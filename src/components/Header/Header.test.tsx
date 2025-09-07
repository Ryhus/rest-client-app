import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Header from './Header';
import { useAuthStore } from '@/stores/authStore/authStore';
import { supabase } from '@/services/supabase';
import type { Session } from '@supabase/supabase-js';

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

const renderWithRouter = (ui: React.ReactNode) => render(<BrowserRouter>{ui}</BrowserRouter>);

const createTestSession = (): Session => ({
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
    user_metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
});

describe('Header component', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null, loading: true });
    vi.clearAllMocks();
  });

  it('renders logo always', () => {
    useAuthStore.setState({ session: null, loading: false });

    renderWithRouter(<Header />);
    expect(screen.getByText(/Rest Client/i)).toBeInTheDocument();
  });

  it('renders Sign In/Sign Up when no session and not loading', () => {
    useAuthStore.setState({ session: null, loading: false });

    renderWithRouter(<Header />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('renders Home and Sign Out when session exists', () => {
    useAuthStore.setState({ session: createTestSession(), loading: false });

    renderWithRouter(<Header />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
  });

  it('does not render actions when loading is true', () => {
    useAuthStore.setState({ session: null, loading: true });

    renderWithRouter(<Header />);
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign Out/i)).not.toBeInTheDocument();
  });

  it('calls signOut when Sign Out button is clicked', () => {
    useAuthStore.setState({ session: createTestSession(), loading: false });

    renderWithRouter(<Header />);
    fireEvent.click(screen.getByText(/Sign Out/i));
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
