import { useState } from "react";
import {
  Calendar,
  Users,
  UserPlus,
  LayoutGrid,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import logo from "../../assets/logoLumina.png";

/* ────── Data ────── */
const noShowData = [
  { mes: "Jan", valor: 4 },
  { mes: "Fev", valor: 3 },
  { mes: "Mar", valor: 6 },
  { mes: "Abr", valor: 2 },
  { mes: "Mai", valor: 4 },
  { mes: "Jun", valor: 3 },
];

const retencaoData = [
  { mes: "Jan", valor: 68 },
  { mes: "Fev", valor: 70 },
  { mes: "Mar", valor: 74 },
  { mes: "Abr", valor: 72 },
  { mes: "Mai", valor: 82 },
  { mes: "Jun", valor: 85 },
];

const navItems = [
  { label: "Agenda", icon: Calendar },
  { label: "Pacientes", icon: Users },
  { label: "Dentistas", icon: UserPlus },
  { label: "Dashboard", icon: LayoutGrid, active: true },
];

/* ────── Sidebar (logo + sair) ────── */
function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop — sticky à esquerda, só logo e sair */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col items-center py-8 px-4">
          <img
            src={logo}
            alt="Lumina Odontologia"
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-2 px-6 py-6 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </aside>

      {/* Mobile — drawer com nav + sair */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
            <div className="flex justify-end p-3">
              <button
                onClick={onClose}
                aria-label="Fechar menu"
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center py-4 px-4">
              <img
                src={logo}
                alt="Lumina Odontologia"
                className="w-14 h-14 object-contain"
              />
            </div>

            {/* Nav items */}
            <nav className="mt-2 flex-1">
              {navItems.map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  onClick={onClose}
                  className={`flex items-center gap-3 w-full px-6 py-3 text-sm transition-colors ${
                    active
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <button className="flex items-center gap-2 px-6 py-6 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ────── Card de métrica ────── */
function MetricCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* ────── Card de gráfico ────── */
function ChartCard({ title, data, yDomain, yTicks }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex-1 min-w-0">
      <p className="font-semibold text-gray-900 mb-4">{title}</p>
      <div className="h-52 sm:h-60 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`grad-${title}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#A38A4B" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#A38A4B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f0ede4" />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
            />
            <YAxis
              domain={yDomain}
              ticks={yTicks}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #eee",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#A38A4B"
              strokeWidth={2}
              fill={`url(#grad-${title})`}
              dot={{ r: 4, stroke: "#A38A4B", strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ────── Página principal ────── */
export default function LuminaDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#EFE8DC]">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Corpo */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* Título + Tabs + Filtro */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Experiência do paciente
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Abas */}
              <div className="flex gap-4 text-sm">
                <span className="text-gray-400 cursor-pointer hover:text-gray-600">
                  Agendamento
                </span>
                <span className="text-gray-900 font-semibold border-b-2 border-amber-600 pb-1 cursor-pointer">
                  Experiência
                </span>
              </div>

              {/* Filtro de período */}
              <button className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 text-sm text-gray-700 shadow-sm hover:shadow-md transition-shadow self-start sm:self-auto">
                <Calendar size={16} />
                <span>Últimos 30 dias</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </section>

          {/* Métricas */}
          <section className="flex flex-col sm:flex-row gap-4">
            <MetricCard label="NPS Digital" value="9.4/10" />
            <MetricCard label="Taxa de Faltas" value="12.4%" />
            <MetricCard label="Taxa de retenção" value="78.5%" />
          </section>

          {/* Gráficos */}
          <section className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <ChartCard
              title="Taxa de No-show"
              data={noShowData}
              yDomain={[0, 20]}
              yTicks={[0, 4, 8, 12, 16, 20]}
            />
            <ChartCard
              title="Crescimento de Retenção"
              data={retencaoData}
              yDomain={[50, 100]}
              yTicks={[50, 60, 70, 80, 90, 100]}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
