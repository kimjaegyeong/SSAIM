import React from 'react';
import styles from './MySprint.module.css';
import { FaArrowRotateRight } from "react-icons/fa6";

interface Content {
  content: string;
}

interface MySprintProps {
  contents: Content[];
}

const MySprint: React.FC<MySprintProps> = ({ contents }) => {
  const [keep, problem, trySection] = contents[0]?.content.split("\n\n") || [];

  return (
    <div className={styles.myReviewContainer}>
      <div className={styles.myReview}>
        {/* Keep 섹션 */}
        <div className={styles.keepSection}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.h3}>Keep</h3>
          </div>
          <div className={styles.reviewContainer}>
            <p className={styles.p}>{keep}</p>
          </div>
        </div>

        {/* Problem 섹션 */}
        <div className={styles.problemSection}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.h3}>Problem</h3>
          </div>
          <div className={styles.reviewContainer}>
            <p className={styles.p}>{problem}</p>
          </div>
        </div>

        {/* Try 섹션 */}
        <div className={styles.trySection}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.h3}>Try</h3>
          </div>
          <div className={styles.reviewContainer}>
            <p className={styles.p}>{trySection}</p>
          </div>
        </div>
      </div>
      {contents.length > 0 && (
        <div className={styles.editbox}>
          <div className={styles.editButton}>
            <FaArrowRotateRight />
            <p className={styles.p}>다시 생성하기</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySprint;
