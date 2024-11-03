import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProjectRemindPage.module.css';
import { RxHamburgerMenu } from "react-icons/rx";
import ProjectHeader from '../../features/project/components/ProjectHeader';
import DailyContainer from '../../features/project/components/remind/daily/DailyContainer';
import SprintContainer from '../../features/project/components/remind/sprint/SprintContainer';


const ProjectRemindPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [isDaily, setIsDaily] = useState(true);

  const handleMoveClick = () => {
    setIsDaily(!isDaily);
  };

  return (
    <div className={styles.pageContainer}>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.move} onClick={handleMoveClick}>
        {isDaily ? '주간 회고 이동' : '일일 회고 이동'}
        <RxHamburgerMenu />
      </div>
      {isDaily ? <DailyContainer /> : <SprintContainer />}
    </div>
  );
};

export default ProjectRemindPage;
