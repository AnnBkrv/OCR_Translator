import React,  { useState } from "react";
import Upload from "./components/Upload";
import Result from "./components/Result";
import { useRef } from "react";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("de");
  const [isDetecting, setIsDetecting] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const controllerRef = useRef<AbortController | null>(null)


  const handleDetect = async (): Promise<void> => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsDetecting(true)
    setStatusMessage("Processing image...")

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
    finally {
      setIsDetecting(false)
      setStatusMessage("")
    }
  };

  const handleTranslate = async (): Promise<void> => {
    if (!detectedText) return;
    setIsTranslating(true)
    setStatusMessage("Translating...")

    const controller = new AbortController()
    controllerRef.current = controller

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
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data: { translated_text: string } = await response.json();

      setTranslatedText(data.translated_text);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatusMessage("Translation cancelled.")
      } else {
        console.error("Translation error:", error)
      }
    } finally {
      setIsTranslating(false)
      setStatusMessage("")
      }
  }

  const handleStop = () => {
    if (controllerRef.current) {
      controllerRef.current.abort()
    }
  }



  return (
    <div>
      <h1>OCR Translator</h1>

      <Upload
        setSelectedFile={setSelectedFile}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        handleDetect={handleDetect}
        isDetecting={isDetecting}
      />

      <Result
        detectedText={detectedText}
        translatedText={translatedText}
        sourceLang={sourceLang}
        targetLang={targetLang}
        setSourceLang={setSourceLang}
        setTargetLang={setTargetLang}
        handleTranslate={handleTranslate}
        isTranslating={isTranslating}
      />

      {statusMessage && <p>{statusMessage}</p>}
      
      {/* ✅ Stop Button (only while translating) */}
      {isTranslating && (
        <button onClick={handleStop}>
          Stop
        </button>
      )}

    </div>
  );
};

export default App;
