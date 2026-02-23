from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from text_detect_translate import detect_text, translate_text, load_model
from PIL import Image
import io
from pydantic import BaseModel

app = FastAPI()

# VERY IMPORTANT for React to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

@app.get("/")
def home():
    return {"message": "OCR API is running"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    detected_text = detect_text(contents)
    return {"detected_text": detected_text}


@app.post("/translate")
async def translate(req: TranslationRequest):
    tokenizer, model = load_model(req.source_lang, req.target_lang)

    inputs = tokenizer(req.text, return_tensors="pt", padding=True)
    translated = model.generate(**inputs)
    result = tokenizer.decode(translated[0], skip_special_tokens=True)

    return {"translated_text": result}

