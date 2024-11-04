import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import Proposal from '../../features/project/components/propasal/Proposal';
import FeatureSpec from '../../features/project/components/featureSpec/FeatureSpec';
import ApiSpec from '../../features/project/components/apiSpec/ApiSpec';
import ERD from '../../features/project/components/erd/ERD';
import styles from './ProjectOutputPage.module.css';
import { useState } from 'react';


const ProjectOutputPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [showOutput, setShowOutput] = useState('proposal')

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.outputHeader}>
        <div
          className={`${styles.outputButton} ${
            showOutput === 'proposal' ? styles.active : ''
          }`}
          onClick={() => setShowOutput('proposal')}
        >
          기획서
        </div>
        <div
          className={`${styles.outputButton} ${
            showOutput === 'featureSpec' ? styles.active : ''
          }`}
          onClick={() => setShowOutput('featureSpec')}
        >
          기능명세서
        </div>
        <div
          className={`${styles.outputButton} ${
            showOutput === 'APIspec' ? styles.active : ''
          }`}
          onClick={() => setShowOutput('APIspec')}
        >
          api명세서
        </div>
        <div
          className={`${styles.outputButton} ${
            showOutput === 'ERD' ? styles.active : ''
          }`}
          onClick={() => setShowOutput('ERD')}
        >
          ERD
        </div>
      </div>
      {showOutput === 'proposal' && <Proposal/>}
      {showOutput === 'featureSpec' && <FeatureSpec/>}
      {showOutput === 'APIspec' && <ApiSpec/>}
      {showOutput === 'ERD' && <ERD/>}
    </div>
  );
};

export default ProjectOutputPage;
