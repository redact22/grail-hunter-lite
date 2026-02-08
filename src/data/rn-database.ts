/**
 * RN Brand Database — Known RN numbers for major vintage brands
 *
 * Source: FTC Registered Identification Number database
 * Curated for high-value vintage fashion authentication.
 */

export interface BrandRNEntry {
  brand: string;
  rn: number;
  notes?: string;
}

export const KNOWN_RN_DATABASE: BrandRNEntry[] = [
  { brand: 'Carhartt', rn: 14806, notes: 'Detroit Jacket, workwear staple' },
  { brand: 'Pendleton', rn: 29685, notes: 'Wool shirts and blankets' },
  { brand: 'Woolrich', rn: 15528, notes: 'Historic American outerwear' },
  { brand: 'Filson', rn: 29237, notes: 'Pacific Northwest heritage' },
  { brand: 'L.L.Bean', rn: 71341, notes: 'Maine outdoor brand' },
  { brand: 'Patagonia', rn: 51884, notes: 'Outdoor performance' },
  { brand: 'The North Face', rn: 61661, notes: 'Outdoor/mountain' },
  { brand: 'Nike', rn: 56323, notes: 'Athletic footwear & apparel' },
  { brand: 'Champion', rn: 15763, notes: 'Reverse Weave heritage' },
  { brand: 'Russell Athletic', rn: 15137, notes: 'Athletic basics' },
  { brand: 'Fruit of the Loom', rn: 14974, notes: 'Basics manufacturer' },
  { brand: 'Hanes', rn: 15763, notes: 'Basics and essentials' },
  { brand: 'Ralph Lauren', rn: 41381, notes: 'Polo Ralph Lauren' },
  { brand: 'Tommy Hilfiger', rn: 77806, notes: '90s Americana' },
  { brand: 'Calvin Klein', rn: 36009, notes: 'American minimalism' },
  { brand: 'Liz Claiborne', rn: 52002, notes: 'American sportswear' },
  { brand: 'Eddie Bauer', rn: 18221, notes: 'Pacific Northwest outdoor' },
  { brand: 'J.Crew', rn: 77388, notes: 'Preppy American' },
];

/** Parse an RN string into a number (handles "RN 14806", "RN#14806", "14806") */
export function parseRNNumber(input: string): number | null {
  const match = input.replace(/[^0-9]/g, '');
  const num = parseInt(match, 10);
  return isNaN(num) ? null : num;
}

/** Look up a brand by RN number */
export function lookupRN(rn: number): BrandRNEntry | null {
  return KNOWN_RN_DATABASE.find((entry) => entry.rn === rn) ?? null;
}

/** Validate if an RN number matches a specific brand */
export function validateRNForBrand(rn: number, brand: string): boolean {
  const entry = KNOWN_RN_DATABASE.find((e) => e.brand.toLowerCase() === brand.toLowerCase());
  return entry ? entry.rn === rn : false;
}
