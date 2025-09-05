import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

import { useAuthStore } from '@/stores/authStore/authStore';
import type { Session } from '@supabase/supabase-js';
import type { UserMetaData } from '@/services/supabase';

vi.mock('@/utils/navLinksConfig', () => ({
  userLinks: [
    { text: 'Dashboard', to: '/dashboard' },
    { text: 'Profile', to: '/profile' },
  ],
  guestLinks: [
    { text: 'Login', to: '/login' },
    { text: 'Sign Up', to: '/signup' },
  ],
}));

const renderWithRouter = (ui: React.ReactNode) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

const createTestSession = (name?: string): Session => ({
  access_token: 'token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'refresh',
  user: {
    id: '1',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: { name } as UserMetaData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
});

describe('Home component', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null, loading: false });
    vi.clearAllMocks();
  });

  it('renders guest welcome message and guest links when no session', () => {
    useAuthStore.setState({ session: null, loading: false });

    renderWithRouter(<Home />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('renders user welcome message with name and user links when session exists', () => {
    useAuthStore.setState({
      session: createTestSession('John Doe'),
      loading: false,
    });

    renderWithRouter(<Home />);
    expect(screen.getByText(/Welcome back, John Doe!/i)).toBeInTheDocument();

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });

  it('falls back to "Dear User" if user name is missing', () => {
    useAuthStore.setState({
      session: createTestSession(undefined),
      loading: false,
    });

    renderWithRouter(<Home />);
    expect(screen.getByText(/Welcome back, Dear User!/i)).toBeInTheDocument();
  });
});
