import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAndIncrementUsage } from "@/lib/usage";
import { generateEmbeddings, answerQuestionWithContext } from "@/lib/ai";
import { semanticSearch } from "@/lib/vector";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
    const rl = await rateLimit(`chat:${ip}`, 60, 60);
    if (!rl.allowed) {
        return new NextResponse("Too many chat requests, please slow down.", { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const question = String(body.question ?? "");
    const lectureId = body.lectureId ? String(body.lectureId) : undefined;

    if (!question.trim()) {
        return new NextResponse("Question is required", { status: 400 });
    }

    const usage = await checkAndIncrementUsage({
        userId: session.user.id,
        increment: { aiMessages: 1 },
    });

    if (!usage.allowed) {
        return NextResponse.json(
            {
                error: "limit_reached",
                reason: usage.reason,
                remainingAiMessages: usage.remainingAiMessages,
                remainingUploads: usage.remainingUploads,
                isPro: usage.isPro,
            },
            { status: 402 },
        );
    }

    const [embedding] = await generateEmbeddings([question]);
    if (!embedding) {
        return new NextResponse("Embedding failed", { status: 500 });
    }

    const matches = await semanticSearch({
        embedding,
        matchLimit: 8,
        filters: {
            userId: session.user.id,
            ...(lectureId ? { lectureId } : {}),
        },
    });

    const contextChunks = matches?.map((m) => m.content) ?? [];
    if (!contextChunks.length && lectureId) {
        const lecture = await prisma.lecture.findUnique({
            where: { id: lectureId },
        });
        if (lecture?.transcript) {
            contextChunks.push(lecture.transcript.slice(0, 4000));
        }
    }

    const answer = await answerQuestionWithContext({
        question,
        contextChunks,
    });

    await prisma.chatMessage.createMany({
        data: [
            {
                role: "user",
                content: question,
                userId: session.user.id,
                lectureId: lectureId ?? (matches?.[0]?.lecture_id ?? null),
            },
            {
                role: "assistant",
                content: answer,
                userId: session.user.id,
                lectureId: lectureId ?? (matches?.[0]?.lecture_id ?? null),
            },
        ].filter((m) => m.lectureId !== null) as any,
    });

    return NextResponse.json({ answer });
}

