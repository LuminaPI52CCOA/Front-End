import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from '../styles.module.css';

function CustomTooltip({ active, payload, label, unit = '' }) {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>
          {payload[0].value}
          {unit}
        </p>
      </div>
    );
  }
  return null;
}

export default function ChartCard({
  title,
  data,
  dataKey = 'valor',
  xKey = 'mes',
  yDomain,
  yTicks,
  unit = '%',
  icon: Icon,
}) {
  const gradientId = `grad-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitleRow}>
          {Icon && (
            <div className={styles.chartIconWrapper}>
              <Icon size={16} />
            </div>
          )}
          <h3 className={styles.chartTitle}>{title}</h3>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A97F2B" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#A97F2B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EFE8DC" strokeDasharray="4 4" />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
            />
            <YAxis
              domain={yDomain}
              ticks={yTicks}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
              tickFormatter={(val) => `${val}${unit}`}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#A97F2B"
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={{ r: 4, stroke: '#A97F2B', strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 6, stroke: '#A97F2B', strokeWidth: 2, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
