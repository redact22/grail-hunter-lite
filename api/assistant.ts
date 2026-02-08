/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * POST /api/assistant — Search-grounded vintage fashion assistant
 *
 * Body: { prompt: string }
 * Returns: { text: string, links: Array<{ title: string, uri: string }> }
 */
import { GoogleGenAI } from '@google/genai';

const CHAT_MODEL = 'gemini-3-pro';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { prompt } = req.body ?? {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prompt' });
  }

  if (prompt.length > 4000) {
    return res.status(413).json({ error: 'Prompt too long (max 4000 chars)' });
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const result = await client.models.generateContent({
      model: CHAT_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are the GRAIL HUNTER Intelligence Assistant. Expert in vintage fashion forensics, market trends, and authentication.',
        tools: [{ googleSearch: {} }],
      },
    });

    const text = result.text ?? '';
    const links: Array<{ title: string; uri: string }> = [];
    const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.web) {
          links.push({ title: chunk.web.title ?? 'Source', uri: chunk.web.uri ?? '' });
        }
      }
    }

    return res.status(200).json({ text, links });
  } catch (err: any) {
    console.error('[/api/assistant] Error:', err?.message || err);
    return res.status(500).json({ error: 'Assistant failed', detail: err?.message });
  }
}
