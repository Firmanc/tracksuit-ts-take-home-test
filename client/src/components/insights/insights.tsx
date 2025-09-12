import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  insights: Insight[];
  className?: string;
};

export const Insights = ({ insights, className }: InsightsProps) => {
  const deleteInsight = () => undefined;

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      {insights?.length && (
        <ul className={styles.list}>
          {insights.map(({ id, text, date, brandId }) => (
              <li className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{brandId}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{date.toString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={deleteInsight}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </li>
            ))}
        </ul>
      )}
      {!insights?.length && <p>We have no insight!</p>}
    </div>
  );
};
