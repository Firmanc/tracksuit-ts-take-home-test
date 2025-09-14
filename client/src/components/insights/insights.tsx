import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { BrandMap } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";

type InsightsProps = {
  deleteInsight: (id: number) => void;
  insights: Insight[];
  className?: string;
  isLoading?: boolean;
};

export const Insights = ({
  insights,
  className,
  deleteInsight,
  isLoading = false,
}: InsightsProps) => (
  <div className={cx(className)}>
    <h1 className={styles.heading}>Insights</h1>
    {isLoading && <p>Loading insights...</p>}
    {!isLoading && Boolean(insights?.length) && (
      <ul className={styles.list}>
        {insights.map(({ id, text, date, brandId, optimistic }) => (
            <li className={styles.insight} key={id}>
              <div className={styles["insight-meta"]}>
                <span>{BrandMap.get(brandId)}</span>
                <div className={styles["insight-meta-details"]}>
                  <span>{date.toString()}</span>
                  {!optimistic && (
                    <Button label="Delete Insight" theme="tertiary" onClick={() => deleteInsight(id)}>
                      <Trash2Icon
                        className={styles["insight-delete"]}
                        aria-label="Delete Insight"
                      />
                    </Button>
                  )}
                </div>
              </div>
              <p className={styles["insight-content"]}>{text}</p>
            </li>
          ))}
      </ul>
    )}
    {!isLoading && !insights?.length && <p>We have no insight!</p>}
  </div>
);
