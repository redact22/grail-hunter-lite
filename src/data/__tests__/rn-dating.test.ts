import { describe, it, expect } from 'vitest';
import { calculateYearFromRN, analyzeRNDating, formatRNDatingResult } from '../rn-dating';
import { parseRNNumber, lookupRN, validateRNForBrand } from '../rn-database';

describe('RN Dating Formula', () => {
  it('calculates Carhartt RN 14806 as ~1959', () => {
    const year = calculateYearFromRN(14806);
    expect(Math.round(year)).toBe(1959);
  });

  it('calculates Nike RN 56323 as ~1975', () => {
    const year = calculateYearFromRN(56323);
    expect(year).toBeGreaterThan(1975);
    expect(year).toBeLessThan(1977);
  });

  it('throws for RN below 13670', () => {
    expect(() => calculateYearFromRN(5000)).toThrow('Invalid RN number');
  });

  it('analyzeRNDating returns full result for valid RN', () => {
    const result = analyzeRNDating(14806);
    expect(result.isValid).toBe(true);
    expect(result.confidence).toBe('high');
    expect(result.calculatedYear).toBeCloseTo(1959.43, 1);
    expect(result.yearRange.min).toBeLessThanOrEqual(1959);
    expect(result.yearRange.max).toBeGreaterThanOrEqual(1959);
  });

  it('analyzeRNDating returns invalid for sub-threshold RN', () => {
    const result = analyzeRNDating(100);
    expect(result.isValid).toBe(false);
    expect(result.confidence).toBe('low');
  });

  it('formatRNDatingResult formats valid result', () => {
    const result = analyzeRNDating(14806);
    const formatted = formatRNDatingResult(result);
    expect(formatted).toContain('Estimated');
    expect(formatted).toContain('high confidence');
  });

  it('formatRNDatingResult formats invalid result', () => {
    const result = analyzeRNDating(100);
    const formatted = formatRNDatingResult(result);
    expect(formatted).toContain('Invalid RN');
  });
});

describe('RN Database', () => {
  it('parseRNNumber handles "RN 14806"', () => {
    expect(parseRNNumber('RN 14806')).toBe(14806);
  });

  it('parseRNNumber handles "RN#14806"', () => {
    expect(parseRNNumber('RN#14806')).toBe(14806);
  });

  it('parseRNNumber handles bare number', () => {
    expect(parseRNNumber('56323')).toBe(56323);
  });

  it('parseRNNumber returns null for empty string', () => {
    expect(parseRNNumber('')).toBe(null);
  });

  it('lookupRN finds Carhartt', () => {
    const entry = lookupRN(14806);
    expect(entry).not.toBeNull();
    expect(entry!.brand).toBe('Carhartt');
  });

  it('lookupRN returns null for unknown RN', () => {
    expect(lookupRN(99999)).toBeNull();
  });

  it('validateRNForBrand returns true for correct match', () => {
    expect(validateRNForBrand(14806, 'Carhartt')).toBe(true);
  });

  it('validateRNForBrand returns false for wrong brand', () => {
    expect(validateRNForBrand(14806, 'Nike')).toBe(false);
  });
});
