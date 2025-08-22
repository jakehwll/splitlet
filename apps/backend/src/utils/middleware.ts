import type { MiddlewareHandler } from "hono";
import { auth } from "./auth";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  if (c.req.method === "OPTIONS") return next();

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (c.req.path.startsWith("/api/auth")) {
    return next();
  }

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};
