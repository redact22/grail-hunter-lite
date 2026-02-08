/* eslint-disable no-restricted-syntax */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScanHistory } from '../useScanHistory';
import type { IdentificationResult } from '../../types';

const makeScan = (name: string): IdentificationResult => ({
  name,
  brand: 'Test',
  category: 'Vintage',
  rarity: 'Rare',
  era: '1990s',
  confidence: 0.95,
  estimatedValue: '$100',
  isAuthentic: true,
});

describe('useScanHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    const { result } = renderHook(() => useScanHistory());
    expect(result.current.history).toHaveLength(0);
  });

  it('adds scans', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan(makeScan('Item 1')));
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].name).toBe('Item 1');
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan(makeScan('Persist Me')));
    const stored = JSON.parse(localStorage.getItem('grail-hunter-scan-history') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Persist Me');
  });

  it('caps at 20 entries', () => {
    const { result } = renderHook(() => useScanHistory());
    for (let i = 0; i < 25; i++) {
      act(() => result.current.addScan(makeScan(`Item ${i}`)));
    }
    expect(result.current.history).toHaveLength(20);
  });

  it('clears history', () => {
    const { result } = renderHook(() => useScanHistory());
    act(() => result.current.addScan(makeScan('To Remove')));
    act(() => result.current.clearHistory());
    expect(result.current.history).toHaveLength(0);
    expect(localStorage.getItem('grail-hunter-scan-history')).toBeNull();
  });
});
