import { PreloadQuery } from "@/utils/graphql";
import { ActivityList, GET_EXPENSES } from "./ActivityList";
import { Suspense } from "react";

const RecentActivity = () => {
  return (
    <>
      <header>
        <h1 className="text-2xl font-medium text-white font-serif">Recent Activity</h1>
      </header>
      <PreloadQuery query={GET_EXPENSES}>
        <Suspense fallback={<div>Loading...</div>}>
          <ActivityList />
        </Suspense>
      </PreloadQuery>
    </>
  );
};

export default RecentActivity;
