import { useState } from 'react';
import { Camera, Upload, Plus, Calendar, ChevronDown, Image as ImageIcon } from 'lucide-react';
import styles from './styles.module.css';

const dentistas = [
  { id: 1, nome: 'Dr. Ricardo Alves' },
  { id: 2, nome: 'Dra. Beatriz Nunes' },
  { id: 3, nome: 'Dra. Fernanda Costa' },
  { id: 4, nome: 'Dra. Helena Prado' },
];

const galeriasConfig = [
  { id: 'fotos-clinicas', titulo: 'Fotos Clínicas' },
  { id: 'radiologia', titulo: 'Radiologia' },
];

const fotosIniciais = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  legenda: 'Legenda',
}));

export function MediaGallery() {
  const [data, setData] = useState('');
  const [dentista, setDentista] = useState('');
  const [fotosClinicas, setFotosClinicas] = useState(fotosIniciais);
  const [fotosRadiologia, setFotosRadiologia] = useState(fotosIniciais);
  const [anuncio, setAnuncio] = useState('');

  const carregarFotos = (galeriaId) => {
    console.log(`Carregar fotos em ${galeriaId} (simulado)`);
    setAnuncio('Fotos carregadas com sucesso.');
  };

  const adicionarFoto = (galeriaId) => {
    const novaFoto = {
      id: `nova-${galeriaId}-${Date.now()}`,
      legenda: 'Legenda',
    };
    if (galeriaId === 'fotos-clinicas') {
      setFotosClinicas((fotos) => [...fotos, novaFoto]);
    } else {
      setFotosRadiologia((fotos) => [...fotos, novaFoto]);
    }
    setAnuncio('Foto adicionada.');
  };

  const obterFotos = (galeriaId) =>
    galeriaId === 'fotos-clinicas' ? fotosClinicas : fotosRadiologia;

  return (
    <div className={styles.layout}>
      <div className={styles.ariaAnnounce} role="status">
        {anuncio}
      </div>

      <aside className={styles.filters}>
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
              value={data}
              onChange={(event) => setData(event.target.value)}
              autoComplete="off"
            />
            <Calendar className={styles.fieldIcon} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="filtro-dentista">
            Dentistas:
          </label>
          <div className={styles.fieldWrapper}>
            <select
              id="filtro-dentista"
              name="dentista"
              className={styles.fieldControl}
              value={dentista}
              onChange={(event) => setDentista(event.target.value)}
              autoComplete="off"
            >
              <option value="">Todos</option>
              {dentistas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
            <ChevronDown className={styles.fieldIcon} aria-hidden="true" />
          </div>
        </div>
      </aside>

      <main className={styles.galleries}>
        {galeriasConfig.map((galeria) => (
          <section key={galeria.id} className={styles.galleryCard}>
            <header className={styles.galleryHeader}>
              <div className={styles.galleryTitle}>
                <Camera className={styles.galleryIcon} aria-hidden="true" />
                <h2>{galeria.titulo}</h2>
              </div>
              <button
                type="button"
                className={styles.uploadButton}
                onClick={() => carregarFotos(galeria.id)}
              >
                <Upload className={styles.buttonIcon} aria-hidden="true" />
                Carregar fotos
              </button>
            </header>

            <hr className={styles.divider} />

            <div className={styles.photoGrid}>
              {obterFotos(galeria.id).map((foto) => (
                <div key={foto.id} className={styles.photoItem}>
                  <div className={styles.photoThumb}>
                    <ImageIcon className={styles.photoIcon} aria-hidden="true" />
                  </div>
                  <span className={styles.photoCaption}>{foto.legenda}</span>
                </div>
              ))}

              <button
                type="button"
                className={styles.addButton}
                onClick={() => adicionarFoto(galeria.id)}
                aria-label={`Adicionar foto em ${galeria.titulo}`}
              >
                <Plus className={styles.addIcon} aria-hidden="true" />
              </button>
            </div>

            {obterFotos(galeria.id).length === 0 && (
              <p className={styles.emptyText}>Nenhuma foto.</p>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}

export default MediaGallery;