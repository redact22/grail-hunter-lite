/**
 * GRAIL HUNTER LITE — Gemini Service (Secure Server-Side Architecture)
 *
 * All Gemini calls route through /api/* serverless functions.
 * The API key lives server-side only (GEMINI_API_KEY env var).
 * No client-side SDK, no VITE_GEMINI_API_KEY in the bundle.
 *
 * Audio TTS uses browser SpeechSynthesis (no API key needed).
 */
import type { IdentificationResult, GroundingLink, NearbyStore, GrailItem } from '../types';

/* ─── API health tracking ─── */

let _lastApiSuccess = true;

/** Returns true if the last API call succeeded (real Gemini data) */
export const isConfigured = (): boolean => _lastApiSuccess;

/* ─── Simulation data ─── */

const SIMULATED_SCAN: IdentificationResult = {
  name: '[SIM] Vintage Halston Caftan c. 1973',
  brand: 'Halston',
  category: 'Vintage',
  rarity: 'Grail',
  era: '1970s',
  confidence: 0.96,
  estimatedValue: '$1,850–$2,400',
  reasoningChain:
    '⚠️ SIMULATION MODE — API unavailable. Showing sample data.\n\n' +
    'Phase 1: Visual Thought Signature — Hand-rolled hems with 12 SPI chain stitch detected. Selvage edges intact, indicating pre-industrial cut. Fabric drape consistent with single-ply charmeuse silk (19mm weight). ' +
    'Phase 2: Taxonomy Analysis — Label typography matches Halston 1971-1976 mainline. RN# 42850 cross-referenced against FTC database: registered to Halston Enterprises Inc., active 1968-1990. Union label ILGWU present (pre-1995). ' +
    "Phase 3: Market Delta — Comparable sales: Christie's 2024 lot #447 ($2,100), Grailed #HLS-9927 ($1,650 NWOT), The RealReal avg caftan price $890. This specimen rates 95th percentile due to museum-grade condition and provenance markers. " +
    'Phase 4: Authentication Verdict — AUTHENTIC with high confidence. Zero red flags detected. All 7 forensic checkpoints passed: label, stitching, fabric, hardware, construction, era-dating, brand-specific markers.',
  redFlags: [],
  authenticationNotes:
    'Museum quality piece. Original silk weight confirmed at ~19mm. Care label intact with period-correct washing symbols. No evidence of alteration, repair, or reproduction.',
  isAuthentic: true,
  stylingAdvice:
    'Layer over a slim black turtleneck for a Studio 54 silhouette. Keep accessories minimal — one bold gold cuff at most. Let the caftan be the statement.',
  pairingSuggestions: ['Minimal Gold Cuff', 'Black Platform Sandals', 'Vintage Box Clutch'],
  occasions: ['Museum Gala', 'Private Collection Viewing', 'Editorial Shoot'],
  materialComposition: { Silk: 92, Rayon: 8 },
};

const SIMULATED_STYLING = {
  advice: 'Style with confidence and authenticity. (Simulation mode — API unavailable)',
  pairings: ['Classic denim', 'Vintage sneakers', 'Minimal accessories'],
  occasions: ['Casual outings', 'Street style events', 'Gallery openings'],
};

const SIMULATED_STORES: NearbyStore[] = [
  { name: 'Vintage Vault NYC', address: '123 Broadway', uri: '' },
  { name: 'Retro Revival', address: '456 Main St', uri: '' },
  { name: 'Thrift Paradise', address: '789 Oak Ave', uri: '' },
];

/* ─── API Proxy helpers ─── */

async function apiPost<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `API ${res.status}`);
  }
  _lastApiSuccess = true;
  return res.json();
}

/* ─── Response validation ─── */

function validateScanResult(data: unknown): IdentificationResult {
  if (!data || typeof data !== 'object') throw new Error('Invalid scan response');
  const d = data as Record<string, unknown>;
  if (typeof d.name !== 'string' || !d.name) throw new Error('Missing name');
  if (typeof d.brand !== 'string' || !d.brand) throw new Error('Missing brand');
  if (typeof d.confidence !== 'number') throw new Error('Missing confidence');
  if (typeof d.isAuthentic !== 'boolean') throw new Error('Missing isAuthentic');
  // Clamp confidence to valid range
  d.confidence = Math.max(0, Math.min(1, d.confidence as number));
  // Ensure arrays default to empty
  if (!Array.isArray(d.redFlags)) d.redFlags = [];
  if (!Array.isArray(d.pairingSuggestions)) d.pairingSuggestions = [];
  if (!Array.isArray(d.occasions)) d.occasions = [];
  // Default optional strings
  if (typeof d.era !== 'string') d.era = 'Unknown';
  if (typeof d.estimatedValue !== 'string') d.estimatedValue = 'N/A';
  if (typeof d.category !== 'string') d.category = 'Other';
  if (typeof d.rarity !== 'string') d.rarity = 'Common';
  return d as unknown as IdentificationResult;
}

/* ─── Public API ─── */

/** Identify a grail via /api/scan serverless function */
export const identifyGrail = async (imageBase64: string): Promise<IdentificationResult> => {
  try {
    const data = await apiPost<Record<string, unknown>>('/api/scan', { imageBase64 });
    return validateScanResult(data);
  } catch {
    _lastApiSuccess = false;
    await new Promise((r) => setTimeout(r, 2500));
    return SIMULATED_SCAN;
  }
};

/** Generate styling advice via /api/styling serverless function */
export const generateStylingAdvice = async (
  item: GrailItem
): Promise<{ advice: string; pairings: string[]; occasions: string[] }> => {
  try {
    return await apiPost('/api/styling', { brand: item.brand, name: item.name, year: item.year });
  } catch {
    _lastApiSuccess = false;
    return SIMULATED_STYLING;
  }
};

/** TTS briefing — browser SpeechSynthesis only (no API key needed) */
export const generateStylingAudio = async (text: string): Promise<string> => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    return 'browser-tts';
  }
  return '';
};

/** Veo video generation — disabled in secure mode (would need API key client-side) */
export const generateProductReel = async (_item: GrailItem): Promise<string> => {
  // Veo requires long-polling + client SDK — not available in server-proxy mode
  return '';
};

/** Search-grounded assistant via /api/assistant serverless function */
export const askAssistant = async (
  prompt: string
): Promise<{ text: string; links: GroundingLink[] }> => {
  try {
    return await apiPost('/api/assistant', { prompt });
  } catch {
    _lastApiSuccess = false;
    return {
      text: 'Market intelligence running in simulation mode. API connection unavailable.',
      links: [],
    };
  }
};

/** Find nearby vintage stores via /api/stores serverless function */
export const findNearbyDrops = async (lat: number, lng: number): Promise<NearbyStore[]> => {
  try {
    return await apiPost('/api/stores', { lat, lng });
  } catch {
    _lastApiSuccess = false;
    return SIMULATED_STORES;
  }
};
