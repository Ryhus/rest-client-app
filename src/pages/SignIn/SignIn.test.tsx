import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider, type ActionFunctionArgs } from 'react-router-dom';
import SignIn, { action } from './SignIn';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
    initReactI18next: { type: '3rdParty', init: () => {} },
  };
});

const mockSignIn = vi.fn();
vi.mock('@/services/supabase/supabaseServer', () => ({
  createClient: () => ({
    supabase: { auth: { signInWithPassword: mockSignIn } },
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useRouteLoaderData: () => null,
    useActionData: () => ({ error: 'Test error message' }),
    Form: ({ children, ...props }: { children: React.ReactNode }) => (
      <form {...props}>{children}</form>
    ),
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
    redirect: (url: string) => new Response(null, { status: 302, headers: { Location: url } }),
  };
});

vi.mock('@/utils/validateInput', () => ({
  validateInput: vi.fn(),
}));

import { validateInput } from '@/utils/validateInput';

const renderWithRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SignIn />,
        action: action,
      },
    ],
    { initialEntries: ['/'] }
  );

  render(<RouterProvider router={router} />);
};

describe('SignIn component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    renderWithRouter();
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/^password$/i);
    expect(screen.getByRole('heading', { level: 1, name: /loginTitle/i })).toBeInTheDocument();
    expect(screen.getByRole('form', { name: /loginTitle/i })).toBeInTheDocument();
    expect(email).toBeRequired();
    expect(email).toHaveAttribute('type', 'email');
    expect(email).toHaveAttribute('autocomplete', 'email');
    expect(password).toBeRequired();
    expect(password).toHaveAttribute('autocomplete', 'current-password');
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderWithRouter();
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const toggle = screen.getByRole('button', { name: /showPassword/i });

    expect(passwordInput.type).toBe('password');
    expect(toggle).toHaveAttribute('aria-controls', 'password');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);
    expect(passwordInput.type).toBe('text');
    expect(toggle).toHaveAccessibleName(/hidePassword/i);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(passwordInput.type).toBe('password');
  });

  it('renders error message from actionData.error', () => {
    renderWithRouter();
    expect(screen.getByRole('alert')).toHaveTextContent(/Something went wrong. Please try again./i);
  });
});

describe('SignIn action function', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
  });

  const createMockRequest = (form: Record<string, string>) => {
    return new Request('http://localhost/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(form),
    });
  };

  it('redirects on successful sign in', async () => {
    mockSignIn.mockResolvedValue({ data: {}, error: null });
    const request = createMockRequest({ email: 'test@example.com', password: '123456' });
    const result = await action({ request } as ActionFunctionArgs);

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });

    if (result instanceof Response) {
      expect(result.headers.get('Location')).toBe('/');
    } else {
      throw new Error(`Expected a Response, but got error: ${result.error}`);
    }
  });

  it('returns error when credentials are wrong', async () => {
    mockSignIn.mockResolvedValue({ data: null, error: { code: 'invalid_credentials' } });
    const request = createMockRequest({ email: 'wrong', password: 'wrong' });
    const result = await action({ request } as ActionFunctionArgs);
    expect(result).toEqual({ error: 'invalid_credentials' });
  });

  it('updates form state and calls validateInput on input change', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(passwordInput.value).toBe('123456');

    expect(validateInput).toHaveBeenCalledTimes(2);
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'email', value: 'test@example.com' })
    );
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'password', value: '123456' })
    );
  });
});
