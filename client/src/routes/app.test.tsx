import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { App } from "./app.tsx";
import { userEvent } from "@testing-library/user-event";
import { InsightsApi } from "../services/insights-api/index.ts";

vi.mock("../services/insights-api", () => ({
  InsightsApi: {
    getInsights: vi.fn().mockResolvedValue([]),
    addInsight: vi.fn(),
    deleteInsight: vi.fn(),
  },
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("Should render insights", async () => {
    const { getByRole, findByText } = render(<App />);

    expect(await findByText(/loading insights.../i)).toBeTruthy();
    expect(getByRole("heading", { name: /insights/i })).toBeTruthy();
    expect(await findByText(/we have no insight!/i)).toBeTruthy();
  });

  it("Should add insights", async () => {
    const NEW_INSIGHT_TEXT = "This is a new insight";
    (InsightsApi.addInsight as Mock).mockResolvedValue({
      id: 1,
      brandId: 1,
      date: new Date(),
      text: NEW_INSIGHT_TEXT,
    });

    render(<App />);

    const addInsightButtons = await screen.findAllByRole("button", { name: /add insight/i });

    await userEvent.click(addInsightButtons[0]);
    
    const brandOption = await screen.findByRole("option", { name: /brand 1/i });
    await userEvent.selectOptions(screen.getByRole("combobox"), brandOption);

    const textArea = screen.getByRole("textbox");
    await userEvent.type(textArea, NEW_INSIGHT_TEXT);

    const submitButtons = await screen.findAllByRole("button", { name: /add insight/i });
    await userEvent.click(submitButtons[1]);

    expect(await screen.findByText(NEW_INSIGHT_TEXT)).toBeTruthy();
  });

  it("Should remove insights", async () => {
    const NEW_INSIGHT_TEXT = "This is a new insight";
    (InsightsApi.getInsights as Mock).mockResolvedValue([
      { id: 1, brandId: 1, date: new Date(), text: NEW_INSIGHT_TEXT },
      { id: 2, brandId: 2, date: new Date(), text: "Another insight" },
    ]);

    (InsightsApi.deleteInsight as Mock).mockResolvedValue({ success: true });

    render(<App />);
    let insights = await screen.findAllByRole("listitem");
    expect(insights).toHaveLength(2);

    const insightItemButtons = await screen.findAllByRole("button", { name: "Delete Insight" });
    expect(insightItemButtons).toHaveLength(2);
    await userEvent.click(insightItemButtons[1]);

    insights = await screen.findAllByRole("listitem");
    expect(insights).toHaveLength(1);
  });
});
