import React from 'react';
import { Link } from 'react-router-dom';

const ProjectListPage = () => {
  return (
    <div>
      <h2>프로젝트 목록 페이지</h2>
      {/* Link 컴포넌트를 사용하여 projectId를 URL 파라미터로 전달 */}
      <Link to="/project/1">프로젝트 1 상세 페이지로 이동</Link>
    </div>
  );
};

export default ProjectListPage;
