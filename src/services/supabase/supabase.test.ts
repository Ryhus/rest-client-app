import { describe, it, beforeEach, vi, expect } from 'vitest';
import { useAuthStore } from '@/stores/authStore/authStore';
import type { Session, AuthChangeEvent, Subscription } from '@supabase/supabase-js';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  })),
}));

import { supabase } from './supaBaseClient';
import { setupAuthListener } from './authListener';

describe('Supabase client and setupAuthListener', () => {
  const setSessionMock = vi.fn();

  beforeEach(() => {
    useAuthStore.setState({ session: null, loading: true });
    useAuthStore.getState().setSession = setSessionMock;
    vi.clearAllMocks();
  });

  it('creates supabase client with environment variables', () => {
    expect(supabase).toBeDefined();
  });

  it('sets initial session from getSession and updates on auth state change', async () => {
    const initialSession: Session = {
      access_token: 'token1',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'refresh1',
      user: {
        id: '1',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'user1@test.com',
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    const newSession: Session = {
      access_token: 'token2',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'refresh2',
      user: {
        id: '2',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'user2@test.com',
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: { session: initialSession },
      error: null,
    });

    let authCallback: (event: AuthChangeEvent, session: Session | null) => void = () => {};
    const unsubscribeMock = vi.fn();

    vi.spyOn(supabase.auth, 'onAuthStateChange').mockImplementation((cb) => {
      authCallback = cb;

      const subscription: Subscription = {
        id: 'test-subscription',
        callback: cb,
        unsubscribe: unsubscribeMock,
      };

      return { data: { subscription } };
    });

    const unsubscribe = setupAuthListener();

    await Promise.resolve();

    expect(setSessionMock).toHaveBeenCalledWith(initialSession);

    authCallback('SIGNED_IN', newSession);
    expect(setSessionMock).toHaveBeenCalledWith(newSession);

    expect(unsubscribe).toBeInstanceOf(Function);
    unsubscribe?.();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
  it('does nothing on server-side (window is undefined)', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');

    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      configurable: true,
    });

    const result = setupAuthListener();
    expect(result).toBeUndefined();

    if (descriptor) {
      Object.defineProperty(globalThis, 'window', descriptor);
    }
  });
});
