import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import DailyContainer from '../../features/project/components/remind/daily/DailyContainer';


const ProjectRemindPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <DailyContainer/>
    </div>
  );
};

export default ProjectRemindPage;
