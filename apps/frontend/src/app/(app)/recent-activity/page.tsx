import { query } from "@/utils/graphql";
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
  return (
    <>
      <header>
        <h1 className="text-2xl font-medium text-white font-serif">Recent Activity</h1>
      </header>
      <Activity />
    </>
  );
};

const Activity = async () => {
  const { data } = await query({ query: GET_EXPENSES });

  return <pre>{JSON.stringify(data?.expenses, null, 2)}</pre>;
};

export default RecentActivity;
