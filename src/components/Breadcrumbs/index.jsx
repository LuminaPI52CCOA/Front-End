import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import styles from './styles.module.css';

const routeLabels = {
  agenda: 'Agenda',
  pacientes: 'Pacientes',
  novo: 'Novo Paciente',
  dentistas: 'Dentistas',
  dashboard: 'Dashboard',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) return null;

  const getBreadcrumbLabel = (segment, index, array) => {
    if (routeLabels[segment]) {
      return routeLabels[segment];
    }
    if (!isNaN(segment)) {
      const prev = array[index - 1];
      if (prev === 'pacientes') return 'Perfil do Paciente';
      if (prev === 'dentistas') return 'Perfil do Dentista';
      return `Item #${segment}`;
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const breadcrumbs = pathnames.map((segment, index) => {
    const url = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = getBreadcrumbLabel(segment, index, pathnames);
    const isLast = index === pathnames.length - 1;

    return { url, label, isLast };
  });

  return (
    <nav className={styles.breadcrumbs} aria-label="Navegação estrutural">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link to="/agenda" className={styles.link} title="Início">
            <Home size={15} className={styles.homeIcon} />
            <span>Início</span>
          </Link>
        </li>
        {breadcrumbs.map((crumb) => (
          <li key={crumb.url} className={styles.item}>
            <ChevronRight size={14} className={styles.separator} aria-hidden="true" />
            {crumb.isLast ? (
              <span className={styles.current} aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.url} className={styles.link}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
