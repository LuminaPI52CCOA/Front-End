export const aplicarFiltros = (consultas, filtros) =>
  (consultas || []).filter((consulta) => {
    if (filtros.especialidade) {
      const bateNome = consulta.especialidade === filtros.especialidade;
      const bateId =
        consulta.especialidadeId != null &&
        String(consulta.especialidadeId) === String(filtros.especialidade);
      if (!bateNome && !bateId) {
        return false;
      }
    }
    if (filtros.dentista) {
      const bateNome = consulta.dentista === filtros.dentista;
      const bateId =
        consulta.dentistaId != null &&
        String(consulta.dentistaId) === String(filtros.dentista);
      if (!bateNome && !bateId) {
        return false;
      }
    }
    if (
      filtros.paciente &&
      String(consulta.pacienteId) !== String(filtros.paciente)
    ) {
      return false;
    }
    return true;
  });
