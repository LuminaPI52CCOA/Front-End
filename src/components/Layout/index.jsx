import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import styles from './styles.module.css';

export function Layout() {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
