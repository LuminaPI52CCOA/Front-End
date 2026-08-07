import React from 'react';
import { User, MapPin, Users } from 'lucide-react';
import styles from './Stepper.module.css';

const allSteps = [
  {
    id: 0,
    title: 'Dados Pessoais',
    icon: User,
  },
  {
    id: 1,
    title: 'Endereço &\nContato',
    icon: MapPin,
  },
  {
    id: 2,
    title: 'Responsável\nLegal',
    icon: Users,
    requiresMinor: true,
  },
];

export const Stepper = ({ currentStep, onStepClick, isMinor }) => {
  const visibleSteps = allSteps.filter(
    (step) => !step.requiresMinor || isMinor
  );

  return (
    <nav className={styles.stepperNav} aria-label="Etapas do cadastro">
      {visibleSteps.map((step) => {
        const IconComponent = step.icon;
        const isActive = currentStep === step.id;
        return (
          <button
            key={step.id}
            type="button"
            className={`${styles.stepItem} ${isActive ? styles.activeStep : ''}`}
            onClick={() => onStepClick(step.id)}
          >
            <div className={styles.iconContainer}>
              <IconComponent size={22} />
            </div>
            <span className={styles.stepLabel}>{step.title}</span>
          </button>
        );
      })}
    </nav>
  );
};
