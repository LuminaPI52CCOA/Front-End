import React from 'react';
import styles from './styles.module.css';

export const Button = ({ children, icon, ...props }) => {
  return (
    <button className={styles.styledButton} {...props}>
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
};