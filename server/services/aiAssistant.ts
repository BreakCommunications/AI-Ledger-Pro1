import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getAIAssistance = async (question: string, context: string): Promise<string> => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant for a business document and accounting platform. Provide helpful and accurate responses to user queries." },
        { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.data.choices[0].message?.content?.trim() || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    throw new Error('Failed to get AI assistance');
  }
};