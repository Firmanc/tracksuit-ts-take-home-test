import { InsightsApi } from "./index.ts";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("InsightsApi", () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.spyOn(global, "fetch");
  });

  test("should fetch insights", async () => {
    const insight1 = {
      id: 1,
      createdAt: "2023-01-01T00:00:00Z",
      brand: 12,
      text: "Insight 1",
    };
    const insight2 = {
      id: 2,
      createdAt: "2023-01-02T00:00:00Z",
      brand: 13,
      text: "Insight 2",
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          insight1,
          insight2,
        ]),
    });

    const insights = await InsightsApi.getInsights();

    expect(insights).toEqual([
      {
        id: insight1.id,
        date: new Date(insight1.createdAt),
        brandId: insight1.brand,
        text: insight1.text,
      },
      {
        id: insight2.id,
        date: new Date(insight2.createdAt),
        brandId: insight2.brand,
        text: insight2.text,
      },
    ]);

    expect(fetchMock).toHaveBeenCalledWith("/api/insights");
  });

  test("should handle fetch error", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: InsightsApi.ERROR_GET_MESSAGE,
    });

    await expect(InsightsApi.getInsights()).rejects.toThrow(
      InsightsApi.ERROR_GET_MESSAGE,
    );
  });
});
