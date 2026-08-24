import { useMemo } from 'react';
import * as S from './styles';

const OPCOES_DURACAO = [
  { value: '15', label: 'Consulta comum (15 min)' },
  { value: '30', label: 'Retorno (30 min)' },
  { value: '45', label: 'Sessão estendida (45 min)' },
  { value: '60', label: 'Procedimento completo (60 min)' },
];

const INICIO_JORNADA = 8 * 60;
const FIM_JORNADA = 18 * 60;

const gerarHorarios = (passo) => {
  const horarios = [];
  for (
    let minuto = INICIO_JORNADA;
    minuto <= FIM_JORNADA;
    minuto += passo
  ) {
    const hora = String(Math.floor(minuto / 60)).padStart(2, '0');
    const resto = String(minuto % 60).padStart(2, '0');
    horarios.push(`${hora}:${resto}`);
  }
  return horarios;
};

export function HorariosDisponiveis({
  duracao,
  onDuracaoChange,
  horarioSelecionado,
  onSelectHorario,
  estaOcupado,
}) {
  const passo = Number(duracao);
  const horarios = useMemo(() => gerarHorarios(passo), [passo]);

  return (
    <S.Card aria-label="Seleção de horário disponível">
      <S.Cabecalho>
        <h3>Horários Disponíveis</h3>
      </S.Cabecalho>

      <S.Corpo>
        <div>
          <S.Rotulo id="rotulo-duracao">Selecione o tempo de consulta</S.Rotulo>
          <S.EnvolvedorSeletor>
            <S.Seletor
              aria-labelledby="rotulo-duracao"
              value={duracao}
              onChange={(evento) => onDuracaoChange(evento.target.value)}
            >
              {OPCOES_DURACAO.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </S.Seletor>
          </S.EnvolvedorSeletor>
        </div>

        <div role="group" aria-labelledby="rotulo-inicio">
          <S.Rotulo id="rotulo-inicio">Escolha o horário de início</S.Rotulo>
          <S.AreaRolagem>
            <S.GradeHorarios>
              {horarios.map((horario) => {
                const ocupado = estaOcupado(horario);
                return (
                  <S.BotaoHorario
                    key={horario}
                    type="button"
                    $selecionado={horario === horarioSelecionado}
                    $ocupado={ocupado}
                    aria-pressed={horario === horarioSelecionado}
                    aria-disabled={ocupado}
                    title={
                      ocupado ? 'Horário já ocupado para este dentista' : undefined
                    }
                    onClick={() => onSelectHorario(horario)}
                  >
                    {horario}
                  </S.BotaoHorario>
                );
              })}
            </S.GradeHorarios>
          </S.AreaRolagem>
        </div>
      </S.Corpo>

      <S.Rodape>
        <S.QuadradoIndicador aria-hidden="true" />
        <p>Selecionado: {horarioSelecionado || '--:--'}</p>
      </S.Rodape>
    </S.Card>
  );
}

export default HorariosDisponiveis;
