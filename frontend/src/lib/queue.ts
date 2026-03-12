import { Queue } from "bullmq";
import { getRedis } from "@/lib/redis";

const connection = getRedis();

export const lectureQueue = new Queue("lecture-processing", {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
    },
});

