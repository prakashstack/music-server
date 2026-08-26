"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifySearchIntent = void 0;
const genai_1 = require("@google/genai");
const env_1 = require("../../config/env");
let genai = null;
const getClient = () => {
    if (!genai && env_1.env.GEMINI_API_KEY) {
        genai = new genai_1.GoogleGenAI({ apiKey: env_1.env.GEMINI_API_KEY });
    }
    if (!genai)
        throw new Error('Gemini API key not configured');
    return genai;
};
const classifySearchIntent = async (query) => {
    const fallback = {
        category: 'general',
        mood: null,
        genre: null,
        language: null,
        artist: null,
    };
    if (!env_1.env.GEMINI_API_KEY)
        return fallback;
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
    }
    catch (err) {
        console.warn('Gemini classification failed, using fallback:', err);
        return fallback;
    }
};
exports.classifySearchIntent = classifySearchIntent;
//# sourceMappingURL=client.js.map