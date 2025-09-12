// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import insertInsight from "./operations/insert-insight.ts";
import { createTable } from "./tables/insights.ts";
import { InsertInsight } from "$models/insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

db.exec(createTable);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  try {
    const body = await ctx.request.body.json();
    const newInsight = InsertInsight.parse(body);

    const result = insertInsight({ db, newInsight });

    ctx.response.status = 201;
    ctx.response.body = JSON.stringify(result);
  } catch (error) {
    console.error("Error creating insight: ", error);
    ctx.response.status = 400; // This ideally should be coming from the error payload.
    ctx.response.body = { message: "Failed to create insight" };
  } finally {
    ctx.response.type = "application/json";
  }
});

router.delete("/insights/:id", (ctx) => {
  try {
    const params = ctx.params as Record<string, any>;
    deleteInsight({ db, insightId: Number(params.id) });
    ctx.response.status = 200;
    ctx.response.body = { message: "Insight deleted" };
  } catch (error) {
    console.error("Error deleting insight: ", error);
    ctx.response.status = 400; // This ideally should be coming from the error payload.
    ctx.response.body = { message: "Failed to delete insight" };
  } finally {
    ctx.response.type = "application/json";
  }
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
