import styles from './ProjectCreate.module.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../../../components/button/Button';
import TeamMemberGrid from './teamMember/TeamMemberGrid';
import { ProjectCreateDTO } from '@features/project/types/ProjectDTO';
import { createProject } from '@features/project/apis/createProject';
import { useNavigate } from 'react-router-dom';
import { transformToProjectMember } from '@features/project/utils/transformers';
import useTeamStore from '../../stores/useTeamStore';

const ProjectCreate = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<ProjectCreateDTO>({
    title: '',
    name: '',
    profileImage: '',
    startDate: new Date(),
    endDate: new Date(),
    teamMembers: [],
  });
  const { members, leaderId } = useTeamStore();
  const handleImageClick = () => {
    // 이미지 선택 로직
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    setProjectData((prevData) => ({
      ...prevData,
      [field]: date ? date.toISOString() : null,
    }));
  };

  const handleSubmit = async () => {
    try {
      // teamMembers 변환
      const transformedTeamMembers = members.map(transformToProjectMember);
      transformedTeamMembers.forEach((e, i) => {if(e.id === leaderId){
        console.log(e)
        transformedTeamMembers[i].role = 1;
        console.log('transformed', transformedTeamMembers)
      }})
      // projectData 업데이트
      const updatedProjectData = {
        ...projectData,
        teamMembers: transformedTeamMembers,
      };

      // 프로젝트 생성 요청
      await createProject(updatedProjectData);
      navigate('/project');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      {/* 상단 구역 */}
      <div className={styles.topSection}>
        {/* 왼쪽 구역 - 대표 사진 */}
        <div className={styles.imageSection} onClick={handleImageClick}>
          {projectData?.profileImage ? (
            <img src={projectData.profileImage} alt="대표 사진" className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>사진 추가</div>
          )}
        </div>
        {/* 오른쪽 구역 - 프로젝트 이름 및 팀 이름 */}
        <div className={styles.infoSection}>
          <input
            type="text"
            name="title"
            placeholder="프로젝트 이름"
            value={projectData.title}
            onChange={handleInputChange}
            className={styles.input}
          />
          <input
            type="text"
            name="name"
            placeholder="팀 이름"
            value={projectData.name}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
      </div>

      {/* 팀원 추가 모달 */}
      <div className={styles.teamMemberModal}>
        <TeamMemberGrid />
      </div>

      {/* 프로젝트 기간 입력 */}
      <div className={styles.dateSection}>
        <div>
          <label>프로젝트 시작일자:</label>

          <DatePicker
            selected={projectData.startDate ? new Date(projectData.startDate) : null}
            onChange={(date) => handleDateChange(date, 'startDate')}
            dateFormat="yyyy/MM/dd"
            placeholderText="시작일 선택"
            className={styles.dateInput}
          />
        </div>
        <span className={styles.dateSeparator}>~</span>
        <div>
          <label>프로젝트 종료일자:</label>
          <DatePicker
            selected={projectData.endDate ? new Date(projectData.endDate) : null}
            onChange={(date) => handleDateChange(date, 'endDate')}
            dateFormat="yyyy/MM/dd"
            placeholderText="종료일 선택"
            className={styles.dateInput}
          />
        </div>
      </div>

      <hr />

      {/* 하단 버튼 */}
      <div className={styles.footer}>
        <Button colorType="blue" size="small" onClick={handleSubmit}>
          프로젝트 생성
        </Button>
      </div>
    </div>
  );
};

export default ProjectCreate;
