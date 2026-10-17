import { useState } from 'react';
import { X, Download, Trash2, ZoomIn, ZoomOut, FileText, Calendar, User, Tag } from 'lucide-react';
import styles from './MediaLightboxModal.module.css';

function formatarTamanho(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatarDataHora(isoString) {
  if (!isoString) return '—';
  try {
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function MediaLightboxModal({ midia, onClose, onDelete }) {
  const [zoom, setZoom] = useState(1);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  if (!midia) return null;

  const isImage = midia.mimeType?.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'webp'].includes(midia.extensao?.toLowerCase());

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const handleDownload = () => {
    if (midia.urlVisualizacao) {
      window.open(midia.urlVisualizacao, '_blank');
    }
  };

  const handleConfirmarExclusao = async () => {
    try {
      setExcluindo(true);
      await onDelete(midia.id);
      onClose();
    } catch (err) {
      console.error('Erro ao excluir mídia:', err);
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {confirmandoExclusao && (
          <div className={styles.confirmOverlay}>
            <h3 className={styles.confirmTitle}>Confirmar Exclusão</h3>
            <p className={styles.confirmDesc}>
              Tem certeza que deseja desativar a mídia <strong>{midia.nomeOriginal}</strong> do prontuário?
              O arquivo será desativado na galeria e retido de forma segura para fins de auditoria médica e conformidade legal.
            </p>
            <div className={styles.confirmButtons}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={() => setConfirmandoExclusao(false)}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.btnDelete}
                onClick={handleConfirmarExclusao}
                disabled={excluindo}
              >
                {excluindo ? 'Excluindo...' : 'Sim, Desativar'}
              </button>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.titleArea}>
            <h2 className={styles.title}>{midia.nomeOriginal}</h2>
            <span className={styles.subtitle}>
              {midia.tipo?.nome || 'Mídia Clínica'} • {formatarTamanho(midia.tamanhoBytes)}
            </span>
          </div>

          <div className={styles.headerActions}>
            {isImage && (
              <>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={handleZoomOut}
                  title="Diminuir Zoom"
                  aria-label="Diminuir Zoom"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={handleZoomIn}
                  title="Aumentar Zoom"
                  aria-label="Aumentar Zoom"
                >
                  <ZoomIn size={18} />
                </button>
              </>
            )}

            <button
              type="button"
              className={styles.iconButton}
              onClick={handleDownload}
              title="Baixar arquivo / Abrir original"
              aria-label="Download"
            >
              <Download size={18} />
            </button>

            <button
              type="button"
              className={`${styles.iconButton} ${styles.deleteButton}`}
              onClick={() => setConfirmandoExclusao(true)}
              title="Excluir mídia"
              aria-label="Excluir mídia"
            >
              <Trash2 size={18} />
            </button>

            <button
              type="button"
              className={styles.iconButton}
              onClick={onClose}
              title="Fechar"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className={styles.content}>
          {isImage ? (
            <img
              src={midia.urlVisualizacao}
              alt={midia.legenda || midia.nomeOriginal}
              className={styles.image}
              style={{ transform: `scale(${zoom})` }}
            />
          ) : (
            <div className={styles.documentPreview}>
              <FileText className={styles.documentIcon} />
              <div className={styles.documentName}>{midia.nomeOriginal}</div>
              <div className={styles.documentSize}>{formatarTamanho(midia.tamanhoBytes)} ({midia.extensao?.toUpperCase()})</div>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={handleDownload}
                style={{ marginTop: '1rem' }}
              >
                Abrir Documento Completo
              </button>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <div className={styles.metadataGrid}>
            <div className={styles.metaItem}>
              <Tag size={15} />
              <span>{midia.tipo?.nome || 'Geral'}</span>
            </div>

            <div className={styles.metaItem}>
              <Calendar size={15} />
              <span>{formatarDataHora(midia.criadoEm)}</span>
            </div>

            {midia.dentista && (
              <div className={styles.metaItem}>
                <User size={15} />
                <span>{midia.dentista.nome}</span>
              </div>
            )}
          </div>

          {midia.legenda && (
            <div className={styles.caption}>
              "{midia.legenda}"
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}

export default MediaLightboxModal;
