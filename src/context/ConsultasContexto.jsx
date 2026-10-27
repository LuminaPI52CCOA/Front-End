import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  alterarStatusConsulta,
  cancelarConsulta as cancelarConsultaApi,
  criarConsulta as criarConsultaApi,
  listConsultas,
  reagendarConsulta as reagendarConsultaApi,
} from '../services/consultaService';

const ConsultasContexto = createContext(null);

export function ConsultasProvider({ children }) {
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [periodo, setPeriodo] = useState({ dataInicio: null, dataFim: null });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    listConsultas(periodo)
      .then((dados) => {
        if (!cancelado) {
          if (Array.isArray(dados)) {
            setConsultas(dados);
          }
          setErro(null);
          setCarregando(false);
        }
      })
      .catch((err) => {
        if (!cancelado) {
          console.warn('Erro ao carregar consultas no contexto:', err);
          setErro(err);
          setCarregando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [periodo, tentativa]);

  const carregarPeriodo = useCallback((dataInicio, dataFim) => {
    setPeriodo((atual) => {
      if (atual.dataInicio === dataInicio && atual.dataFim === dataFim) {
        return atual;
      }
      setCarregando(true);
      return { dataInicio, dataFim };
    });
  }, []);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setTentativa((v) => v + 1);
  }, []);

  const criar = useCallback(async (dados) => {
    const criada = await criarConsultaApi(dados);
    setConsultas((atual) => [...atual, criada]);
    return criada;
  }, []);

  const reagendar = useCallback(async (id, dados) => {
    const atualizada = await reagendarConsultaApi(id, dados);
    setConsultas((atual) =>
      atual.map((c) => (String(c.id) === String(id) ? atualizada : c)),
    );
    return atualizada;
  }, []);

  const mudarStatus = useCallback(async (id, novoStatus) => {
    const atualizada = await alterarStatusConsulta(id, novoStatus);
    setConsultas((atual) =>
      atual.map((c) => (String(c.id) === String(id) ? atualizada : c)),
    );
    return atualizada;
  }, []);

  const cancelar = useCallback(async (id) => {
    await cancelarConsultaApi(id);
    setConsultas((atual) =>
      atual.map((c) =>
        String(c.id) === String(id)
          ? { ...c, status: 'Cancelado', statusApi: 'CANCELADA' }
          : c,
      ),
    );
    return true;
  }, []);

  const valor = useMemo(
    () => ({
      consultas,
      carregando,
      erro,
      recarregar,
      carregarPeriodo,
      criar,
      reagendar,
      mudarStatus,
      cancelar,
      adicionarConsulta: criar,
      atualizarConsulta: async (id, mudancas) => {
        if (mudancas.status && Object.keys(mudancas).length === 1) {
          return mudarStatus(id, mudancas.status);
        }
        return reagendar(id, {
          data: mudancas.data,
          horarioInicio: mudancas.horarioInicio ?? mudancas.inicio,
          horarioFim: mudancas.horarioFim ?? mudancas.fim,
          observacoes: mudancas.observacoes,
        });
      },
      removerConsulta: cancelar,
    }),
    [consultas, carregando, erro, recarregar, carregarPeriodo, criar, reagendar, mudarStatus, cancelar],
  );

  return (
    <ConsultasContexto.Provider value={valor}>
      {children}
    </ConsultasContexto.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useConsultas = () => useContext(ConsultasContexto);
