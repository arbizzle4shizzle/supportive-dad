import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SupportiveDadChatbot.css";
import { FormattedText } from "./components/FormattedText";
import { LoadingPhraseDisplay } from "./components/LoadingPhraseDisplay";
import FaderText from "./components/Fader";

const apiBaseUrl =
  process.env.REACT_APP_NODE_ENV === "production"
    ? "https://supportive.dad/api"
    : "http://localhost:3000/api";

const SupportiveDadChatbot: React.FC = () => {
  const [stage, setStage] = useState(1);
  const [dadsResponse, setDadsResponse] = useState("");
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
      } else if (stage === 4 && dadsResponse && imageURL) {
        setStage(5);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [stage, messageSent, dadsResponse, imageURL]);

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
        <FormattedText text={dadsResponse} />
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
    setUserInput("");

    const askDadOptions = {
      method: "GET",
      url: `${apiBaseUrl}/askDad`,
      params: { userInput },
    };

    await axios
      .request(askDadOptions)
      .then((response) => {
        setDadsResponse(response.data.dadsResponse);
        setImageURL(response.data.imageURL);
      })
      .catch((error) => {
        console.error(error);
      });
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
