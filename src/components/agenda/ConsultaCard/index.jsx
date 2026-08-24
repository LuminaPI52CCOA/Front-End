import * as S from './styles';

export function ConsultaCard({ agendamento, top, height, onClick }) {
  const { inicio, fim, paciente, especialidade, status } = agendamento;
  const cancelado = status === 'Cancelado';

  return (
    <S.Card
      $cancelado={cancelado}
      $confirmado={status === 'Confirmado'}
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Consulta de ${paciente}, ${especialidade}, das ${inicio} às ${fim}, ${status}`}
    >
      <S.LinhaPrincipal>
        <S.NomePaciente $cancelado={cancelado}>{paciente}</S.NomePaciente>
        <S.Horario>
          {inicio} – {fim}
        </S.Horario>
      </S.LinhaPrincipal>

      <S.LinhaSecundaria>
        <S.Especialidade $cor={especialidade}>{especialidade}</S.Especialidade>
        <S.Status $status={status}>
          {status === 'Confirmado' && (
            <span aria-hidden="true">✓</span>
          )}
          {status}
        </S.Status>
      </S.LinhaSecundaria>
    </S.Card>
  );
}

export default ConsultaCard;
