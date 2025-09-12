import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import insertInsight from "./insert-insight.ts";

describe("insert insights into the database", () => {
  withDB((fixture) => {
    const newInsight = { brand: 1, text: "New insight", createdAt: new Date() };

    it("inserts an insight successfully", () => {
      const insertedInsight: Insight = insertInsight({
        db: fixture.db,
        newInsight,
      });
      expect(insertedInsight).toMatchObject({
        brand: newInsight.brand,
        text: newInsight.text,
      });
      expect(insertedInsight.id).toBeDefined();
      expect(insertedInsight.createdAt).toBeInstanceOf(Date);
    });
  });
});
