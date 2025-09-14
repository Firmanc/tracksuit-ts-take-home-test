import { useState } from "react";
import { Button } from "../button/button.tsx";
import styles from "./header.module.css";
import { AddInsight } from "../add-insight/add-insight.tsx";
import type { NewInsight } from "../../schemas/insight.ts";

export const HEADER_TEXT = "Suit Tracker Insights";

export type AddInsightProps = {
  addInsight: (insight: NewInsight) => Promise<void>;
};

export const Header = ({ addInsight }: AddInsightProps) => {
  const [addInsightOpen, setAddInsightOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <span className={styles.logo}>{HEADER_TEXT}</span>
          <Button
            label="Add insight"
            theme="secondary"
            onClick={() => setAddInsightOpen(true)}
          />
        </div>
      </header>
      <AddInsight
        open={addInsightOpen}
        onClose={() => setAddInsightOpen(false)}
        addInsight={addInsight}
      />
    </>
  );
};
