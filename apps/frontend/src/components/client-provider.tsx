import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/api/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
