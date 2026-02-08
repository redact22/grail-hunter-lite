/**
 * RN/WPL Textile Dating Formula
 *
 * Forensic chronometrics for dating vintage textiles using RN (Registered Number) tags.
 * Formula: (RN - 13670) / 2635 + 1959
 *
 * Ported from thrift-finds product-authentication module (pure functions, zero deps).
 */

export interface RNDatingResult {
  calculatedYear: number;
  yearRange: { min: number; max: number };
  confidence: 'high' | 'medium' | 'low';
  formula: string;
  isValid: boolean;
  error?: string;
}

/** Calculate manufacturing year from RN number */
export function calculateYearFromRN(rn: number): number {
  if (rn < 13670) {
    throw new Error(`Invalid RN number: ${rn}. RN must be >= 13670 to use dating formula.`);
  }
  return (rn - 13670) / 2635 + 1959;
}

/** Get year range with manufacturing variance */
export function getYearRangeFromRN(rn: number, variance = 0.5): { min: number; max: number } {
  const year = calculateYearFromRN(rn);
  return { min: Math.floor(year - variance), max: Math.ceil(year + variance) };
}

/** Calculate confidence based on RN validity and year range */
export function calculateConfidence(
  rn: number,
  yearRange: { min: number; max: number }
): 'high' | 'medium' | 'low' {
  if (rn >= 13670 && rn <= 100000 && yearRange.min >= 1958 && yearRange.max <= 2030) {
    const range = yearRange.max - yearRange.min;
    if (range <= 2) return 'high';
    if (range <= 5) return 'medium';
  }
  if (rn >= 13670 && yearRange.min >= 1950 && yearRange.max <= 2040) return 'medium';
  return 'low';
}

/** Comprehensive RN dating analysis */
export function analyzeRNDating(rn: number): RNDatingResult {
  try {
    if (rn < 13670) {
      return {
        calculatedYear: 0,
        yearRange: { min: 0, max: 0 },
        confidence: 'low',
        formula: '(RN - 13670) / 2635 + 1959',
        isValid: false,
        error: `RN ${rn} is below minimum threshold (13670)`,
      };
    }

    const calculatedYear = calculateYearFromRN(rn);
    const yearRange = getYearRangeFromRN(rn);
    const confidence = calculateConfidence(rn, yearRange);
    const isValid = yearRange.min >= 1958 && yearRange.max <= 2030;

    return {
      calculatedYear,
      yearRange,
      confidence: isValid ? confidence : 'low',
      formula: '(RN - 13670) / 2635 + 1959',
      isValid,
      error: isValid
        ? undefined
        : `Calculated year ${calculatedYear.toFixed(2)} is outside reasonable range`,
    };
  } catch (error) {
    return {
      calculatedYear: 0,
      yearRange: { min: 0, max: 0 },
      confidence: 'low',
      formula: '(RN - 13670) / 2635 + 1959',
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error calculating RN date',
    };
  }
}

/** Format RN dating result for display */
export function formatRNDatingResult(result: RNDatingResult): string {
  if (!result.isValid) {
    return `Invalid RN: ${result.error || 'Unable to calculate date'}`;
  }

  const yearStr = result.calculatedYear.toFixed(1);
  const rangeStr =
    result.yearRange.min === result.yearRange.max
      ? `${result.yearRange.min}`
      : `${result.yearRange.min}-${result.yearRange.max}`;

  return `Estimated: ${yearStr} (${rangeStr}) - ${result.confidence} confidence`;
}
