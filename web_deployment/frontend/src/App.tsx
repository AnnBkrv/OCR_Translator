import React,  { useState } from "react";
import Upload from "./components/Upload";
import Result from "./components/Result";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("de");

  const handleDetect = async (): Promise<void> => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Detection failed");
      }

      const data: { detected_text: string } = await response.json();

      setDetectedText(data.detected_text);
      setTranslatedText(""); // reset old translation
    } catch (error) {
      console.error("Detection error:", error);
    }
  };

  const handleTranslate = async (): Promise<void> => {
    if (!detectedText) return;

    try {
      const response = await fetch("http://localhost:8000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: detectedText,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data: { translated_text: string } = await response.json();

      setTranslatedText(data.translated_text);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <div>
      <h1>OCR Translator</h1>

      <Upload
        setSelectedFile={setSelectedFile}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        handleDetect={handleDetect}
      />

      <Result
        detectedText={detectedText}
        translatedText={translatedText}
        sourceLang={sourceLang}
        targetLang={targetLang}
        setSourceLang={setSourceLang}
        setTargetLang={setTargetLang}
        handleTranslate={handleTranslate}
      />
    </div>
  );
};

export default App;
