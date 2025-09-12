import { Insight } from "../../schemas/insight.ts";

export class InsightsApi {
  static BASE_URL = "/api/insights";
  static ERROR_GET_MESSAGE = "Failed to fetch insights";

  static async getInsights(): Promise<Insight[]> {
    const response = await fetch(InsightsApi.BASE_URL);

    if (!response.ok) {
      throw new Error(InsightsApi.ERROR_GET_MESSAGE);
    }

    const responseData = await response.json();

    return responseData.map((item: any) =>
      Insight.parse({
        id: item.id,
        date: new Date(item.createdAt),
        brandId: item.brand,
        text: item.text,
      })
    );
  }
}
