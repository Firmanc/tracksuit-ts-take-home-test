import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

export type Input = HasDBClient & {
  insightId: number;
};

export default ({ db, insightId }: Input) => {
  try {
    console.log("Deleting insight: ", insightId);

    db.sql<insightsTable.Row>`
        DELETE FROM insights WHERE id = ${insightId};
    `;
  } catch (error) {
    console.error("Error deleting insight: ", error);
    throw new Error("Failed to delete insight");
  }
};
