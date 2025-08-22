import { DateTimeResolver } from "graphql-scalars";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import { schema } from "@repo/graphql";
import { globalQueue } from "../utils/bullmq";
import type { Resolvers } from "@repo/graphql/__generated/resolvers-types";
import { Hono, type Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

export interface GlobalContext {
  userId: string;
}

const prisma = new PrismaClient();

const resolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    ledgerBalances: async (_parent, _args, context) => {
      const userId = context.userId;
      const owedToYou = await prisma.ledgerBalance.findMany({
        where: { creditorId: userId, balance: { gt: 0 } },
        include: {
          creditor: true,
          debtor: true,
        },
      });
      const youOwe = await prisma.ledgerBalance.findMany({
        where: { debtorId: userId, balance: { gt: 0 } },
        include: {
          creditor: true,
          debtor: true,
        },
      });
      return { owedToYou, youOwe };
    },
    expenses: async (_parent, _args, _context) => {
      const expenses = await prisma.expense.findMany({
        include: {
          expenseSplits: {
            include: {
              user: true,
            },
          },
          payer: true,
        },
      });
      return expenses;
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
            description: description ?? "",
            total,
            date,
            expenseSplits: {
              create: splits.map((split) => ({
                userId: split.userId,
                amount: split.amount,
              })),
            },
          },
          include: {
            expenseSplits: {
              include: {
                user: true,
              },
            },
            payer: true,
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

        const userIds = [userId, ...splits.map((split) => split.userId)];

        Promise.all(
          userIds.map(async (userId) => {
            return await globalQueue.add("recalculateNetDebtSummary", { userId });
          })
        );

        return expense;
      });
    },
  },
};

const server = new ApolloServer<GlobalContext>({
  typeDefs: schema,
  resolvers,
});
await server.start();

const graphql = new Hono();

graphql.on(["GET", "POST", "OPTIONS"], "/", async (c: Context) => {
  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }

  const httpGraphQLRequest = {
    httpGraphQLRequest: {
      method: c.req.method,
      headers: new HeaderMap(
        Object.entries(c.req.header()).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value])
      ),
      body: c.req.method === "POST" ? await c.req.json() : undefined,
      search: new URL(c.req.url).search,
    },
    context: async () => ({
      userId: "user1",
    }),
  };

  const result = await server.executeHTTPGraphQLRequest(httpGraphQLRequest);

  for (const [headerKey, headerValue] of result.headers) {
    c.header(headerKey, headerValue);
  }

  const statusCode = result.status ?? 200;
  c.status(statusCode as StatusCode);

  if (result.body.kind === "complete") {
    return c.body(result.body.string);
  }

  const asyncIteratorContent = [];
  for await (const chunk of result.body.asyncIterator) {
    asyncIteratorContent.push(chunk);
  }
  return c.body(asyncIteratorContent.join(""));
});

export default graphql;
