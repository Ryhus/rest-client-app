import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RequestDataEditorOrViewer } from '@/pages/RestClient/RequestDataEditorOrViewer/RequestDataEditorOrViewer.tsx';
import { describe, test, expect, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';

function renderEditorComponent() {
  return render(<RequestDataEditorOrViewer mode="editor" />);
}

function renderViewerComponent(params: { data?: string; status?: number; errorMessage?: string }) {
  const viewerData = {
    data: params.data || '',
    status: params.status || undefined,
    errorMessage: params.errorMessage || '',
  };
  return render(<RequestDataEditorOrViewer mode="viewer" viewerData={viewerData} />);
}

describe('Editor', () => {
  afterEach(() => {
    cleanup();
  });

  describe('the necessary elements', () => {
    test('renders a title', () => {
      renderEditorComponent();

      expect(screen.getByTestId('title')).toBeInTheDocument();
    });

    test('renders a selection of types', () => {
      renderEditorComponent();

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('does not render a button by default type', () => {
      renderEditorComponent();

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('renders content', () => {
      const { container } = renderEditorComponent();

      expect(screen.getByRole('textbox', { name: /request body editor/i })).toBeInTheDocument();
      expect(container.querySelector('.body-editor__line-numbers')).toHaveTextContent('1');
    });
  });

  describe('functionality', () => {
    test('renders a button when type is "json"', async () => {
      renderEditorComponent();

      const typeSelector = screen.getByRole('combobox');
      await userEvent.selectOptions(typeSelector, 'json');

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Beautify/i })).toBeInTheDocument();
      });
    });

    test('renders disabled button when type is "json" and body is empty', async () => {
      renderEditorComponent();

      const typeSelector = screen.getByRole('combobox');
      await userEvent.selectOptions(typeSelector, 'json');

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Beautify/i })).toBeDisabled();
      });
    });

    test('renders enabled button when type is "json" and body is not empty', async () => {
      renderEditorComponent();

      const typeSelector = screen.getByRole('combobox');
      await userEvent.selectOptions(typeSelector, 'json');

      const contentElement = screen.getByRole('textbox');
      fireEvent.change(contentElement, { target: { value: '{ "name": "John" }' } });

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Beautify/i })).not.toBeDisabled();
      });
    });

    test('renders an error when type is "json" and body is not valid json', async () => {
      renderEditorComponent();

      const typeSelector = screen.getByRole('combobox');
      await userEvent.selectOptions(typeSelector, 'json');

      expect(screen.getByTestId('not-valid-format')).toBeInTheDocument();
    });

    test('renders line numbers for multiline content', () => {
      const { container } = renderEditorComponent();
      const editor = screen.getByRole('textbox', { name: /request body editor/i });

      fireEvent.change(editor, { target: { value: 'first\nsecond\nthird' } });

      const lineNumbers = container.querySelectorAll('.body-editor__line-numbers li');
      expect(lineNumbers).toHaveLength(3);
      expect(Array.from(lineNumbers).map((line) => line.textContent)).toEqual(['1', '2', '3']);
    });

    test('highlights JSON properties and values', async () => {
      const { container } = renderEditorComponent();
      await userEvent.selectOptions(screen.getByRole('combobox'), 'json');

      fireEvent.change(screen.getByRole('textbox'), {
        target: {
          value: '{"name":"John","age":30,"active":true,"note":null}',
        },
      });

      expect(container.querySelectorAll('.syntax-token--property')).toHaveLength(4);
      expect(container.querySelector('.syntax-token--string')).toHaveTextContent('"John"');
      expect(container.querySelector('.syntax-token--number')).toHaveTextContent('30');
      expect(container.querySelector('.syntax-token--boolean')).toHaveTextContent('true');
      expect(container.querySelector('.syntax-token--null')).toHaveTextContent('null');
    });

    test('keeps highlighting and line numbers synchronized with editor scroll', () => {
      const { container } = renderEditorComponent();
      const editor = screen.getByRole('textbox');

      Object.defineProperties(editor, {
        scrollTop: { configurable: true, value: 22 },
        scrollLeft: { configurable: true, value: 10 },
      });
      fireEvent.scroll(editor);

      expect(screen.getByTestId('syntax-highlight')).toHaveStyle({
        transform: 'translate(-10px, -22px)',
      });
      expect(container.querySelector('.body-editor__line-numbers')).toHaveStyle({
        transform: 'translateY(-22px)',
      });
    });
  });
});

describe('Viewer', () => {
  describe('the necessary elements', () => {
    test('renders a title', () => {
      renderViewerComponent({});

      expect(screen.getByTestId('title')).toBeInTheDocument();
    });

    test('renders content', () => {
      renderViewerComponent({ data: 'some data', status: 200, errorMessage: 'error message' });

      expect(screen.getByText('some data')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('error message')).toBeInTheDocument();
    });

    test('renders correct success status', () => {
      renderViewerComponent({ data: 'some data', status: 200 });

      const status = screen.getByText('200');
      expect(status).toHaveAttribute('class', 'status-code success');
    });

    test('renders correct error status', () => {
      renderViewerComponent({ data: 'some data', status: 500 });

      const status = screen.getByText('500');
      expect(status).toHaveAttribute('class', 'status-code error');
    });

    test('renders correct info status', () => {
      renderViewerComponent({ data: 'some data', status: 100 });

      const status = screen.getByText('100');
      expect(status).toHaveAttribute('class', 'status-code info');
    });
  });
});
