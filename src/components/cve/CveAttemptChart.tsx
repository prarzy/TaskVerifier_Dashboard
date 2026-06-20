import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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

interface Series {
  key: string;
  label: string;
  color: string;
}

interface CveAttemptChartProps {
  data: Record<string, unknown>[];
  series: Series[];
  yLabel?: string;
}

/**
 * Renders attempt-indexed metrics for a single CVE (e.g. prompt length,
 * hallucination count). Since data comes from one CVE's attempts[] array,
 * the X axis is always a clean, monotonically increasing attempt number —
 * no cross-CVE concatenation issues.
 */
export default function CveAttemptChart({ data, series, yLabel }: CveAttemptChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
        <XAxis
          dataKey="attempt"
          tick={AXIS_STYLE}
          axisLine={{ stroke: '#1e2d45' }}
          tickLine={false}
          label={{ value: 'Attempt', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 10 }}
        />
        <YAxis
          tick={AXIS_STYLE}
          axisLine={{ stroke: '#1e2d45' }}
          tickLine={false}
          label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 } : undefined}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />}
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={{ fill: s.color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}