import { useMemo } from 'react';
import styles from './styles.module.css';

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
    <section className={styles.card} aria-label="Seleção de horário disponível">
      <div className={styles.cabecalho}>
        <h3>Horários Disponíveis</h3>
      </div>

      <div className={styles.corpo}>
        <div>
          <p className={styles.rotulo} id="rotulo-duracao">Selecione o tempo de consulta</p>
          <div className={styles.envolvedorSeletor}>
            <select
              className={styles.seletor}
              aria-labelledby="rotulo-duracao"
              value={duracao}
              onChange={(evento) => onDuracaoChange(evento.target.value)}
            >
              {OPCOES_DURACAO.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div role="group" aria-labelledby="rotulo-inicio">
          <p className={styles.rotulo} id="rotulo-inicio">Escolha o horário de início</p>
          <div className={styles.areaRolagem}>
            <div className={styles.gradeHorarios}>
              {horarios.map((horario) => {
                const ocupado = estaOcupado(horario);
                return (
                  <button
                    className={`${styles.botaoHorario}${horario === horarioSelecionado ? ` ${styles.selecionado}` : ''}${ocupado ? ` ${styles.ocupado}` : ''}`}
                    key={horario}
                    type="button"
                    aria-pressed={horario === horarioSelecionado}
                    aria-disabled={ocupado}
                    title={
                      ocupado ? 'Horário já ocupado para este dentista' : undefined
                    }
                    onClick={() => onSelectHorario(horario)}
                  >
                    {horario}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.rodape}>
        <span className={styles.quadradoIndicador} aria-hidden="true" />
        <p>Selecionado: {horarioSelecionado || '--:--'}</p>
      </footer>
    </section>
  );
}

export default HorariosDisponiveis;
