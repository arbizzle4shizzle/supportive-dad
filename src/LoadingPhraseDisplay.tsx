import React, { useState, useEffect, useMemo } from "react";
import { PhraseManager } from "./PhraseManager";

export const LoadingPhraseDisplay: React.FC = () => {
  const fatherlySayings: string[] = useMemo(
    () => [
      "Crafting fatherly advice just for you.",
      "Formulating wisdom from a dad's heart.",
      "Pondering life lessons, fatherly style.",
      "Forging words of guidance from dad.",
      "Nurturing dreams with dad's insight.",
      "Weaving paternal advice, always present.",
      "Cultivating wisdom for your journey.",
      "Deliberating on dad's pearls of wisdom.",
      "Crafting counsel, straight from dad.",
      "Molding your path with father's wisdom.",
      "Shaping your future, dad's guidance.",
      "Constructing fatherly advice, step by step.",
      "Assembling the puzzle of dad's counsel.",
      "Weighing options, sharing dad's secret sauce.",
      "Sculpting your success, with paternal guidance.",
    ],
    []
  );

  const phraseManager = useMemo(
    () => new PhraseManager(fatherlySayings),
    [fatherlySayings]
  );

  const [currentPhrase, setCurrentPhrase] = useState("");
  const [fadeState, setFadeState] = useState<"fade-in" | "fade-out">("fade-in");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeState("fade-out");
    }, 4500); // Change the phrase every 2 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (fadeState === "fade-out") {
      const timeoutId = setTimeout(() => {
        setCurrentPhrase(phraseManager.getNextPhrase());
        setFadeState("fade-in");
      }, 1000); // Wait for 1000 milliseconds before fading in the new phrase

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [fadeState, phraseManager]);

  return (
    <div className={`${fadeState}`}>
      <h1>{currentPhrase}</h1>
    </div>
  );
};
