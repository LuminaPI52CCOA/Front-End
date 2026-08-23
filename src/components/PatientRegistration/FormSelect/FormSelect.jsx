import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './FormSelect.module.css';

export const FormSelect = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Escolha',
  name,
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectId = id || name;

  // Fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (isOpen) {
          setIsOpen(false);
          if (onBlur) onBlur({ target: { name } });
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onBlur, name]);

  const handleSelectOption = (optValue) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { name, value: optValue } });
    }
    setIsOpen(false);
    if (onBlur) onBlur({ target: { name } });
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const selectedOptionObj = options.find((opt) => {
    const val = typeof opt === 'string' ? opt : opt.value;
    return val === value;
  });

  const selectedLabel = selectedOptionObj
    ? typeof selectedOptionObj === 'string'
      ? selectedOptionObj
      : selectedOptionObj.label
    : '';

  return (
    <div className={styles.selectGroup} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.selectContainer}>
        {/* Hidden input to pass ref for React Hook Form focus */}
        <input
          type="hidden"
          ref={ref}
          name={name}
          id={selectId}
          value={value || ''}
          disabled={disabled}
          {...props}
        />

        <button
          type="button"
          disabled={disabled}
          className={`${styles.triggerButton} ${disabled ? styles.triggerDisabled : ''} ${error ? styles.selectError : ''} ${
            isOpen ? styles.triggerOpen : ''
          }`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={!selectedLabel ? styles.placeholderText : ''}>
            {selectedLabel || placeholder}
          </span>
          <div className={`${styles.iconWrapper} ${isOpen ? styles.iconOpen : ''}`}>
            <ChevronDown size={18} />
          </div>
        </button>

        {isOpen && !disabled && (
          <ul className={styles.dropdownMenu} role="listbox">
            {options.map((opt) => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const isSelected = optValue === value;

              return (
                <li
                  key={optValue}
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.optionItem} ${
                    isSelected ? styles.selectedOption : ''
                  }`}
                  onClick={() => handleSelectOption(optValue)}
                >
                  <span>{optLabel}</span>
                  {isSelected && <Check size={16} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';
