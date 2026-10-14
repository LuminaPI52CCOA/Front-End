import { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
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
  multiple = false,
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
    
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
      const isSelected = currentValues.includes(optValue);
      let newValues;
      
      if (isSelected) {
        newValues = currentValues.filter(v => v !== optValue);
      } else {
        newValues = [...currentValues, optValue];
      }
      
      if (onChange) {
        onChange({ target: { name, value: newValues } });
      }
      // Don't close dropdown for multiple select
    } else {
      if (onChange) {
        onChange({ target: { name, value: optValue } });
      }
      setIsOpen(false);
      if (onBlur) onBlur({ target: { name } });
    }
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const isValueSelected = (optValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optValue);
    }
    return optValue === value || (value !== '' && value !== null && value !== undefined && String(optValue) === String(value));
  };

  const getSelectedLabels = () => {
    if (!multiple) {
      const selectedOptionObj = options.find((opt) => {
        const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
        return val === value || (value !== '' && value !== null && value !== undefined && String(val) === String(value));
      });
      return selectedOptionObj
        ? typeof selectedOptionObj === 'object' && selectedOptionObj !== null
          ? selectedOptionObj.label
          : selectedOptionObj
        : '';
    }
    
    if (!Array.isArray(value) || value.length === 0) return '';
    
    return value.map(v => {
      const opt = options.find(o => {
        const val = typeof o === 'object' && o !== null ? o.value : o;
        return val === v;
      });
      return opt ? (typeof opt === 'object' && opt !== null ? opt.label : opt) : v;
    }).join(', ');
  };

  const selectedLabels = getSelectedLabels();

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
          value={multiple ? (Array.isArray(value) ? value.join(',') : '') : (value !== undefined && value !== null ? value : '')}
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
          {multiple ? (
            <div className={styles.multiSelectedWrapper}>
              {selectedLabels ? (
                <>
                  {selectedLabels.split(', ').map((label, idx) => (
                    <span key={idx} className={styles.selectedChip}>
                      {label}
                      <button
                        type="button"
                        className={styles.chipRemove}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOption(label);
                        }}
                        aria-label={`Remover ${label}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </>
              ) : (
                <span className={styles.placeholderText}>{placeholder}</span>
              )}
            </div>
          ) : (
            <span className={!selectedLabels ? styles.placeholderText : ''}>
              {selectedLabels || placeholder}
            </span>
          )}
          <div className={`${styles.iconWrapper} ${isOpen ? styles.iconOpen : ''}`}>
            <ChevronDown size={18} />
          </div>
        </button>

        {isOpen && !disabled && (
          <ul className={styles.dropdownMenu} role="listbox">
            {options.map((opt) => {
              const optValue = typeof opt === 'object' && opt !== null ? opt.value : opt;
              const optLabel = typeof opt === 'object' && opt !== null ? opt.label : opt;
              const isSelected = isValueSelected(optValue);

              return (
                <li
                  key={String(optValue)}
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
