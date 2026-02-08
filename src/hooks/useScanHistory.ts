import { useState, useCallback } from 'react';
import { safeLocalStorage } from '../lib/safe-storage';
import type { IdentificationResult } from '../types';

const STORAGE_KEY = 'grail-hunter-scan-history';
const MAX_ENTRIES = 20;

function loadHistory(): IdentificationResult[] {
  const raw = safeLocalStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as IdentificationResult[];
  } catch {
    return [];
  }
}

export function useScanHistory() {
  const [history, setHistory] = useState<IdentificationResult[]>(loadHistory);

  const addScan = useCallback((result: IdentificationResult) => {
    setHistory((prev) => {
      const next = [{ ...result, id: result.id ?? `scan-${Date.now()}` }, ...prev].slice(
        0,
        MAX_ENTRIES
      );
      safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    safeLocalStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addScan, clearHistory };
}
