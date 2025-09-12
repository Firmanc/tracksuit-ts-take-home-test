import { describe, expect, it, vi, beforeEach, afterEach, type Mock } from "vitest";
import { Header, HEADER_TEXT, type AddInsightProps } from "./header.tsx";
import { render, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("header", () => {
  let addInsight: Mock<AddInsightProps["addInsight"]>;

  beforeEach(() => {
    addInsight = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("Should render the header", () => {
    const { getByText } = render(<Header addInsight={addInsight} />);
    expect(getByText(HEADER_TEXT)).toBeTruthy();
  });

  it("Should open the AddInsight modal when clicking the Add Insight button", async () => {
    const { getByRole, findByText } = render(<Header addInsight={addInsight} />);
    const addButton = getByRole("button", { name: "Add insight" });
    expect(addButton).toBeTruthy();

    userEvent.click(addButton);

    const modalHeading = await findByText("Add a new insight");
    expect(modalHeading).toBeTruthy();
  });
});
