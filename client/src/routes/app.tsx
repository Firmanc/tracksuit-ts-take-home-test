import { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight, NewInsight } from "../schemas/insight.ts";
import { InsightsApi } from "../services/insights-api/index.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      const insights = await InsightsApi.getInsights();
      setInsights(insights);
    };

  fetchInsights();
  }, []);

  const addInsight = useCallback(async (insight: NewInsight) => {
    const newInsight = await InsightsApi.addInsight(insight.brandId, insight.text);
    setInsights((prevInsights) => [newInsight, ...prevInsights]);
  }, []);

  return (
    <main className={styles.main}>
      <Header addInsight={addInsight} />
      <Insights className={styles.insights} insights={insights} />
    </main>
  );
};
