/**
 * This file contains the service for interacting with the Google Gemini API.
 * It provides a function to generate copywriting content for YouTube videos.
 */
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// As per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the expected JSON structure from the Gemini API
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'A catchy and SEO-friendly YouTube video title, under 70 characters.',
    },
    description: {
      type: Type.STRING,
      description: 'A detailed and engaging YouTube video description, around 200-300 words, including hashtags and emojis.',
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 10-15 relevant keywords and tags for the video.',
    },
    scriptHook: {
      type: Type.STRING,
      description: 'An engaging opening hook for the video script to capture viewer attention in the first 15 seconds.',
    },
    thumbnailIdea: {
        type: Type.STRING,
        description: 'A creative concept for the video thumbnail based on the video topic.'
    }
  },
  required: ['title', 'description', 'tags', 'scriptHook', 'thumbnailIdea'],
};


export interface CopywritingResult {
    title: string;
    description: string;
    tags: string[];
    scriptHook: string;
    thumbnailIdea: string;
}

export const generateCopy = async (
    topic: string,
    niche: string,
    tone: string
): Promise<CopywritingResult> => {
    try {
        const model = 'gemini-2.5-flash';

        const textPrompt = `Generate compelling YouTube video copy for a video about "${topic}".
The target niche is "${niche === 'auto-detect' ? 'to be auto-detected' : niche}" and the desired tone is "${tone}".
Come up with a creative concept for the video thumbnail based on the topic.
All generated content (titles, descriptions, tags, hooks, and ideas) MUST BE IN ENGLISH, targeting a global market.`;
        
        const parts = [{ text: textPrompt }];

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const result: CopywritingResult = JSON.parse(jsonText);
        
        return result;

    } catch (error) {
        console.error("Error generating copywriting:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate content: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating content.");
    }
};