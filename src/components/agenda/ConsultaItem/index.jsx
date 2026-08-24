import { CORES_ESPECIALIDADES } from '../../../data/agenda';
import * as S from './styles';

export function ConsultaItem({ consulta }) {
  const { inicio, paciente, dentista, especialidade, status } = consulta;

  return (
    <S.Item>
      <S.Horario>{inicio}</S.Horario>

      <S.Informacoes>
        <S.NomePaciente $cancelado={status === 'Cancelado'}>
          {paciente}
        </S.NomePaciente>
        <S.NomeDentista>{dentista}</S.NomeDentista>
      </S.Informacoes>

      <S.EtiquetaEspecialidade
        $cor={CORES_ESPECIALIDADES[especialidade]}
        aria-label={`Especialidade: ${especialidade}`}
      >
        {especialidade}
      </S.EtiquetaEspecialidade>

      <S.EtiquetaStatus $status={status}>{status}</S.EtiquetaStatus>
    </S.Item>
  );
}

export default ConsultaItem;
