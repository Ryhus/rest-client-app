import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

import { useAuthStore } from '@/stores/authStore/authStore';
import type { Session } from '@supabase/supabase-js';
import type { UserMetaData } from '@/services/supabase';

const renderWithRouter = (ui: React.ReactNode) => render(<BrowserRouter>{ui}</BrowserRouter>);

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

  it('renders guest welcome message when no session', () => {
    useAuthStore.setState({ session: null, loading: false });

    renderWithRouter(<Home />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });

  it('renders user welcome message with name when session exists', () => {
    useAuthStore.setState({
      session: createTestSession('John Doe'),
      loading: false,
    });

    renderWithRouter(<Home />);
    expect(screen.getByText(/Welcome back, John Doe!/i)).toBeInTheDocument();
  });

  it('falls back to "Dear User" if user name is missing', () => {
    useAuthStore.setState({
      session: createTestSession(undefined),
      loading: false,
    });

    renderWithRouter(<Home />);
    expect(screen.getByText(/Welcome back, Dear User!/i)).toBeInTheDocument();
  });

  it('render app info', () => {
    renderWithRouter(<Home />);
    const info = screen.getByText(/Our app is/i);
    expect(info).toBeInTheDocument();
    expect(info).toHaveClass('home__about');
  });
});
