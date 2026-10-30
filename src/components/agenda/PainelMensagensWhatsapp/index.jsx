import { useEffect, useState, useCallback } from 'react';
import {
  listarNotificacoes,
  marcarComoDisparado,
  processarNotificacoesD1,
} from '../../../services/notificacaoService';
import { hojeISO, adicionarDias, deISO } from '../../../utils/datas';
import styles from './styles.module.css';

function IconeWhatsApp() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 6.9C9.34 6.9 9.02 6.97 8.76 7.26C8.5 7.55 7.76 8.24 7.76 9.66C7.76 11.08 8.8 12.44 8.94 12.63C9.09 12.83 10.97 15.72 13.85 16.96C14.53 17.26 15.07 17.44 15.48 17.57C16.17 17.79 16.8 17.76 17.3 17.68C17.85 17.6 18.99 16.99 19.23 16.32C19.47 15.65 19.47 15.07 19.4 14.95C19.33 14.83 19.14 14.77 18.85 14.62C18.57 14.48 17.18 13.8 16.92 13.7C16.67 13.61 16.48 13.56 16.3 13.85C16.11 14.14 15.58 14.77 15.42 14.95C15.26 15.14 15.1 15.17 14.82 15.02C14.53 14.88 13.62 14.58 12.54 13.62C11.7 12.87 11.13 11.95 10.97 11.67C10.81 11.39 10.95 11.23 11.1 11.09C11.23 10.96 11.39 10.75 11.53 10.58C11.67 10.42 11.72 10.3 11.81 10.11C11.91 9.92 11.86 9.76 11.79 9.62C11.72 9.48 11.14 8.07 10.9 7.5C10.68 6.94 10.44 7.02 10.27 7.01C10.11 7 9.92 7 9.73 7L9.53 6.9Z" />
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

function IconeCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconeAlerta() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function PainelMensagensWhatsapp() {
  const dataAmanha = adicionarDias(hojeISO(), 1);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoD1, setProcessandoD1] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  const carregarNotificacoes = useCallback(() => {
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
      const resultado = await processarNotificacoesD1();
      setMensagemAviso(
        resultado.totalEnfileiradas > 0
          ? `${resultado.totalEnfileiradas} lembrete(s) enfileirado(s) com sucesso!`
          : 'Nenhuma consulta pendente para enfileirar amanhã.',
      );
      setTimeout(() => setMensagemAviso(''), 4000);
      await carregarNotificacoes();
    } catch (err) {
      setMensagemAviso(err.message || 'Erro ao gerar lembretes de amanhã.');
      setTimeout(() => setMensagemAviso(''), 4000);
    } finally {
      setProcessandoD1(false);
    }
  };

  const handleDispararWhatsApp = async (notificacao) => {
    if (!notificacao.linkWhatsApp) return;

    window.open(notificacao.linkWhatsApp, '_blank', 'noopener,noreferrer');

    try {
      await marcarComoDisparado(notificacao.idNotificacao);
      setNotificacoes((lista) =>
        lista.map((item) =>
          item.idNotificacao === notificacao.idNotificacao
            ? { ...item, status: 'DISPARADO', disparadoEm: new Date().toISOString() }
            : item,
        ),
      );
    } catch {
      // Abre a janela mesmo se a auditoria falhar temporariamente
    }
  };

  const notificacoesFiltradas = notificacoes.filter((item) => {
    if (filtroStatus === 'TODOS') return true;
    return item.status === filtroStatus;
  });

  const formatarDataCabecalho = (iso) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
      }).format(deISO(iso)).toUpperCase();
    } catch {
      return iso;
    }
  };

  return (
    <section className={styles.card} aria-label="Mensagens e Lembretes WhatsApp">
      <div className={styles.cabecalho}>
        <div className={styles.titulos}>
          <div className={styles.tituloLinha}>
            <span className={styles.iconeHeader}>
              <IconeWhatsApp />
            </span>
            <h2>Lembretes WhatsApp</h2>
          </div>
          <p>Consultas de Amanhã: {formatarDataCabecalho(dataAmanha)}</p>
        </div>

        <div className={styles.acoesHeader}>
          <button
            type="button"
            className={styles.botaoProcessar}
            onClick={handleProcessarD1}
            disabled={processandoD1}
            title="Prepara e atualiza a lista de lembretes para as consultas de amanhã"
          >
            <IconePlay />
            {processandoD1 ? 'Atualizando...' : 'Gerar Lembretes'}
          </button>

          <select
            className={styles.seletorFiltro}
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="TODOS">Todos ({notificacoes.length})</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="DISPARADO">Disparados</option>
            <option value="FALHA_CONTATO_INVALIDO">Falhas</option>
          </select>
        </div>
      </div>

      {mensagemAviso && (
        <div className={styles.bannerAviso} role="status">
          {mensagemAviso}
        </div>
      )}

      {carregando ? (
        <p className={styles.vazio}>Carregando lembretes de amanhã...</p>
      ) : notificacoesFiltradas.length === 0 ? (
        <div className={styles.vazioBox}>
          <p className={styles.vazio}>
            {notificacoes.length === 0
              ? 'Nenhum lembrete preparado para amanhã. Clique em "Gerar Lembretes" para carregar as mensagens.'
              : 'Nenhum lembrete com o filtro selecionado.'}
          </p>
        </div>
      ) : (
        <ul className={styles.lista}>
          {notificacoesFiltradas.map((notificacao) => {
            const isPendente = notificacao.status === 'PENDENTE';
            const isDisparado = notificacao.status === 'DISPARADO';
            const isFalha = notificacao.status === 'FALHA_CONTATO_INVALIDO';

            return (
              <li key={notificacao.idNotificacao} className={styles.itemNotificacao}>
                <div className={styles.itemHorario}>
                  <span className={styles.horario}>
                    {notificacao.horarioConsulta ? String(notificacao.horarioConsulta).slice(0, 5) : '--:--'}
                  </span>
                  {notificacao.consultaConfirmada ? (
                    <span className={styles.tagConfirmada} title="Consulta confirmada pelo paciente">
                      <IconeCheck /> Confirmada
                    </span>
                  ) : (
                    <span className={styles.tagAguardando}>Aguardando</span>
                  )}
                </div>

                <div className={styles.itemCorpo}>
                  <div className={styles.linhaPaciente}>
                    <strong className={styles.nomePaciente}>
                      {notificacao.nomePaciente || 'Paciente'}
                    </strong>
                    {notificacao.grauParentesco && (
                      <span className={styles.grauBadge}>
                        Resp: {notificacao.nomeDestinatario} ({notificacao.grauParentesco})
                      </span>
                    )}
                  </div>

                  <div className={styles.linhaInfo}>
                    <span className={styles.telefone}>
                      {notificacao.telefoneFormatado || 'Telefone não informado'}
                    </span>
                    <span className={styles.separador}>•</span>
                    <span className={styles.dentista}>
                      {notificacao.dentista ? `Dr(a). ${notificacao.dentista}` : 'Dentista'}
                    </span>
                  </div>

                  {isFalha && (
                    <div className={styles.motivoFalhaBox}>
                      <IconeAlerta />
                      <span>{notificacao.motivoFalha || 'Contato incompatível com WhatsApp'}</span>
                    </div>
                  )}
                </div>

                <div className={styles.itemAcoes}>
                  {isPendente && notificacao.linkWhatsApp && (
                    <button
                      type="button"
                      className={styles.botaoWhatsApp}
                      onClick={() => handleDispararWhatsApp(notificacao)}
                      title="Abrir mensagem no WhatsApp Web e marcar como disparado"
                    >
                      <IconeWhatsApp />
                      <span>Enviar</span>
                    </button>
                  )}

                  {isDisparado && (
                    <button
                      type="button"
                      className={styles.botaoReenviar}
                      onClick={() => handleDispararWhatsApp(notificacao)}
                      title="Reabrir mensagem no WhatsApp Web"
                    >
                      <IconeWhatsApp />
                      <span>Reenviar</span>
                    </button>
                  )}

                  {isFalha && (
                    <span className={styles.badgeFalha} title="Número fixo ou incompleto">
                      Contato Inválido
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default PainelMensagensWhatsapp;
