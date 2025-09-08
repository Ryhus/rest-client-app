import { describe, it, vi, beforeEach, expect, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SignIn, { clientAction } from './SignIn';
import { useAuthStore } from '@/stores/authStore/authStore';
import { supabase } from '@/services/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

vi.mock('@/stores/authStore/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
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

import * as reactRouter from 'react-router-dom';

function renderWithDataRouter() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SignIn />,
      },
    ],
    { initialEntries: ['/'] }
  );

  return render(<RouterProvider router={router} />);
}

describe('SignIn component', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({ session: null });
    vi.clearAllMocks();
  });

  it('renders login form when no session', () => {
    renderWithDataRouter();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
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
    expect(screen.queryByLabelText(/Password/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Login/i })).not.toBeInTheDocument();
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
      error: 'Invalid login',
    });

    renderWithDataRouter();
    expect(screen.getByText(/Invalid login/i)).toBeInTheDocument();
  });
  it('fires onChange events for all inputs', () => {
    renderWithDataRouter();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'a@b.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: '123456' },
    });

    expect((screen.getByLabelText(/Email/i) as HTMLInputElement).value).toBe('a@b.com');
    expect((screen.getByLabelText(/Password/i) as HTMLInputElement).value).toBe('123456');
  });
});

describe('clientAction', () => {
  const email = 'test@test.com';
  const password = '123456';

  const createMockRequest = (): Request =>
    ({
      formData: vi.fn().mockResolvedValue(
        Object.assign(new FormData(), {
          get: (key: string) => (key === 'email' ? email : password),
        })
      ),
    }) as unknown as Request;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data on successful login', async () => {
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

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user, session },
      error: null,
    });

    const request = createMockRequest();
    const result = await clientAction({ request });
    expect(result).toEqual({ data: { user, session } });
  });

  it('returns error message on failed login', async () => {
    const error: AuthError = new SupabaseAuthError('Invalid credentials', 400);

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error,
    });

    const request = createMockRequest();
    const result = await clientAction({ request });
    expect(result).toEqual({ error: 'Invalid credentials' });
  });

  it('returns network error message if "Failed to fetch"', async () => {
    const error: AuthError = new SupabaseAuthError('Failed to fetch', 500);

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error,
    });

    const request = createMockRequest();
    const result = await clientAction({ request });
    expect(result).toEqual({ error: 'Pls, check your internet connection.' });
  });
});
