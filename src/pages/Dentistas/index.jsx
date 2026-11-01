import { useMemo, useState } from 'react';
import DoctorList from '../../components/DoctorList';
import { DentistaPerfilMobile } from '../../components/DentistaPerfilMobile';
import { ModalEditarDentista } from '../../components/ModalEditarDentista';
import { useConsultas } from '../../context/ConsultasContexto';
import { useDoctor } from '../../hooks/useDoctor';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { updateDoctor } from '../../services/doctorService';
import { hojeISO } from '../../utils/datas';
import { getDentistaLogado } from '../../utils/sessao';

const DENTISTA_FALLBACK = {
  nome: 'Dr. Fernando Henrique Costa',
  cro: 'CRO-SP 123456',
  especialidade: 'Clínica Geral',
};

export function DentistasPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dentistaSessao = getDentistaLogado();
  const perfilDentista = Boolean(dentistaSessao);
  const dentistaId = dentistaSessao?.id ?? null;

  const { dentist: dentistaApi, reload } = useDoctor(
    isMobile && perfilDentista ? dentistaId : null,
  );
  const { consultas } = useConsultas();
  const [editando, setEditando] = useState(false);

  const dentista = useMemo(() => {
    const base = dentistaApi || dentistaSessao || DENTISTA_FALLBACK;
    const id = base.id ?? dentistaSessao?.id ?? null;
    const nome = base.nome || DENTISTA_FALLBACK.nome;

    const pertenceAoDentista = (consulta) =>
      (id && String(consulta.dentistaId) === String(id)) ||
      (nome && consulta.dentistaNome === nome);

    const consultasHoje = consultas.filter(
      (consulta) =>
        consulta.data === hojeISO() &&
        consulta.statusApi !== 'CANCELADA' &&
        pertenceAoDentista(consulta),
    ).length;

    const pacientes = new Set(
      consultas
        .filter(pertenceAoDentista)
        .map((consulta) => consulta.pacienteId ?? consulta.pacienteNome)
        .filter(Boolean),
    );

    return {
      ...base,
      id,
      nome,
      especialidade: base.especialidade || DENTISTA_FALLBACK.especialidade,
      consultasHoje,
      pacientesVinculados: pacientes.size,
    };
  }, [consultas, dentistaApi, dentistaSessao]);

  if (!isMobile || !perfilDentista) {
    return <DoctorList />;
  }

  const salvarEdicao = async (dados) => {
    try {
      if (dentista.id) {
        await updateDoctor(dentista.id, dados);
        reload();
      }
    } catch (error) {
      console.error('Erro ao salvar dentista:', error);
      alert(error.message || 'Erro ao atualizar dados do dentista');
    } finally {
      setEditando(false);
    }
  };

  return (
    <>
      <DentistaPerfilMobile
        dentista={dentista}
        onEditar={() => setEditando(true)}
        mostrarVoltar={false}
      />
      {editando && (
        <ModalEditarDentista
          dentist={dentista}
          onCancelar={() => setEditando(false)}
          onSalvar={salvarEdicao}
        />
      )}
    </>
  );
}

export default DentistasPage;
