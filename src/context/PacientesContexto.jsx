import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { PACIENTES } from '../data/pacientes';

const PacientesContexto = createContext(null);

export function PacientesProvider({ children }) {
  const [pacientes, setPacientes] = useState(PACIENTES);

  const atualizarPaciente = useCallback((id, mudancas) => {
    setPacientes((atual) =>
      atual.map((paciente) =>
        String(paciente.id) === String(id)
          ? {
              ...paciente,
              ...mudancas,
              contato: { ...paciente.contato, ...(mudancas.contato ?? {}) },
            }
          : paciente,
      ),
    );
  }, []);

  const buscarPorId = useCallback(
    (id) => pacientes.find((paciente) => String(paciente.id) === String(id)) ?? null,
    [pacientes],
  );

  const valor = useMemo(
    () => ({ pacientes, atualizarPaciente, buscarPorId }),
    [pacientes, atualizarPaciente, buscarPorId],
  );

  return (
    <PacientesContexto.Provider value={valor}>
      {children}
    </PacientesContexto.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePacientes = () => useContext(PacientesContexto);
