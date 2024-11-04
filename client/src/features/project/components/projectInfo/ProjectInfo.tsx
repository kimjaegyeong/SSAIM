import styles from './ProjectInfo.module.css';
import ProgressChart from '../dashboard/progressChart/ProgressChart';
import Button from '../../../../components/button/Button';
import { FaPen } from "react-icons/fa6";
import EditProjectInfoModal from './editProjectInfo/EditProjectInfo';
import { useState } from 'react';

const ProjectInfo: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const project = {
    profileImage: 'path/to/projectImage.jpg',
    name: '프로젝트 이름',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    createdAt: '2024-01-01',
    modifiedAt: '2024-10-01',
    teamMembers: [
      { id: 1, name: '홍길동', profileImage: 'path/to/member1.jpg' },
      { id: 2, name: '김영희', profileImage: 'path/to/member2.jpg' },
    ],
  };

  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.leftSection}>
        <div className={styles.projectDetails}>
          <img src={project.profileImage} alt="프로젝트 프로필" className={styles.projectImage} />
          <div className={styles.projectText}>
            <h2>{project.name}</h2>
            <p>
              프로젝트 기간: {project.startDate} ~ {project.endDate}
            </p>
            <div className={styles.dates}>
              <span>프로젝트 생성일: {project.createdAt}</span>
              <span>최근 수정일: {project.modifiedAt}</span>
            </div>
          </div>
          <span className={styles.modify} onClick={()=>{setIsEditModalOpen(true)}}><FaPen />
          </span>
        </div>

        <div className={styles.leftLowerSection}>
          {/* 버튼 6개가 위치할 왼쪽 영역 */}
          <div className={styles.buttonGrid}>
          <Button children="Jira" colorType='blue' size='small'></Button>
          <Button children="GitLab" colorType='blue' size='small'></Button>
          <Button children="주간 진행상황" colorType='blue' size='small'></Button>
          <Button children="산출물" colorType='blue' size='small'></Button>
          <Button children="회의록" colorType='blue' size='small'></Button>
          <Button children="회고" colorType='blue' size='small'></Button>
          </div>

          {/* 컴포넌트가 들어갈 오른쪽 영역 */}
          <div
          className={styles.componentArea}>
          <ProgressChart />

          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <h3>팀원 정보</h3>
        <div className={styles.teamMembers}>
          {project.teamMembers.map((member) => (
            <div key={member.id} className={styles.teamMember}>
              <img src={member.profileImage} alt={member.name} className={styles.memberImage} />
              <span>{member.name}</span>
            </div>
          ))}
        </div>
      </div>
      {isEditModalOpen && (
        <EditProjectInfoModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default ProjectInfo;
