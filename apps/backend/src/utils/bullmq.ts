import { Queue } from "bullmq";
import { BULLMQ_QUEUE_NAME } from "@repo/common";

export const globalQueue = new Queue(BULLMQ_QUEUE_NAME);
