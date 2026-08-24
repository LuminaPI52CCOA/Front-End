import { CORES_ESPECIALIDADES } from '../../../data/agenda';
import * as S from './styles';

const CORES_TEXTO_ETIQUETA = {
  Endodontia: '#8a6d14',
  Limpeza: '#2f6cab',
  Periodontia: '#3d3428',
  Odontopediatria: '#b0568b',
};

export function ConsultaItem({ consulta }) {
  const { inicio, paciente, dentista, especialidade, status } = consulta;
  const cores = CORES_ESPECIALIDADES[especialidade];

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
        $fundo={cores?.fundo}
        $texto={CORES_TEXTO_ETIQUETA[especialidade]}
        aria-label={`Especialidade: ${especialidade}`}
      >
        {especialidade}
      </S.EtiquetaEspecialidade>

      <S.EtiquetaStatus $status={status}>{status}</S.EtiquetaStatus>
    </S.Item>
  );
}

export default ConsultaItem;
