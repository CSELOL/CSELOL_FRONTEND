import { supabase } from './supabase';

/**
 * Helper to get authentication headers for API calls.
 * Uses Supabase session token.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();

    return {
        'Content-Type': 'application/json',
        ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
    };
}

/**
 * Get current access token (for non-JSON requests like file uploads)
 */
export async function getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}
