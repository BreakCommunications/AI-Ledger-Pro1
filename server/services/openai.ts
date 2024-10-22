import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const analyzeDocument = async (content: string) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant specialized in analyzing business documents." },
        { role: "user", content: `Please analyze the following document and provide insights:\n\n${content}` }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.data.choices[0].message?.content?.trim();
  } catch (error) {
    console.error('Error analyzing document with OpenAI:', error);
    throw new Error('Failed to analyze document');
  }
};

export const generateAIInsights = async (transactions: any[], documents: any[]) => {
  try {
    const prompt = `Based on the following financial transactions and documents, provide business insights and recommendations:

Transactions:
${JSON.stringify(transactions, null, 2)}

Documents:
${JSON.stringify(documents, null, 2)}

Please provide insights on financial health, spending patterns, and document management efficiency. Also, suggest any areas for improvement or cost-saving opportunities.`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant specialized in business analysis and financial advice." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.data.choices[0].message?.content?.trim();
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw new Error('Failed to generate AI insights');
  }
};