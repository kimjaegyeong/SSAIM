import React from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import styles from './ProjectHeader.module.css';
import { useProjectInfo } from '../hooks/useProjectInfo';

interface ProjectHeaderProps {
  projectId: string;
  isDaily?: boolean;
  setIsDaily?: (value: boolean) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectId, isDaily, setIsDaily }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {data : projectInfo} = useProjectInfo(Number(projectId));

  const isActiveLink = (path: string) => {
    return location.pathname.startsWith(path); // 경로가 주어진 경로로 시작하는지 확인
  };

  const getLinkClass = (path: string) => {
    return isActiveLink(path) ? styles.activeLink : styles.navLink;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const toggleRemindState = () => {
    if (setIsDaily) {
      setIsDaily(!isDaily);
    }
  };

  return (
    <div className={styles.projectHeader}>
      <h1
        className={styles.projectTitle}
        onClick={() => handleNavigation(`/project/${projectId}/info`)}
        style={{ cursor: 'pointer' }} // 클릭 가능하도록 스타일 추가
      >
        {projectInfo?.title}
      </h1>
      <nav className={styles.projectNavbar}>
        <ul className={styles.navList}>
          <li>
            <p
              className={getLinkClass(`/project/${projectId}/info`)}
              onClick={() => handleNavigation(`/project/${projectId}/info`)}
            >
              개요
            </p>
          </li>
          <li>
            <p
              className={getLinkClass(`/project/${projectId}/sprint`)}
              onClick={() => handleNavigation(`/project/${projectId}/sprint`)}
            >
              스프린트 관리
            </p>
          </li>
          <li>
            <p
              className={getLinkClass(`/project/${projectId}/output`)}
              onClick={() => handleNavigation(`/project/${projectId}/output`)}
            >
              산출물
            </p>
          </li>
          <li>
            <p
              className={getLinkClass(`/project/${projectId}/meeting`)}
              onClick={() => handleNavigation(`/project/${projectId}/meeting`)}
            >
              회의록
            </p>
          </li>
          {location.pathname === `/project/${projectId}/remind` ? (
            <>
              <li>
                <p
                  className={isDaily ? styles.activeLink : styles.navLink}
                  onClick={toggleRemindState}
                >
                  일간
                </p>
              </li>
              <li>
                <p
                  className={!isDaily ? styles.activeLink : styles.navLink}
                  onClick={toggleRemindState}
                >
                  주간
                </p>
              </li>
            </>
          ) : (
            <li>
              <p
                className={getLinkClass(`/project/${projectId}/remind`)}
                onClick={() => handleNavigation(`/project/${projectId}/remind`)}
              >
                회고
              </p>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default ProjectHeader;
