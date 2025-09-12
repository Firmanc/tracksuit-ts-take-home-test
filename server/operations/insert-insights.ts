import { type InsertInsight, Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";

import type * as insightsTable from "$tables/insights.ts";

export type Input = HasDBClient & {
  newInsight: InsertInsight;
};

export default ({ db, newInsight }: Input): Insight => {
  try {
    console.log("Inserting insight: ", newInsight);

    const insertItem: insightsTable.Insert = {
      brand: newInsight.brand,
      createdAt: new Date().toISOString(),
      text: newInsight.text,
    };

    const result = db.sql<insightsTable.Row>`
        INSERT INTO insights (brand, createdAt, text)
        VALUES (${insertItem.brand}, ${insertItem.createdAt}, ${insertItem.text})
        RETURNING *;
    `;

    const insertedInsight = result[0];

    console.log("Inserted insight successfully: ", insertedInsight);

    return Insight.parse({
      ...insertedInsight,
      createdAt: new Date(insertedInsight.createdAt),
    });
  } catch (error) {
    console.error("Error inserting insight: ", error);
    throw new Error("Failed to insert insight");
  }
};
