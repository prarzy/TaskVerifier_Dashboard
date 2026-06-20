import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { AnalysisConfig } from '../../types';
import EmptyState from '../shared/EmptyState';

interface DynamicChartProps {
  config: AnalysisConfig;
  data: Record<string, unknown>[];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#131929',
  border: '1px solid #1e2d45',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: '12px',
  fontFamily: 'JetBrains Mono, monospace',
};

const AXIS_STYLE = {
  fill: '#475569',
  fontSize: 11,
  fontFamily: 'Inter, sans-serif',
};

export default function DynamicChart({ config, data }: DynamicChartProps) {
  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="Dataset key not found or data is empty." />;
  }

  const series = config.series ?? [];
  const xKey = config.x_key ?? 'x';
  const type = config.chart_type ?? 'bar';

  const commonProps = {
    data,
    margin: { top: 8, right: 16, left: 0, bottom: 8 },
  };

  const gridProps = {
    strokeDasharray: '3 3',
    stroke: '#1e2d45',
    vertical: false,
  };

  const axisProps = {
    tick: AXIS_STYLE,
    axisLine: { stroke: '#1e2d45' },
    tickLine: false,
  };

  if (type === 'bar' || type === 'stacked_bar') {
    const stacked = type === 'stacked_bar';
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart {...commonProps}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />}
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color ?? '#3b82f6'}
              stackId={stacked ? 'stack' : undefined}
              radius={stacked ? [0, 0, 0, 0] : [3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart {...commonProps}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color ?? '#3b82f6'}
              strokeWidth={2}
              dot={{ fill: s.color ?? '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart {...commonProps}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color ?? '#3b82f6'}
              fill={`${s.color ?? '#3b82f6'}22`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'scatter') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart {...commonProps} margin={{ top: 8, right: 16, left: 0, bottom: 28 }}>
          <CartesianGrid {...gridProps} />
          <XAxis
            dataKey={xKey}
            name={config.x_label}
            {...axisProps}
            angle={-35}
            textAnchor="end"
            height={50}
            interval={0}
          />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: '3 3' }} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />}
          {series.map((s) => (
            <Scatter
              key={s.key}
              name={s.label}
              dataKey={s.key}
              fill={s.color ?? '#3b82f6'}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={s.color ?? '#3b82f6'} opacity={0.8} />
              ))}
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  return <EmptyState title={`Unsupported chart type: ${type}`} message="Add support in DynamicChart.tsx" />;
}
