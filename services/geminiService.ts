
import { GoogleGenAI, Type } from "@google/genai";
import type { Itinerary, Budget } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itinerarySchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      day: {
        type: Type.INTEGER,
        description: 'The day number of the itinerary, starting from 1.',
      },
      title: {
        type: Type.STRING,
        description: 'A catchy and descriptive title for the day\'s plan.',
      },
      activities: {
        type: Type.ARRAY,
        description: 'A list of activities planned for the day.',
        items: {
          type: Type.OBJECT,
          properties: {
            time: {
              type: Type.STRING,
              description: 'Time of day for the activity, e.g., "Morning", "Afternoon", "Evening".',
            },
            description: {
              type: Type.STRING,
              description: 'A concise description of the activity or dining suggestion.',
            },
            details: {
              type: Type.STRING,
              description: 'Optional longer description with tips, booking info, or context.'
            }
          },
          required: ['time', 'description'],
        },
      },
    },
    required: ['day', 'title', 'activities'],
  },
};

export const generateItinerary = async (
  destination: string,
  duration: number,
  interests: string,
  budget: Budget
): Promise<Itinerary> => {
  const prompt = `You are an expert travel agent. Create a detailed, day-by-day travel itinerary for a trip.
  
  **Trip Details:**
  - **Destination:** ${destination}
  - **Duration:** ${duration} days
  - **Traveler Interests:** ${interests}
  - **Budget:** ${budget}

  Please provide a creative and practical itinerary. For each day, include a fun title and a schedule for the morning, afternoon, and evening. Activities should include a mix of sightseeing, dining, and experiences relevant to the interests. For dining, suggest specific restaurants or types of cuisine that fit the specified budget. Include practical details where possible.

  Generate the response in a valid JSON format according to the provided schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const text = response.text.trim();
    
    // Basic validation to ensure we have a non-empty array-like string
    if (!text.startsWith('[') || !text.endsWith(']')) {
      throw new Error("Invalid JSON response format from API.");
    }
    
    const parsedItinerary: Itinerary = JSON.parse(text);
    return parsedItinerary;

  } catch (error) {
    console.error("Error generating itinerary from Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
