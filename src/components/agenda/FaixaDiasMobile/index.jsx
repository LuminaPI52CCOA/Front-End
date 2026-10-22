import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  deISO,
  adicionarDias,
  hojeISO,
  paraISO,
} from '../../../utils/datas';
import styles from './styles.module.css';

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const DIAS_SEMANA_CALENDARIO = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function gerarDiasJanela(baseISO, quantidade) {
  const dias = [];
  for (let indice = 0; indice < quantidade; indice += 1) {
    const iso = adicionarDias(baseISO, indice);
    const data = deISO(iso);
    dias.push({
      iso,
      diaSemana: DIAS_SEMANA[data.getDay()],
      numero: data.getDate(),
      mes: data.getMonth(),
      ano: data.getFullYear(),
      hoje: iso === hojeISO(),
    });
  }
  return dias;
}

function inicioMesISO(iso) {
  const data = deISO(iso);
  data.setDate(1);
  return paraISO(data);
}

function adicionarMesesISO(iso, quantidade) {
  const data = deISO(iso);
  data.setMonth(data.getMonth() + quantidade);
  data.setDate(1);
  return paraISO(data);
}

function obterDiasMes(isoMesBase) {
  const dataBase = deISO(isoMesBase);
  const ano = dataBase.getFullYear();
  const mes = dataBase.getMonth();
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const totalDias = ultimoDia.getDate();
  const deslocamento = primeiroDia.getDay();
  const dias = [];

  for (let i = 0; i < deslocamento; i += 1) {
    dias.push({ vazio: true, key: `vazio-${i}` });
  }

  for (let dia = 1; dia <= totalDias; dia += 1) {
    const data = new Date(ano, mes, dia);
    const iso = paraISO(data);
    dias.push({
      vazio: false,
      key: iso,
      iso,
      numero: dia,
      hoje: iso === hojeISO(),
    });
  }

  return dias;
}

export function FaixaDiasMobile({ selectedDate, onSelectData }) {
  const containerRef = useRef(null);
  const carregandoRef = useRef(false);
  const [janelaInicio, setJanelaInicio] = useState(() =>
    adicionarDias(selectedDate, -10),
  );
  const [dias, setDias] = useState(() => gerarDiasJanela(janelaInicio, 60));
  const [modalAberto, setModalAberto] = useState(false);
  const [mesCalendario, setMesCalendario] = useState(() => inicioMesISO(selectedDate));

  useEffect(() => {
    setMesCalendario(inicioMesISO(selectedDate));
  }, [selectedDate]);

  const dataSelecionada = useMemo(() => deISO(selectedDate), [selectedDate]);
  const rotuloMesAno = useMemo(
    () => `${MESES[dataSelecionada.getMonth()]} ${dataSelecionada.getFullYear()}`,
    [dataSelecionada],
  );

  const centralizarDia = (iso) => {
    const container = containerRef.current;
    if (!container) return;
    const elemento = container.querySelector(`[data-iso="${iso}"]`);
    if (!elemento) return;
    const posicao =
      elemento.offsetLeft - container.offsetWidth / 2 + elemento.offsetWidth / 2;
    container.scrollTo({ left: posicao, behavior: 'smooth' });
  };

  useEffect(() => {
    centralizarDia(selectedDate);
  }, [selectedDate]);

  const carregarAnterior = () => {
    if (carregandoRef.current) return;
    carregandoRef.current = true;
    const novoInicio = adicionarDias(janelaInicio, -30);
    setJanelaInicio(novoInicio);
    setDias((atual) => [...gerarDiasJanela(novoInicio, 30), ...atual]);
    setTimeout(() => {
      carregandoRef.current = false;
    }, 150);
  };

  const carregarProximo = () => {
    if (carregandoRef.current) return;
    carregandoRef.current = true;
    const ultimo = dias[dias.length - 1].iso;
    const novoInicio = adicionarDias(ultimo, 1);
    setDias((atual) => [...atual, ...gerarDiasJanela(novoInicio, 30)]);
    setTimeout(() => {
      carregandoRef.current = false;
    }, 150);
  };

  const aoRolar = () => {
    const container = containerRef.current;
    if (!container) return;
    if (container.scrollLeft < 80) {
      carregarAnterior();
    }
    if (container.scrollLeft + container.clientWidth > container.scrollWidth - 80) {
      carregarProximo();
    }
  };

  const irParaHoje = () => {
    const hoje = hojeISO();
    onSelectData(hoje);
    centralizarDia(hoje);
  };

  const diasCalendario = useMemo(() => obterDiasMes(mesCalendario), [mesCalendario]);

  const selecionarDoCalendario = (iso) => {
    onSelectData(iso);
    setModalAberto(false);
    centralizarDia(iso);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cabecalho}>
        <button
          type="button"
          className={styles.mesAnoBotao}
          onClick={() => setModalAberto(true)}
          aria-label="Abrir calendário completo"
        >
          <Calendar size={16} />
          <span>{rotuloMesAno}</span>
        </button>
        <button type="button" className={styles.hojeBotao} onClick={irParaHoje}>
          Hoje
        </button>
      </div>

      <div
        ref={containerRef}
        className={styles.faixa}
        role="tablist"
        aria-label="Selecionar dia"
        onScroll={aoRolar}
      >
        {dias.map((dia) => {
          const selecionado = dia.iso === selectedDate;

          return (
            <button
              key={dia.iso}
              data-iso={dia.iso}
              type="button"
              role="tab"
              aria-selected={selecionado}
              className={`${styles.diaCard}${selecionado ? ` ${styles.selecionado}` : ''}`}
              onClick={() => onSelectData(dia.iso)}
            >
              <span className={styles.diaSemana}>{dia.diaSemana}</span>
              <span className={styles.diaNumero}>{dia.numero}</span>
              {dia.hoje && !selecionado && (
                <span className={styles.pontoHoje} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {modalAberto && (
        <div className={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Calendário completo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalCabecalho}>
              <button
                type="button"
                className={styles.modalSeta}
                onClick={() => setMesCalendario(adicionarMesesISO(mesCalendario, -1))}
                aria-label="Mês anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <span className={styles.modalMesAno}>
                {MESES[deISO(mesCalendario).getMonth()]} {deISO(mesCalendario).getFullYear()}
              </span>
              <button
                type="button"
                className={styles.modalSeta}
                onClick={() => setMesCalendario(adicionarMesesISO(mesCalendario, 1))}
                aria-label="Próximo mês"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className={styles.calendarioGradeCabecalho}>
              {DIAS_SEMANA_CALENDARIO.map((d, i) => (
                <span key={i} className={styles.calendarioDiaSemana}>
                  {d}
                </span>
              ))}
            </div>

            <div className={styles.calendarioGrade}>
              {diasCalendario.map((dia) => {
                if (dia.vazio) {
                  return <span key={dia.key} className={styles.calendarioVazio} />;
                }
                const selecionado = dia.iso === selectedDate;
                return (
                  <button
                    key={dia.key}
                    type="button"
                    className={`${styles.calendarioBotaoDia}${selecionado ? ` ${styles.calendarioSelecionado}` : ''}${dia.hoje && !selecionado ? ` ${styles.calendarioHoje}` : ''}`}
                    onClick={() => selecionarDoCalendario(dia.iso)}
                  >
                    {dia.numero}
                  </button>
                );
              })}
            </div>

            <div className={styles.modalAcoes}>
              <button type="button" className={styles.modalHoje} onClick={irParaHoje}>
                Ir para hoje
              </button>
              <button type="button" className={styles.modalFechar} onClick={() => setModalAberto(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaixaDiasMobile;
