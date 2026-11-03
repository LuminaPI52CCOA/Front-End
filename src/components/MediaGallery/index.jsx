import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Upload, Plus, ChevronDown, FileText, Filter, RotateCcw } from 'lucide-react';
import { useDoctors } from '../../hooks/useDoctors';
import { getTiposMidia, getMidias, excluirMidia } from '../../services/mediaService';
import MediaUploadModal from './MediaUploadModal';
import MediaLightboxModal from './MediaLightboxModal';
import styles from './styles.module.css';

export function MediaGallery({ pacienteId: pacienteIdProp }) {
  const { id: pacienteIdRoute } = useParams();
  const clienteId = pacienteIdProp || pacienteIdRoute;

  const { dentistas } = useDoctors();
  const [tiposMidia, setTiposMidia] = useState([]);
  const [midias, setMidias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // Filtros
  const [filtroTipoId, setFiltroTipoId] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroDentistaId, setFiltroDentistaId] = useState('');

  // Modais
  const [modalUploadAberto, setModalUploadAberto] = useState(false);
  const [tipoUploadPreselecionado, setTipoUploadPreselecionado] = useState(null);
  const [midiaLightbox, setMidiaLightbox] = useState(null);

  // Carregar tipos de midia
  useEffect(() => {
    let cancelado = false;
    async function carregarTipos() {
      try {
        const tipos = await getTiposMidia();
        if (!cancelado) {
          setTiposMidia(Array.isArray(tipos) ? tipos : []);
        }
      } catch (err) {
        console.error('Erro ao buscar tipos de mídia:', err);
      }
    }
    carregarTipos();
    return () => {
      cancelado = true;
    };
  }, []);

  // Carregar midias do paciente
  useEffect(() => {
    let cancelado = false;

    async function buscar() {
      if (!clienteId) return;
      try {
        const filtros = {};
        if (filtroTipoId) filtros.tipoId = filtroTipoId;
        if (filtroData) filtros.data = filtroData;
        if (filtroDentistaId) filtros.dentistaId = filtroDentistaId;

        const dados = await getMidias(clienteId, filtros);
        if (!cancelado) {
          setMidias(Array.isArray(dados) ? dados : []);
          setErro('');
          setLoading(false);
        }
      } catch (err) {
        if (!cancelado) {
          console.error('Erro ao buscar mídias do paciente:', err);
          setErro(err.message || 'Não foi possível carregar as fotos e mídias.');
          setLoading(false);
        }
      }
    }

    buscar();

    return () => {
      cancelado = true;
    };
  }, [clienteId, filtroTipoId, filtroData, filtroDentistaId, reloadKey]);

  const recarregarMidias = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };


  const handleAbrirUpload = (tipoId = null) => {
    setTipoUploadPreselecionado(tipoId ? String(tipoId) : null);
    setModalUploadAberto(true);
  };

  const handleExcluirMidia = async (midiaId) => {
    if (!clienteId) return;
    await excluirMidia(clienteId, midiaId);
    setMidias((prev) => prev.filter((m) => m.id !== midiaId));
  };

  const handleLimparFiltros = () => {
    setFiltroTipoId('');
    setFiltroData('');
    setFiltroDentistaId('');
  };

  const temFiltroAtivo = Boolean(filtroTipoId || filtroData || filtroDentistaId);

  // Agrupamento por tipo de midia
  // Mostra as secoes existentes que possuem midias ou os tipos cadastrados
  const tiposExibicao = tiposMidia.filter((t) => {
    if (filtroTipoId && String(t.id) !== String(filtroTipoId)) {
      return false;
    }
    return true;
  });

  return (
    <div className={styles.layout}>
      {/* Sidebar de Filtros */}
      <aside className={styles.filters}>
        <h3 className={styles.filtersTitle}>
          <Filter size={16} color="#a97f2b" />
          Filtros de Mídias
        </h3>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="filtro-tipo">
            Tipo de Mídia:
          </label>
          <div className={styles.fieldWrapper}>
            <select
              id="filtro-tipo"
              className={styles.fieldControl}
              value={filtroTipoId}
              onChange={(e) => setFiltroTipoId(e.target.value)}
            >
              <option value="">Todas as Seções</option>
              {tiposMidia.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
            <ChevronDown className={styles.fieldIcon} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="filtro-data">
            Data:
          </label>
          <div className={styles.fieldWrapper}>
            <input
              id="filtro-data"
              name="data"
              type="date"
              className={styles.fieldControl}
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="filtro-dentista">
            Dentista:
          </label>
          <div className={styles.fieldWrapper}>
            <select
              id="filtro-dentista"
              name="dentista"
              className={styles.fieldControl}
              value={filtroDentistaId}
              onChange={(e) => setFiltroDentistaId(e.target.value)}
            >
              <option value="">Todos os profissionais</option>
              {dentistas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
            <ChevronDown className={styles.fieldIcon} aria-hidden="true" />
          </div>
        </div>

        {temFiltroAtivo && (
          <button
            type="button"
            className={styles.btnLimparFiltros}
            onClick={handleLimparFiltros}
          >
            <RotateCcw size={12} style={{ display: 'inline', marginRight: 4 }} />
            Limpar filtros
          </button>
        )}
      </aside>

      {/* Area Principal com as Galerias por Secao */}
      <main className={styles.galleries}>
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.photoThumb} style={{ width: 48, height: 48 }}>
              <Camera size={24} color="#a97f2b" />
            </div>
            <p>Carregando galeria clínica...</p>
          </div>
        )}

        {!loading && erro && (
          <div className={styles.emptyGalleryCard}>
            <p style={{ color: '#ef4444' }}>{erro}</p>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={recarregarMidias}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !erro && tiposExibicao.length === 0 && (
          <div className={styles.emptyGalleryCard}>
            <p>Nenhuma categoria de mídia configurada.</p>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => handleAbrirUpload()}
            >
              <Upload className={styles.buttonIcon} aria-hidden="true" />
              Carregar fotos
            </button>
          </div>
        )}

        {!loading && !erro && tiposExibicao.map((tipo) => {
          const midiasDaSecao = midias.filter((m) => m.tipo?.id === tipo.id);

          // Se tiver filtro ativo e a secao nao tiver itens, ou se o usuario filtrou por um tipo especifico
          if (filtroTipoId && String(tipo.id) !== String(filtroTipoId)) {
            return null;
          }

          return (
            <section key={tipo.id} className={styles.galleryCard}>
              <header className={styles.galleryHeader}>
                <div className={styles.galleryTitle}>
                  <Camera className={styles.galleryIcon} aria-hidden="true" />
                  <h2>{tipo.nome}</h2>
                  <span className={styles.badgeCount}>
                    {midiasDaSecao.length} {midiasDaSecao.length === 1 ? 'mídia' : 'mídias'}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={() => handleAbrirUpload(tipo.id)}
                >
                  <Upload className={styles.buttonIcon} aria-hidden="true" />
                  Carregar fotos
                </button>
              </header>

              <hr className={styles.divider} />

              <div className={styles.photoGrid}>
                {midiasDaSecao.map((midia) => {
                  const isImage = midia.mimeType?.startsWith('image/') ||
                    ['jpg', 'jpeg', 'png', 'webp'].includes(midia.extensao?.toLowerCase());

                  return (
                    <div
                      key={midia.id}
                      className={styles.photoItem}
                      onClick={() => setMidiaLightbox(midia)}
                      title={midia.legenda || midia.nomeOriginal}
                    >
                      <div className={styles.photoThumb}>
                        {isImage ? (
                          <img
                            src={midia.urlVisualizacao}
                            alt={midia.legenda || midia.nomeOriginal}
                            className={styles.photoImg}
                            loading="lazy"
                          />
                        ) : (
                          <div className={styles.docCard}>
                            <FileText className={styles.docIcon} />
                            <span className={styles.docExt}>{midia.extensao?.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <span className={styles.photoCaption}>
                        {midia.legenda || midia.nomeOriginal}
                      </span>
                    </div>
                  );
                })}

                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => handleAbrirUpload(tipo.id)}
                  aria-label={`Adicionar foto em ${tipo.nome}`}
                  title={`Adicionar foto em ${tipo.nome}`}
                >
                  <Plus className={styles.addIcon} aria-hidden="true" />
                </button>
              </div>

              {midiasDaSecao.length === 0 && (
                <p className={styles.emptyText}>
                  Nenhuma foto cadastrada nesta categoria.
                </p>
              )}
            </section>
          );
        })}
      </main>

      {/* Modal de Upload em Lote */}
      {modalUploadAberto && (
        <MediaUploadModal
          clienteId={clienteId}
          tiposMidia={tiposMidia}
          tipoIdInicial={tipoUploadPreselecionado}
          onClose={() => setModalUploadAberto(false)}
          onSuccess={() => {
            recarregarMidias();
          }}
        />
      )}

      {/* Modal Lightbox de Visualizacao HD */}
      {midiaLightbox && (
        <MediaLightboxModal
          midia={midiaLightbox}
          onClose={() => setMidiaLightbox(null)}
          onDelete={handleExcluirMidia}
        />
      )}
    </div>
  );
}

export default MediaGallery;