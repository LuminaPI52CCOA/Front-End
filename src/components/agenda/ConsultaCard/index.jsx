import { CORES_ESPECIALIDADES } from '../../../data/agenda';
import * as S from './styles';

export function ConsultaCard({ agendamento, onClick }) {
  const { paciente, dentista, especialidade, status } = agendamento;
  const cancelado = status === 'Cancelado';
  const corBorda =
    CORES_ESPECIALIDADES[especialidade]?.ponto || '#8C7A5E';

  return (
    <S.Card
      $cancelado={cancelado}
      $corBorda={corBorda}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Consulta de ${paciente} com ${dentista}, ${especialidade}, ${status}`}
    >
      <S.NomePaciente>{paciente}</S.NomePaciente>

      <S.Dentista>{dentista}</S.Dentista>

      <S.Especialidade $corPonto={corBorda}>{especialidade}</S.Especialidade>

      <S.Status $status={status}>
        {status === 'Confirmado' && <span aria-hidden="true">✓</span>}
        {status}
      </S.Status>
    </S.Card>
  );
}

export default ConsultaCard;
