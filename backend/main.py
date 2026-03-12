from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import ffmpeg
import os
import torch
from transformers import pipeline
from reportlab.pdfgen import canvas
import stripe

app = FastAPI(title="Lectify AI API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Models (Singleton pattern for efficiency)
class AIModels:
    def __init__(self):
        self.transcriber = None
        self.generator = None
        self.summarizer = None
        
    def load_transcriber(self):
        if not self.transcriber:
            # Using whisper-large-v3 as requested
            self.transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-large-v3")
        return self.transcriber
    
    def load_generator(self):
        if not self.generator:
            # Using Llama-3-8B-Instruct as requested
            # Note: This requires HF token and local resources. Using a placeholder for now
            # or it might crash if run on standard machine.
            self.generator = pipeline("text-generation", model="meta-llama/Meta-Llama-3-8B-Instruct")
        return self.generator
        
    def load_summarizer(self):
        if not self.summarizer:
            self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        return self.summarizer

models = AIModels()

class YTLink(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Lectify AI API - The Café for Studying"}

@app.post("/api/v1/process-youtube")
async def process_youtube(data: YTLink):
    try:
        ydl_opts = {'format': 'bestaudio/best', 'outtmpl': 'downloads/%(id)s.%(ext)s'}
        if not os.path.exists('downloads'):
            os.makedirs('downloads')
            
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(data.url, download=True)
            video_id = info['id']
            audio_path = f"downloads/{video_id}.webm" # or .m4a
            
        # Extract audio using ffmpeg if needed (transcriber might handle webm)
        # For whisper, we ideally want wav/mp3
        output_audio = f"downloads/{video_id}.mp3"
        (
            ffmpeg
            .input(audio_path)
            .output(output_audio)
            .run(overwrite_output=True)
        )
        
        # Transcribe
        transcriber = models.load_transcriber()
        result = transcriber(output_audio)
        transcript = result["text"]
        
        return {"transcript": transcript, "video_id": video_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/generate-notes")
async def generate_notes(transcript: str):
    try:
        prompt = f"""
        Convert this lecture transcript into structured study notes.
        Use headings and bullet points. Include key terms and a brief summary.
        
        Transcript:
        {transcript}
        """
        generator = models.load_generator()
        notes = generator(prompt, max_new_tokens=600)
        return {"notes": notes[0]["generated_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/export-pdf")
async def export_pdf(content: str, filename: str = "notes.pdf"):
    try:
        path = f"exports/{filename}"
        if not os.path.exists('exports'):
            os.makedirs('exports')
            
        c = canvas.Canvas(path)
        # Simplified PDF generation for now
        c.drawString(100, 750, "Lectify AI - Study Notes")
        c.drawString(100, 730, "-" * 50)
        
        # Split content into lines
        lines = content.split('\n')
        y = 700
        for line in lines:
            c.drawString(100, y, line[:80])
            y -= 15
            if y < 50:
                c.showPage()
                y = 800
        c.save()
        return {"message": "PDF exported", "path": path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
