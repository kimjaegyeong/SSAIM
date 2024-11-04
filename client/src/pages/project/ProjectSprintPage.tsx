// import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import WeeklyProgress from '../../features/project/components/sprint/Sprint';

const ProjectSprintPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <WeeklyProgress/>
    </div>
  );
};

export default ProjectSprintPage;
