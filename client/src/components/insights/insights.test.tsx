import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Insights } from "./insights.tsx";

const TEST_INSIGHTS = [
  {
    id: 1,
    brandId: 1,
    date: new Date(),
    text: "Test insight",
  },
  { id: 2, brandId: 2, date: new Date(), text: "Another test insight" },
];

describe("insights", () => {
  it("Should render insights", () => {
    const { getByRole, getAllByRole } = render(<Insights insights={TEST_INSIGHTS} />);
    expect(getByRole("list")).toBeDefined();
    expect(getAllByRole("listitem")).toHaveLength(TEST_INSIGHTS.length);
  });
  it("Should render no insights message", () => {
    const { getByText } = render(<Insights insights={[]} />);
    expect(getByText("We have no insight!")).toBeDefined();
  });
});
