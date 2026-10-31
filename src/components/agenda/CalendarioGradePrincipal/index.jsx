import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useConsultas } from '../../../context/ConsultasContexto';
import { useBloqueios } from '../../../context/BloqueiosContexto';
import { hojeISO, inicioDaSemanaISO, paraISO } from '../../../utils/datas';
import { aplicarFiltros } from '../../../utils/filtragem';
import ConsultaCard from '../ConsultaCard';
import ModalDetalhesConsulta from '../ModalDetalhesConsulta';
import styles from './styles.module.css';

const ABREVIACOES = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const DURACOES_VALIDAS = [15, 30, 45, 60];

const formatarHHMM = (data) =>
  `${String(data.getHours()).padStart(2, '0')}:${String(
    data.getMinutes(),
  ).padStart(2, '0')}`;

const hhmmLimpo = (valor) => (valor ? String(valor).slice(0, 5) : '08:00');

function IconeCalendario() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#b09b6f"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function CalendarioGradePrincipal({ selectedDate, filtros }) {
  const calendarRef = useRef(null);
  const { consultas, reagendar } = useConsultas();
  const { isDataBloqueada } = useBloqueios();
  const [consultaSelecionadaId, setConsultaSelecionadaId] = useState(null);
  const [erroAcao, setErroAcao] = useState('');

  const dentistaSelecionado = filtros.dentista || '';

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(selectedDate);
  }, [selectedDate]);

  const consultaSelecionada = useMemo(
    () =>
      consultas.find((c) => String(c.id) === String(consultaSelecionadaId)) ??
      null,
    [consultas, consultaSelecionadaId],
  );

  const selecionarConsulta = (id) => {
    setErroAcao('');
    setConsultaSelecionadaId(String(id));
  };

  const segundaFeira = inicioDaSemanaISO(selectedDate);
  const hoje = hojeISO();

  const consultasVisiveis = useMemo(
    () => aplicarFiltros(consultas, filtros),
    [consultas, filtros],
  );

  const eventos = useMemo(
    () =>
      consultasVisiveis.map((consulta) => {
        const cancelada =
          consulta.status === 'Cancelado' || consulta.statusApi === 'CANCELADA';
        const finalizada =
          consulta.status === 'Finalizada' || consulta.statusApi === 'CONCLUIDA';
        const inicio = hhmmLimpo(consulta.inicio);
        const fim = hhmmLimpo(consulta.fim);

        return {
          id: String(consulta.id),
          start: `${consulta.data}T${inicio}:00`,
          end: `${consulta.data}T${fim}:00`,
          display: cancelada ? 'background' : 'auto',
          editable: !cancelada && !finalizada,
          startEditable: !cancelada && !finalizada,
          durationEditable: !cancelada && !finalizada,
          classNames: cancelada ? ['fc-evento-cancelado'] : [],
          extendedProps: { agendamento: consulta },
        };
      }),
    [consultasVisiveis],
  );

  const aoMoverOuRedimensionar = async (info) => {
    setErroAcao('');
    const inicio = info.event.start;
    const fim = info.event.end ?? info.event.start;
    const duracaoMinutos = Math.round((fim.getTime() - inicio.getTime()) / 60000);

    if (!DURACOES_VALIDAS.includes(duracaoMinutos)) {
      info.revert();
      setErroAcao(
        `Duração inválida (${duracaoMinutos} min). Permitidas: 15, 30, 45 ou 60 minutos.`,
      );
      return;
    }

    try {
      await reagendar(info.event.id, {
        data: paraISO(inicio),
        horarioInicio: formatarHHMM(inicio),
        horarioFim: formatarHHMM(fim),
      });
    } catch (error) {
      info.revert();
      setErroAcao(
        error?.message || 'Não foi possível reagendar a consulta neste horário.',
      );
    }
  };

  const cabecalhoDia = (arg) => (
    <div className="fc-dia-header">
      <span className="fc-dia-nome">{ABREVIACOES[arg.date.getDay()]}.</span>
      <span className="fc-dia-numero">{arg.date.getDate()}</span>
    </div>
  );

  const classesCabecalho = (arg) => {
    const iso = paraISO(arg.date);
    const classes = [];
    if (iso === hoje) classes.push('fc-dia-hoje');
    if (inicioDaSemanaISO(iso) === segundaFeira) {
      classes.push('fc-dia-selecionado');
    }
    if (dentistaSelecionado && isDataBloqueada(dentistaSelecionado, iso, 'dia_todo')) {
      classes.push('fc-dia-bloqueado');
    }
    return classes;
  };

  const classesCelulaDia = (arg) => {
    const iso = paraISO(arg.date);
    const classes = [];
    if (iso === hoje) classes.push('fc-coluna-hoje');
    if (dentistaSelecionado && isDataBloqueada(dentistaSelecionado, iso, 'dia_todo')) {
      classes.push('fc-celula-bloqueada');
    }
    return classes;
  };

  const slotLaneClassNames = (arg) => {
    if (!dentistaSelecionado) return [];
    const iso = paraISO(arg.date);
    const hora = arg.date.getHours();
    const turno = hora < 13 ? 'manha' : 'tarde';

    if (isDataBloqueada(dentistaSelecionado, iso, 'dia_todo')) {
      return ['fc-slot-bloqueado'];
    }
    if (isDataBloqueada(dentistaSelecionado, iso, turno)) {
      return ['fc-slot-bloqueado'];
    }
    return [];
  };

  const conteudoEvento = (arg) => (
    <div className="fc-cartao-agenda">
      <ConsultaCard
        agendamento={arg.event.extendedProps.agendamento}
        selecionado={String(arg.event.id) === String(consultaSelecionadaId)}
        onClick={() => selecionarConsulta(arg.event.id)}
      />
    </div>
  );

  const aoClicarEvento = (info) => {
    selecionarConsulta(info.event.id);
  };

  return (
    <section className={styles.cartao} aria-label="Grade semanal de agendamentos">
      <div style={{ marginBottom: 8 }}>
        <IconeCalendario />
      </div>

      <div className={styles.legend} role="status" aria-label="Legenda da agenda">
        <span className={styles.legendItem}>
          <span className={styles.legendDotCanceled} aria-hidden="true" />
          ✕ Consulta cancelada (horário livre)
        </span>
        {dentistaSelecionado && (
          <span className={styles.legendItem}>
            <span className={styles.legendDotBlocked} aria-hidden="true" />
            Indisponível (Bloqueado)
          </span>
        )}
      </div>

      {erroAcao && (
        <p className={styles.avisoErro} role="alert">
          {erroAcao}
        </p>
      )}

      <div className={styles.rolagem}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          initialDate={selectedDate}
          firstDay={1}
          hiddenDays={[0]}
          headerToolbar={false}
          footerToolbar={false}
          allDaySlot={false}
          slotDuration="00:15:00"
          slotLabelInterval="00:15:00"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
          contentHeight={500}
          expandRows={false}
          nowIndicator={true}
          editable={true}
          eventStartEditable={true}
          eventDurationEditable={true}
          snapDuration="00:15:00"
          slotEventOverlap={false}
          selectable={false}
          dayHeaderContent={cabecalhoDia}
          dayHeaderClassNames={classesCabecalho}
          dayCellClassNames={classesCelulaDia}
          slotLaneClassNames={slotLaneClassNames}
          events={eventos}
          eventContent={conteudoEvento}
          eventClick={aoClicarEvento}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          displayEventTime={false}
          eventDrop={aoMoverOuRedimensionar}
          eventResize={aoMoverOuRedimensionar}
        />
      </div>

      {consultaSelecionada && (
        <ModalDetalhesConsulta
          key={consultaSelecionada.id}
          consulta={consultaSelecionada}
          onFechar={() => setConsultaSelecionadaId(null)}
        />
      )}
    </section>
  );
}

export default CalendarioGradePrincipal;
