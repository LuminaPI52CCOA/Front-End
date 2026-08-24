import { Select } from '../../Select';
import { ESPECIALIDADES, DENTISTAS, PACIENTES } from '../../../data/agenda';
import * as S from './styles';

const comOpcaoTodos = (opcoes) => [
  { value: '', label: 'Todos' },
  ...opcoes,
];

export function FiltrosSidebar({ filtros, onChangeFiltro, onNovoAgendamento }) {
  const handleChange = (campo) => (evento) =>
    onChangeFiltro(campo, evento.target.value);

  return (
    <S.Card aria-label="Filtros da agenda">
      <S.Titulo>Filtros</S.Titulo>

      <Select
        label="Especialidades:"
        options={comOpcaoTodos(ESPECIALIDADES)}
        value={filtros.especialidade}
        onChange={handleChange('especialidade')}
        aria-label="Filtrar por especialidade"
      />

      <Select
        label="Dentista:"
        options={comOpcaoTodos(DENTISTAS)}
        value={filtros.dentista}
        onChange={handleChange('dentista')}
        aria-label="Filtrar por dentista"
      />

      <Select
        label="Pacientes:"
        options={comOpcaoTodos(PACIENTES)}
        value={filtros.paciente}
        onChange={handleChange('paciente')}
        aria-label="Filtrar por paciente"
      />

      <S.BotaoNovo type="button" onClick={onNovoAgendamento}>
        <span aria-hidden="true">+</span> Novo Agendamento
      </S.BotaoNovo>
    </S.Card>
  );
}

export default FiltrosSidebar;
