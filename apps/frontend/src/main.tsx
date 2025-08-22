import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./routes/(app)/_layout.tsx";
import Index from "./routes/(app)/index.tsx";
import RecentActivity from "./routes/(app)/recent-activity.tsx";
import Groups from "./routes/(app)/groups.tsx";
import Friends from "./routes/(app)/friends.tsx";
import AuthLayout from "./routes/(auth)/_layout.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import SignIn from "./routes/(auth)/sign-in.tsx";
import SignUp from "./routes/(auth)/sign-up.tsx";
import SignOut from "./routes/(auth)/sign-out.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
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
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        path: "/auth/sign-up",
        Component: SignUp,
      },
      {
        path: "/auth/sign-in",
        Component: SignIn,
      },
      {
        path: "/auth/sign-out",
        Component: SignOut,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
