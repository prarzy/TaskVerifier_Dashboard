import { useState, useEffect } from 'react';
import type { Dataset, OverviewData, ModelsData, TimelineData, AnalysisConfig } from '../types';
import { loadDataset, loadOverview, loadModels, loadTimeline, loadAnalyses } from '../utils/data';

export interface AppData {
  dataset: Dataset | null;
  overview: OverviewData | null;
  models: ModelsData | null;
  timeline: TimelineData | null;
  analyses: AnalysisConfig[];
  loading: boolean;
  error: string | null;
}

export function useAppData(): AppData {
  const [state, setState] = useState<AppData>({
    dataset: null,
    overview: null,
    models: null,
    timeline: null,
    analyses: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [dataset, overview, models, timeline, analyses] = await Promise.all([
          loadDataset(),
          loadOverview(),
          loadModels(),
          loadTimeline(),
          loadAnalyses(),
        ]);
        setState({
          dataset,
          overview,
          models,
          timeline,
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
