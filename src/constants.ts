/**
 * GRAIL HUNTER LITE — Constants & Utility Functions
 */
import { GrailRarity } from './types';
import type { GrailItem } from './types';

// ─── Sample marketplace data ──────────────────────────────────────────────
export const SAMPLE_ITEMS: GrailItem[] = [
  {
    id: '1',
    name: 'Halston Caftan',
    brand: 'Halston',
    category: 'Vintage',
    estimatedValue: 1850,
    rarity: GrailRarity.GRAIL,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    description: 'Original 1970s silk caftan',
    year: 1974,
    isAuthentic: true,
    curatorNote: 'Museum-grade piece with original silk weight. RN# 42850 verified.',
  },
  {
    id: '2',
    name: 'Detroit Jacket J97',
    brand: 'Carhartt',
    category: 'Outerwear',
    estimatedValue: 450,
    rarity: GrailRarity.RARE,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
    description: 'Blanket-lined Detroit jacket',
    year: 1992,
    isAuthentic: true,
    curatorNote: 'Union-made blanket lining. Original brass YKK zipper intact.',
  },
  {
    id: '3',
    name: 'Air Jordan 1 Chicago',
    brand: 'Nike',
    category: 'Footwear',
    estimatedValue: 4200,
    rarity: GrailRarity.GRAIL,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
    description: '1985 original pair',
    year: 1985,
    isAuthentic: true,
    curatorNote: '1985 originals with factory stitching. Five-figure territory.',
  },
  {
    id: '4',
    name: 'Big E 501 Selvedge',
    brand: "Levi's",
    category: 'Bottoms',
    estimatedValue: 2800,
    rarity: GrailRarity.ULTRA_RARE,
    imageUrl: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=500&fit=crop',
    description: 'Pre-1971 Big E selvedge',
    year: 1968,
    isAuthentic: true,
    curatorNote: 'Big E tab, hidden rivets, selvedge ID. The gold standard.',
  },
  {
    id: '5',
    name: 'Archive Bomber',
    brand: 'Helmut Lang',
    category: 'Outerwear',
    estimatedValue: 3200,
    rarity: GrailRarity.ULTRA_RARE,
    imageUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop',
    description: 'FW98 archive nylon bomber',
    year: 1998,
    isAuthentic: true,
    curatorNote: 'FW98 runway piece. Astro-nylon shell with bondage straps. Archive gold.',
  },
  {
    id: '6',
    name: 'Riot Riot Riot Parka',
    brand: 'Raf Simons',
    category: 'Outerwear',
    estimatedValue: 8500,
    rarity: GrailRarity.GRAIL,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
    description: 'AW01 Riot Riot Riot collection',
    year: 2001,
    isAuthentic: true,
    curatorNote: 'AW01 "Riot Riot Riot" collection. Museum-tier. Sub-10 known examples.',
  },
  {
    id: '7',
    name: 'Birkin 35 Gold',
    brand: 'Hermes',
    category: 'Accessories',
    estimatedValue: 12000,
    rarity: GrailRarity.GRAIL,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
    description: 'Togo leather, gold hardware',
    year: 2019,
    isAuthentic: true,
    curatorNote: 'Togo leather, GHW. Blind stamp confirms 2019 production. Resale premium 3x.',
  },
  {
    id: '8',
    name: 'Submariner 5513',
    brand: 'Rolex',
    category: 'Accessories',
    estimatedValue: 15000,
    rarity: GrailRarity.GRAIL,
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop',
    description: 'Matte dial no-date Sub',
    year: 1969,
    isAuthentic: true,
    curatorNote: 'Matte dial, meters-first. Serial 2.1M confirms 1969. Patina developing nicely.',
  },
];

// ─── Scan Status Messages ──────────────────────────────────────────────
export const SCAN_STATUS_MESSAGES = [
  'Visual Thought Signature...',
  'Taxonomy Analysis...',
  'Market Delta Calculation...',
  'Authentication Verdict...',
  'Styling Synthesis...',
  'Forensic Report Compilation...',
];

// ─── Condition Multiplier ──────────────────────────────────────────────
export const conditionMultiplier = (pct: number): number => {
  if (pct >= 95) return 1.25;
  if (pct >= 85) return 1.0;
  if (pct >= 70) return 0.8;
  if (pct >= 50) return 0.6;
  return 0.4;
};

export const conditionLabel = (pct: number): string => {
  if (pct >= 95) return 'Deadstock';
  if (pct >= 85) return 'Excellent';
  if (pct >= 70) return 'Good';
  if (pct >= 50) return 'Fair';
  return 'Poor';
};

// ─── Rarity Colors ──────────────────────────────────────────────
export const rarityColors: Record<
  string,
  { bg: string; text: string; glow: string; border: string }
> = {
  Grail: {
    bg: 'bg-[#FFB020]/20',
    text: 'text-[#FFB020]',
    glow: 'shadow-[0_0_20px_rgba(255,176,32,0.3)]',
    border: 'border-[#FFB020]/30',
  },
  'Ultra Rare': {
    bg: 'bg-[#FF3BD4]/20',
    text: 'text-[#FF3BD4]',
    glow: 'shadow-[0_0_20px_rgba(255,59,212,0.3)]',
    border: 'border-[#FF3BD4]/30',
  },
  Rare: {
    bg: 'bg-[#9B7BFF]/20',
    text: 'text-[#9B7BFF]',
    glow: 'shadow-[0_0_20px_rgba(155,123,255,0.3)]',
    border: 'border-[#9B7BFF]/30',
  },
  Common: { bg: 'bg-white/10', text: 'text-white/60', glow: '', border: 'border-white/10' },
};
