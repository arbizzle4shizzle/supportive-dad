import React from "react";

interface FormattedTextProps {
  text: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  const paragraphs = text.split("\n\n");

  return (
    <div className="fade-in formatted-text-container">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          {paragraph}
          <br />
        </p>
      ))}
    </div>
  );
};
