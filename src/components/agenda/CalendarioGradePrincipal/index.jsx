import { useEffect, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useConsultas } from '../../../context/ConsultasContexto';
import { hojeISO, inicioDaSemanaISO, paraISO } from '../../../utils/datas';
import ConsultaCard from '../ConsultaCard';
import * as S from './styles';

const ABREVIACOES = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const formatarHHMM = (data) =>
  `${String(data.getHours()).padStart(2, '0')}:${String(
    data.getMinutes(),
  ).padStart(2, '0')}`;

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

export function CalendarioGradePrincipal({ selectedDate }) {
  const calendarRef = useRef(null);
  const { consultas, atualizarConsulta } = useConsultas();

  useEffect(() => {
    calendarRef.current?.getApi().gotoDate(selectedDate);
  }, [selectedDate]);

  const segundaFeira = inicioDaSemanaISO(selectedDate);
  const hoje = hojeISO();

  const eventos = useMemo(
    () =>
      consultas.map((consulta) => ({
        id: consulta.id,
        start: `${consulta.data}T${consulta.inicio}:00`,
        end: `${consulta.data}T${consulta.fim}:00`,
        extendedProps: { agendamento: consulta },
      })),
    [consultas],
  );

  const aoMoverOuRedimensionar = (info) => {
    const inicio = info.event.start;
    const fim = info.event.end ?? info.event.start;
    atualizarConsulta(info.event.id, {
      data: paraISO(inicio),
      inicio: formatarHHMM(inicio),
      fim: formatarHHMM(fim),
    });
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
    return classes;
  };

  const classesCelulaDia = (arg) =>
    paraISO(arg.date) === hoje ? ['fc-coluna-hoje'] : [];

  const conteudoEvento = (arg) => (
    <div className="fc-cartao-agenda">
      <ConsultaCard agendamento={arg.event.extendedProps.agendamento} />
    </div>
  );

  return (
    <S.Cartao aria-label="Grade semanal de agendamentos">
      <div style={{ marginBottom: 8 }}>
        <IconeCalendario />
      </div>

      <S.Rolagem>
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
          selectable={false}
          dayHeaderContent={cabecalhoDia}
          dayHeaderClassNames={classesCabecalho}
          dayCellClassNames={classesCelulaDia}
          events={eventos}
          eventContent={conteudoEvento}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          displayEventTime={false}
          eventDrop={aoMoverOuRedimensionar}
          eventResize={aoMoverOuRedimensionar}
        />
      </S.Rolagem>
    </S.Cartao>
  );
}

export default CalendarioGradePrincipal;
