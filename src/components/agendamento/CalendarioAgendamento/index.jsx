import { useState } from 'react';
import { deISO, paraISO } from '../../../utils/datas';
import * as S from './styles';

const MESES_COMPLETOS = [
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

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const mesmoMes = (isoA, isoB) => isoA.slice(0, 7) === isoB.slice(0, 7);

export function CalendarioAgendamento({ dataSelecionada, onSelect }) {
  const [visao, setVisao] = useState(() => dataSelecionada.slice(0, 7));

  if (!dataSelecionada.startsWith(visao)) {
    setVisao(dataSelecionada.slice(0, 7));
  }

  const [anoTexto, mesTexto] = visao.split('-');
  const ano = Number(anoTexto);
  const mesIndice = Number(mesTexto) - 1;

  const primeiroDoMes = new Date(ano, mesIndice, 1);
  const deslocamento = primeiroDoMes.getDay();
  const inicio = new Date(ano, mesIndice, 1 - deslocamento);

  const celulas = Array.from({ length: 42 }, (_, indice) => {
    const data = new Date(
      inicio.getFullYear(),
      inicio.getMonth(),
      inicio.getDate() + indice,
    );
    return { data, iso: paraISO(data) };
  });

  const navegar = (quantidade) => {
    const nova = new Date(ano, mesIndice + quantidade, 1);
    setVisao(
      `${nova.getFullYear()}-${String(nova.getMonth() + 1).padStart(2, '0')}`,
    );
  };

  const rotuloRodape = (() => {
    const selecionada = deISO(dataSelecionada);
    return `Data selecionada: ${selecionada.getDate()} de ${
      MESES_COMPLETOS[selecionada.getMonth()]
    }, ${selecionada.getFullYear()}`;
  })();

  return (
    <S.Card aria-label="Calendário para seleção da data da consulta">
      <S.Cabecalho>
        <h3>
          {MESES_COMPLETOS[mesIndice]} {ano}
        </h3>
        <S.Navegacao aria-label="Navegar entre meses">
          <S.BotaoNavegar
            type="button"
            onClick={() => navegar(-1)}
            aria-label="Mês anterior"
          >
            ‹
          </S.BotaoNavegar>
          <S.BotaoNavegar
            type="button"
            onClick={() => navegar(1)}
            aria-label="Próximo mês"
          >
            ›
          </S.BotaoNavegar>
        </S.Navegacao>
      </S.Cabecalho>

      <S.Grade>
        <S.DiasSemana aria-hidden="true">
          {DIAS_SEMANA.map((dia) => (
            <span key={dia}>{dia}</span>
          ))}
        </S.DiasSemana>

        <S.Celulas>
          {celulas.map(({ data, iso }) => {
            const foraDoMes = !mesmoMes(iso, visao);
            return (
              <S.CelulaDia
                key={iso}
                type="button"
                $foraDoMes={foraDoMes}
                $selecionado={iso === dataSelecionada}
                disabled={foraDoMes}
                onClick={() => onSelect(iso)}
              >
                {data.getDate()}
              </S.CelulaDia>
            );
          })}
        </S.Celulas>
      </S.Grade>

      <S.Rodape>
        <S.QuadradoIndicador aria-hidden="true" />
        <p>{rotuloRodape}</p>
      </S.Rodape>
    </S.Card>
  );
}

export default CalendarioAgendamento;
