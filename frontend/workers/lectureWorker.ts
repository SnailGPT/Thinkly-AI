import "dotenv/config";
import { Worker, Job } from "bullmq";
import { getRedis } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { processLecturePipeline, generateEmbeddings } from "@/lib/ai";
import { upsertEmbeddings } from "@/lib/vector";

type LectureJobData = {
    lectureId: string;
    transcript: string;
};

const connection = getRedis();

async function handleJob(job: Job<LectureJobData>) {
    const { lectureId, transcript } = job.data;

    const lecture = await prisma.lecture.update({
        where: { id: lectureId },
        data: { status: "PROCESSING", transcript },
    });

    const { summary, notes, flashcards, quizzes } = await processLecturePipeline(transcript);

    await prisma.$transaction(async (tx) => {
        await tx.lecture.update({
            where: { id: lecture.id },
            data: {
                summary,
                status: "COMPLETED",
            },
        });

        if (notes) {
            await tx.notes.create({
                data: {
                    content: notes,
                    lectureId: lecture.id,
                },
            });
        }

        if (flashcards.length) {
            await tx.flashcard.createMany({
                data: flashcards.map((c) => ({
                    front: c.front,
                    back: c.back,
                    lectureId: lecture.id,
                })),
            });
        }

        if (quizzes.length) {
            await tx.quiz.createMany({
                data: quizzes.map((q) => ({
                    question: q.question,
                    options: q.options,
                    correctOption: q.correctOption,
                    explanation: q.explanation ?? null,
                    lectureId: lecture.id,
                })),
            });
        }
    });

    const CHUNK_SIZE = 800;
    const chunks: string[] = [];
    for (let i = 0; i < transcript.length; i += CHUNK_SIZE) {
        chunks.push(transcript.slice(i, i + CHUNK_SIZE));
    }

    const vectors = await generateEmbeddings(chunks);
    if (vectors.length) {
        const records = vectors.map((values, idx) => ({
            id: `${lecture.id}-${idx}`,
            values,
            metadata: {
                lectureId: lecture.id,
                userId: lecture.userId,
                index: idx,
            },
        }));

        await upsertEmbeddings(records);
    }
}

new Worker<LectureJobData>("lecture-processing", handleJob, {
    connection,
});

