import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider, type ActionFunctionArgs } from 'react-router-dom';
import SignUp, { action } from './SignUp';
import type { ChangeEvent } from 'react';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
    initReactI18next: { type: '3rdParty', init: () => {} },
  };
});

vi.mock('@/utils/validateInput', () => ({
  validateInput: vi.fn(),
}));
const mockSignUp = vi.fn();

vi.mock('@/services/supabase/supabaseServer', () => ({
  createClient: () => ({
    supabase: { auth: { signUp: mockSignUp } },
  }),
}));

import { validateInput } from '@/utils/validateInput';

describe('SignUp component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <SignUp />,
          action: action,
        },
      ],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);
  };

  it('renders all form fields and the submit button', () => {
    renderWithRouter();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signUp/i })).toBeInTheDocument();
  });

  it('updates form state when inputs change', () => {
    renderWithRouter();

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    } as ChangeEvent<HTMLInputElement>);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } } as ChangeEvent<HTMLInputElement>);
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    } as ChangeEvent<HTMLInputElement>);

    expect(emailInput.value).toBe('test@example.com');
    expect(nameInput.value).toBe('John Doe');
    expect(passwordInput.value).toBe('123456');

    expect(validateInput).toHaveBeenCalledTimes(3);
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'email', value: 'test@example.com' })
    );
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'name', value: 'John Doe' })
    );
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'password', value: '123456' })
    );
  });

  it('toggles password visibility', () => {
    renderWithRouter();
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const togglerWrapper = screen.getByAltText(/eye show/i).parentElement;
    expect(togglerWrapper).not.toBeNull();
    if (!togglerWrapper) return;
    expect(passwordInput.type).toBe('password');
    fireEvent.click(togglerWrapper);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(togglerWrapper);
    expect(passwordInput.type).toBe('password');
  });
});

describe('SignUp action function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (form: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    return new Request('http://localhost/signup', { method: 'POST', body: formData });
  };

  it('returns data on successful sign up', async () => {
    mockSignUp.mockResolvedValue({ data: { id: '1' }, error: null });
    const request = createMockRequest({ email: 'a@b.com', name: 'John', password: '123456' });
    const result = await action({ request } as ActionFunctionArgs);

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: '123456',
      options: { data: { name: 'John' } },
    });
    expect(result).toEqual({ data: { id: '1' } });
  });

  it('returns error message when sign up fails', async () => {
    mockSignUp.mockResolvedValue({ data: null, error: { message: 'Invalid input' } });
    const request = createMockRequest({ email: '', name: '', password: '' });
    const result = await action({ request } as ActionFunctionArgs);

    expect(result).toEqual({ error: 'Invalid input' });
  });

  it('returns network error when sign up fails with "Failed to fetch"', async () => {
    mockSignUp.mockResolvedValue({ data: null, error: { message: 'Failed to fetch' } });
    const request = createMockRequest({ email: 'a', name: 'b', password: 'c' });
    const result = await action({ request } as ActionFunctionArgs);

    expect(result).toEqual({ error: 'Pls, check your internet connection.' });
  });
});
