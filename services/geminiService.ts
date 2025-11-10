
import { GoogleGenAI } from "@google/genai";

export const generateContentFromApi = async (topic: string, tone: string): Promise<string> => {
    // This check is for the browser environment where process.env might not be defined
    // or the API key is not set. The environment is expected to provide the key.
    if (!process.env.API_KEY) {
        console.error("API_KEY is not set in environment variables.");
        throw new Error("API key is missing. Please configure your environment.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const model = 'gemini-2.5-flash';
        
        const prompt = `
            You are an expert content creator for social media shorts.
            Your task is to generate a short, engaging script based on the following details.
            The script should be concise and suitable for a short video format.

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
            throw new Error(`Failed to generate content: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating content.");
    }
};
