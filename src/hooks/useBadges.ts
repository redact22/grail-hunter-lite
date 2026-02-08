import { useState, useCallback } from 'react';
import { safeLocalStorage } from '../lib/safe-storage';
import { BADGES } from '../data/badges';
import type { BadgeDef } from '../data/badges';
import type { IdentificationResult } from '../types';

const STORAGE_KEY = 'grail-hunter-badges';

function loadUnlocked(): Set<string> {
  const raw = safeLocalStorage.getItem(STORAGE_KEY);
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function persist(unlocked: Set<string>) {
  safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]));
}

export interface BadgeState {
  unlocked: Set<string>;
  lastUnlocked: BadgeDef | null;
  isUnlocked: (id: string) => boolean;
  checkAfterScan: (result: IdentificationResult, totalScans: number) => void;
  checkTabVisits: (visitedTabs: Set<string>) => void;
  dismissCelebration: () => void;
}

export function useBadges(): BadgeState {
  const [unlocked, setUnlocked] = useState<Set<string>>(loadUnlocked);
  const [lastUnlocked, setLastUnlocked] = useState<BadgeDef | null>(null);

  const unlock = useCallback((badgeId: string) => {
    setUnlocked((prev) => {
      if (prev.has(badgeId)) return prev;
      const next = new Set(prev);
      next.add(badgeId);
      persist(next);
      const badge = BADGES.find((b) => b.id === badgeId);
      if (badge) setLastUnlocked(badge);
      return next;
    });
  }, []);

  const isUnlocked = useCallback((id: string) => unlocked.has(id), [unlocked]);

  const checkAfterScan = useCallback(
    (result: IdentificationResult, totalScans: number) => {
      // First Scan
      if (totalScans >= 1) unlock('first-scan');

      // Forensic Expert (10 scans)
      if (totalScans >= 10) unlock('forensic-expert');

      // Eagle Eye (check if this is a >90% confidence scan — we track via count)
      if (result.confidence > 0.9) {
        const highConfCount = parseInt(
          safeLocalStorage.getItem('grail-hunter-high-conf') || '0',
          10
        );
        const newCount = highConfCount + 1;
        safeLocalStorage.setItem('grail-hunter-high-conf', String(newCount));
        if (newCount >= 3) unlock('eagle-eye');
      }

      // Grail Hunter
      if (result.rarity === 'Grail') unlock('grail-hunter');

      // Authenticator
      if (result.isAuthentic) {
        const authCount = parseInt(safeLocalStorage.getItem('grail-hunter-auth-count') || '0', 10);
        const newCount = authCount + 1;
        safeLocalStorage.setItem('grail-hunter-auth-count', String(newCount));
        if (newCount >= 5) unlock('authenticator');
      }
    },
    [unlock]
  );

  const checkTabVisits = useCallback(
    (visitedTabs: Set<string>) => {
      if (visitedTabs.size >= 4) unlock('void-walker');
    },
    [unlock]
  );

  const dismissCelebration = useCallback(() => {
    setLastUnlocked(null);
  }, []);

  return {
    unlocked,
    lastUnlocked,
    isUnlocked,
    checkAfterScan,
    checkTabVisits,
    dismissCelebration,
  };
}
