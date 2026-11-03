import { useEffect, useId, useRef, useState } from 'react';
import styles from './AnamneseOcrModal.module.css';
import { validarArquivoAnamnese, uploadAnamneseOcr } from '../../services/anamneseService';

function formatarTamanho(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AnamneseOcrModal({ clienteId, onClose, onSuccess }) {
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef(null);
  const idBase = useId();
  const idTitulo = `${idBase}-titulo`;

  useEffect(() => {
    const aoTeclar = (event) => {
      if (event.key === 'Escape' && !processando) onClose();
    };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [processando, onClose]);

  const selecionarArquivo = (proximo) => {
    if (!proximo) return;
    const erroValidacao = validarArquivoAnamnese(proximo);
    if (erroValidacao) {
      setArquivo(null);
      setErro(erroValidacao);
      return;
    }
    setErro('');
    setArquivo(proximo);
  };

  const aoMudarInput = (event) => {
    selecionarArquivo(event.target.files?.[0]);
    event.target.value = '';
  };

  const abrirSeletor = () => {
    if (!processando) inputRef.current?.click();
  };

  const aoArrastarSobre = (event) => {
    event.preventDefault();
    if (!processando) setArrastando(true);
  };

  const aoSairArrasto = (event) => {
    event.preventDefault();
    setArrastando(false);
  };

  const aoSoltar = (event) => {
    event.preventDefault();
    setArrastando(false);
    if (!processando) selecionarArquivo(event.dataTransfer.files?.[0]);
  };

  const aoTeclarDropzone = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      abrirSeletor();
    }
  };

  const removerArquivo = () => {
    if (processando) return;
    setArquivo(null);
    setErro('');
  };

  const processar = async () => {
    if (!arquivo || processando) return;
    setErro('');
    setProcessando(true);
    try {
      const ficha = await uploadAnamneseOcr(clienteId, arquivo);
      onSuccess(ficha);
    } catch (err) {
      setErro(err?.message || 'Não foi possível processar a ficha. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const fechar = () => {
    if (!processando) onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) fechar();
      }}
    >
      <div
        className={styles.box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
      >
        <div className={styles.header}>
          <div>
            <h2 id={idTitulo} className={styles.titulo}>
              Digitalizar Ficha de Anamnese
            </h2>
            <p className={styles.subtitulo}>
              Envie uma foto ou PDF. O OCR e a IA vão extrair as respostas.
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={fechar}
            disabled={processando}
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          className={styles.inputOculto}
          accept=".png,.jpg,.jpeg,.pdf,application/pdf"
          onChange={aoMudarInput}
          tabIndex={-1}
          aria-hidden="true"
        />

        {!arquivo ? (
          <div
            role="button"
            tabIndex={0}
            className={`${styles.dropzone} ${arrastando ? styles.dropzoneAtiva : ''}`}
            onClick={abrirSeletor}
            onKeyDown={aoTeclarDropzone}
            onDragOver={aoArrastarSobre}
            onDragLeave={aoSairArrasto}
            onDrop={aoSoltar}
            aria-label="Selecionar ficha física para digitalização"
          >
            <span className={styles.dropIcone}>
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
              </svg>
            </span>
            <p className={styles.dropTitulo}>Arraste a ficha aqui ou clique para selecionar</p>
            <p className={styles.dropTexto}>PNG, JPG, JPEG ou PDF · até 10 MB</p>
          </div>
        ) : (
          <div className={styles.arquivo}>
            <div className={styles.arquivoInfo}>
              <p className={styles.arquivoNome} title={arquivo.name}>
                {arquivo.name}
              </p>
              <p className={styles.arquivoMeta}>{formatarTamanho(arquivo.size)}</p>
            </div>
            <button
              type="button"
              className={styles.botaoRemover}
              onClick={removerArquivo}
              disabled={processando}
            >
              Remover
            </button>
          </div>
        )}

        {erro && (
          <p className={styles.erro} role="alert">
            {erro}
          </p>
        )}

        {processando && (
          <div className={styles.processando} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            <p>Lendo ficha e extraindo respostas via OCR e IA…</p>
          </div>
        )}

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={fechar}
            disabled={processando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.botaoPrimario}
            onClick={processar}
            disabled={!arquivo || processando}
          >
            {processando ? 'Processando…' : 'Processar com IA'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnamneseOcrModal;
