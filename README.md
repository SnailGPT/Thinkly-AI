# Lectify AI ☕

**Your AI Café for Studying.**
Transform lectures, YouTube videos, and PDFs into structured study materials instantly.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Design System**: Custom "Café Aesthetic" Design System (Glassmorphism, Neutral Tones)

### Backend
- **Framework**: FastAPI (Python)
- **AI Models**: 
  - `openai/whisper-large-v3` for Transcription
  - `meta-llama/Meta-Llama-3-8B-Instruct` for Note Generation
  - `facebook/bart-large-cnn` for Summarization
- **Database**: FAISS Vector DB
- **Utils**: yt-dlp, ffmpeg, reportlab

## Project Structure

```
lectify-ai/
├── frontend/        # Next.js 14 App
│   ├── src/app/     # Pages (Dashboard, Upload, Notes, Flashcards, Quizzes, etc.)
│   ├── src/components/ # UI Components
│   └── public/      # Assets (Café Background)
└── backend/         # FastAPI AI Pipeline
    ├── app/         # Source Code
    ├── downloads/   # Temporary Audio Files
    └── requirements.txt
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Hugging Face Token (for Llama models)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Set up `.env` with your API keys
4. `uvicorn app.main:app --reload`
