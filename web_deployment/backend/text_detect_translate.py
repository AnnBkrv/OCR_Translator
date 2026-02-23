import cv2
from IPython.display import display, Image
import os
import numpy as np
import pytesseract
from PIL import Image as PILImage
from transformers import MarianMTModel, MarianTokenizer

translation_models = {}

def load_model(source, target):
    key = f"{source}-{target}"
    if key not in translation_models:
        model_name = f"Helsinki-NLP/opus-mt-{source}-{target}"
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        translation_models[key] = (tokenizer, model)
    return translation_models[key]

def detect_text(file_bytes):
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = PILImage.fromarray(img)

    text = pytesseract.image_to_string(img)
    
    return text

def translate_text(text, from_lang, to_lang):
    model_name = f"Helsinki-NLP/opus-mt-{from_lang}-{to_lang}"
    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name)
    inputs = tokenizer(text, return_tensors="pt", padding=True)
    translated = model.generate(**inputs)
    return tokenizer.decode(translated[0], skip_special_tokens=True)

# should return detected text
# should accept language to translate to and if translate is needed,
# return the appropriate translation