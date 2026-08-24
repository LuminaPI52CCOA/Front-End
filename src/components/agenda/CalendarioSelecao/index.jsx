import * as S from './styles';

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const OUTUBRO_2026 = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
];

export function CalendarioSelecao({ diasSelecionados, onToggleDia }) {
  const conjunto = new Set(diasSelecionados);

  return (
    <S.Card aria-label="Calendário de seleção de datas">
      <S.Cabecalho>
        <S.BotaoSeta type="button" aria-label="Mês anterior">
          ‹
        </S.BotaoSeta>
        <S.RotuloMes>
          2026 <span aria-hidden="true">›</span> OUT
        </S.RotuloMes>
        <S.BotaoSeta type="button" aria-label="Próximo mês">
          ›
        </S.BotaoSeta>
      </S.Cabecalho>

      <S.Grade role="grid" aria-label="Outubro de 2026">
        {DIAS_SEMANA.map((dia) => (
          <S.DiaSemana key={dia} aria-hidden="true">
            {dia}
          </S.DiaSemana>
        ))}

        {OUTUBRO_2026.flat().map((dia, indice) => {
          if (dia === null) {
            return (
              <S.Celula key={`vazio-${indice}`}>
                <S.DiaVazio />
              </S.Celula>
            );
          }

          const selecionado = conjunto.has(dia);
          const arredondarEsquerda = !conjunto.has(dia - 1);
          const arredondarDireita = !conjunto.has(dia + 1) || dia === 31;

          return (
            <S.Celula key={dia}>
              <S.BotaoDia
                type="button"
                $selecionado={selecionado}
                $arredondarEsquerda={arredondarEsquerda}
                $arredondarDireita={arredondarDireita}
                aria-pressed={selecionado}
                aria-label={`${dia} de outubro de 2026${selecionado ? ', selecionado' : ''}`}
                onClick={() => onToggleDia(dia)}
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
