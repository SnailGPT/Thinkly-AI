import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

export type GeneratedFlashcard = {
    front: string;
    back: string;
};

export type GeneratedQuizQuestion = {
    question: string;
    options: string[];
    correctOption: number;
    explanation?: string;
};

export type LecturePipelineResult = {
    summary: string;
    notes: string;
    flashcards: GeneratedFlashcard[];
    quizzes: GeneratedQuizQuestion[];
};

export async function summarizeLecture(text: string): Promise<string> {
    if (!text) return "";
    try {
        const result = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: text,
            parameters: { max_length: 500, min_length: 150 }
        });
        if (Array.isArray(result)) {
            return result[0]?.summary_text ?? "";
        }
        // @ts-expect-error huggingface types are loose
        return result.summary_text ?? "";
    } catch (e) {
        console.error("AI Summarize Error:", e);
        return "";
    }
}

export async function generateStructuredNotes(text: string): Promise<string> {
    if (!text) return "";
    try {
        const prompt = [
            "You are an expert study assistant.",
            "Convert the following lecture transcript into structured markdown notes.",
            "Use clear headings, bullet points, and call-outs for key formulas or definitions.",
            "Return markdown only.",
            "",
            text,
        ].join("\n");

        const result = await hf.textGeneration({
            model: "google/flan-t5-large",
            inputs: prompt,
            parameters: { max_new_tokens: 800, temperature: 0.4 }
        });

        // @ts-expect-error huggingface types are loose
        return (Array.isArray(result) ? result[0]?.generated_text : result.generated_text) ?? "";
    } catch (e) {
        console.error("AI Notes Error:", e);
        return "";
    }
}

export async function generateFlashcards(text: string): Promise<GeneratedFlashcard[]> {
    if (!text) return [];
    try {
        const prompt = [
            "Generate 12 high–quality flashcards from the lecture content below.",
            "Return STRICTLY a JSON array of objects with shape:",
            '{ "front": "question or term", "back": "answer or explanation" }',
            "Do not include any markdown, commentary, or code fences.",
            "",
            "Lecture content:",
            text,
        ].join("\n");

        const result = await hf.textGeneration({
            model: "google/flan-t5-large",
            inputs: prompt,
            parameters: { max_new_tokens: 700, temperature: 0.5 }
        });

        const raw = Array.isArray(result) ? result[0]?.generated_text : (result as any).generated_text;
        if (!raw) return [];

        const jsonStart = raw.indexOf("[");
        const jsonEnd = raw.lastIndexOf("]");
        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return [];

        const sliced = raw.slice(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(sliced) as GeneratedFlashcard[];
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((c) => c && typeof c.front === "string" && typeof c.back === "string")
            .map((c) => ({ front: c.front.trim(), back: c.back.trim() }));
    } catch (e) {
        console.error("AI Flashcards Error:", e);
        return [];
    }
}

export async function generateQuiz(text: string): Promise<GeneratedQuizQuestion[]> {
    if (!text) return [];
    try {
        const prompt = [
            "Generate 10 challenging multiple-choice questions from the lecture below.",
            "Return STRICTLY a JSON array of objects with shape:",
            '{ "question": "...", "options": ["A", "B", "C", "D"], "correctOption": 0, "explanation": "why this is correct" }',
            "Do not include any markdown, commentary, or code fences.",
            "",
            "Lecture content:",
            text,
        ].join("\n");

        const result = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            inputs: prompt,
            parameters: { max_new_tokens: 1200, temperature: 0.4 }
        });

        const raw = Array.isArray(result) ? result[0]?.generated_text : (result as any).generated_text;
        if (!raw) return [];

        const jsonStart = raw.indexOf("[");
        const jsonEnd = raw.lastIndexOf("]");
        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return [];

        const sliced = raw.slice(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(sliced) as GeneratedQuizQuestion[];
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((q) => q && typeof q.question === "string" && Array.isArray(q.options))
            .map((q) => ({
                question: q.question.trim(),
                options: q.options.map((o) => String(o).trim()).slice(0, 4),
                correctOption: typeof q.correctOption === "number" ? q.correctOption : 0,
                explanation: q.explanation?.trim(),
            }));
    } catch (e) {
        console.error("AI Quiz Error:", e);
        return [];
    }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!texts.length) return [];
    try {
        const result = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: texts,
        });

        if (Array.isArray(result) && Array.isArray(result[0])) {
            return result as number[][];
        }
        if (Array.isArray(result)) {
            return [result as number[]];
        }
        return [];
    } catch (e) {
        console.error("AI Embedding Error:", e);
        return [];
    }
}

export async function speechToText(audio: Blob | ArrayBuffer): Promise<string> {
    try {
        const buffer = audio instanceof Blob ? Buffer.from(await audio.arrayBuffer()) : Buffer.from(audio);

        const result = await hf.automaticSpeechRecognition({
            model: "openai/whisper-large-v3",
            data: buffer,
        });

        // @ts-expect-error response shape is from HF
        return result.text ?? "";
    } catch (e) {
        console.error("AI STT Error:", e);
        return "";
    }
}

export async function answerQuestionWithContext(params: {
    question: string;
    contextChunks: string[];
}): Promise<string> {
    const { question, contextChunks } = params;
    if (!question.trim()) return "";

    const context = contextChunks.join("\n\n---\n\n");

    try {
        const prompt = [
            "You are an AI tutor helping a student study their lecture materials.",
            "Use ONLY the context below to answer the question.",
            "If the answer is not present in the context, say you are not sure and suggest where in the lecture they might look.",
            "",
            "CONTEXT:",
            context,
            "",
            "QUESTION:",
            question,
            "",
            "ANSWER:",
        ].join("\n");

        const result = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            inputs: prompt,
            parameters: { max_new_tokens: 600, temperature: 0.3 }
        });

        const raw = Array.isArray(result) ? result[0]?.generated_text : (result as any).generated_text;
        return raw?.trim() ?? "";
    } catch (e) {
        console.error("AI QA Error:", e);
        return "";
    }
}

export async function processLecturePipeline(content: string): Promise<LecturePipelineResult> {
    const summaryPromise = summarizeLecture(content);
    const notesPromise = generateStructuredNotes(content);
    const flashcardsPromise = generateFlashcards(content);
    const quizzesPromise = generateQuiz(content);

    const [summary, notes, flashcards, quizzes] = await Promise.all([
        summaryPromise,
        notesPromise,
        flashcardsPromise,
        quizzesPromise,
    ]);

    return { summary, notes, flashcards, quizzes };
}

