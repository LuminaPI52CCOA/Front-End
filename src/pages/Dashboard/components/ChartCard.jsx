import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-100">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-[#A38A4B]">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function ChartCard({ title, data, dataKey, xKey = "month", yMin, yMax, yStep }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A38A4B" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#A38A4B" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <YAxis
            domain={[yMin, yMax]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickCount={Math.floor((yMax - yMin) / yStep) + 1}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#A38A4B"
            strokeWidth={2.5}
            fill={`url(#gradient-${dataKey})`}
            dot={{
              r: 5,
              fill: "#ffffff",
              stroke: "#A38A4B",
              strokeWidth: 2.5,
            }}
            activeDot={{
              r: 7,
              fill: "#ffffff",
              stroke: "#A38A4B",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
