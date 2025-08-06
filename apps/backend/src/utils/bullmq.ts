import { Queue } from "bullmq";

export const globalQueue = new Queue("foo");
