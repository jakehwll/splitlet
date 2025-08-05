import { query } from "@/utils/graphql";
import { gql } from "@apollo/client";

export const GET_EXPENSES = gql(`
  query GetExpenses {
    expenses {
      id
      amount
      description
      participants {
        amount
        user {
          id
        }
      }
    }
  }
`);

export const ActivityList = async () => {
  const { data } = await query({ query: GET_EXPENSES });

  return <pre>{JSON.stringify(data?.expenses, null, 2)}</pre>;
};
