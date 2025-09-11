import { describe, it, vi, beforeEach, expect, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp, { clientAction } from './SignUp';
import { useAuthStore } from '@/stores/authStore/authStore';
import { supabase } from '@/services/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import * as reactRouter from 'react-router-dom';
import { act } from 'react';

vi.mock('@/stores/authStore/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

vi.mock('react-router-dom', async () => {
  const actual: typeof import('react-router-dom') = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useActionData: vi.fn(() => null),
  };
});

function renderWithDataRouter() {
  const router = createMemoryRouter([{ path: '/', element: <SignUp /> }], {
    initialEntries: ['/'],
  });
  return render(<RouterProvider router={router} />);
}

describe('SignUp component', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({ session: null });
    vi.clearAllMocks();
  });

  it('renders signup form when no session', () => {
    renderWithDataRouter();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  it('redirects to "/" when session exists', () => {
    const user: User = {
      id: '1',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'test@test.com',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const session: Session = {
      access_token: 'token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'refresh',
      user,
    };

    vi.mocked(useAuthStore).mockReturnValue({ session });
    renderWithDataRouter();

    expect(screen.queryByLabelText(/Email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Password/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Sign Up/i })).not.toBeInTheDocument();
  });

  it('toggles password visibility when clicking icon button', () => {
    renderWithDataRouter();

    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const inputWrapper = passwordInput.closest('.input-wrapper');
    if (!inputWrapper) throw new Error('Input wrapper not found');

    const toggleButton = inputWrapper.querySelector('.toggler') as HTMLButtonElement;
    if (!toggleButton) throw new Error('Toggle button not found');

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('renders server error message from useActionData', () => {
    (reactRouter.useActionData as Mock).mockReturnValue({
      error: 'Invalid signup',
    });

    renderWithDataRouter();
    expect(screen.getByText(/Invalid signup/i)).toBeInTheDocument();
  });

  it('does not render error when actionData is null', () => {
    (reactRouter.useActionData as Mock).mockReturnValue(null);

    renderWithDataRouter();
    expect(screen.queryByText(/Invalid signup/i)).not.toBeInTheDocument();
  });

  it('fires onChange events for all inputs', async () => {
    renderWithDataRouter();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: 'a@b.com' },
      });
      fireEvent.change(screen.getByLabelText(/Name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: '123456' },
      });

      expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe('a@b.com');
      expect((screen.getByLabelText(/Name/i) as HTMLInputElement).value).toBe('Test User');
      expect((screen.getByLabelText(/Password/i) as HTMLInputElement).value).toBe('123456');
    });
  });

  it('submits the form', () => {
    renderWithDataRouter();

    const form = document.querySelector('.signup-page__form') as HTMLFormElement;
    if (!form) throw new Error('Form not found');

    fireEvent.submit(form);
  });
});

describe('clientAction', () => {
  const email = 'test@test.com';
  const name = 'Test User';
  const password = '123456';

  const createMockRequest = (): Request =>
    ({
      formData: vi.fn().mockResolvedValue(
        Object.assign(new FormData(), {
          get: (key: string) => (key === 'email' ? email : key === 'name' ? name : password),
        })
      ),
    }) as unknown as Request;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data on successful signup', async () => {
    const user: User = {
      id: '1',
      aud: 'authenticated',
      role: 'authenticated',
      email,
      app_metadata: {},
      user_metadata: { name },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user, session: null },
      error: null,
    });

    const request = createMockRequest();
    const result = await clientAction({ request });
    expect(result).toEqual({ data: { user, session: null } });
  });

  it('returns error message on failed signup', async () => {
    const error: AuthError = new SupabaseAuthError('Email already exists', 400);

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error,
    });

    const request = createMockRequest();
    const result = await clientAction({ request });
    expect(result).toEqual({ error: 'Email already exists' });
  });

  it('returns network error message if "Failed to fetch"', async () => {
    const error: AuthError = new SupabaseAuthError('Failed to fetch', 500);

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error,
    });

    const request = createMockRequest();
    const result = await clientAction({ request });
    expect(result).toEqual({ error: 'Pls, check your internet connection.' });
  });
});
