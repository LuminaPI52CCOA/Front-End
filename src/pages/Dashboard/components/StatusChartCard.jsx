import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../styles.module.css';

const STATUS_COLORS = {
  'Concluída': '#2E7D5A',
  'Confirmada': '#A97F2B',
  'Agendada': '#D99B26',
  'Cancelada': '#C94A4A',
};

const FALLBACK_COLORS = ['#2E7D5A', '#A97F2B', '#D99B26', '#C94A4A'];

function StatusTooltip({ active, payload }) {
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

export default function StatusChartCard({ title, data = [], icon: Icon }) {
  const total = data.reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0);

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

      <div className={styles.statusChartLayout}>
        <div className={styles.statusPieWrapper}>
          <div className={styles.statusCenterTotal}>
            <span className={styles.statusCenterValue}>{total}</span>
            <span className={styles.statusCenterLabel}>Total</span>
          </div>
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ position: 'relative', zIndex: 2 }}
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="quantidade"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={86}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.categoria}
                    fill={
                      STATUS_COLORS[entry.categoria] ||
                      FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                content={<StatusTooltip />}
                wrapperStyle={{ zIndex: 100 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className={styles.statusLegendList}>
          {data.map((entry, index) => {
            const color =
              STATUS_COLORS[entry.categoria] ||
              FALLBACK_COLORS[index % FALLBACK_COLORS.length];
            return (
              <li key={entry.categoria} className={styles.statusLegendItem}>
                <div className={styles.statusLegendLeft}>
                  <span
                    className={styles.statusLegendDot}
                    style={{ backgroundColor: color }}
                  />
                  <span className={styles.statusLegendName}>{entry.categoria}</span>
                </div>
                <div className={styles.statusLegendRight}>
                  <strong className={styles.statusLegendCount}>{entry.quantidade}</strong>
                  <span className={styles.statusLegendPct}>
                    ({Number(entry.percentual || 0).toFixed(1)}%)
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
