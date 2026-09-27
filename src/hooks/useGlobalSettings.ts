"use client";

import { useState, useEffect, useCallback } from 'react';
import type { GlobalSettings } from '@/lib/dataService';
import { defaultGlobalSettings } from '@/lib/dataService';

export type { GlobalSettings };

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultGlobalSettings);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/v1/settings', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data ? [data] : []));
      const globalItem = list.find((s: any) => s && s.key === 'GLOBAL_SETTINGS');
      if (globalItem && globalItem.value) {
        const parsed = typeof globalItem.value === 'string' ? JSON.parse(globalItem.value) : globalItem.value;
        setSettings({ ...defaultGlobalSettings, ...parsed });
      }
    } catch (err) {
      console.warn('Could not fetch global settings on client:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const handleUpdate = () => {
      fetchSettings();
    };

    window.addEventListener('vinex_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('vinex_settings_updated', handleUpdate);
    };
  }, [fetchSettings]);

  return { settings, isLoading, refresh: fetchSettings };
}
