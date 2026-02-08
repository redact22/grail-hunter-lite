/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * POST /api/scan — Grail identification via Gemini 3 Pro Vision
 *
 * Body: { imageBase64: string }
 * Returns: IdentificationResult JSON
 */
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import type { Schema } from '@google/genai';

const VISION_MODEL = 'gemini-3-flash-preview';

const EXPERT_SYSTEM_INSTRUCTION = `You are GRAIL HUNTER, an elite vintage fashion forensics AI.
You specialize in authenticating and valuing thrift/vintage clothing, shoes, and accessories.

AUTHENTICATION EXPERTISE:
- Stitching patterns: chain stitch vs. lockstitch, SPI analysis
- Hardware: YKK vs. Talon zippers, snap quality, button composition
- Label forensics: RN numbers, care labels, union labels, country of origin
- Fabric analysis: thread count, weave patterns, material composition
- Era dating: tag styles, font changes, label color transitions by decade
- Brand-specific: Levi's Big E, Carhartt J97, Nike swoosh evolution

MARKET INTELLIGENCE:
- Current resale trends across Grailed, eBay, Depop, The RealReal
- Premium multipliers for deadstock, NWOT, vintage condition
- Rarity tiers: Common, Rare, Ultra Rare, Grail
- Seasonal demand, cultural moments, celebrity influence`;

const IDENTIFICATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Full item name with brand and style' },
    brand: { type: Type.STRING, description: 'Brand or maker name' },
    category: {
      type: Type.STRING,
      enum: ['Footwear', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Vintage', 'Other'],
    },
    rarity: { type: Type.STRING, enum: ['Common', 'Rare', 'Ultra Rare', 'Grail'] },
    era: { type: Type.STRING, description: 'Decade or year range' },
    confidence: { type: Type.NUMBER, description: 'Authentication confidence 0.0-1.0' },
    estimatedValue: { type: Type.STRING, description: 'Estimated value as "$XXX" or "$XXX-$YYY"' },
    reasoningChain: { type: Type.STRING, description: 'Step-by-step forensic reasoning' },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    authenticationNotes: { type: Type.STRING },
    isAuthentic: { type: Type.BOOLEAN },
    stylingAdvice: { type: Type.STRING },
    pairingSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    occasions: { type: Type.ARRAY, items: { type: Type.STRING } },
    materialComposition: { type: Type.OBJECT },
  },
  required: [
    'name',
    'brand',
    'category',
    'rarity',
    'era',
    'confidence',
    'estimatedValue',
    'isAuthentic',
  ],
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { imageBase64 } = req.body ?? {};
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid imageBase64' });
  }

  // Limit to ~6MB base64 (~4.5MB raw image)
  if (imageBase64.length > 8_000_000) {
    return res.status(413).json({ error: 'Image too large (max ~4.5MB)' });
  }

  try {
    const client = new GoogleGenAI({ apiKey });
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const result = await client.models.generateContent({
      model: VISION_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `FORENSIC AUTHENTICATION PROTOCOL:
Phase 1: Visual Thought Signature — stitching, hardware, fabric weave.
Phase 2: Taxonomy — brand, era, category, rarity.
Phase 3: Market Delta — estimate current market value.
Phase 4: Authentication verdict with reasoning chain and red flags.
Phase 5: Styling recommendations.

Analyze this vintage/thrift item image thoroughly.`,
            },
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: IDENTIFICATION_SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        systemInstruction: EXPERT_SYSTEM_INSTRUCTION,
      },
    });

    const parsed = JSON.parse(result.text ?? '{}');
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('[/api/scan] Error:', err?.message || err);
    return res.status(500).json({ error: 'Scan failed' });
  }
}
