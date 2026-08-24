import { useMemo, useState } from 'react';
import {
  MESES_ABREV,
} from '../../../data/agenda';
import {
  paraISO,
  deISO,
  hojeISO,
  adicionarDias,
  inicioDaSemanaISO,
  mesmaSemana,
} from '../../../utils/datas';
import * as S from './styles';

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export function CalendarioSelecao({ selectedDate, onSelectData }) {
  const dataSelecionada = useMemo(() => deISO(selectedDate), [selectedDate]);
  const [visao, setVisao] = useState({
    ano: dataSelecionada.getFullYear(),
    mes: dataSelecionada.getMonth(),
  });

  const celulas = useMemo(() => {
    const primeiroDia = new Date(visao.ano, visao.mes, 1).getDay();
    const diasNoMes = new Date(visao.ano, visao.mes + 1, 0).getDate();
    const vazios = Array(primeiroDia).fill(null);
    const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);
    return [...vazios, ...dias];
  }, [visao]);

  const isoDoDia = (dia) => paraISO(new Date(visao.ano, visao.mes, dia));

  const semanaSelecionada = inicioDaSemanaISO(selectedDate);
  const naFaixa = (dia) =>
    inicioDaSemanaISO(isoDoDia(dia)) === semanaSelecionada;

  const trocarMes = (deslocamento) =>
    setVisao((atual) => {
      const nova = new Date(atual.ano, atual.mes + deslocamento, 1);
      return { ano: nova.getFullYear(), mes: nova.getMonth() };
    });

  return (
    <S.Card aria-label="Calendário de seleção de datas">
      <S.Cabecalho>
        <S.BotaoSeta
          type="button"
          aria-label="Mês anterior"
          onClick={() => trocarMes(-1)}
        >
          ‹
        </S.BotaoSeta>
        <S.RotuloMes>
          {visao.ano} <span aria-hidden="true">›</span>{' '}
          {MESES_ABREV[visao.mes]}
        </S.RotuloMes>
        <S.BotaoSeta
          type="button"
          aria-label="Próximo mês"
          onClick={() => trocarMes(1)}
        >
          ›
        </S.BotaoSeta>
      </S.Cabecalho>

      <S.Grade role="grid" aria-label={`Calendário ${MESES_ABREV[visao.mes]} ${visao.ano}`}>
        {DIAS_SEMANA.map((dia) => (
          <S.DiaSemana key={dia} aria-hidden="true">
            {dia}
          </S.DiaSemana>
        ))}

        {celulas.map((dia, indice) => {
          if (dia === null) {
            return (
              <S.Celula key={`vazio-${indice}`}>
                <S.DiaVazio />
              </S.Celula>
            );
          }

          const iso = isoDoDia(dia);
          const selecionado = iso === selectedDate;
          const emFaixa = naFaixa(dia);
          const ehHoje = iso === hojeISO();
          const vizinhoEsquerdoNaFaixa =
            mesmaSemana(adicionarDias(iso, -1), selectedDate) &&
            deISO(adicionarDias(iso, -1)).getMonth() === visao.mes;
          const vizinhoDireitoNaFaixa =
            mesmaSemana(adicionarDias(iso, 1), selectedDate) &&
            deISO(adicionarDias(iso, 1)).getMonth() === visao.mes;

          return (
            <S.Celula key={iso}>
              <S.BotaoDia
                type="button"
                $selecionado={selecionado}
                $naFaixa={emFaixa}
                $ehHoje={ehHoje}
                $arredondarEsquerda={!vizinhoEsquerdoNaFaixa}
                $arredondarDireita={!vizinhoDireitoNaFaixa}
                aria-pressed={selecionado}
                aria-current={ehHoje ? 'date' : undefined}
                aria-label={`${dia} de ${MESES_ABREV[visao.mes]} de ${visao.ano}${selecionado ? ', selecionado' : ''}`}
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
