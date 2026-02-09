/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * POST /api/styling — Generate styling advice for a grail item
 *
 * Body: { brand: string, name: string, year?: number }
 * Returns: { advice: string, pairings: string[], occasions: string[] }
 */
import { GoogleGenAI, Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { rateLimit, getClientIp } from './_rateLimit';

const CHAT_MODEL = 'gemini-3-flash-preview';

const STYLING_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    advice: { type: Type.STRING },
    pairings: { type: Type.ARRAY, items: { type: Type.STRING } },
    occasions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['advice', 'pairings', 'occasions'],
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { allowed, remaining, resetMs } = rateLimit(getClientIp(req), '/api/styling');
  if (!allowed) {
    return res.status(429).json({ error: `Rate limited. Try again in ${Math.ceil(resetMs / 1000)}s` });
  }
  res.setHeader('X-RateLimit-Remaining', remaining);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { brand, name, year } = req.body ?? {};
  if (!brand || !name) {
    return res.status(400).json({ error: 'Missing brand or name' });
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const result = await client.models.generateContent({
      model: CHAT_MODEL,
      contents: `Suggest elite styling for: ${brand} ${name} (${year ?? 'vintage'}). Provide one strategy, 3 pairings, 3 occasions.`,
      config: { responseMimeType: 'application/json', responseSchema: STYLING_SCHEMA },
    });

    const parsed = JSON.parse(result.text ?? '{}');
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('[/api/styling] Error:', err?.message || err);
    return res.status(500).json({ error: 'Styling generation failed' });
  }
}
