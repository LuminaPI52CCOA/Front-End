import { useNavigate } from 'react-router-dom';
import { Select } from '../../Select';
import { AutoComplete } from '../../AutoComplete';
import { ESPECIALIDADES, DENTISTAS, PACIENTES } from '../../../data/agenda';
import styles from './styles.module.css';

const comOpcaoTodos = (opcoes) => [
  { value: '', label: 'Todos' },
  ...opcoes,
];

export function FiltrosSidebar({ filtros, onChangeFiltro }) {
  const navigate = useNavigate();
  const handleChange = (campo) => (evento) =>
    onChangeFiltro(campo, evento.target.value);

  return (
    <section className={styles.card} aria-label="Filtros da agenda">
      <h2 className={styles.titulo}>Filtros</h2>

      <div className={styles.campos}>
        <Select
          label="Especialidades:"
          options={comOpcaoTodos(ESPECIALIDADES)}
          value={filtros.especialidade}
          onChange={handleChange('especialidade')}
          aria-label="Filtrar por especialidade"
        />

        <AutoComplete
          id="filtro-dentista"
          label="Dentista:"
          options={DENTISTAS}
          value={filtros.dentista}
          onChange={(valor) => onChangeFiltro('dentista', valor)}
          placeholder="Buscar dentista..."
        />

        <AutoComplete
          id="filtro-paciente"
          label="Pacientes:"
          options={PACIENTES}
          value={filtros.paciente}
          onChange={(valor) => onChangeFiltro('paciente', valor)}
          placeholder="Buscar paciente..."
        />
      </div>

      <button
        className={styles.botaoNovo}
        type="button"
        onClick={() => navigate('/novo-agendamento')}
      >
        <span aria-hidden="true">+</span> Novo Agendamento
      </button>
    </section>
  );
}

export default FiltrosSidebar;
