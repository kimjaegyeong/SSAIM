import React from 'react';
import styles from './Bar.module.css';

interface BarProps {
    currentMembers: number;
    totalMembers: number;
}

const Bar: React.FC<BarProps> = ({ currentMembers, totalMembers }) => {
    const percentage = totalMembers > 0 ? (currentMembers / totalMembers) * 100 : 0;

    let barColor = '#f00';

    if (percentage >= 80) {
        barColor = '#4caf50';
    } else if (percentage >= 50) {
        barColor = '#ffa500';
    }

    return (
        <div className={styles.barWrapper}>
            <span 
                className={styles.memberCount}
                style={{
                    color: barColor,
                }}
            >
                {currentMembers}    
            </span> 
            <div className={styles.barContainer}>
                <div
                    className={styles.bar}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: barColor,
                    }}
                />
            </div>
        </div>
    );
};

export default Bar;
