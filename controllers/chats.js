import OpenAI from 'openai';

export const createChat = async (req, res) => {
  try {
    const request = req.body;

    const openai = new OpenAI({
    baseURL: process.env.AZURE_ENDPOINT,
    apiKey: process.env.GITHUB_TOKEN,
  });

    const completion = await openai.chat.completions.create({
      messages: [
        { role:"system", content: "You are a helpful assistant that provides short first-aid instructions for pet ownert befor going to the vet in 2-5 steps. Each step should start on a new line, without extra formatting." },
        { role:"user", content: request.message.query }
      ],
      model: process.env.MODEL_NAME,
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
