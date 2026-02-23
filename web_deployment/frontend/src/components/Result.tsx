import React from "react";

interface ResultProps {
  detectedText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  setSourceLang: React.Dispatch<React.SetStateAction<string>>;
  setTargetLang: React.Dispatch<React.SetStateAction<string>>;
  handleTranslate: () => void;
}

function Result({
  detectedText,
  translatedText,
  sourceLang,
  targetLang,
  setSourceLang,
  setTargetLang,
  handleTranslate,
}: ResultProps) {

  if (!detectedText) return null;

  return (
    <div>
      <h2>Detected Text</h2>
      <p>{detectedText}</p>

      <h3>Translate</h3>

      <label>
        Source Language:
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="de">German</option>
          <option value="fr">French</option>
          <option value="ru">Russian</option>
        </select>
      </label>

      <label style={{ marginLeft: "10px" }}>
        Target Language:
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="de">German</option>
          <option value="fr">French</option>
          <option value="ru">Russian</option>
        </select>
      </label>

      <br />
      <br />

      <button onClick={handleTranslate}>Translate</button>

      {translatedText && (
        <>
          <h2>Translated Text</h2>
          <p>{translatedText}</p>
        </>
      )}
    </div>
  );
}

export default Result;
