import { useMemo, useState } from 'react';
import {
  ShieldCheck,
  CalendarDays,
  Users,
  ClipboardList,
  Search,
  Check,
} from 'lucide-react';
import styles from './styles.module.css';

const permissoesTotais = [
  'Todas as Agendas',
  'Upload de Anamneses',
  'Base Geral de Pacientes',
  'Controle Financeiro & Corpo',
];

const regras = [
  {
    id: 'agenda',
    icon: CalendarDays,
    titulo: 'Agenda & Consultas',
    descricao:
      'Acesso restrito ao profissional. O dentista vê apenas a própria agenda e não cria consultas globais para outros profissionais.',
  },
  {
    id: 'pacientes',
    icon: Users,
    titulo: 'Pacientes & Clientes',
    descricao:
      'Vinculado ao histórico. O dentista visualiza apenas as fichas de pacientes com quem tem consulta associada.',
  },
  {
    id: 'prontuarios',
    icon: ClipboardList,
    titulo: 'Prontuários & Anamneses',
    descricao:
      'Histórico clínico restrito aos seus próprios pacientes atendidos.',
  },
];

const dentistas = [
  {
    id: 1,
    nome: 'Dra. Mariana Alves',
    cro: 'SP-CD-48213',
    especialidade: 'Ortodontia',
    status: 'Ativo',
    pacientes: 42,
  },
  {
    id: 2,
    nome: 'Dr. Rafael Costa',
    cro: 'SP-CD-31987',
    especialidade: 'Endodontia',
    status: 'Ativo',
    pacientes: 28,
  },
  {
    id: 3,
    nome: 'Dra. Camila Ferreira',
    cro: 'SP-CD-52140',
    especialidade: 'Implantodontia',
    status: 'Ativo',
    pacientes: 35,
  },
  {
    id: 4,
    nome: 'Dr. Bruno Martins',
    cro: 'SP-CD-27455',
    especialidade: 'Periodontia',
    status: 'Ativo',
    pacientes: 21,
  },
  {
    id: 5,
    nome: 'Dra. Helena Souza',
    cro: 'SP-CD-60412',
    especialidade: 'Odontopediatria',
    status: 'Ativo',
    pacientes: 30,
  },
];

const obterIniciais = (nome) => {
  const partes = nome.replace(/^(Dra?\.)\s+/i, '').split(' ').filter(Boolean);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${primeira}${ultima}`.toUpperCase();
};

export function ControlePermissoes() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const dentistasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return dentistas.filter((dentista) => {
      if (filtro === 'ativos' && dentista.status !== 'Ativo') {
        return false;
      }

      if (!termo) {
        return true;
      }

      return (
        dentista.nome.toLowerCase().includes(termo) ||
        dentista.cro.toLowerCase().includes(termo) ||
        dentista.especialidade.toLowerCase().includes(termo)
      );
    });
  }, [busca, filtro]);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Controle de Permissões e Perfis</h1>
      </header>

      <section className={styles.perfilCard}>
        <div className={styles.perfilTop}>
          <span className={styles.perfilIcon}>
            <ShieldCheck size={26} />
          </span>
          <h2 className={styles.perfilNome}>Recepcionista / Administrador</h2>
          <span className={styles.badgeAcesso}>Acesso Total</span>
        </div>

        <p className={styles.perfilDescricao}>
          Controle total sobre o sistema. Permissão para cadastrar, editar,
          reagendar e cancelar qualquer consulta, gerenciar o cadastro completo
          de clientes, convênios e realizar uploads de anamneses sem restrições
          de vínculo médico.
        </p>

        <div className={styles.permissoesGrid}>
          {permissoesTotais.map((permissao) => (
            <div key={permissao} className={styles.permissaoItem}>
              <span className={styles.permissaoIcone}>
                <Check size={14} strokeWidth={3} />
              </span>
              <span className={styles.permissaoTexto}>{permissao}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.regrasSection}>
        <h2 className={styles.sectionTitle}>
          Regras de Acesso e Restrições do Corpo Clínico — Dentistas
        </h2>

        <div className={styles.regrasGrid}>
          {regras.map((regra) => {
            const Icone = regra.icon;

            return (
              <article key={regra.id} className={styles.regraCard}>
                <span className={styles.regraIcon}>
                  <Icone size={20} />
                </span>
                <h3 className={styles.regraTitulo}>{regra.titulo}</h3>
                <p className={styles.regraDescricao}>{regra.descricao}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.tabelaCard}>
        <div className={styles.tabelaHeader}>
          <div>
            <h2 className={styles.tabelaTitulo}>Dentistas Cadastrados</h2>
            <p className={styles.tabelaSubtitulo}>
              Profissionais com vínculo à clínica e as suas agendas.
            </p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="search"
              className={styles.search}
              placeholder="Buscar dentista por nome, CRO ou especialidade..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              aria-label="Buscar dentista"
            />
          </div>

          <div className={styles.filtros}>
            <button
              type="button"
              className={`${styles.filtroBotao} ${
                filtro === 'todos' ? styles.filtroAtivo : ''
              }`}
              onClick={() => setFiltro('todos')}
            >
              Todos
            </button>
            <button
              type="button"
              className={`${styles.filtroBotao} ${
                filtro === 'ativos' ? styles.filtroAtivo : ''
              }`}
              onClick={() => setFiltro('ativos')}
            >
              Ativos
            </button>
          </div>
        </div>

        <div className={styles.tabelaWrapper}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Profissional & CRO</th>
                <th>Especialidade</th>
                <th>Status Clínico</th>
                <th>Vínculo de Agenda</th>
              </tr>
            </thead>
            <tbody>
              {dentistasFiltrados.map((dentista) => (
                <tr key={dentista.id}>
                  <td>
                    <div className={styles.profissional}>
                      <span className={styles.avatar}>
                        {obterIniciais(dentista.nome)}
                      </span>
                      <div className={styles.profissionalDados}>
                        <span className={styles.profissionalNome}>
                          {dentista.nome}
                        </span>
                        <span className={styles.profissionalCro}>
                          CRO {dentista.cro}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.especialidadeTag}>
                      {dentista.especialidade}
                    </span>
                  </td>
                  <td>
                    <span className={styles.statusAtivo}>
                      {dentista.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.vinculo}>
                      <span className={styles.vinculoAgenda}>
                        Agenda Própria
                      </span>
                      <span className={styles.vinculoPacientes}>
                        {dentista.pacientes} pacientes em acompanhamento
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {dentistasFiltrados.length === 0 && (
            <p className={styles.vazio}>Nenhum dentista encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ControlePermissoes;
