import { useEffect, useId, useRef, useState } from 'react';
import styles from './styles.module.css';

const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'application/pdf'];
const EXTENSOES_ACEITAS = ['.png', '.jpg', '.jpeg', '.pdf'];

function formatarTamanho(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function arquivoPermitido(arquivo) {
  const nome = arquivo.name.toLowerCase();
  return (
    TIPOS_ACEITOS.includes(arquivo.type) ||
    EXTENSOES_ACEITAS.some((extensao) => nome.endsWith(extensao))
  );
}

const IconeUpload = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
  </svg>
);

const IconeDocumento = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

const IconeCamera = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 4h-5L8 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4Z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

const IconeSeta = ({ aberto }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ transform: aberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function UploadAnamneseFisica() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [arrastando, setArrastando] = useState(false);
  const [expandido, setExpandido] = useState(true);
  const [erro, setErro] = useState('');
  const inputRef = useRef(null);
  const cameraRef = useRef(null);
  const idBase = useId();
  const idTitulo = `${idBase}-titulo`;
  const idConteudo = `${idBase}-conteudo`;

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selecionarArquivo = (proximo) => {
    if (!proximo) return;

    if (!arquivoPermitido(proximo)) {
      setErro('Formato inválido. Envie um arquivo PNG, JPG, JPEG ou PDF.');
      return;
    }

    setErro('');
    setUploadedFile(proximo);
    setPreviewUrl(proximo.type.startsWith('image/') ? URL.createObjectURL(proximo) : '');
    setExpandido(true);
  };

  const aoMudarInput = (event) => {
    selecionarArquivo(event.target.files?.[0]);
    event.target.value = '';
  };

  const abrirSeletor = () => inputRef.current?.click();
  const abrirCamera = () => cameraRef.current?.click();

  const removerArquivo = () => {
    setUploadedFile(null);
    setPreviewUrl('');
    setErro('');
  };

  const aoArrastarSobre = (event) => {
    event.preventDefault();
    setArrastando(true);
  };

  const aoSairArrasto = (event) => {
    event.preventDefault();
    setArrastando(false);
  };

  const aoSoltar = (event) => {
    event.preventDefault();
    setArrastando(false);
    selecionarArquivo(event.dataTransfer.files?.[0]);
  };

  const aoTeclarDropzone = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      abrirSeletor();
    }
  };

  return (
    <section className={styles.card} aria-labelledby={idTitulo}>
      <header className={styles.header}>
        <div className={styles.headerTexto}>
          <span className={styles.headerIcone}>
            <IconeDocumento />
          </span>
          <div>
            <h3 id={idTitulo} className={styles.titulo}>
              Anamnese Física
            </h3>
            <p className={styles.subtitulo}>
              Anexe uma foto ou documento para leitura automatizada
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.botaoRecolher}
          aria-expanded={expandido}
          aria-controls={idConteudo}
          onClick={() => setExpandido((atual) => !atual)}
        >
          {expandido ? 'Recolher' : 'Expandir'}
          <IconeSeta aberto={expandido} />
        </button>
      </header>

      {expandido && (
        <div id={idConteudo} className={styles.conteudo}>
          <input
            ref={inputRef}
            type="file"
            className={styles.inputOculto}
            accept=".png,.jpg,.jpeg,.pdf,application/pdf"
            onChange={aoMudarInput}
            tabIndex={-1}
            aria-hidden="true"
          />
          <input
            ref={cameraRef}
            type="file"
            className={styles.inputOculto}
            accept="image/*"
            capture="environment"
            onChange={aoMudarInput}
            tabIndex={-1}
            aria-hidden="true"
          />

          {!uploadedFile ? (
            <div
              role="button"
              tabIndex={0}
              className={`${styles.dropzone} ${arrastando ? styles.dropzoneAtiva : ''}`}
              onClick={abrirSeletor}
              onKeyDown={aoTeclarDropzone}
              onDragOver={aoArrastarSobre}
              onDragLeave={aoSairArrasto}
              onDrop={aoSoltar}
              aria-label="Enviar foto ou escaneamento da Anamnese Física"
            >
              <span className={styles.dropIcone}>
                <IconeUpload />
              </span>
              <p className={styles.dropTitulo}>
                Enviar foto ou escaneamento da Anamnese Física
              </p>
              <p className={styles.dropTexto}>
                Arraste a imagem aqui ou clique para selecionar o arquivo
              </p>
              <span className={styles.dropFormatos}>PNG, JPG, JPEG ou PDF</span>
            </div>
          ) : (
            <div
              className={`${styles.preview} ${arrastando ? styles.previewAtiva : ''}`}
              onDragOver={aoArrastarSobre}
              onDragLeave={aoSairArrasto}
              onDrop={aoSoltar}
            >
              <div className={styles.previewMidia}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`Pré-visualização de ${uploadedFile.name}`}
                    className={styles.previewImagem}
                  />
                ) : (
                  <span className={styles.previewDocumento}>
                    <IconeDocumento />
                  </span>
                )}
              </div>

              <div className={styles.previewInfo}>
                <p className={styles.arquivoNome} title={uploadedFile.name}>
                  {uploadedFile.name}
                </p>
                <p className={styles.arquivoMeta}>
                  {formatarTamanho(uploadedFile.size)} · {previewUrl ? 'Imagem' : 'Documento PDF'}
                </p>
                <div className={styles.acoesArquivo}>
                  <button type="button" className={styles.botaoTrocar} onClick={abrirSeletor}>
                    Trocar arquivo
                  </button>
                  <button type="button" className={styles.botaoRemover} onClick={removerArquivo}>
                    Remover
                  </button>
                </div>
              </div>

              <span className={styles.badgeOcr} role="status">
                📄 Anamnese anexada — Pronta para leitura automatizada (OCR)
              </span>
            </div>
          )}

          {erro && (
            <p className={styles.erro} role="alert">
              {erro}
            </p>
          )}

          <div className={styles.rodape}>
            <button type="button" className={styles.botaoUpload} onClick={abrirSeletor}>
              <IconeUpload />
              Selecionar arquivo
            </button>

            <button type="button" className={styles.botaoCamera} onClick={abrirCamera}>
              <IconeCamera />
              Tirar foto
            </button>

            <button
              type="button"
              className={styles.botaoOcr}
              disabled
              title="A integração com OCR estará disponível em breve"
            >
              Importar dados via OCR
              <span className={styles.badgeEmBreve}>Em breve · Simulação</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default UploadAnamneseFisica;
