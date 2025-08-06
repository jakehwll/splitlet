import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import Index from "./routes/index.tsx";
import RecentActivity from "./routes/recent-activity.tsx";
import Groups from "./routes/groups.tsx";
import Friends from "./routes/friends.tsx";
import Layout from "./routes/layout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Index },
      {
        path: "/recent-activity",
        Component: RecentActivity,
      },
      {
        path: "/groups/:groupId",
        Component: Groups,
      },
      {
        path: "/friends/:friendId",
        Component: Friends,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
