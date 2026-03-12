import prisma from "@/lib/prisma";

const FREE_DAILY_AI_MESSAGES = 10;
const FREE_DAILY_UPLOADS = 3;

export type UsageCheckResult = {
    allowed: boolean;
    reason?: "limit_ai" | "limit_uploads";
    remainingAiMessages: number;
    remainingUploads: number;
    isPro: boolean;
};

export async function checkAndIncrementUsage(opts: {
    userId: string;
    increment: { aiMessages?: number; uploads?: number };
}): Promise<UsageCheckResult> {
    const { userId, increment } = opts;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { usage: true, subscription: true },
    });
    if (!user) {
        throw new Error("User not found");
    }

    const isPro = user.subscription?.status === "active";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let usage = user.usage;
    if (!usage) {
        usage = await prisma.usage.create({
            data: {
                userId: user.id,
                aiMessagesToday: 0,
                uploadsToday: 0,
                lastReset: today,
            },
        });
    }

    if (usage.lastReset < today) {
        usage = await prisma.usage.update({
            where: { userId: user.id },
            data: {
                aiMessagesToday: 0,
                uploadsToday: 0,
                lastReset: today,
            },
        });
    }

    const aiInc = increment.aiMessages ?? 0;
    const uploadInc = increment.uploads ?? 0;

    if (!isPro) {
        if (aiInc > 0 && usage.aiMessagesToday + aiInc > FREE_DAILY_AI_MESSAGES) {
            return {
                allowed: false,
                reason: "limit_ai",
                remainingAiMessages: Math.max(FREE_DAILY_AI_MESSAGES - usage.aiMessagesToday, 0),
                remainingUploads: Math.max(FREE_DAILY_UPLOADS - usage.uploadsToday, 0),
                isPro,
            };
        }
        if (uploadInc > 0 && usage.uploadsToday + uploadInc > FREE_DAILY_UPLOADS) {
            return {
                allowed: false,
                reason: "limit_uploads",
                remainingAiMessages: Math.max(FREE_DAILY_AI_MESSAGES - usage.aiMessagesToday, 0),
                remainingUploads: Math.max(FREE_DAILY_UPLOADS - usage.uploadsToday, 0),
                isPro,
            };
        }
    }

    if (aiInc || uploadInc) {
        usage = await prisma.usage.update({
            where: { userId: user.id },
            data: {
                aiMessagesToday: {
                    increment: aiInc,
                },
                uploadsToday: {
                    increment: uploadInc,
                },
            },
        });
    }

    return {
        allowed: true,
        remainingAiMessages: isPro ? Number.POSITIVE_INFINITY : Math.max(FREE_DAILY_AI_MESSAGES - usage.aiMessagesToday, 0),
        remainingUploads: isPro ? Number.POSITIVE_INFINITY : Math.max(FREE_DAILY_UPLOADS - usage.uploadsToday, 0),
        isPro,
    };
}

