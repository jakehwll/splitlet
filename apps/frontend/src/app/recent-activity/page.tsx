"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@repo/graphql";

const GET_EXPENSES = gql(`
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

const RecentActivity = () => {
  const { loading, error, data } = useQuery(GET_EXPENSES, {});

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return <pre>{JSON.stringify(data?.expenses, null, 2)}</pre>;
};

export default RecentActivity;
