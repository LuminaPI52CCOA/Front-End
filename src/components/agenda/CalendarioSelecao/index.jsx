import { useMemo, useState } from 'react';
import { MESES_ABREV } from '../../../data/agenda';
import {
  paraISO,
  deISO,
  hojeISO,
  inicioDaSemanaISO,
} from '../../../utils/datas';
import * as S from './styles';

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

export function CalendarioSelecao({ selectedDate, onSelectData }) {
  const [visao, setVisao] = useState(() => {
    const base = deISO(selectedDate);
    return { ano: base.getFullYear(), mes: base.getMonth() };
  });
  const [dataSincronizada, setDataSincronizada] = useState(selectedDate);

  if (dataSincronizada !== selectedDate) {
    setDataSincronizada(selectedDate);
    const base = deISO(selectedDate);
    setVisao({ ano: base.getFullYear(), mes: base.getMonth() });
  }

  const trocarMes = (deslocamento) =>
    setVisao((atual) => {
      const nova = new Date(atual.ano, atual.mes + deslocamento, 1);
      return { ano: nova.getFullYear(), mes: nova.getMonth() };
    });

  const celulas = useMemo(() => {
    const deslocamento = new Date(visao.ano, visao.mes, 1).getDay();
    const diasNoMes = new Date(visao.ano, visao.mes + 1, 0).getDate();
    const totalCelulas = Math.ceil((deslocamento + diasNoMes) / 7) * 7;

    return Array.from({ length: totalCelulas }, (_, indice) => {
      const data = new Date(visao.ano, visao.mes, 1 - deslocamento + indice);
      return {
        iso: paraISO(data),
        dia: data.getDate(),
        noMes: data.getMonth() === visao.mes,
      };
    });
  }, [visao]);

  const semanaSelecionada = inicioDaSemanaISO(selectedDate);
  const hoje = hojeISO();

  return (
    <S.Card aria-label="Calendário de seleção de datas">
      <S.Cabecalho>
        <S.Grupo>
          <S.BotaoSeta
            type="button"
            aria-label="Mês anterior"
            onClick={() => trocarMes(-1)}
          >
            ‹
          </S.BotaoSeta>
          <S.Ano>
            {visao.ano} <span aria-hidden="true">›</span>
          </S.Ano>
        </S.Grupo>

        <S.Grupo>
          <S.Mes>{MESES_ABREV[visao.mes]}</S.Mes>
          <S.BotaoSeta
            type="button"
            aria-label="Próximo mês"
            onClick={() => trocarMes(1)}
          >
            ›
          </S.BotaoSeta>
        </S.Grupo>
      </S.Cabecalho>

      <S.Grade
        role="grid"
        aria-label={`Calendário ${MESES_ABREV[visao.mes]} ${visao.ano}`}
      >
        {DIAS_SEMANA.map((dia) => (
          <S.DiaSemana key={dia} aria-hidden="true">
            {dia}
          </S.DiaSemana>
        ))}

        {celulas.map(({ iso, dia, noMes }) => {
          const selecionado = iso === selectedDate;
          const naFaixa = inicioDaSemanaISO(iso) === semanaSelecionada;

          return (
            <S.Celula key={iso}>
              <S.BotaoDia
                type="button"
                $noMes={noMes}
                $naFaixa={naFaixa && !selecionado}
                $selecionado={selecionado}
                aria-pressed={selecionado}
                aria-current={iso === hoje ? 'date' : undefined}
                aria-label={`${dia} de ${MESES_ABREV[visao.mes]} de ${visao.ano}${
                  selecionado ? ', selecionado' : ''
                }`}
                onClick={() => onSelectData(iso)}
              >
                {dia}
              </S.BotaoDia>
            </S.Celula>
          );
        })}
      </S.Grade>
    </S.Card>
  );
}

export default CalendarioSelecao;
