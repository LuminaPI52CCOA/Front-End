import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoComplete } from '../../AutoComplete';
import { useDentistasOpcoes } from '../../../hooks/useDentistasOpcoes';
import { useEspecialidades } from '../../../hooks/useEspecialidades';
import { usePatients } from '../../../hooks/usePatients';
import { podeCriarAgendamento } from '../../../utils/sessao';
import styles from './styles.module.css';

const comOpcaoTodos = (opcoes) => [
  { value: '', label: 'Todos' },
  ...opcoes,
];

export function FiltrosSidebar({ filtros, onChangeFiltro }) {
  const navigate = useNavigate();
  const { dentistas } = useDentistasOpcoes();
  const { especialidades } = useEspecialidades();
  const { pacientes } = usePatients();

  const opcoesEspecialidades = useMemo(
    () => (especialidades || []).map((e) => ({ value: e.nome, label: e.nome })),
    [especialidades],
  );

  const opcoesDentistas = useMemo(
    () => (dentistas || []).map((d) => ({ value: d.nome, label: d.nome })),
    [dentistas],
  );

  const opcoesPacientes = useMemo(
    () => (pacientes || []).map((p) => ({ value: String(p.id), label: p.nome })),
    [pacientes],
  );

  return (
    <section className={styles.card} aria-label="Filtros da agenda">
      <h2 className={styles.titulo}>Filtros</h2>

      <div className={styles.campos}>
        <AutoComplete
          id="filtro-especialidade"
          label="Especialidades:"
          options={comOpcaoTodos(opcoesEspecialidades)}
          value={filtros.especialidade}
          onChange={(valor) => onChangeFiltro('especialidade', valor)}
          placeholder="Buscar especialidade..."
        />

        <AutoComplete
          id="filtro-dentista"
          label="Dentista:"
          options={comOpcaoTodos(opcoesDentistas)}
          value={filtros.dentista}
          onChange={(valor) => onChangeFiltro('dentista', valor)}
          placeholder="Buscar dentista..."
        />

        <AutoComplete
          id="filtro-paciente"
          label="Pacientes:"
          options={comOpcaoTodos(opcoesPacientes)}
          value={filtros.paciente}
          onChange={(valor) => onChangeFiltro('paciente', valor)}
          placeholder="Buscar paciente..."
        />
      </div>

      {podeCriarAgendamento() && (
        <button
          className={styles.botaoNovo}
          type="button"
          onClick={() => navigate('/novo-agendamento')}
        >
          <span aria-hidden="true">+</span> Novo Agendamento
        </button>
      )}
    </section>
  );
}

export default FiltrosSidebar;
