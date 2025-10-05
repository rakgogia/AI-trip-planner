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
            },
            restaurant: {
              type: Type.OBJECT,
              description: "Details for a specific restaurant, required if the activity is dining.",
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the recommended restaurant."
                },
                cuisine: {
                  type: Type.STRING,
                  description: "The type of cuisine the restaurant serves, e.g., 'Italian', 'Local Thai'."
                }
              }
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
  budget: Budget,
  timeOfYear: string
): Promise<Itinerary> => {
  const prompt = `You are an expert travel agent. Create a detailed, day-by-day travel itinerary for a trip.
  
  **Trip Details:**
  - **Destination:** ${destination}
  - **Duration:** ${duration} days
  - **Time of Year:** ${timeOfYear}
  - **Traveler Interests:** ${interests}
  - **Budget:** ${budget}

  Please provide a creative and practical itinerary. For each day, include a fun title and a schedule for the morning, afternoon, and evening. Activities should include a mix of sightseeing, dining, and experiences relevant to the interests.
  
  **For all dining suggestions (e.g., lunch, dinner, breakfast), you MUST recommend a specific, real restaurant IN THE DESTINATION by name.** Populate the 'restaurant' object with the restaurant's name and its cuisine type. The chosen restaurants must fit the specified budget. The restaurant MUST be highly rated. 
  
  **Crucially, tailor all activities and suggestions to be appropriate for the specified time of year (${timeOfYear}), considering potential weather, holidays, or seasonal events.**

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