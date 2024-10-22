import axios from 'axios';

const API_URL = 'https://api.openai.com/v1';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

if (!API_KEY) {
  console.error('OpenAI API key is not set. Please set the REACT_APP_OPENAI_API_KEY environment variable.');
}

const openai = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

export const generateResponse = async (prompt: string, model: string = 'gpt-4') => {
  try {
    const response = await openai.post('/chat/completions', {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

export default openai;