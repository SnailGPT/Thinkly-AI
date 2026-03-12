import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const lecture = await prisma.lecture.findFirst({
        where: { userId: session.user.id, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        include: {
            notes: true,
            flashcards: true,
            quizzes: true,
        },
    });

    if (!lecture) {
        return NextResponse.json({ lecture: null });
    }

    return NextResponse.json({
        lecture: {
            id: lecture.id,
            title: lecture.title,
            createdAt: lecture.createdAt,
            notes: lecture.notes[0] ?? null,
            flashcards: lecture.flashcards,
            quizzes: lecture.quizzes,
        },
    });
}

