import { useState, useEffect } from 'react';
import type { Dataset, OverviewData, ModelsData, AnalysisConfig } from '../types';
import { loadDataset, loadOverview, loadModels, loadAnalyses } from '../utils/data';
import { computeOverviewMetrics, computeAggregated } from '../utils/computeMetrics';

export interface AppData {
  dataset: Dataset | null;
  overview: OverviewData | null;
  models: ModelsData | null;
  analyses: AnalysisConfig[];
  loading: boolean;
  error: string | null;
}

export function useAppData(): AppData {
  const [state, setState] = useState<AppData>({
    dataset: null,
    overview: null,
    models: null,
    analyses: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [rawDataset, rawOverview, models, analyses] = await Promise.all([
          loadDataset(),
          loadOverview(),
          loadModels(),
          loadAnalyses(),
        ]);

        const cves = rawDataset?.cves ?? [];

        // Numbers are always derived live from cves[] (and models[]). overview.json
        // is only used for editorial/static fields (project name, tagline, notes) —
        // adding a CVE to dataset.json never requires touching overview.json.
        const computedMetrics = {
          ...computeOverviewMetrics(cves),
          models_evaluated: models?.models?.length ?? 0,
        };
        const overview: OverviewData | null = rawOverview
          ? {
              ...rawOverview,
              metrics: {
                ...rawOverview.metrics,
                ...computedMetrics,
              },
            }
          : {
              metrics: computedMetrics,
            };

        // Merge computed aggregates with any author-supplied dataset.aggregated
        // (computed values win, since they always reflect the current cves[]).
        const dataset: Dataset | null = rawDataset
          ? {
              ...rawDataset,
              aggregated: {
                ...rawDataset.aggregated,
                ...computeAggregated(cves),
              },
            }
          : null;

        setState({
          dataset,
          overview,
          models,
          analyses,
          loading: false,
          error: null,
        });
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: String(e) }));
      }
    }
    load();
  }, []);

  return state;
}