import { DateTimeResolver } from 'graphql-scalars';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "./schema";
import type { Balance, Expense } from "./_generated/types";

const expenses: Expense[] = [
  {
    id: "1",
    payeeId: "1",
    amount: 100,
    date: new Date().toISOString(),
    description: "test",
  },
  {
    id: "2",
    payeeId: "1",
    amount: 100,
    date: new Date().toISOString(),
    description: "test",
  },
];

const balances: Balance[] = [
  {
    payeeId: "1",
    recipientId: "2",
    amount: 100,
  }
]

const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    expenses: () => expenses,
    balances: () => balances,
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);