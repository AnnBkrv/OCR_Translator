# OCR Translator

A simple web application that lets users upload images, detect text using OCR, and translate it into another language.  

## Features
- Upload an image and preview it.
- Detect text in the image using Tesseract OCR.
- Translate detected text to a selected language using MarianMT models.
- Supports English, French, German, and Russian.

## Frontend
- Built with React and TypeScript.
- Components for file upload and displaying results.
- Frontend runs at http://localhost:5173.

## Backend
- FastAPI server handles OCR detection and translation.
- MarianMT models for translation.
- Backend runs at http://localhost:8000.

## How to Run
1. **Backend:**  
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev

## Usage
- Start backend.
- Open frontend in your browser.
- Upload an image.
- Click Detect Text.
- Choose languages and click Translate.
