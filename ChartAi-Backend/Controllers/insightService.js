import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, 
});

export const generateInsight = async (dataJson) => {
  const prompt = `You are a data analyst. Given this JSON array, summarize key insights:\n\n${JSON.stringify(dataJson, null, 2)}\n\nWhat trends or patterns do you see?`;

  try {
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt: prompt,
      maxTokens: 300,
      temperature: 0.5
    });

    return response.generations[0].text;
  } catch (error) {
    console.error("Cohere Insight Error:", error);
    return "Insight generation failed.";
  }
};
