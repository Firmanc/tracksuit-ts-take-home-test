import { useCallback, useEffect, useOptimistic, useState, startTransition } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight, NewInsight } from "../schemas/insight.ts";
import { InsightsApi } from "../services/insights-api/index.ts";

type OptimisticInsightActionCreate = {
  type: "CREATE";
  payload: NewInsight;
};

/**
 * The main application component that handles displaying and managing insights.
 * As the application scales, this would ideally use a state management solution.
 * @todo: Add error handling and messaging
 * @todo: Add loading states while fetching for initial insights
 * @todo: Implement infinite scroll / pagination
 */
type OptimisticInsightActionDelete = {
  type: "DELETE";
  payload: { id: number };
};

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      const response = await InsightsApi.getInsights();
      setInsights(response);
    };

  fetchInsights();
  }, []);

  const addInsight = useCallback((insight: NewInsight) => {
    runOptimisticAction({ type: "CREATE", payload: insight });

    startTransition(async () => {
      const newInsight = await InsightsApi.addInsight(insight.brandId, insight.text);
      setInsights((prevInsights) => [newInsight, ...prevInsights]);
    });
  }, []);

  const deleteInsight = useCallback((id: number) => {
    runOptimisticAction({ type: "DELETE", payload: { id } });

    startTransition(async () => {
      await InsightsApi.deleteInsight(id);
      setInsights((prevInsights) => prevInsights.filter((insight) => insight.id !== id));
    });
  }, []);

  const [optimisticInsights, runOptimisticAction] = useOptimistic<Insight[], OptimisticInsightActionCreate | OptimisticInsightActionDelete>(
    insights,
    (currentState, {type, payload}) => {
      if (type === "CREATE") {
        const optimisticInsight: Insight = {
          id: Date.now(),
          brandId: payload.brandId,
          date: new Date(),
          text: payload.text,
          optimistic: true,
        };
        
        return [optimisticInsight, ...currentState];
      }
      if (type === "DELETE") {
        return currentState.filter((insight) => insight.id !== payload.id);
      }
      return currentState;
    }
  );

  return (
    <main className={styles.main}>
      <Header addInsight={addInsight} />
      <Insights className={styles.insights} insights={optimisticInsights} deleteInsight={deleteInsight} />
    </main>
  );
};
