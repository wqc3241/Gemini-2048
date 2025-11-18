import { GoogleGenAI, Type } from "@google/genai";
import { Grid, Direction } from "../types";
import { AI_SYSTEM_INSTRUCTION } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getBestMove = async (grid: Grid): Promise<{ direction: Direction; reasoning: string } | null> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Current Board:\n${JSON.stringify(grid)}`,
      config: {
        systemInstruction: AI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            direction: {
              type: Type.STRING,
              enum: ["UP", "DOWN", "LEFT", "RIGHT"],
            },
            reasoning: {
              type: Type.STRING,
            }
          },
          required: ["direction", "reasoning"],
        }
      },
    });

    const text = response.text;
    if (!text) return null;

    const result = JSON.parse(text);
    
    return {
      direction: result.direction as Direction,
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
