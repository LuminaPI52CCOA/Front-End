import { useEffect, useMemo, useState } from 'react';
import { ListStatus } from '../ListStatus';
import { useAnamneses } from '../../hooks/useAnamneses';
import {
  PERGUNTAS_ANAMNESE,
  criarAnamnese,
  extrairAlertasClinicos,
} from '../../services/anamneseService';
import { AnamneseForm } from './index';
import { AnamneseOcrModal } from './AnamneseOcrModal';
import styles from './AnamnesePanel.module.css';

function formatarDataFicha(dataIso) {
  if (!dataIso) return 'Data não informada';
  const partes = String(dataIso).split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataIso;
}

export function AnamnesePanel({ clienteId }) {
  const { anamneses, fichaMaisRecente, loading, error, reload } = useAnamneses(clienteId);
  const [modo, setModo] = useState('historico'); // 'historico' | 'formulario'
  const [fichaIdSelecionada, setFichaIdSelecionada] = useState(null);
  const [fichaRecemCriada, setFichaRecemCriada] = useState(null);
  const [modalOcrAberto, setModalOcrAberto] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    if (!mensagemSucesso) return undefined;
    const timer = setTimeout(() => setMensagemSucesso(''), 5000);
    return () => clearTimeout(timer);
  }, [mensagemSucesso]);

  const listaFichas = useMemo(() => {
    if (!fichaRecemCriada) return anamneses;
    const jaExiste = anamneses.some(
      (item) => Number(item.idAnamnese) === Number(fichaRecemCriada.idAnamnese),
    );
    return jaExiste ? anamneses : [fichaRecemCriada, ...anamneses];
  }, [anamneses, fichaRecemCriada]);

  const fichaSelecionada = useMemo(() => {
    if (listaFichas.length === 0) return null;
    if (fichaIdSelecionada != null) {
      const encontrada = listaFichas.find(
        (item) => Number(item.idAnamnese) === Number(fichaIdSelecionada),
      );
      if (encontrada) return encontrada;
    }
    return listaFichas[0] ?? fichaMaisRecente;
  }, [listaFichas, fichaIdSelecionada, fichaMaisRecente]);

  const alertasFichaSelecionada = useMemo(
    () => (fichaSelecionada ? extrairAlertasClinicos(fichaSelecionada) : []),
    [fichaSelecionada],
  );

  const handleSalvarManual = async (dadosFormulario) => {
    const novaFicha = await criarAnamnese(clienteId, dadosFormulario);
    if (novaFicha) {
      setFichaRecemCriada(novaFicha);
      setFichaIdSelecionada(novaFicha.idAnamnese);
    }
    reload();
    setModo('historico');
    setMensagemSucesso('Anamnese registrada com sucesso.');
    return true;
  };

  const handleSucessoOcr = (novaFicha) => {
    setModalOcrAberto(false);
    if (novaFicha) {
      setFichaRecemCriada(novaFicha);
      setFichaIdSelecionada(novaFicha.idAnamnese);
    }
    reload();
    setModo('historico');
    setMensagemSucesso('Anamnese digitalizada via OCR + IA e registrada com sucesso.');
  };

  if (loading && listaFichas.length === 0) {
    return <ListStatus loading={loading} error={null} onRetry={reload} />;
  }

  if (error && listaFichas.length === 0) {
    return (
      <ListStatus
        loading={false}
        error={error}
        onRetry={reload}
        forbiddenMessage="Você não tem permissão para acessar a anamnese deste paciente."
      />
    );
  }

  const exibirFormulario = modo === 'formulario' || listaFichas.length === 0;

  return (
    <div className={styles.wrapper}>
      {mensagemSucesso && (
        <div className={styles.bannerSucesso} role="status">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {exibirFormulario ? (
        <AnamneseForm
          dadosIniciais={null}
          onSubmit={handleSalvarManual}
          onOpenOcr={() => setModalOcrAberto(true)}
          onCancel={listaFichas.length > 0 ? () => setModo('historico') : null}
        />
      ) : (
        <section className={styles.painelHistorico}>
          {/* Card de Alertas Clínicos */}
          {alertasFichaSelecionada.length > 0 ? (
            <div className={styles.cardAlertas} role="region" aria-label="Alertas clínicos">
              <div className={styles.alertasTopo}>
                <span className={styles.iconeAlerta} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <path d="M12 9v4M12 17h.01" />
                  </svg>
                </span>
                <div>
                  <h4 className={styles.alertasTitulo}>
                    Alertas Clínicos ({alertasFichaSelecionada.length})
                  </h4>
                  <p className={styles.alertasSubtitulo}>
                    Condições de atenção identificadas na ficha selecionada
                  </p>
                </div>
              </div>

              <ul className={styles.listaAlertas}>
                {alertasFichaSelecionada.map((alerta) => (
                  <li key={alerta} className={styles.badgeAlerta}>
                    {alerta}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={styles.cardSemAlertas} role="status">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <span>Nenhum alerta médico crítico registrado nesta ficha de anamnese.</span>
            </div>
          )}

          {/* Barra de Controle e Histórico */}
          <header className={styles.headerHistorico}>
            <div>
              <h3 className={styles.titulo}>Histórico de Anamnese</h3>
              <p className={styles.subtitulo}>
                {listaFichas.length === 1
                  ? '1 ficha registrada para este paciente'
                  : `${listaFichas.length} fichas registradas para este paciente`}
              </p>
            </div>

            <div className={styles.controlesTopo}>
              <div className={styles.seletorBloco}>
                <label htmlFor="seletor-ficha-anamnese" className={styles.seletorRotulo}>
                  Ficha:
                </label>
                <select
                  id="seletor-ficha-anamnese"
                  className={styles.seletorFicha}
                  value={fichaSelecionada?.idAnamnese ?? ''}
                  onChange={(e) => setFichaIdSelecionada(Number(e.target.value))}
                >
                  {listaFichas.map((item, idx) => (
                    <option key={item.idAnamnese ?? idx} value={item.idAnamnese}>
                      {formatarDataFicha(item.dataAnamnese)}
                      {item.idAnamnese ? ` — Ficha #${item.idAnamnese}` : ''}
                      {idx === 0 ? ' (Mais recente)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className={styles.botaoOcr}
                onClick={() => setModalOcrAberto(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 16V4" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
                </svg>
                Enviar imagem
              </button>

              <button
                type="button"
                className={styles.botaoNova}
                onClick={() => {
                  setMensagemSucesso('');
                  setModo('formulario');
                }}
              >
                + Nova Anamnese
              </button>
            </div>
          </header>

          {/* Grade das 14 perguntas da ficha selecionada */}
          {fichaSelecionada && (
            <div className={styles.gridRespostas}>
              {PERGUNTAS_ANAMNESE.map((pergunta) => {
                const resposta = fichaSelecionada[pergunta.campo];
                const textoDetalhe = pergunta.detalhe
                  ? fichaSelecionada[pergunta.detalhe.campo]?.trim()
                  : '';
                const ehCritico =
                  pergunta.criticoQuando !== undefined && resposta === pergunta.criticoQuando;

                let rotuloResposta = 'Não informado';
                let classeBadge = styles.badgeNeutro;
                if (resposta === true) {
                  rotuloResposta = 'Sim';
                  classeBadge = ehCritico ? styles.badgeCritico : styles.badgeSim;
                } else if (resposta === false) {
                  rotuloResposta = 'Não';
                  classeBadge = ehCritico ? styles.badgeCritico : styles.badgeNao;
                }

                return (
                  <article
                    key={pergunta.campo}
                    className={`${styles.cardPergunta} ${
                      pergunta.larguraTotal ? styles.larguraTotal : ''
                    } ${ehCritico ? styles.cardPerguntaCritica : ''}`}
                  >
                    <header className={styles.perguntaTopo}>
                      <span className={styles.numero}>
                        {String(pergunta.numero).padStart(2, '0')}
                      </span>
                      <p className={styles.textoPergunta}>{pergunta.texto}</p>
                    </header>

                    <div className={styles.linhaResposta}>
                      <span className={`${styles.badgeResposta} ${classeBadge}`}>
                        {rotuloResposta}
                      </span>

                      {ehCritico && (
                        <span className={styles.tagAtencao}>Atenção clínica</span>
                      )}

                      {textoDetalhe && (
                        <p className={styles.detalheTexto}>
                          <strong>{pergunta.detalhe.rotulo}</strong> {textoDetalhe}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {modalOcrAberto && (
        <AnamneseOcrModal
          clienteId={clienteId}
          onClose={() => setModalOcrAberto(false)}
          onSuccess={handleSucessoOcr}
        />
      )}
    </div>
  );
}

export default AnamnesePanel;
