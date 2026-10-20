import { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { iniciarUpload, fazerUploadS3, confirmarUpload, criarTipoMidia } from '../../services/mediaService';
import styles from './MediaUploadModal.module.css';

const EXTENSOES_IMAGEM = ['jpg', 'jpeg', 'png', 'webp'];
const EXTENSOES_DOC = ['pdf', 'dcm'];
const LIMITE_IMAGEM = 15 * 1024 * 1024;
const LIMITE_DOC = 50 * 1024 * 1024;

function formatarTamanho(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaUploadModal({ clienteId, tiposMidia = [], onClose, onSuccess, tipoIdInicial }) {
  const [arquivos, setArquivos] = useState([]);
  const [tipoId, setTipoId] = useState(tipoIdInicial || (tiposMidia[0]?.id ? String(tiposMidia[0].id) : ''));
  const [legenda, setLegenda] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Criacao inline de novo tipo
  const [criandoTipo, setCriandoTipo] = useState(false);
  const [nomeNovoTipo, setNomeNovoTipo] = useState('');
  const [listaTipos, setListaTipos] = useState(tiposMidia);

  const fileInputRef = useRef(null);

  const validarArquivo = (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext) return 'Arquivo sem extensão.';

    if (EXTENSOES_IMAGEM.includes(ext)) {
      if (file.size > LIMITE_IMAGEM) {
        return `A imagem "${file.name}" excede o limite de 15 MB.`;
      }
    } else if (EXTENSOES_DOC.includes(ext)) {
      if (file.size > LIMITE_DOC) {
        return `O documento "${file.name}" excede o limite de 50 MB.`;
      }
    } else {
      return `Extensão ".${ext}" não permitida. Aceitos: JPG, PNG, WEBP, PDF e DCM.`;
    }
    return null;
  };

  const handleAdicionarArquivos = (novos) => {
    setErro('');
    const validos = [];
    for (const f of novos) {
      const err = validarArquivo(f);
      if (err) {
        setErro(err);
        return;
      }
      validos.push({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        progresso: 0,
        status: 'pending',
      });
    }

    setArquivos((prev) => [...prev, ...validos]);
  };

  const handleRemoverArquivo = (id) => {
    if (enviando) return;
    setArquivos((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSalvarNovoTipo = async () => {
    if (!nomeNovoTipo.trim()) return;
    try {
      const criado = await criarTipoMidia(nomeNovoTipo.trim(), 'Criado via modal de upload');
      setListaTipos((prev) => [...prev, criado]);
      setTipoId(String(criado.id));
      setNomeNovoTipo('');
      setCriandoTipo(false);
    } catch (err) {
      setErro(err.message || 'Falha ao cadastrar novo tipo de mídia.');
    }
  };

  const handleEnviar = async () => {
    if (!tipoId) {
      setErro('Selecione um tipo de mídia.');
      return;
    }
    if (arquivos.length === 0) {
      setErro('Adicione pelo menos um arquivo para upload.');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      // 1. Iniciar upload no backend
      const payload = {
        tipoId: Number(tipoId),
        legenda: legenda.trim() || undefined,
        arquivos: arquivos.map((a) => ({
          nomeOriginal: a.file.name,
          mimeType: a.file.type || 'application/octet-stream',
          tamanhoBytes: a.file.size,
        })),
      };

      const presignedItems = await iniciarUpload(clienteId, payload);

      // 2. Upload individual direto ao S3 com progresso
      for (let i = 0; i < presignedItems.length; i++) {
        const item = presignedItems[i];
        const arquivoObj = arquivos[i];

        setArquivos((prev) =>
          prev.map((a, idx) => (idx === i ? { ...a, status: 'uploading' } : a))
        );

        await fazerUploadS3(item.uploadUrl, arquivoObj.file, (progresso) => {
          setArquivos((prev) =>
            prev.map((a, idx) => (idx === i ? { ...a, progresso } : a))
          );
        });

        // 3. Confirmar upload no backend
        await confirmarUpload(clienteId, item.midiaId);

        setArquivos((prev) =>
          prev.map((a, idx) => (idx === i ? { ...a, status: 'done', progresso: 100 } : a))
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro no fluxo de upload:', err);
      setErro(err.message || 'Erro durante o envio dos arquivos para o S3.');
      setEnviando(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={enviando ? undefined : onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>Upload de Fotos e Mídias Clínicas</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={enviando}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </header>

        <div className={styles.body}>
          {erro && <div className={styles.errorMessage}>{erro}</div>}

          {/* Selecao de Tipo de Midia */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tipo-midia-select">
              Tipo de Mídia:
            </label>
            <div className={styles.selectRow}>
              <select
                id="tipo-midia-select"
                className={styles.select}
                value={tipoId}
                onChange={(e) => setTipoId(e.target.value)}
                disabled={enviando}
              >
                <option value="">Selecione o tipo de exame/foto...</option>
                {listaTipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome} {t.personalizado ? '(Personalizado)' : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.btnNovoTipo}
                onClick={() => setCriandoTipo((prev) => !prev)}
                disabled={enviando}
              >
                <Plus size={14} style={{ display: 'inline', marginRight: 4 }} />
                Novo Tipo...
              </button>
            </div>

            {criandoTipo && (
              <div className={styles.inlineNovoTipo}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Nome do novo tipo (ex: Tomografia Arcada Superior)"
                  value={nomeNovoTipo}
                  onChange={(e) => setNomeNovoTipo(e.target.value)}
                  disabled={enviando}
                />
                <button
                  type="button"
                  className={styles.btnSalvarTipo}
                  onClick={handleSalvarNovoTipo}
                  disabled={enviando || !nomeNovoTipo.trim()}
                >
                  Salvar
                </button>
              </div>
            )}
          </div>

          {/* Legenda Opcional */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="legenda-input">
              Legenda ou Observação Clínica (opcional):
            </label>
            <input
              id="legenda-input"
              type="text"
              className={styles.input}
              placeholder="Ex: Evolução molar 16 após canal"
              value={legenda}
              onChange={(e) => setLegenda(e.target.value)}
              disabled={enviando}
            />
          </div>

          {/* Dropzone */}
          <div
            className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files?.length) {
                handleAdicionarArquivos(Array.from(e.dataTransfer.files));
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className={styles.dropIcon} />
            <div className={styles.dropText}>
              Arraste fotos e exames aqui, ou clique para selecionar
            </div>
            <div className={styles.dropHint}>
              Formatos aceitos: JPG, PNG, WEBP (até 15 MB) • PDF, DICOM (até 50 MB)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className={styles.fileInput}
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.dcm"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleAdicionarArquivos(Array.from(e.target.files));
                }
              }}
            />
          </div>

          {/* Lista de Arquivos Selecionados */}
          {arquivos.length > 0 && (
            <div className={styles.fileList}>
              {arquivos.map((item) => {
                const isImg = item.file.type.startsWith('image/');
                return (
                  <div key={item.id} className={styles.fileItem}>
                    <div className={styles.fileItemRow}>
                      <div className={styles.fileInfo}>
                        {isImg ? <ImageIcon size={18} color="#0284c7" /> : <FileText size={18} color="#0284c7" />}
                        <span className={styles.fileName}>{item.file.name}</span>
                        <span className={styles.fileSize}>({formatarTamanho(item.file.size)})</span>
                      </div>
                      {!enviando && (
                        <button
                          type="button"
                          className={styles.removeFileBtn}
                          onClick={() => handleRemoverArquivo(item.id)}
                          aria-label={`Remover ${item.file.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {enviando && (
                      <div className={styles.progressBarContainer}>
                        <div
                          className={styles.progressBarFill}
                          style={{ width: `${item.progresso}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleEnviar}
            disabled={enviando || arquivos.length === 0 || !tipoId}
          >
            {enviando ? 'Enviando ao S3...' : `Enviar ${arquivos.length > 0 ? `(${arquivos.length})` : ''}`}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default MediaUploadModal;
