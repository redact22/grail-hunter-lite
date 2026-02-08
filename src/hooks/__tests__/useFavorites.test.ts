/* eslint-disable no-restricted-syntax */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite('any')).toBe(false);
  });

  it('toggles a favorite on', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('item-1'));
    expect(result.current.isFavorite('item-1')).toBe(true);
  });

  it('toggles a favorite off', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('item-1'));
    act(() => result.current.toggle('item-1'));
    expect(result.current.isFavorite('item-1')).toBe(false);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle('item-2'));
    const stored = JSON.parse(localStorage.getItem('grail-hunter-favorites') || '[]');
    expect(stored).toContain('item-2');
  });

  it('loads from localStorage', () => {
    localStorage.setItem('grail-hunter-favorites', JSON.stringify(['pre-saved']));
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite('pre-saved')).toBe(true);
  });
});
