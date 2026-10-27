import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { ConsultasProvider } from '../../context/ConsultasContexto';
import styles from './styles.module.css';

export function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('lumina_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('lumina_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <ConsultasProvider>
      <div className={styles.layoutContainer}>
        <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        <div
          className={`${styles.mainContent} ${isCollapsed ? styles.mainContentCollapsed : ''}`}
        >
          <div className={styles.pageArea}>
            <Outlet />
          </div>
        </div>
      </div>
    </ConsultasProvider>
  );
}

export default Layout;
