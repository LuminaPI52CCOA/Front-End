import { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  TrendingUp,
  Users,
  Clock,
  CalendarCheck,
  ShieldCheck,
  PieChart as PieChartIcon,
} from 'lucide-react';
import MetricCard from './components/MetricCard';
import ChartCard from './components/ChartCard';
import ConvenioChartCard from './components/ConvenioChartCard';
import StatusChartCard from './components/StatusChartCard';
import { obterDashboardAgendamento } from '../../services/consultaService';
import styles from './styles.module.css';

const PERIOD_MAP = {
  'Últimos 7 dias': '7d',
  'Últimos 30 dias': '30d',
  'Últimos 90 dias': '90d',
  'Este ano': 'ano',
};

const periodOptions = Object.keys(PERIOD_MAP);

function calcularEscalaVolume(serie) {
  const valores = (serie || []).map((p) => Number(p.valor) || 0);
  const maxValor = valores.length ? Math.max(...valores) : 0;
  if (maxValor <= 15) {
    return { yDomain: [0, 15], yTicks: [0, 3, 6, 9, 12, 15] };
  }
  if (maxValor <= 40) {
    return { yDomain: [0, 40], yTicks: [0, 8, 16, 24, 32, 40] };
  }
  if (maxValor <= 100) {
    return { yDomain: [0, 100], yTicks: [0, 20, 40, 60, 80, 100] };
  }
  const teto = Math.ceil(maxValor / 40) * 40;
  const passo = teto / 5;
  return {
    yDomain: [0, teto],
    yTicks: [0, passo, passo * 2, passo * 3, passo * 4, teto],
  };
}

function calcularEscalaConfirmacao(serie) {
  const valores = (serie || []).map((p) => Number(p.valor) || 0).filter((v) => v > 0);
  const minValor = valores.length ? Math.min(...valores) : 0;
  if (minValor >= 70) {
    return { yDomain: [70, 100], yTicks: [70, 80, 90, 100] };
  }
  return { yDomain: [0, 100], yTicks: [0, 20, 40, 60, 80, 100] };
}

export function LuminaDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 30 dias');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
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

  useEffect(() => {
    let ativo = true;
    const codigoPeriodo = PERIOD_MAP[selectedPeriod] || '30d';

    obterDashboardAgendamento(codigoPeriodo)
      .then((resposta) => {
        if (!ativo) return;
        setDashboardData(resposta);
        setErro(null);
      })
      .catch((err) => {
        if (!ativo) return;
        setErro(err?.message || 'Não foi possível carregar os dados do dashboard.');
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [selectedPeriod]);

  const consultasRealizadas = dashboardData?.consultasRealizadas ?? 0;
  const variacaoConsultas = Number(dashboardData?.variacaoConsultasPercentual ?? 0);
  const novosPacientes = dashboardData?.novosPacientes ?? 0;
  const taxaOcupacao = Number(dashboardData?.taxaOcupacao ?? 0);

  const metrics = [
    {
      label: 'Consultas Realizadas',
      value: carregando && !dashboardData ? '...' : String(consultasRealizadas),
      icon: CalendarCheck,
      pillText: `${variacaoConsultas >= 0 ? '+' : ''}${variacaoConsultas.toFixed(1)}% vs período anterior`,
      pillType: variacaoConsultas >= 0 ? 'success' : 'neutral',
    },
    {
      label: 'Novos Pacientes',
      value: carregando && !dashboardData ? '...' : String(novosPacientes),
      icon: Users,
      pillText: `+${novosPacientes} no período`,
      pillType: 'neutral',
    },
    {
      label: 'Taxa de Ocupação',
      value: carregando && !dashboardData ? '...' : `${taxaOcupacao.toFixed(1)}%`,
      icon: Clock,
      pillText:
        taxaOcupacao >= 75
          ? 'Alta demanda'
          : taxaOcupacao >= 50
            ? 'Demanda moderada'
            : 'Baixa demanda',
      pillType: taxaOcupacao >= 75 ? 'success' : 'neutral',
    },
  ];

  const volumeChart = dashboardData?.graficoVolume ?? [];
  const confirmationChart = dashboardData?.graficoConfirmacao ?? [];
  const convenioChart = dashboardData?.graficoConvenio ?? [];
  const statusChart = dashboardData?.graficoStatus ?? [];
  const escalaVolume = calcularEscalaVolume(volumeChart);
  const escalaConfirmacao = calcularEscalaConfirmacao(confirmationChart);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* Top Bar: Tabs & Filter */}
      <div className={styles.topBar}>
        <div className={styles.tabsBar}>
          <button
            type="button"
            className={`${styles.tabButton} ${styles.tabActive}`}
          >
            Agendamento
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
                    if (selectedPeriod !== period) {
                      setCarregando(true);
                      setErro(null);
                      setSelectedPeriod(period);
                    }
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

      {erro && (
        <p role="alert" style={{ color: '#b42318', marginBottom: '16px', fontSize: '14px' }}>
          {erro}
        </p>
      )}

      {/* Scheduling Dashboard Content */}
      <section className={styles.metricsGrid}>
        {metrics.map((metric) => (
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
          data={volumeChart}
          yDomain={escalaVolume.yDomain}
          yTicks={escalaVolume.yTicks}
          unit=" cons."
          icon={CalendarCheck}
        />
        <ChartCard
          title="Taxa de Confirmação"
          data={confirmationChart}
          yDomain={escalaConfirmacao.yDomain}
          yTicks={escalaConfirmacao.yTicks}
          unit="%"
          icon={TrendingUp}
        />
      </section>

      <section className={styles.chartsGrid}>
        <ConvenioChartCard
          title="Atendimentos por Convênio"
          data={convenioChart}
          icon={ShieldCheck}
        />
        <StatusChartCard
          title="Status das Consultas"
          data={statusChart}
          icon={PieChartIcon}
        />
      </section>
    </div>
  );
}

export default LuminaDashboard;
