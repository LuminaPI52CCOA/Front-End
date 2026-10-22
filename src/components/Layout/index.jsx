import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../Sidebar';
import styles from './styles.module.css';

export function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('lumina_sidebar_collapsed') === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('lumina_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div
        className={`${styles.mainContent} ${isCollapsed ? styles.mainContentCollapsed : ''}`}
      >
        <header className={styles.mobileTopBar}>
          <button
            type="button"
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={22} />
          </button>
        </header>

        <div className={styles.pageArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
