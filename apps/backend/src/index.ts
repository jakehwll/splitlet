import { Hono } from "hono";
import graphql from "./routes/graphql";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());

app.route("/graphql", graphql);

export default {
  fetch: app.fetch,
  port: 4000,
};
