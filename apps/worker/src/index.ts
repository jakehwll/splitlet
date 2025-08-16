import IORedis from "ioredis";
import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";

const connection = new IORedis({ maxRetriesPerRequest: null });
const prisma = new PrismaClient();

const worker = new Worker(
  "foo",
  async (job) => {
    const userId = job.data.userId;

    const [youOweResult, owedToYouResult] = await Promise.all([
      prisma.ledgerBalance.aggregate({
        where: { debtorId: userId, balance: { gt: 0 } },
        _sum: { balance: true },
      }),
      prisma.ledgerBalance.aggregate({
        where: { creditorId: userId, balance: { gt: 0 } },
        _sum: { balance: true },
      }),
    ]);

    const totalYouOwe = youOweResult._sum.balance || 0;
    const totalOwedToYou = owedToYouResult._sum.balance || 0;

    await prisma.netDebtSummary.upsert({
      where: { userId },
      update: { totalYouOwe, totalOwedToYou },
      create: {
        userId,
        totalYouOwe,
        totalOwedToYou,
      },
    });

    return { totalYouOwe, totalOwedToYou };
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
