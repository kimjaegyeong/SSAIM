import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';

const ProjectSprintPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      스프린트
    </div>
  );
};

export default ProjectSprintPage;
