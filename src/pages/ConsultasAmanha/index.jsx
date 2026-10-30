import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listarNotificacoes,
  marcarComoDisparado,
  processarNotificacoesD1,
} from '../../services/notificacaoService';
import { hojeISO, adicionarDias, deISO } from '../../utils/datas';
import styles from './styles.module.css';

function IconeVoltar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconeCalendario() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconeDentista() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconeConversa() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 21l2-4.9a8.4 8.4 0 0 1-1-4.1 8.4 8.4 0 0 1 8.5-8.4A8.4 8.4 0 0 1 21 11.5z" />
    </svg>
  );
}

function IconePlay() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconeVazio() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

const formatarDataLonga = (iso) => {
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(deISO(iso));

  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export default function ConsultasAmanhaPage() {
  const navigate = useNavigate();
  const dataAmanha = adicionarDias(hojeISO(), 1);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoD1, setProcessandoD1] = useState(false);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    return listarNotificacoes(dataAmanha)
      .then((dados) => {
        setNotificacoes(Array.isArray(dados) ? dados : []);
      })
      .catch(() => {
        setNotificacoes([]);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [dataAmanha]);

  useEffect(() => {
    let ativo = true;
    listarNotificacoes(dataAmanha)
      .then((dados) => {
        if (ativo) {
          setNotificacoes(Array.isArray(dados) ? dados : []);
          setCarregando(false);
        }
      })
      .catch(() => {
        if (ativo) {
          setNotificacoes([]);
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [dataAmanha]);

  const handleProcessarD1 = async () => {
    try {
      setProcessandoD1(true);
      const res = await processarNotificacoesD1();
      setAviso(
        res.totalEnfileiradas > 0
          ? `${res.totalEnfileiradas} consulta(s) enfileirada(s) no RabbitMQ!`
          : 'Nenhuma nova consulta elegível para enfileirar amanhã.',
      );
      setTimeout(() => setAviso(''), 4000);
      await carregar();
    } catch (err) {
      setAviso(err.message || 'Erro ao processar D-1.');
      setTimeout(() => setAviso(''), 4000);
    } finally {
      setProcessandoD1(false);
    }
  };

  const handleDisparar = async (notificacao) => {
    if (!notificacao.linkWhatsApp) return;

    window.open(notificacao.linkWhatsApp, '_blank', 'noopener,noreferrer');

    try {
      await marcarComoDisparado(notificacao.idNotificacao);
      setNotificacoes((lista) =>
        lista.map((n) =>
          n.idNotificacao === notificacao.idNotificacao
            ? { ...n, status: 'DISPARADO', disparadoEm: new Date().toISOString() }
            : n,
        ),
      );
    } catch {
      // Ignora erro de auditoria mantendo a janela aberta
    }
  };

  return (
    <div className={styles.page}>
      <button
        className={styles.voltar}
        type="button"
        onClick={() => navigate('/agenda')}
      >
        <IconeVoltar />
        Voltar para agenda
      </button>

      <div className={styles.cabecalho}>
        <div className={styles.titulos}>
          <div className={styles.iconeTitulo}>
            <IconeCalendario />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Consultas de Amanhã</h1>
            <p className={styles.subtitulo}>{formatarDataLonga(dataAmanha)}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className={styles.botaoProcessar}
            onClick={handleProcessarD1}
            disabled={processandoD1}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f6f0e8',
              color: '#7b5900',
              border: '1px solid #e5dfd5',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <IconePlay />
            {processandoD1 ? 'Processando...' : 'Processar Fila D-1'}
          </button>

          <span className={styles.contador}>
            {notificacoes.length} consulta
            {notificacoes.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {aviso && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '16px',
          }}
          role="status"
        >
          {aviso}
        </div>
      )}

      <div className={styles.container}>
        {carregando ? (
          <p className={styles.estado}>Carregando lembretes de amanhã...</p>
        ) : notificacoes.length === 0 ? (
          <div className={styles.vazio}>
            <span className={styles.vazioIcone}>
              <IconeVazio />
            </span>
            <h2>Nenhuma notificação para amanhã</h2>
            <p>
              Clique em &quot;Processar Fila D-1&quot; acima para varrer as consultas elegíveis
              e preparar os lembretes no RabbitMQ.
            </p>
            <button
              className={styles.botaoVoltar}
              type="button"
              onClick={() => navigate('/agenda')}
            >
              Voltar para a agenda
            </button>
          </div>
        ) : (
          <div className={styles.grade}>
            {notificacoes.map((item) => {
              const isDisparado = item.status === 'DISPARADO';
              const isFalha = item.status === 'FALHA_CONTATO_INVALIDO';

              return (
                <article className={styles.card} key={item.idNotificacao}>
                  <div className={styles.cardTopo}>
                    <span className={styles.horario}>
                      {item.horarioConsulta ? String(item.horarioConsulta).slice(0, 5) : '--:--'}
                    </span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {item.consultaConfirmada && (
                        <span
                          style={{
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '6px',
                          }}
                        >
                          Confirmada
                        </span>
                      )}
                      <span
                        className={`${styles.status} ${
                          isDisparado
                            ? styles.statusConfirmado
                            : isFalha
                            ? styles.statusCancelado
                            : styles.statusPendente
                        }`}
                      >
                        {isDisparado ? 'Disparado' : isFalha ? 'Contato Inválido' : 'Pendente'}
                      </span>
                    </div>
                  </div>

                  <div className={styles.paciente}>
                    <h2>{item.nomePaciente || 'Paciente'}</h2>
                    {item.grauParentesco ? (
                      <span className={styles.especialidade}>
                        Destinatário: {item.nomeDestinatario} ({item.grauParentesco})
                      </span>
                    ) : (
                      <span className={styles.especialidade}>
                        {item.telefoneFormatado || 'Telefone não informado'}
                      </span>
                    )}
                  </div>

                  <p className={styles.dentista}>
                    <IconeDentista />
                    {item.dentista ? `Dr(a). ${item.dentista}` : 'Dentista'}
                  </p>

                  <hr className={styles.divisor} />

                  <button
                    className={styles.botaoMensagem}
                    type="button"
                    onClick={() => handleDisparar(item)}
                    disabled={isFalha || !item.linkWhatsApp}
                    style={{
                      opacity: isFalha || !item.linkWhatsApp ? 0.5 : 1,
                      cursor: isFalha || !item.linkWhatsApp ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <IconeConversa />
                    {isDisparado
                      ? 'Reenviar no WhatsApp'
                      : isFalha
                      ? 'Contato Inválido'
                      : 'Encaminhar Mensagem'}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
