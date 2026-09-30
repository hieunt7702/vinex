"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GlobalSettings } from '@/lib/types';
import { defaultGlobalSettings } from '@/lib/types';

export type { GlobalSettings };

// ─── Module-level cache — shared across all hook instances ───────────────────
let cachedSettings: GlobalSettings | null = null;
let pendingFetch: Promise<GlobalSettings | null> | null = null;
const CACHE_MAX_AGE_MS = 15_000; // 15 s freshness
let lastFetchedAt = 0;
// ─────────────────────────────────────────────────────────────────────────────

async function fetchSettingsFromApi(): Promise<GlobalSettings | null> {
  try {
    const res = await fetch(`/api/v1/settings?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : data
      ? [data]
      : [];
    const globalItem = list.find((s: any) => s && s.key === 'GLOBAL_SETTINGS');
    if (globalItem?.value) {
      const parsed =
        typeof globalItem.value === 'string'
          ? JSON.parse(globalItem.value)
          : globalItem.value;
      return { ...defaultGlobalSettings, ...parsed };
    }
  } catch (e) {
    console.warn('[useGlobalSettings] Fetch failed:', e);
  }
  return null;
}

export function useGlobalSettings(initialSettings?: GlobalSettings) {
  if (initialSettings && !cachedSettings) {
    cachedSettings = initialSettings;
  }

  const [settings, setSettings] = useState<GlobalSettings>(
    initialSettings ?? cachedSettings ?? defaultGlobalSettings,
  );
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  // Sync if initialSettings changes (e.g. navigation across SSR pages)
  useEffect(() => {
    if (initialSettings) {
      setSettings((prev) => ({ ...prev, ...initialSettings }));
      cachedSettings = { ...(cachedSettings || defaultGlobalSettings), ...initialSettings };
    }
  }, [initialSettings]);

  const fetchSettings = useCallback(async (force = false) => {
    // Skip if cache is fresh and not forced
    if (!force && Date.now() - lastFetchedAt < CACHE_MAX_AGE_MS && cachedSettings) {
      return;
    }

    // Dedup: all simultaneous callers share one in-flight request
    if (!pendingFetch) {
      pendingFetch = fetchSettingsFromApi().finally(() => {
        pendingFetch = null;
      });
    }

    setIsLoading(true);
    try {
      const result = await pendingFetch!;
      lastFetchedAt = Date.now();
      if (result) {
        cachedSettings = result;
        if (mountedRef.current) setSettings(result);
      }
    } catch (err) {
      console.warn('Could not fetch global settings on client:', err);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchSettings();

    const handleUpdate = () => fetchSettings(true);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'vinex_settings_updated_at') {
        fetchSettings(true);
      }
    };

    window.addEventListener('vinex_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('vinex_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchSettings]);

  return { settings, isLoading, refresh: () => fetchSettings(true) };
}
