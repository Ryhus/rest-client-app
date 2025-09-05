import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import type { Session } from '@supabase/supabase-js';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null, loading: true });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(true);
    expect(typeof state.setSession).toBe('function');
  });

  it('setSession updates session and loading correctly', () => {
    const testSession: Session = {
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
    };

    useAuthStore.getState().setSession(testSession);

    const state = useAuthStore.getState();
    expect(state.session).toEqual(testSession);
    expect(state.loading).toBe(false);
  });

  it('setSession can reset session to null', () => {
    useAuthStore.getState().setSession({
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

    useAuthStore.getState().setSession(null);
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });
});
