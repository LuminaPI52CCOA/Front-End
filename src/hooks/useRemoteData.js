import { useCallback, useEffect, useState } from 'react';

export function useRemoteData(loader) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    loader()
      .then((data) => {
        if (!cancelado) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (!cancelado) setState({ data: null, error, loading: false });
      });

    return () => {
      cancelado = true;
    };
  }, [loader, tentativa]);

  const reload = useCallback(() => {
    setState((atual) => ({ ...atual, error: null, loading: true }));
    setTentativa((valor) => valor + 1);
  }, []);

  return { ...state, reload };
}
