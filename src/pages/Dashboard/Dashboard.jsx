import { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  CalendarX,
  TrendingUp,
  Award,
  Users,
  Clock,
  CalendarCheck,
} from 'lucide-react';
import MetricCard from './components/MetricCard';
import ChartCard from './components/ChartCard';
import styles from './styles.module.css';

/* ────── Mock Data ────── */
const experienceData = {
  metrics: [
    {
      label: 'NPS Digital',
      value: '9.4/10',
      icon: Award,
      pillText: 'Excelente',
      pillType: 'success',
    },
    {
      label: 'Taxa de Faltas (No-Show)',
      value: '12.4%',
      icon: CalendarX,
      pillText: '-2.1% no período',
      pillType: 'neutral',
    },
    {
      label: 'Taxa de Retenção',
      value: '78.5%',
      icon: TrendingUp,
      pillText: '+4.2% crescimento',
      pillType: 'success',
    },
  ],
  noShowChart: [
    { mes: 'Jan', valor: 4 },
    { mes: 'Fev', valor: 3 },
    { mes: 'Mar', valor: 6 },
    { mes: 'Abr', valor: 2 },
    { mes: 'Mai', valor: 4 },
    { mes: 'Jun', valor: 3 },
  ],
  retentionChart: [
    { mes: 'Jan', valor: 68 },
    { mes: 'Fev', valor: 70 },
    { mes: 'Mar', valor: 74 },
    { mes: 'Abr', valor: 72 },
    { mes: 'Mai', valor: 82 },
    { mes: 'Jun', valor: 85 },
  ],
};

const schedulingData = {
  metrics: [
    {
      label: 'Consultas Realizadas',
      value: '148',
      icon: CalendarCheck,
      pillText: '+12% vs mês anterior',
      pillType: 'success',
    },
    {
      label: 'Novos Pacientes',
      value: '34',
      icon: Users,
      pillText: '+8 este mês',
      pillType: 'neutral',
    },
    {
      label: 'Taxa de Ocupação',
      value: '89.2%',
      icon: Clock,
      pillText: 'Alta demanda',
      pillType: 'success',
    },
  ],
  volumeChart: [
    { mes: 'Jan', valor: 110 },
    { mes: 'Fev', valor: 125 },
    { mes: 'Mar', valor: 140 },
    { mes: 'Abr', valor: 132 },
    { mes: 'Mai', valor: 155 },
    { mes: 'Jun', valor: 168 },
  ],
  confirmationChart: [
    { mes: 'Jan', valor: 88 },
    { mes: 'Fev', valor: 91 },
    { mes: 'Mar', valor: 89 },
    { mes: 'Abr', valor: 93 },
    { mes: 'Mai', valor: 95 },
    { mes: 'Jun', valor: 96 },
  ],
};

const periodOptions = [
  'Últimos 7 dias',
  'Últimos 30 dias',
  'Últimos 90 dias',
  'Este ano',
];

export function LuminaDashboard() {
  const [activeTab, setActiveTab] = useState('experiencia');
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 30 dias');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* Top Bar: Tabs & Filter */}
      <div className={styles.topBar}>
        <div className={styles.tabsBar}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'agendamento' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('agendamento')}
          >
            Agendamento
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'experiencia' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('experiencia')}
          >
            Experiência do Paciente
          </button>
        </div>

        {/* Period Filter Dropdown */}
        <div className={styles.filterWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={styles.filterButton}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
          >
            <CalendarIcon size={16} className={styles.filterIcon} />
            <span>{selectedPeriod}</span>
            <ChevronDown size={14} />
          </button>

          {isDropdownOpen && (
            <div className={styles.filterDropdown}>
              {periodOptions.map((period) => (
                <button
                  key={period}
                  type="button"
                  className={`${styles.dropdownItem} ${
                    selectedPeriod === period ? styles.dropdownItemActive : ''
                  }`}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsDropdownOpen(false);
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'experiencia' ? (
        <>
          {/* Metrics Section */}
          <section className={styles.metricsGrid}>
            {experienceData.metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                icon={metric.icon}
                pillText={metric.pillText}
                pillType={metric.pillType}
              />
            ))}
          </section>

          {/* Charts Section */}
          <section className={styles.chartsGrid}>
            <ChartCard
              title="Taxa de No-show"
              data={experienceData.noShowChart}
              yDomain={[0, 20]}
              yTicks={[0, 4, 8, 12, 16, 20]}
              unit="%"
              icon={CalendarX}
            />
            <ChartCard
              title="Crescimento de Retenção"
              data={experienceData.retentionChart}
              yDomain={[50, 100]}
              yTicks={[50, 60, 70, 80, 90, 100]}
              unit="%"
              icon={TrendingUp}
            />
          </section>
        </>
      ) : (
        <>
          {/* Scheduling Tab Content */}
          <section className={styles.metricsGrid}>
            {schedulingData.metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                icon={metric.icon}
                pillText={metric.pillText}
                pillType={metric.pillType}
              />
            ))}
          </section>

          <section className={styles.chartsGrid}>
            <ChartCard
              title="Volume de Atendimentos"
              data={schedulingData.volumeChart}
              yDomain={[80, 180]}
              yTicks={[80, 100, 120, 140, 160, 180]}
              unit=" cons."
              icon={CalendarCheck}
            />
            <ChartCard
              title="Taxa de Confirmação"
              data={schedulingData.confirmationChart}
              yDomain={[70, 100]}
              yTicks={[70, 80, 90, 100]}
              unit="%"
              icon={TrendingUp}
            />
          </section>
        </>
      )}
    </div>
  );
}

export default LuminaDashboard;
