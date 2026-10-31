import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmarConsultaPublica } from '../../services/notificacaoService';
import logoLumina from '../../assets/logo.png';
import styles from './styles.module.css';

function IconeSucesso() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconeAviso() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconeErro() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function formatarDataBrasileira(dataIso) {
  if (!dataIso) return '';
  const partes = dataIso.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataIso;
}

export default function ConfirmarConsultaPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [estado, setEstado] = useState(() => ({
    carregando: Boolean(token),
    sucesso: false,
    dados: null,
    erro: token ? null : 'Token de confirmação não informado ou inválido.',
  }));

  useEffect(() => {
    if (!token) return;

    let cancelado = false;

    confirmarConsultaPublica(token)
      .then((resposta) => {
        if (!cancelado) {
          setEstado({
            carregando: false,
            sucesso: true,
            dados: resposta,
            erro: null,
          });
        }
      })
      .catch((err) => {
        if (!cancelado) {
          setEstado({
            carregando: false,
            sucesso: false,
            dados: null,
            erro: err.message || 'Não foi possível confirmar sua consulta.',
          });
        }
      });

    return () => {
      cancelado = true;
    };
  }, [token]);

  return (
    <div className={styles.pagina}>
      <div className={styles.card}>
        <img src={logoLumina} alt="Lumina Odontologia" className={styles.logo} />
        <h1 className={styles.marca}>Lumina Odontologia</h1>

        {estado.carregando && (
          <div className={styles.carregando}>
            <div className={styles.spinner} />
            <p>Processando sua confirmação...</p>
          </div>
        )}

        {!estado.carregando && estado.sucesso && estado.dados && (
          <div className={styles.resultado}>
            <div className={styles.iconeResultado}>
              <IconeSucesso />
            </div>
            <h2 className={styles.tituloSucesso}>Presença Confirmada!</h2>
            <p className={styles.mensagemSucesso}>{estado.dados.mensagem}</p>

            <div className={styles.detalhesBox}>
              <div className={styles.itemDetalhe}>
                <span className={styles.rotulo}>Paciente:</span>
                <strong>{estado.dados.paciente || 'Não informado'}</strong>
              </div>
              {estado.dados.dentista && (
                <div className={styles.itemDetalhe}>
                  <span className={styles.rotulo}>Dentista:</span>
                  <strong>{estado.dados.dentista}</strong>
                </div>
              )}
              <div className={styles.itemDetalhe}>
                <span className={styles.rotulo}>Data:</span>
                <strong>{formatarDataBrasileira(estado.dados.data)}</strong>
              </div>
              <div className={styles.itemDetalhe}>
                <span className={styles.rotulo}>Horário:</span>
                <strong>{estado.dados.horario}</strong>
              </div>
            </div>

            <p className={styles.rodapeAgradecimento}>
              Agradecemos a sua confirmação. Estamos ansiosos para recebê-lo(a)!
            </p>
          </div>
        )}

        {!estado.carregando && !estado.sucesso && (
          <div className={styles.resultado}>
            <div className={styles.iconeResultado}>
              {estado.erro && estado.erro.toLowerCase().includes('expirado') ? (
                <IconeAviso />
              ) : (
                <IconeErro />
              )}
            </div>
            <h2 className={styles.tituloErro}>Não foi possível confirmar</h2>
            <p className={styles.mensagemErro}>{estado.erro}</p>

            <div className={styles.avisoSuporte}>
              <p>
                Caso precise reagendar ou verificar o status do seu agendamento,
                por favor entre em contato conosco por telefone ou WhatsApp da clínica.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
