export const aplicarFiltros = (consultas, filtros) =>
  consultas.filter((consulta) => {
    if (filtros.especialidade && consulta.especialidade !== filtros.especialidade) {
      return false;
    }
    if (filtros.dentista && consulta.dentista !== filtros.dentista) {
      return false;
    }
    if (
      filtros.paciente &&
      String(consulta.pacienteId) !== String(filtros.paciente)
    ) {
      return false;
    }
    return true;
  });
