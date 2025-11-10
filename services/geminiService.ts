
import { GoogleGenAI } from "@google/genai";

export const generateContentFromApi = async (topic: string, tone: string, apiKey: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API key is missing. Please set it in the settings.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        const model = 'gemini-2.5-flash';
        
        const prompt = `
            You are an expert content creator for social media shorts.
            Your task is to generate a short, engaging script based on the following details.
            The script should be concise and suitable for a short video format.
            Regardless of the language of the topic, the generated script must be in English.

            Topic: "${topic}"
            Tone: "${tone.replace(' (default)', '').trim()}"

            Generate the script now.
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
