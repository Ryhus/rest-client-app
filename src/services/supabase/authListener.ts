import { supabase } from './supaBaseClient';
import { useAuthStore } from '@/stores/authStore/authStore';

export function setupAuthListener() {
  if (typeof window === 'undefined') return;

  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.getState().setSession(data.session);
  });

  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session);
  });

  return () => subscription.subscription.unsubscribe();
}
