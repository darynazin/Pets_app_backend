import OpenAI from 'openai';

export const createChat = async (req, res) => {
  try {
    const request = req.body;
    console.log(request);

    const openai = new OpenAI({
    baseURL: process.env.AZURE_ENDPOINT,
    apiKey: process.env.GITHUB_TOKEN,
  });

    const completion = await openai.chat.completions.create({
      messages: [
        { role:"system", content: "you are a helpful assistand that gives short and clear instruction of first aid for pets in 2-5 steps" },
        { role:"user", content: request.message }
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
