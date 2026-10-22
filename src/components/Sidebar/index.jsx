import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  BriefcaseMedical,
  LayoutGrid,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';
import styles from './styles.module.css';

const menuItems = [
  {
    path: '/agenda',
    label: 'Agenda',
    icon: Calendar,
    matches: (pathname) => pathname.startsWith('/agenda'),
  },
  {
    path: '/pacientes',
    label: 'Pacientes',
    icon: User,
    matches: (pathname) => pathname.startsWith('/pacientes'),
  },
  {
    path: '/dentistas',
    label: 'Dentistas',
    icon: BriefcaseMedical,
    matches: (pathname) => pathname.startsWith('/dentistas'),
  },
  {
    path: '/permissoes',
    label: 'Permissões',
    icon: ShieldCheck,
    matches: (pathname) => pathname.startsWith('/permissoes'),
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    matches: (pathname) => pathname.startsWith('/dashboard'),
  },
];

export function Sidebar({ isCollapsed = false, onToggle, mobileOpen = false, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') onMobileClose?.();
    };
    window.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, onMobileClose]);

  const handleLogout = () => {
    onMobileClose?.();
    navigate('/login');
  };

  const fecharDrawer = () => onMobileClose?.();

  return (
    <>
      <div
        className={`${styles.backdrop}${mobileOpen ? ` ${styles.backdropAberto}` : ''}`}
        onClick={fecharDrawer}
        role="presentation"
        aria-hidden="true"
      />

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.sidebarMobileOpen : ''}`}
        aria-label="Navegação lateral principal"
      >
        <div className={styles.brandContainer}>
          <Link to="/agenda" className={styles.brand} title="Lumina Odontologia">
            <img src={logoImg} alt="Lumina Odontologia" className={styles.logo} />
            {!isCollapsed && (
              <>
                <span className={styles.brandName}>LUMINA</span>
                <span className={styles.brandSubtitle}>ODONTOLOGIA</span>
              </>
            )}
          </Link>

          <button
            type="button"
            onClick={fecharDrawer}
            className={styles.closeButton}
            aria-label="Fechar menu de navegação"
          >
            <X size={18} />
          </button>

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className={styles.toggleButton}
              aria-label={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        <nav className={styles.navSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matches(location.pathname);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                title={isCollapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={fecharDrawer}
              >
                <span className={styles.navIcon}>
                  <Icon size={20} />
                </span>
                {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutButton}
            aria-label="Sair do sistema"
            title={isCollapsed ? 'Sair' : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
