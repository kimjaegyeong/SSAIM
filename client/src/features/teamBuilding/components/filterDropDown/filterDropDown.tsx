import React, { useState } from 'react';
import styles from './filterDropDown.module.css';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  selectedOption: Option | null;
  onSelect: (option: Option) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedOption, onSelect, placeholder = '선택하세요' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOptionClick = (option: Option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.button} onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? selectedOption.label : placeholder}
      </button>
      {isOpen && (
        <ul className={styles.options}>
          {options.map(option => (
            <li 
              key={option.value} 
              className={`${styles.option} ${selectedOption?.value === option.value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
