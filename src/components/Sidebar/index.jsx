import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, BriefcaseMedical, LayoutGrid, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
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
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    matches: (pathname) => pathname.startsWith('/dashboard'),
  },
];

export function Sidebar({ isCollapsed = false, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}
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
  );
}

export default Sidebar;
