import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

// Cache the session to avoid repeated getSession calls
let cachedSession: Session | null = null;

// Initialize and listen for session changes
supabase.auth.getSession().then(({ data: { session } }) => {
    cachedSession = session;
});

supabase.auth.onAuthStateChange((_event, session) => {
    cachedSession = session;
});

/**
 * Helper to get authentication headers for API calls.
 * Uses cached Supabase session token for performance.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
    // Use cached session if available, otherwise fetch
    const session = cachedSession ?? (await supabase.auth.getSession()).data.session;

    return {
        'Content-Type': 'application/json',
        ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
    };
}

/**
 * Get current access token (for non-JSON requests like file uploads)
 */
export async function getAccessToken(): Promise<string | null> {
    // Use cached session if available, otherwise fetch
    const session = cachedSession ?? (await supabase.auth.getSession()).data.session;
    return session?.access_token || null;
}
