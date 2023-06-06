import React, { useState, useEffect } from "react";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import "./SupportiveDadChatbot.css";
import { FormattedText } from "./components/FormattedText";
import { LoadingPhraseDisplay } from "./components/LoadingPhraseDisplay";
import FaderText from "./components/Fader";

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const configuration = new Configuration({ apiKey: openaiApiKey });
const openai = new OpenAIApi(configuration);

const trainingConversation: ChatCompletionRequestMessage[] = [
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

const SupportiveDadChatbot: React.FC = () => {
  const [stage, setStage] = useState(1);
  const [response, setResponse] = useState("");
  const [userInput, setUserInput] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [imageURL, setImageURL] = useState<string | undefined>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === 1) {
        setStage(2);
      } else if (stage === 2) {
        setStage(3);
      } else if (stage === 3 && messageSent) {
        setStage(4);
      } else if (stage === 4 && response && imageURL) {
        setStage(5);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [stage, messageSent, response, imageURL]);

  const handleReset = () => {
    setStage(1);
    setUserInput("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const renderStage1 = () => (
    <div className="stage-container">
      <FaderText text={"Hey kid, heard there's something on your mind..."} />
    </div>
  );

  const renderStage2 = () => (
    <div className="stage-container">
      <FaderText text={"Don't worry, everything will be okay."} />
      <FaderText text={"I'm here for you."} />
    </div>
  );

  const renderStage3 = () => (
    <div className="stage-container">
      <h1 className={!messageSent ? "fade-in" : "fade-out"}>
        Tell me, what's going on?
      </h1>
      <input
        className={`input-box ${!messageSent ? "fade-in" : "fade-out"}`}
        type="text"
        value={userInput}
        onChange={handleUserInput}
        placeholder="Enter your text..."
        onKeyDown={handleKeyDown}
      />
      <button
        className={`send-button ${
          messageSent ? "fade-out disabled" : "fade-in"
        }`}
        onClick={sendMessage}
        disabled={messageSent}
        style={{ width: "100px" }}
      >
        {messageSent ? "Sending..." : "Send"}
      </button>
    </div>
  );

  const renderStage4 = () => (
    <div className="stage-container">
      <LoadingPhraseDisplay />
    </div>
  );

  const renderStage5 = () => {
    const imagePhrase =
      "And here's a little picture you can hold on to to remind you of our conversation:";

    return (
      <div className="stage-container">
        <FormattedText text={response} />
        {imageURL && (
          <>
            <h2 className="fade-in">{imagePhrase}</h2>
            <img
              className="fade-in"
              src={imageURL}
              alt="A visual representation of your supportive dad's response"
            />
          </>
        )}
        <div>
          <button className="fade-in reset-button" onClick={handleReset}>
            There's something else...
          </button>
        </div>
      </div>
    );
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") {
      return;
    }
    setMessageSent(true);

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

      const assistantReply = response?.data.choices?.[0]?.message?.content;

      if (assistantReply) {
        setResponse(assistantReply);
        setUserInput("");
        const imageResponse = await openai.createImage({
          prompt: assistantReply,
          size: "256x256",
        });

        const imageUrl = imageResponse?.data.data?.[0]?.url;

        setImageURL(imageUrl);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="app-container">
      {stage === 1 && renderStage1()}
      {stage === 2 && renderStage2()}
      {stage === 3 && renderStage3()}
      {stage === 4 && renderStage4()}
      {stage === 5 && renderStage5()}
    </div>
  );
};

export default SupportiveDadChatbot;
