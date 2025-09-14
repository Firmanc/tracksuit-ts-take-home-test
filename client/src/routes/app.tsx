import { useCallback, useEffect, useOptimistic, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight, NewInsight } from "../schemas/insight.ts";
import { InsightsApi } from "../services/insights-api/index.ts";

type OptimisticInsightActionCreate = {
  type: "CREATE";
  payload: NewInsight;
};

type OptimisticInsightActionDelete = {
  type: "DELETE";
  payload: { id: number };
};

/**
 * The main application component that handles displaying and managing insights.
 * As the application scales, this would ideally use a state management solution.
 * @todo: Implement infinite scroll / pagination
 */
export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const response = await InsightsApi.getInsights();
      setInsights(response);
      setLoading(false);
    };

  fetchInsights();
  }, []);

  const addInsight = useCallback(async (insight: NewInsight) => {
    runOptimisticAction({ type: "CREATE", payload: insight });

    try {
      const newInsight = await InsightsApi.addInsight(insight.brandId, insight.text);
      setInsights((prevInsights) => [newInsight, ...prevInsights]);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";

      setError(errorMessage);
    }
  }, []);

  const deleteInsight = useCallback(async (id: number) => {
    runOptimisticAction({ type: "DELETE", payload: { id } });

    try {
      await InsightsApi.deleteInsight(id);

      console.log("Deleted insight with id:", id);
      setInsights((prevInsights) => prevInsights.filter((insight) => insight.id !== id));
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      
      setError(errorMessage);
    }
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
      {error && <p>Error: {error}</p>}
      <Header addInsight={addInsight} />
      <Insights
        isLoading={loading}
        className={styles.insights}
        insights={optimisticInsights}
        deleteInsight={deleteInsight}
      />
    </main>
  );
};
