import { useState } from 'react';
import styles from './styles.module.css';
import ListStatus from '../ListStatus';
import { AnamneseForm } from '../AnamneseForm';
import { AnamneseOcrModal } from '../AnamneseForm/AnamneseOcrModal';
import { useAnamneses } from '../../hooks/useAnamneses';
import { PERGUNTAS_ANAMNESE } from '../../services/anamneseService';

function formatarData(valor) {
  if (!valor) return 'Data não informada';
  const data = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleDateString('pt-BR');
}

function descreverAlteracoes(ficha) {
  const itens = [];

  PERGUNTAS_ANAMNESE.forEach((pergunta) => {
    const valor = ficha[pergunta.campo];
    if (valor !== true) return;
    const detalhe = pergunta.detalhe ? ficha[pergunta.detalhe.campo] : '';
    itens.push({
      campo: pergunta.campo,
      texto: pergunta.texto,
      detalhe: detalhe?.trim() || '',
    });
  });

  if (ficha.pressaoArterialNormal === false) {
    itens.push({
      campo: 'pressaoArterialNormal',
      texto: 'Pressão arterial não é normal',
      detalhe: ficha.pressaoArterialDetalhes?.trim() || '',
    });
  }

  return itens;
}

export function AnamnesePanel({ clienteId, onCadastrarAnamnese }) {
  const { anamneses, alertasClinicos, loading, error, reload } = useAnamneses(clienteId);
  const [formAberto, setFormAberto] = useState(false);
  const [modalOcrAberto, setModalOcrAberto] = useState(false);

  const fichaAtual = anamneses[0] ?? null;
  const alteracoes = fichaAtual ? descreverAlteracoes(fichaAtual) : [];

  const abrirNovaFicha = () => {
    setFormAberto(true);
  };

  const cadastrarManual = async (dados) => {
    await onCadastrarAnamnese(dados);
    setFormAberto(false);
    reload();
  };

  const aoConcluirOcr = (ficha) => {
    setModalOcrAberto(false);
    if (ficha) reload();
  };

  return (
    <section className={styles.painel}>
      <header className={styles.cabecalho}>
        <div>
          <h3 className={styles.titulo}>Anamnese</h3>
          <p className={styles.subtitulo}>Histórico de saúde e alertas clínicos do paciente</p>
        </div>
        {!formAberto && (
          <div className={styles.acoesTopo}>
            <button
              type="button"
              className={styles.botaoSecundario}
              onClick={() => setModalOcrAberto(true)}
            >
              Digitalizar ficha
            </button>
            <button type="button" className={styles.botaoPrimario} onClick={abrirNovaFicha}>
              Nova anamnese
            </button>
          </div>
        )}
      </header>

      {alertasClinicos.length > 0 && (
        <div className={styles.alertaClinico} role="alert">
          <span className={styles.alertaIcone} aria-hidden="true">
            !
          </span>
          <div>
            <p className={styles.alertaTitulo}>Atenção clínica</p>
            <ul className={styles.alertaLista}>
              {alertasClinicos.map((alerta) => (
                <li key={alerta}>{alerta}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {formAberto ? (
        <div className={styles.formWrapper}>
          <AnamneseForm
            onSubmit={cadastrarManual}
            onCancel={() => setFormAberto(false)}
          />
        </div>
      ) : (
        <>
          <ListStatus
            loading={loading}
            error={error}
            onRetry={reload}
            forbiddenMessage="Você não tem permissão para visualizar a anamnese deste paciente."
          />

          {!loading && !error && !fichaAtual && (
            <div className={styles.vazio}>
              <p className={styles.vazioTitulo}>Nenhuma ficha de anamnese registrada</p>
              <p className={styles.vazioTexto}>
                Cadastre manualmente ou digitalize a ficha física com OCR e IA.
              </p>
              <div className={styles.vazioAcoes}>
                <button type="button" className={styles.botaoSecundario} onClick={() => setModalOcrAberto(true)}>
                  Digitalizar ficha
                </button>
                <button type="button" className={styles.botaoPrimario} onClick={abrirNovaFicha}>
                  Nova anamnese
                </button>
              </div>
            </div>
          )}

          {!loading && !error && fichaAtual && (
            <article className={styles.ficha}>
              <header className={styles.fichaCabecalho}>
                <div>
                  <p className={styles.fichaRotulo}>Ficha mais recente</p>
                  <p className={styles.fichaData}>{formatarData(fichaAtual.dataAnamnese)}</p>
                </div>
                {anamneses.length > 1 && (
                  <span className={styles.contador}>{anamneses.length} fichas no histórico</span>
                )}
              </header>

              {alteracoes.length > 0 ? (
                <ul className={styles.alteracoes}>
                  {alteracoes.map((alteracao) => (
                    <li key={alteracao.campo} className={styles.alteracaoItem}>
                      <p className={styles.alteracaoTitulo}>{alteracao.texto}</p>
                      {alteracao.detalhe && (
                        <p className={styles.alteracaoDetalhe}>{alteracao.detalhe}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.semAlteracoes}>Sem alterações relatadas na última ficha.</p>
              )}

              {anamneses.length > 1 && (
                <div className={styles.historico}>
                  <p className={styles.historicoTitulo}>Fichas anteriores</p>
                  <ul className={styles.historicoLista}>
                    {anamneses.slice(1).map((ficha) => (
                      <li key={ficha.idAnamnese} className={styles.historicoItem}>
                        {formatarData(ficha.dataAnamnese)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )}
        </>
      )}

      {modalOcrAberto && (
        <AnamneseOcrModal
          clienteId={clienteId}
          onClose={() => setModalOcrAberto(false)}
          onSuccess={aoConcluirOcr}
        />
      )}
    </section>
  );
}

export default AnamnesePanel;
