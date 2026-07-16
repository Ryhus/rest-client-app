import { cleanup, render, screen } from '@testing-library/react';
import RequestBar, { type RequestBarProps } from '@/pages/RestClient/RequestBar/RequestBar.tsx';
import { afterEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

function renderComponent(params: Partial<RequestBarProps>) {
  const handleMethodOnChange = params.handleMethodOnChange || (() => {});
  const handleEndpointOnChange = params.handleEndpointOnChange || (() => {});
  const handleButtonClick = params.handleButtonClick || (() => {});

  return render(
    <RequestBar
      handleMethodOnChange={handleMethodOnChange}
      handleEndpointOnChange={handleEndpointOnChange}
      handleButtonClick={handleButtonClick}
      initMethod={params.initMethod}
      initSearchValue={params.initSearchValue}
      urlError={params.urlError}
      methodError={params.methodError}
    />
  );
}

describe('<RequestBar>', () => {
  afterEach(() => {
    cleanup();
  });

  describe('the necessary elements', () => {
    test('renders a selection of methods', () => {
      renderComponent({});

      const selector = screen.getByRole('combobox', { name: /method/i });
      expect(selector).toHaveAttribute('aria-expanded', 'false');
    });

    test('renders input for Endpoint URL', () => {
      renderComponent({});

      const endpoint = screen.getByRole('textbox', { name: /Endpoint URL/i });
      expect(endpoint).toBeInTheDocument();
      expect(endpoint).toHaveAttribute('aria-required', 'true');
    });

    test('renders button', () => {
      renderComponent({});

      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    test('renders method error', () => {
      renderComponent({ methodError: 'methodError' });

      expect(screen.getByText('methodError')).toBeInTheDocument();
    });

    test('renders endpoint error', () => {
      renderComponent({ urlError: 'endpointError' });

      const endpoint = screen.getByRole('textbox', { name: /Endpoint URL/i });
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('endpointError');
      expect(endpoint).toHaveAttribute('aria-invalid', 'true');
      expect(endpoint).toHaveAttribute('aria-describedby', error.id);
    });

    test('announces whether method options are open', async () => {
      const user = userEvent.setup();
      renderComponent({});

      const toggle = screen.getByRole('button', { name: /open method options/i });
      await user.click(toggle);

      expect(toggle).toHaveAccessibleName(/close method options/i);
    });
  });

  describe('functionality', () => {
    test('changing method', async () => {
      const handleMethodOnChange = vi.fn();
      const user = userEvent.setup();

      renderComponent({ handleMethodOnChange });

      await user.click(screen.getByRole('combobox', { name: /method/i }));
      await user.click(screen.getByRole('option', { name: 'GET' }));

      expect(handleMethodOnChange).toHaveBeenCalledWith('GET');
    });

    test('supports keyboard method selection', async () => {
      const handleMethodOnChange = vi.fn();
      const user = userEvent.setup();

      renderComponent({ handleMethodOnChange });

      const selector = screen.getByRole('combobox', { name: /method/i });
      await user.click(selector);
      await user.keyboard('{ArrowDown}{Enter}');

      expect(handleMethodOnChange).toHaveBeenCalledWith('POST');
      expect(selector).toHaveAttribute('aria-expanded', 'false');
    });

    test('renders every method with its color class', async () => {
      const user = userEvent.setup();
      renderComponent({ initMethod: 'PATCH' });

      const selector = screen.getByRole('combobox', { name: /method/i });
      expect(selector).toHaveClass('method--PATCH');
      await user.click(selector);

      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].forEach((method) => {
        expect(screen.getByRole('option', { name: method }).firstElementChild).toHaveClass(
          `method--${method}`
        );
      });
    });

    test('accepts a custom HTTP method', async () => {
      const handleMethodOnChange = vi.fn();
      const user = userEvent.setup();
      renderComponent({ handleMethodOnChange });

      const selector = screen.getByRole('combobox', { name: /method/i });
      await user.type(selector, 'propfind');

      expect(selector).toHaveValue('PROPFIND');
      expect(handleMethodOnChange).toHaveBeenLastCalledWith('PROPFIND');
    });

    test('changing endpoint', async () => {
      const handleEndpointOnChange = vi.fn();

      renderComponent({ handleEndpointOnChange });

      const input = screen.getByPlaceholderText('Endpoint URL');
      await userEvent.type(input, 'https://stapi.co/animal/search');

      expect(handleEndpointOnChange).toHaveBeenCalled();
    });

    test('button click', async () => {
      const handleButtonClick = vi.fn();

      renderComponent({ handleButtonClick });

      const button = screen.getByRole('button', { name: /send/i });
      await userEvent.click(button);

      expect(handleButtonClick).toHaveBeenCalled();
    });
  });
});
