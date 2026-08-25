export default function MetricCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-1">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
  );
}
