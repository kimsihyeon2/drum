import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real app, ensure process.env.API_KEY is set.
// For this demo, we'll gracefully fail if no key is present or mock the response if needed.
let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateDrumCoachAdvice = async (songTitle: string, artist: string, difficulty: string): Promise<string> => {
  if (!ai) {
    return "Gemini API Key not found. Please configure the environment to get AI coaching tips.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      I am learning to play the drums for the song "${songTitle}" by "${artist}".
      The transcription difficulty is rated as ${difficulty}.
      
      Provide 3 short, specific, and actionable tips for a drummer attempting this song.
      Focus on the groove, key techniques (like ghost notes, paradiddles, or foot technique), and "feel".
      Keep it under 100 words total. Format as a bulleted list.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Keep practicing! Focus on your timing.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not retrieve AI advice at this moment.";
  }
};
