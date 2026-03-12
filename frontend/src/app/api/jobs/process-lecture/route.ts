import { NextRequest, NextResponse } from "next/server";
import { processLectureJob } from "@/lib/lectureProcessor";

export const runtime = "nodejs";

// This endpoint is intended for serverless-friendly job execution.
// You can call it from a scheduler (QStash / cron) or internally as a fallback.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lectureId = String(body.lectureId ?? "");
    const transcript = String(body.transcript ?? "");

    if (!lectureId || !transcript) {
      return new NextResponse("Missing lectureId/transcript", { status: 400 });
    }

    await processLectureJob({ lectureId, transcript });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PROCESS_LECTURE_JOB_ERROR", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

