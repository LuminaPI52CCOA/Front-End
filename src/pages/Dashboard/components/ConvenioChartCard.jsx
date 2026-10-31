import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styles from '../styles.module.css';

const BAR_COLORS = ['#A97F2B', '#C9A24B', '#8C651D', '#D8B86A', '#6E4E14'];

function ConvenioTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{item.categoria}</p>
        <p className={styles.tooltipValue}>
          {item.quantidade} cons. ({Number(item.percentual || 0).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
}

export default function ConvenioChartCard({ title, data = [], icon: Icon }) {
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
          <BarChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EFE8DC" strokeDasharray="4 4" />
            <XAxis
              dataKey="categoria"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(201, 162, 75, 0.08)' }}
              content={<ConvenioTooltip />}
            />
            <Bar dataKey="quantidade" radius={[8, 8, 0, 0]} maxBarSize={52}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.categoria}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
