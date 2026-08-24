import { SEMANA, AGENDAMENTOS_POR_DIA, HORARIO_INICIO, HORARIO_FIM } from '../../../data/agenda';
import ConsultaCard from '../ConsultaCard';
import * as S from './styles';

const SLOTS_POR_HORA = 4;
const TOTAL_SLOTS = (HORARIO_FIM - HORARIO_INICIO) * SLOTS_POR_HORA;

const paraMinutos = (hhmm) => {
  const [hora, minuto] = hhmm.split(':').map(Number);
  return hora * 60 + minuto;
};

const formatarHora = (minutos) => {
  const hora = Math.floor(minutos / 60);
  return `${String(hora).padStart(2, '0')}:00`;
};

function IconeCalendario() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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

export function CalendarioGradePrincipal({ diasSelecionados }) {
  const conjuntoSelecionado = new Set(diasSelecionados);
  const alturaTotal = TOTAL_SLOTS * S.ALTURA_SLOTS;

  return (
    <S.Card aria-label="Grade semanal de agendamentos">
      <S.AreaInterna>
        <S.CabecalhoSemana>
          <S.IconeCalendario>
            <IconeCalendario />
          </S.IconeCalendario>

          {SEMANA.map((dia) => (
            <S.ColunaDia key={dia.diaSemana}>
              <S.NomeDia>{dia.diaSemana}.</S.NomeDia>
              <S.NumeroDia $hoje={dia.hoje}>{dia.dia}</S.NumeroDia>
              <S.MarcadorSelecao $selecionado={conjuntoSelecionado.has(dia.dia)} />
            </S.ColunaDia>
          ))}
        </S.CabecalhoSemana>

        <S.Corpo>
          <S.ColunaHorarios aria-hidden="true">
            {Array.from({ length: TOTAL_SLOTS + 1 }, (_, indice) => (
              <S.RotuloHora key={indice}>
                {formatarHora(HORARIO_INICIO * 60 + indice * (60 / SLOTS_POR_HORA))}
              </S.RotuloHora>
            ))}
          </S.ColunaHorarios>

          {SEMANA.map((dia) => (
            <S.ColunaDiaCorpo key={`${dia.diaSemana}-${dia.dia}`} $altura={alturaTotal}>
              {(AGENDAMENTOS_POR_DIA[dia.dia] || []).map((agendamento) => {
                const inicioMin = paraMinutos(agendamento.inicio);
                const fimMin = paraMinutos(agendamento.fim);
                const baseMin = HORARIO_INICIO * 60;
                const top =
                  ((inicioMin - baseMin) / 15) * S.ALTURA_SLOTS;
                const height =
                  ((fimMin - inicioMin) / 15) * S.ALTURA_SLOTS - 3;

                return (
                  <ConsultaCard
                    key={agendamento.id}
                    agendamento={agendamento}
                    top={top}
                    height={height}
                    onClick={() => {}}
                  />
                );
              })}
            </S.ColunaDiaCorpo>
          ))}
        </S.Corpo>
      </S.AreaInterna>
    </S.Card>
  );
}

export default CalendarioGradePrincipal;
