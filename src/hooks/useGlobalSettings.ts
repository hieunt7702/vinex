"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GlobalSettings } from '@/lib/types';
import { defaultGlobalSettings } from '@/lib/types';

export type { GlobalSettings };

// ─── Module-level cache — shared across all hook instances ───────────────────
let cachedSettings: GlobalSettings | null = null;
let pendingFetch: Promise<GlobalSettings | null> | null = null;
const CACHE_MAX_AGE_MS = 5 * 60_000; // 5 min (settings rarely change)
let lastFetchedAt = 0;
// ─────────────────────────────────────────────────────────────────────────────

async function fetchSettingsFromApi(): Promise<GlobalSettings | null> {
  // Relative path — same origin, no DNS/TLS overhead
  const res = await fetch('/api/v1/settings', {
    // Use browser cache with 60s freshness
    cache: 'default',
    next: { revalidate: 60 },
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
  return null;
}

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(
    cachedSettings ?? defaultGlobalSettings,
  );
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetchSettings = useCallback(async (force = false) => {
    // Skip if cache is fresh
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
    window.addEventListener('vinex_settings_updated', handleUpdate);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('vinex_settings_updated', handleUpdate);
    };
  }, [fetchSettings]);

  return { settings, isLoading, refresh: () => fetchSettings(true) };
}
