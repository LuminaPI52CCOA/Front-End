import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from '../../Select';
import { AutoComplete } from '../../AutoComplete';
import { useConsultas } from '../../../context/ConsultasContexto';
import { consultaService } from '../../../services/consultaService';
import styles from './styles.module.css';

const comOpcaoTodos = (opcoes) => [
  { value: '', label: 'Todos' },
  ...opcoes,
];

const opcoesUnicas = (nomes) =>
  [...new Set(nomes.filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((nome) => ({ value: nome, label: nome }));

export function FiltrosSidebar({ filtros, onChangeFiltro }) {
  const navigate = useNavigate();
  const { consultas } = useConsultas();
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    let ativo = true;
    consultaService
      .listarEspecialidades()
      .then((lista) => {
        if (ativo) setEspecialidades(lista.map(({ nome }) => ({ value: nome, label: nome })));
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  // Dentistas e pacientes vêm das consultas carregadas da semana.
  const dentistas = useMemo(
    () => opcoesUnicas(consultas.map((consulta) => consulta.dentista)),
    [consultas],
  );
  const pacientes = useMemo(
    () => opcoesUnicas(consultas.map((consulta) => consulta.paciente)),
    [consultas],
  );
  const handleChange = (campo) => (evento) =>
    onChangeFiltro(campo, evento.target.value);

  return (
    <section className={styles.card} aria-label="Filtros da agenda">
      <h2 className={styles.titulo}>Filtros</h2>

      <div className={styles.campos}>
        <Select
          label="Especialidades:"
          options={comOpcaoTodos(especialidades)}
          value={filtros.especialidade}
          onChange={handleChange('especialidade')}
          aria-label="Filtrar por especialidade"
        />

        <AutoComplete
          id="filtro-dentista"
          label="Dentista:"
          options={dentistas}
          value={filtros.dentista}
          onChange={(valor) => onChangeFiltro('dentista', valor)}
          placeholder="Buscar dentista..."
        />

        <AutoComplete
          id="filtro-paciente"
          label="Pacientes:"
          options={pacientes}
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
