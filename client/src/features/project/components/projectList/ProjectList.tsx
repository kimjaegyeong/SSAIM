import styles from './ProjectList.module.css';
import React from 'react';
import { ProjectDTO } from '../../types/ProjectDTO';
import Button from '../../../../components/button/Button';
import { useProjectListData } from '../../hooks/useProjectListData';
import { dateToString } from '../../../../utils/dateToString';
import { useNavigate } from 'react-router-dom';

interface ProjectListItemProps {
  projectInfo: ProjectDTO;
  onClick: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ projectInfo, onClick }) => {
  return (
    <div className={styles.projectItem} onClick={onClick}>
      <div className={styles.cardLeft}>
        <img src={projectInfo.profileImage} className={styles.profileImage} alt="thumbnail" />
      </div>
      <div className={styles.cardRight}>
        <h2>{projectInfo.title}</h2>
        <p>팀장 : 허일영</p>
        <p>팀원 : 두경민, 전성현, 유기상, 타마요, 마레이</p>
        <p>
          {dateToString(projectInfo.startDate)} ~ {dateToString(projectInfo.endDate)}
        </p>
      </div>
    </div>
  );
};
const ProjectList: React.FC = () => {
  const { data: projectListData } = useProjectListData();
  const navigate = useNavigate();
  const handleItemClick = (projectId: number) => () => {
    navigate(`/project/${projectId}`);
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.projectTitle}>프로젝트 목록</h1>
        <Button children={'프로젝트 생성'} size="small" colorType="blue" />
      </div>
      <div className={styles.body}>
        {projectListData.map((project) => (
          <ProjectListItem key={project.projectId} projectInfo={project} onClick={handleItemClick(project.projectId)} />
        ))}
      </div>
    </>
  );
};

export default ProjectList;
