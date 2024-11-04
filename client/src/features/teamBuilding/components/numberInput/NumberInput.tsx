import React, { useState } from "react";
import styles from "./NumberInput.module.css";

interface NumberInputProps {
    onChange?: (value: string) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ onChange }) => {
    const [value, setValue] = useState<string>("0");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (/^\d?$/.test(newValue)) { 
            setValue(newValue);
            if (onChange) {
                onChange(newValue);
            }
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const increment = () => {
        setValue((prev) => {
            const newValue = parseInt(prev, 10) < 9 ? (parseInt(prev, 10) + 1).toString() : prev;
            if (onChange) {
                onChange(newValue);
            }
            return newValue;
        });
    };

    const decrement = () => {
        setValue((prev) => {
            const newValue = parseInt(prev, 10) > 0 ? (parseInt(prev, 10) - 1).toString() : prev;
            if (onChange) {
                onChange(newValue);
            }
            return newValue;
        });
    };

    return (
        <div className={styles.numberInputContainer}>
            <button type="button" className={styles.decrement} onClick={decrement}>◀</button>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={handleFocus}
                className={styles.numberInput}
            />
            <button type="button" className={styles.increment} onClick={increment}>▶</button>
        </div>
    );
};

export default NumberInput;
