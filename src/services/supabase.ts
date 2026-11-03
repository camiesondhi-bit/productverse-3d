// Supabase Cloud Sync Manager for ProductVerse 3D
// Operates in 100% Offline-First Mode by default, with instant toggle for live Supabase backends

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isEnabled: boolean;
  lastSyncedAt?: string;
}

const SUPABASE_STORAGE_KEY = 'productverse_supabase_config_v1';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const raw = localStorage.getItem(SUPABASE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return {
    url: '',
    anonKey: '',
    isEnabled: false,
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  try {
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save supabase config', e);
  }
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
  if (!url || !anonKey) {
    return { success: false, message: 'URL and Anon Key cannot be empty.' };
  }

  try {
    const cleanUrl = url.replace(/\/$/, '');
    const res = await fetch(`${cleanUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    if (res.ok || res.status === 200 || res.status === 404) {
      return { success: true, message: 'Successfully connected to Supabase endpoint!' };
    } else {
      return { success: false, message: `Server responded with status: ${res.status}` };
    }
  } catch (e: unknown) {
    const err = e as Error;
    return { success: false, message: `Connection error: ${err.message || 'Network unreachable'}` };
  }
}
