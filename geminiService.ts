
import { GoogleGenAI, Type } from "@google/genai";

export const getCurriculumRecommendation = async (userRole: string, businessNeed: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As an expert in AI and B2B education, recommend a specific curriculum path for a professional with the role: "${userRole}" and the following needs: "${businessNeed}". 
    Format the response in JSON with 'curriculumTitle', 'reasoning', and 'threeKeyLessons'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          curriculumTitle: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          threeKeyLessons: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["curriculumTitle", "reasoning", "threeKeyLessons"]
      }
    }
  });

  return JSON.parse(response.text);
};
