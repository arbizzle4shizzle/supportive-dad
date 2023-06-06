import React, { useState, useEffect, useMemo } from "react";
import { PhraseManager } from "../utils/PhraseManager";
import { fatherlySayings } from "../utils/constants";
import FaderText from "./Fader";

export const LoadingPhraseDisplay: React.FC = () => {
  const phraseManager = useMemo(() => new PhraseManager(fatherlySayings), []);
  const [currentPhrase, setCurrentPhrase] = useState(
    phraseManager.getNextPhrase()
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPhrase(phraseManager.getNextPhrase());
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [phraseManager, currentPhrase]);

  return <FaderText text={currentPhrase} />;
};
