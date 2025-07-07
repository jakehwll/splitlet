import { DateTimeResolver } from "graphql-scalars";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "./schema";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    expenses: () =>
      prisma.expense.findMany({
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      }),
    balances: () => [],
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
