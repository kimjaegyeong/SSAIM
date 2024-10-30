import React from 'react';
import styles from './Tag.module.css';

interface TagProps {
    text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
    // 기본 색상 정의
    const defaultBackgroundColor = '#d9d9d9';
    const defaultFontColor = '#000000';

    // 색상 맵 정의
    const colorMap: { [key: string]: { backgroundColor: string; fontColor: string } } = {
        FE: { backgroundColor: '#B6EDD7', fontColor: '#0EA475' },
        BE: { backgroundColor: '#D9E5F8', fontColor: '#427DDC' },
        Infra: { backgroundColor: '#FFF0D8', fontColor: '#FFA308' },
        자유주제: { backgroundColor: '#17C585', fontColor: '#FFFFFF' },
        기업연계: { backgroundColor: '#913BF6', fontColor: '#FFFFFF' },
    };

    // 해당 텍스트에 맞는 색상 가져오기
    const { backgroundColor, fontColor } = colorMap[text] || { backgroundColor: defaultBackgroundColor, fontColor: defaultFontColor };

    return (
        <span
            className={styles.tag}
            style={{ backgroundColor, color: fontColor }}
        >
            {text}
        </span>
    );
};

export default Tag;
