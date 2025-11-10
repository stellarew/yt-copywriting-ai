import { GoogleGenAI } from "@google/genai";

export const generateContentFromApi = async (topic: string, tone: string, apiKey: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API key is missing. Please set it in the settings.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const model = 'gemini-2.5-flash';
        
        const prompt = `
            You are an expert storyteller.
            Your task is to write a compelling and engaging narrative based on the following topic and tone.
            The output should be a pure story, without any script formatting, dialogue tags, or scene directions.
            The story should be suitable for a short video, focusing on vivid descriptions and a clear plot.
            Regardless of the language of the topic, the generated story must be in English.

            Topic: "${topic}"
            Tone: "${tone.replace(' (default)', '').trim()}"

            Write the story now.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        if (response.text) {
            return response.text;
        } else {
            throw new Error("Received an empty response from the AI.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            // Check for common API key-related errors
            if (error.message.includes('API key not valid')) {
                throw new Error('The provided API key is not valid. Please check it in the settings.');
            }
            throw new Error(`Failed to generate content: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating content.");
    }
};

export const getSmartSuggestions = async (topic: string, niche: string, apiKey: string): Promise<string[]> => {
    if (!apiKey) {
        throw new Error("API key is missing. Please set it in the settings.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const model = 'gemini-2.5-flash';

        const prompt = `
            Generate a list of 20 engaging, specific, and creative topic ideas for social media shorts.
            The topics should be related to the central theme: "${topic}" within the "${niche}" niche.
            Return the list as a simple, plain text, numbered list (e.g., "1. Topic one", "2. Topic two").
            Do not add any preamble, introduction, or conclusion. Just the list.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        if (response.text) {
            // Split by new line, remove the numbering, and filter out empty lines
            return response.text
                .split('\n')
                .map(line => line.replace(/^\d+\.\s*/, '').trim())
                .filter(line => line.length > 0);
        } else {
            throw new Error("Received an empty response from the AI for suggestions.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for suggestions:", error);
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                throw new Error('The provided API key is not valid. Please check it in the settings.');
            }
            throw new Error(`Failed to get suggestions: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while getting suggestions.");
    }
};
