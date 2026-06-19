# TaskVerifier Dashboard

A fully client-side React + TypeScript research dashboard for the **TaskVerifier** project.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Folder Structure

```
public/data/
  dataset.json          ← Main experiment data (CVEs + aggregated keys)
  overview.json         ← Summary metrics (Overview page)
  models.json           ← Model metadata
  timeline.json         ← Project milestones
  analyses/             ← One JSON per chart (auto-discovered)
    manifest.json       ← (optional) explicit file list + order
    *.json              ← Chart configs

src/
  components/layout/    ← Sidebar, Topbar, AppLayout
  components/charts/    ← DynamicChart, AnalysisCard
  components/cve/       ← CveTable, CveDetailTabs
  components/shared/    ← MetricCard, EmptyState, CodeViewer, SearchBar
  hooks/useAppData.ts   ← Parallel JSON loader
  pages/                ← One file per route
  types/index.ts        ← All interfaces (all fields optional)
  utils/data.ts         ← JSON fetchers + formatters
```

## Adding a New Chart (no code changes needed)

Create `public/data/analyses/my_chart.json`:

```json
{
  "id": "my_chart",
  "title": "My Chart Title",
  "description": "What this shows.",
  "chart_type": "bar",
  "x_key": "cve",
  "data_key": "my_aggregated_key",
  "series": [{ "key": "my_value", "label": "My Value", "color": "#3b82f6" }],
  "order": 10,
  "claim": "Key research insight."
}
```

`data_key` must match a key in `dataset.aggregated`. The Analysis page discovers all files automatically.

Supported chart types: `bar`, `stacked_bar`, `line`, `area`, `scatter`

## Adding CVEs

Add entries to `dataset.cves[]` in `dataset.json`. All fields are optional — missing fields show `—` or empty states, never crash.

## Adding Models

Add entries to `models.models[]` in `models.json`. 1 model → detailed card. 2+ models → comparison grid.

## Troubleshooting

- **Chart shows "No chart data"** → `data_key` must exactly match a key in `dataset.aggregated`
- **CVE detail 404** → URL uses the `cve` field value; values must match exactly
- **Build warning: chunk > 500kB** → expected; Recharts is large. Acceptable for a research dashboard.
