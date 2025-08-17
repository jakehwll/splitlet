import { gql } from "@repo/graphql";
import { useQuery } from "@apollo/client";

const LIST_RECENT_ACTIVITY_QUERY = gql(`
  query ListRecentActivity {
    expenses {
      id
      description
      date
    }
  }
`);

const RecentActivity = () => {
  const { data: recentActivity } = useQuery(LIST_RECENT_ACTIVITY_QUERY);

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-white font-serif">Recent Activity</h1>
          <p>Here is a list of recent activities...</p>
        </div>
      </header>
      <section>
        <pre>{JSON.stringify(recentActivity?.expenses, null, 2)}</pre>
      </section>
    </>
  );
};

export default RecentActivity;
