import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkAndIncrementUsage } from "@/lib/usage";
import pdfParse from "pdf-parse";
import { rateLimit } from "@/lib/rateLimit";
import { processLectureJob } from "@/lib/lectureProcessor";

export const runtime = "nodejs";

async function extractTextFromFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const data = await pdfParse(buffer);
        return data.text || "";
    }

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        return buffer.toString("utf-8");
    }

    return "";
}

export async function POST(req: NextRequest) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
    const rl = await rateLimit(`upload:${ip}`, 20, 60);
    if (!rl.allowed) {
        return new NextResponse("Too many uploads, please slow down.", { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null) || (file?.name ?? "Untitled lecture");
    const rawText = (formData.get("text") as string | null) || "";

    if (!file && !rawText) {
        return new NextResponse("No content provided", { status: 400 });
    }

    const usage = await checkAndIncrementUsage({
        userId: session.user.id,
        increment: { uploads: 1 },
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

    let transcript = rawText;
    if (!transcript && file) {
        transcript = await extractTextFromFile(file);
    }

    const lecture = await prisma.lecture.create({
        data: {
            title,
            transcript: null,
            status: "PENDING",
            userId: session.user.id,
        },
    });

    // Vercel-compatible: process in-request (serverless) by default.
    // Optional: swap this to QStash for async background jobs in production.
    await processLectureJob({ lectureId: lecture.id, transcript });

    return NextResponse.json({ lectureId: lecture.id, status: "completed" });
}

