import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, BriefcaseMedical, LayoutGrid, LogOut } from 'lucide-react';
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

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar} aria-label="Navegação lateral principal">
      <Link to="/agenda" className={styles.brand}>
        <img src={logoImg} alt="Lumina Odontologia" className={styles.logo} />
        <span className={styles.brandName}>LUMINA</span>
        <span className={styles.brandSubtitle}>ODONTOLOGIA</span>
      </Link>

      <nav className={styles.navSection}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matches(location.pathname);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>
                <Icon size={20} />
              </span>
              <span className={styles.navLabel}>{item.label}</span>
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
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
