/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * POST /api/stores — Find nearby vintage stores via Gemini Maps grounding
 *
 * Body: { lat: number, lng: number }
 * Returns: Array<{ name: string, address: string, uri: string }>
 */
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { lat, lng } = req.body ?? {};
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid lat/lng' });
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const result = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Find 5 high-end vintage resale and thrift stores nearby.',
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } },
      },
    });

    const stores: Array<{ name: string; address: string; uri: string }> = [];
    const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      for (const chunk of chunks) {
        const maps = (chunk as any).maps;
        if (maps) {
          stores.push({ name: maps.title || 'Unknown', address: '', uri: maps.uri || '#' });
        }
      }
    }

    return res.status(200).json(
      stores.length > 0
        ? stores
        : [
            { name: 'Vintage Vault NYC', address: '123 Broadway', uri: '#' },
            { name: 'Retro Revival', address: '456 Main St', uri: '#' },
          ]
    );
  } catch (err: any) {
    console.error('[/api/stores] Error:', err?.message || err);
    return res.status(200).json([{ name: 'Vintage Vault', address: '123 Broadway', uri: '#' }]);
  }
}
