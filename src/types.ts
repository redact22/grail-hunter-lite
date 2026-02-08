/**
 * GRAIL HUNTER LITE — Type Definitions
 */

export enum GrailRarity {
  COMMON = 'Common',
  RARE = 'Rare',
  ULTRA_RARE = 'Ultra Rare',
  GRAIL = 'Grail',
}

export type ToastVariant = 'success' | 'error' | 'info' | 'achievement';

export type GrailCategory =
  | 'Footwear'
  | 'Tops'
  | 'Bottoms'
  | 'Outerwear'
  | 'Accessories'
  | 'Vintage'
  | 'Other';

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface NearbyStore {
  name: string;
  address: string;
  rating?: number;
  uri: string;
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
  ttl?: number;
}

export interface GrailItem {
  id: string;
  name: string;
  brand: string;
  category: GrailCategory;
  estimatedValue: number;
  rarity: GrailRarity;
  imageUrl: string;
  description: string;
  year?: number;
  curatorNote?: string;
  season?: string;
  authenticationNotes?: string;
  confidence?: number;
  redFlags?: string[];
  isAuthentic?: boolean;
  stylingAdvice?: string;
  pairingSuggestions?: string[];
  occasions?: string[];
  materialComposition?: Record<string, number>;
}

export interface IdentificationResult {
  name: string;
  brand: string;
  category: GrailCategory | string;
  rarity: GrailRarity | string;
  era: string;
  confidence: number;
  estimatedValue: string;
  reasoningChain?: string;
  authenticationNotes?: string;
  isAuthentic: boolean;
  redFlags?: string[];
  stylingAdvice?: string;
  pairingSuggestions?: string[];
  occasions?: string[];
  materialComposition?: Record<string, number>;
  id?: string;
}
