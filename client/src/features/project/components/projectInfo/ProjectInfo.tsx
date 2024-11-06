import styles from './ProjectInfo.module.css';
import ProgressChart from '../dashboard/progressChart/ProgressChart';
import Button from '../../../../components/button/Button';
import { FaPen } from 'react-icons/fa6';
import EditProjectInfoModal from './editProjectInfo/EditProjectInfo';
import { useState } from 'react';
import { useProjectInfo } from '@features/project/hooks/useProjectInfo';
import { ProjectInfoMemberDTO } from '../../types/ProjectDTO';

interface ProjectInfoProps {
  projectId: number;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectId }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: projectInfo } = useProjectInfo(projectId);
  console.log(projectId)
  console.log(projectInfo);
  return (
    <div className={styles.projectInfoContainer}>
      <div className={styles.leftSection}>
        <div className={styles.projectDetails}>
          <img src={projectInfo.profileImage} alt="프로젝트 프로필" className={styles.projectImage} />
          <div className={styles.projectText}>
            <h2>{projectInfo.name}</h2>
            <p>
              프로젝트 기간: {projectInfo.startDate} ~ {projectInfo.endDate}
            </p>
            <div className={styles.dates}>
              <span>프로젝트 생성일: {projectInfo.createdAt}</span>
              <span>최근 수정일: {projectInfo.modifiedAt}</span>
            </div>
          </div>
          <span
            className={styles.modify}
            onClick={() => {
              setIsEditModalOpen(true);
            }}
          >
            <FaPen />
          </span>
        </div>

        <div className={styles.leftLowerSection}>
          {/* 버튼 6개가 위치할 왼쪽 영역 */}
          <div className={styles.buttonGrid}>
            <Button children="Jira" colorType="blue" size="small"></Button>
            <Button children="GitLab" colorType="blue" size="small"></Button>
            <Button children="주간 진행상황" colorType="blue" size="small"></Button>
            <Button children="산출물" colorType="blue" size="small"></Button>
            <Button children="회의록" colorType="blue" size="small"></Button>
            <Button children="회고" colorType="blue" size="small"></Button>
          </div>

          {/* 컴포넌트가 들어갈 오른쪽 영역 */}
          <div className={styles.componentArea}>
            <ProgressChart />
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <h3>팀원 정보</h3>
        <div className={styles.teamMembers}>
          {projectInfo.projectMemberFindResponseDtoList?.map((member:ProjectInfoMemberDTO) => (
            <div key={member.userId} className={styles.teamMember}>
              <img src={member.profileImage} alt={member.name} className={styles.memberImage} />
              <span>{member.name}</span>
            </div>
          ))}
        </div>
      </div>
      {isEditModalOpen && <EditProjectInfoModal onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

export default ProjectInfo;
