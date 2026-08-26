import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';

let genai: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!genai && env.GEMINI_API_KEY) {
    genai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  if (!genai) throw new Error('Gemini API key not configured');
  return genai;
};

export interface SearchIntent {
  category: string;
  mood: string | null;
  genre: string | null;
  language: string | null;
  artist: string | null;
}

export const classifySearchIntent = async (query: string): Promise<SearchIntent> => {
  const fallback: SearchIntent = {
    category: 'general',
    mood: null,
    genre: null,
    language: null,
    artist: null,
  };

  if (!env.GEMINI_API_KEY) return fallback;

  try {
    const client = getClient();
    const prompt = `Classify this music search query into JSON. Return only JSON, no markdown.
Query: "${query}"
JSON format: {"category":"string","mood":"string or null","genre":"string or null","language":"string or null","artist":"string or null"}
Categories: workout, relaxation, party, romantic, sad, devotional, study, general
Moods: energetic, calm, happy, melancholic, motivating, peaceful
Genres: bollywood, punjabi, classical, indie, devotional, pop, hip-hop, jazz, rock, tamil, telugu, marathi`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...fallback, ...parsed };
    }
    return fallback;
  } catch (err) {
    console.warn('Gemini classification failed, using fallback:', err);
    return fallback;
  }
};
