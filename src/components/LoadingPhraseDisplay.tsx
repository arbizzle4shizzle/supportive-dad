import React, { useState, useEffect, useMemo } from "react";
import { PhraseManager } from "../utils/PhraseManager";
import { fatherlySayings } from "../utils/constants";
import FaderText from "./Fader";

export const LoadingPhraseDisplay: React.FC = () => {
  const phraseManager = useMemo(() => new PhraseManager(fatherlySayings), []);
  const [currentPhrase, setCurrentPhrase] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPhrase(phraseManager.getNextPhrase());
    }, 1000); // Wait for 1000 milliseconds to change the phrase

    return () => {
      clearTimeout(timeoutId);
    };
  }, [phraseManager]);

  return <FaderText text={currentPhrase} />;
};
