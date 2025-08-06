import IORedis from "ioredis";
import { Worker } from "bullmq";

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "foo",
  async (job) => {
    console.log(job.data);
  },
  { connection }
);

worker.on("ready", () => {
  console.log("Worker is ready");
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job has failed with ${err.message}`);
});
