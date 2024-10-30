import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';

const ProjectOutputPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      산출물
    </div>
  );
};

export default ProjectOutputPage;
