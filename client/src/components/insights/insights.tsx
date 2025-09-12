import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { BrandMap } from "../../lib/consts.ts";

type InsightsProps = {
  deleteInsight: (id: number) => void;
  insights: Insight[];
  className?: string;
};

export const Insights = ({ insights, className, deleteInsight }: InsightsProps) => (
  <div className={cx(className)}>
    <h1 className={styles.heading}>Insights</h1>
    {Boolean(insights?.length) && (
      <ul className={styles.list}>
        {insights.map(({ id, text, date, brandId, optimistic }) => (
            <li className={styles.insight} key={id}>
              <div className={styles["insight-meta"]}>
                <span>{BrandMap.get(brandId)}</span>
                <div className={styles["insight-meta-details"]}>
                  <span>{date.toString()}</span>
                  {!optimistic && <Trash2Icon
                    className={styles["insight-delete"]}
                    onClick={() => deleteInsight(id)}
                  />}
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
