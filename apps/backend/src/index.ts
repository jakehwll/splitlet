import { DateTimeResolver } from "graphql-scalars";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { schema } from "@repo/graphql";

const prisma = new PrismaClient();

const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    me: async (_parent, _args, context) => {
      const userId = context.userId;
      const summary = await prisma.netDebtSummary.findUnique({
        where: { userId },
      });
      return summary;
    },

    // Get LedgerBalances for current user
    ledgerBalances: async (_parent, _args, context) => {
      const userId = context.userId;
      const owedToYou = await prisma.ledgerBalance.findMany({
        where: { creditorId: userId, balance: { gt: 0 } },
      });
      const youOwe = await prisma.ledgerBalance.findMany({
        where: { debtorId: userId, balance: { gt: 0 } },
      });
      return { owedToYou, youOwe };
    },
  },

  Mutation: {
    addExpense: async (_parent, args, context) => {
      const userId = context.userId;
      const { description, total, splits, date } = args.input;

      return await prisma.$transaction(async (tx) => {
        const expense = await tx.expense.create({
          data: {
            payerId: userId,
            description,
            total,
            date,
            expenseSplits: {
              create: splits.map((split) => ({
                userId: split.userId,
                amount: split.amount,
              })),
            },
          },
        });

        for (const split of splits) {
          if (split.userId === userId) continue;

          await tx.ledgerBalance.upsert({
            where: {
              debtorId_creditorId: {
                debtorId: split.userId,
                creditorId: userId,
              },
            },
            update: {
              balance: { increment: split.amount },
            },
            create: {
              debtorId: split.userId,
              creditorId: userId,
              balance: split.amount,
            },
          });
        }

        return expense;
      });
    },

    recalculateNetDebtSummary: async (_parent, _args, context) => {
      const userId = context.userId;

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
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return { userId: "some-user-id" };
  },
});

console.log(`🚀 Server ready at: ${url}`);
