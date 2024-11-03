import styles from './ProjectCreate.module.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../../../../components/button/Button';
import TeamMemberGrid from './teamMember/TeamMemberGrid';

const ProjectCreate = () => {
  const [startDate, setStartDate] = useState<Date|null>(null);
  const [endDate, setEndDate] = useState<Date|null>(null);
  const [image] = useState(null);

  const handleImageClick = () => {
    // 이미지 선택 로직
  };

  return (
    <div className={styles.container}>
      {/* 상단 구역 */}
      <div className={styles.topSection}>
        {/* 왼쪽 구역 - 대표 사진 */}
        <div className={styles.imageSection} onClick={handleImageClick}>
          {image ? (
            <img src={image} alt="대표 사진" className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>사진 추가</div>
          )}
        </div>
        {/* 오른쪽 구역 - 프로젝트 이름 및 팀 이름 */}
        <div className={styles.infoSection}>
          <input type="text" placeholder="프로젝트 이름" className={styles.input} />
          <input type="text" placeholder="팀 이름" className={styles.input} />
        </div>
      </div>

      {/* 팀원 추가 모달 (현재 비워둠) */}
      <div className={styles.teamMemberModal}><TeamMemberGrid/></div>

      {/* 프로젝트 기간 입력 */}
      <div className={styles.dateSection}>
        <div>
          <label>프로젝트 시작일자:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="시작일 선택"
            className={styles.dateInput}
          />
        </div>
        <span className={styles.dateSeparator}>~</span>
        <div>
          <label>프로젝트 종료일자:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="종료일 선택"
            className={styles.dateInput}
          />
        </div>
      </div>
      <hr />
      <div className={styles.footer}>
          <Button children="프로젝트 생성" colorType='blue' size='small'></Button>

      </div>
    </div>
  );
};

export default ProjectCreate;
