// import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import Proposal from '../../features/project/components/propasal/Proposal';
import FeatureSpec from '../../features/project/components/featureSpec/FeatureSpec';


const ProjectOutputPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <Proposal/>
      <FeatureSpec/>
    </div>
  );
};

export default ProjectOutputPage;
