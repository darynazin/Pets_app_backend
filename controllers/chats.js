import OpenAI from 'openai';
import { AZURE_ENDPOINT, GITHUB_TOKEN, MODEL_NAME } from '../config/config.js';

export const createChat = async (req, res) => {
  try {
    const request = req.body;

    const openai = new OpenAI({
    baseURL: AZURE_ENDPOINT,
    apiKey: GITHUB_TOKEN,
  });

    const completion = await openai.chat.completions.create({
      messages: [
        { role:"system", content: "You are a helpful assistant that provides short first-aid instructions for pet ownert befor going to the vet in 2-5 steps. Each step should start on a new line, without extra formatting." },
        { role:"user", content: request.message.query }
      ],
      model: MODEL_NAME,
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });
    res.json(completion.choices[0].message.content);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
