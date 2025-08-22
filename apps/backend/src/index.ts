import { Hono } from "hono";
import graphql from "./routes/graphql";
import { cors } from "hono/cors";
import { auth } from "./utils/auth";
import type { AuthEnvironmentContext } from "./types/auth";
import { authMiddleware } from "./utils/middleware";

const app = new Hono<AuthEnvironmentContext>();

// Middleware
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.use("*", authMiddleware);

// Auth
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Routes
app.route("/graphql", graphql);

export default {
  fetch: app.fetch,
  port: 4000,
};
