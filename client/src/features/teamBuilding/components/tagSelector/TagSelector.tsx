import React, { useState } from 'react';
import Tag from '../tag/Tag';
import styles from './TagSelector.module.css';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { getPositionLabel } from '../../../../utils/labelUtils'

interface TagSelectorProps {
  onTagChange: (tag: number) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ onTagChange }) => {
  const [tag, setTag] = useState<number>(0);
  const tags: number[] = [1, 2, 3];

  const handleTagChange = (direction: 'up' | 'down') => {
    const currentIndex = tags.indexOf(tag);
    const newTag = direction === 'up'
      ? tags[(currentIndex + 1) % tags.length]
      : tags[(currentIndex - 1 + tags.length) % tags.length];
      
    setTag(newTag);
    onTagChange(newTag);
  };

  return (
    <div className={styles.tagSelector}>
      <FaChevronUp className={styles.changeButton} onClick={() => handleTagChange('up')} color='#d9d9d9' />
      <Tag text={getPositionLabel(tag)} disablePointerCursor={true} />
      <FaChevronDown className={styles.changeButton} onClick={() => handleTagChange('down')} color='#d9d9d9' />
    </div>
  );
};

export default TagSelector;
