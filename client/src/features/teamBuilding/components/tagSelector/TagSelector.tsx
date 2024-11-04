import React, { useState } from 'react';
import Tag from '../tag/Tag';
import styles from './TagSelector.module.css';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const TagSelector: React.FC = () => {
  const [tag, setTag] = useState<string>('FE');
  const tags: string[] = ['FE', 'BE', 'Infra'];

  const handleTagChange = (direction: 'up' | 'down') => {
    const currentIndex = tags.indexOf(tag);
    if (direction === 'up') {
      setTag(tags[(currentIndex + 1) % tags.length]);
    } else if (direction === 'down') {
      setTag(tags[(currentIndex - 1 + tags.length) % tags.length]);
    }
  };

  return (
    <div className={styles.tagSelector}>
      <FaChevronUp className={styles.changeButton} onClick={() => handleTagChange('up')} color='#d9d9d9' />
      <Tag text={tag} disablePointerCursor={true} />
      <FaChevronDown className={styles.changeButton} onClick={() => handleTagChange('down')} color='#d9d9d9' />
    </div>
  );
};

export default TagSelector;