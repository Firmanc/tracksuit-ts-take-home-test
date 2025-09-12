import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";
import { Insight } from "$models/insight.ts";
import listInsights from "./list-insights.ts";

describe("deleteInsight", () => {
  const insight = {
    id: 1,
    brand: 1,
    text: "Insight to be deleted",
    createdAt: new Date(),
  };
  withDB((fixture) => {
    const insights: Insight[] = [
      { id: 1, brand: 0, createdAt: new Date(), text: "1" },
      { id: 2, brand: 0, createdAt: new Date(), text: "2" },
      { id: 3, brand: 1, createdAt: new Date(), text: "3" },
      { id: 4, brand: 4, createdAt: new Date(), text: "4" },
    ];

    beforeAll(() => {
      fixture.insights.insert(
        insights.map((it) => ({
          ...it,
          createdAt: it.createdAt.toISOString(),
        })),
      );
    });

    it("should delete an insight by id", () => {
      deleteInsight({
        db: fixture.db,
        insightId: insight.id,
      });

      const result = listInsights(fixture);

      expect(result.find((it) => it.id === insight.id)).toBeUndefined();
    });
  });
});
