// import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import WeeklySprint from '../../features/project/components/sprint/WeeklySprint';

const ProjectSprintPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <WeeklySprint/>
    </div>
  );
};

export default ProjectSprintPage;
