import { create } from 'zustand';
import { supabase } from '@/services/supabase/supaBaseClient';
import type { Session } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => set({ session, loading: false }),
}));

supabase.auth.getSession().then(({ data }) => {
  useAuthStore.getState().setSession(data.session);
});
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});
