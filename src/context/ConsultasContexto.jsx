import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { consultaService, STATUS_ROTULO_PARA_API } from '../services/consultaService';

const obterIdUsuarioLogado = () => {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null')?.userId ?? null;
  } catch {
    return null;
  }
};

const ConsultasContexto = createContext(null);

export function ConsultasProvider({ children }) {
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const periodoRef = useRef(null);
  const requisicaoRef = useRef(0);

  // ADMIN/RECEPCIONISTA leem a agenda geral; DENTISTA recebe 403 nela e lê a própria agenda.
  const buscarPeriodo = useCallback(async (periodo) => {
    try {
      return await consultaService.listar(periodo);
    } catch (erroListagem) {
      const idUsuario = obterIdUsuarioLogado();
      if (erroListagem.status !== 403 || !idUsuario) throw erroListagem;
      return consultaService.listarDoDentista(idUsuario, periodo);
    }
  }, []);

  const carregarPeriodo = useCallback(
    async (dataInicio, dataFim) => {
      const periodo = { dataInicio, dataFim };
      periodoRef.current = periodo;
      const requisicao = ++requisicaoRef.current;
      setCarregando(true);
      setErro('');
      try {
        const lista = await buscarPeriodo(periodo);
        if (requisicao === requisicaoRef.current) setConsultas(lista);
      } catch (erroCarga) {
        if (requisicao === requisicaoRef.current) {
          setConsultas([]);
          setErro(erroCarga.message);
        }
      } finally {
        if (requisicao === requisicaoRef.current) setCarregando(false);
      }
    },
    [buscarPeriodo],
  );

  const recarregar = useCallback(() => {
    const periodo = periodoRef.current;
    return periodo ? carregarPeriodo(periodo.dataInicio, periodo.dataFim) : Promise.resolve();
  }, [carregarPeriodo]);

  const substituirConsulta = useCallback((atualizada) => {
    setConsultas((atual) =>
      atual.some((consulta) => consulta.id === atualizada.id)
        ? atual.map((consulta) => (consulta.id === atualizada.id ? atualizada : consulta))
        : [...atual, atualizada],
    );
  }, []);

  const valor = useMemo(
    () => ({
      consultas,
      carregando,
      erro,
      carregarPeriodo,
      recarregar,
      adicionarConsulta: async (dados) => {
        const nova = await consultaService.cadastrar(dados);
        substituirConsulta(nova);
        return nova;
      },
      reagendarConsulta: async (id, dados) => {
        const atualizada = await consultaService.reagendar(id, dados);
        substituirConsulta(atualizada);
        return atualizada;
      },
      alterarStatusConsulta: async (id, statusRotulo) => {
        const statusApi = STATUS_ROTULO_PARA_API[statusRotulo] ?? statusRotulo;
        const atualizada = await consultaService.alterarStatus(id, statusApi);
        substituirConsulta(atualizada);
        return atualizada;
      },
      cancelarConsulta: async (id) => {
        await consultaService.cancelar(id);
        setConsultas((atual) =>
          atual.map((consulta) =>
            consulta.id === id
              ? { ...consulta, status: 'Cancelado', statusApi: 'CANCELADA' }
              : consulta,
          ),
        );
      },
    }),
    [consultas, carregando, erro, carregarPeriodo, recarregar, substituirConsulta],
  );

  return (
    <ConsultasContexto.Provider value={valor}>
      {children}
    </ConsultasContexto.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useConsultas = () => useContext(ConsultasContexto);
