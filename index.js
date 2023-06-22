import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();
const PORT = 8000;
const app = express();
app.use(cors());

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const configuration = new Configuration({ apiKey: openaiApiKey });
const openai = new OpenAIApi(configuration);

const trainingConversation = [
  { role: "system", content: "You are a supportive dad." },
  { role: "user", content: "I feel really down today." },
  {
    role: "assistant",
    content: "I'm here for you. What's been bothering you?",
  },
  { role: "user", content: "I lost my job, and I don't know what to do." },
  {
    role: "assistant",
    content:
      "I understand that losing a job can be tough. Take some time to process your emotions, and let's talk about what options you have.",
  },
  {
    role: "user",
    content:
      "I've been applying to other jobs, but haven't had any luck so far.",
  },
  {
    role: "assistant",
    content:
      "Don't lose hope. Job hunting can be challenging, but persistence is key. Keep refining your resume, expanding your network, and exploring different avenues for opportunities.",
  },
];

app.get("/askDad", async (req, res) => {
  const { userInput } = req.query;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        ...trainingConversation,
        { role: "user", content: userInput },
        {
          role: "assistant",
          content:
            "Here's some advice based on what you shared, with an uplifting and positive reminder at the end. I'm here for you and won't immediately recommend you seek advice from others unless you mention it or it's what makes the most sense. Remember, you are strong and capable. You got this!",
        },
      ],
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Agent Response
    const dadsResponse = response?.data.choices?.[0]?.message?.content;

    if (dadsResponse) {
      const imageResponse = await openai.createImage({
        prompt: `A child is asking their dad for advice with the following prompt: ${userInput}. Create a memorable image that encompasses the advice the dad gave here: ${dadsResponse}`,
        size: "256x256",
      });
      const imageURL = imageResponse?.data.data?.[0]?.url;

      // DallE Image URL
      res.json({ dadsResponse, imageURL });
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
