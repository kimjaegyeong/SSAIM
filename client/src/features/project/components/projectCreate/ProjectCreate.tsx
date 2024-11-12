import styles from './ProjectCreate.module.css';
import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [projectData, setProjectData] = useState<ProjectCreateDTO>({
    title: '',
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    teamMembers: [],
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null); // 미리보기 URL 상태 추가
  const { members, leaderId } = useTeamStore();

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectImage(file);
      setProjectImagePreview(URL.createObjectURL(file)); // 미리보기 URL 설정
    }
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
      const transformedTeamMembers = members.map(transformToProjectMember);
      transformedTeamMembers.forEach((e, i) => {
        if (e.id === leaderId) {
          transformedTeamMembers[i].role = 1;
        }
      });

      const updatedProjectData = {
        ...projectData,
        teamMembers: transformedTeamMembers,
      };

      await createProject(updatedProjectData, projectImage);
      navigate('/project');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.imageSection} onClick={handleImageClick}>
          {projectImagePreview ? (
            <img src={projectImagePreview} alt="대표 사진" className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>사진 추가</div>
          )}
        </div>
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
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

      <div className={styles.teamMemberModal}>
        <TeamMemberGrid />
      </div>

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

      <div className={styles.footer}>
        <Button colorType="blue" size="small" onClick={handleSubmit}>
          프로젝트 생성
        </Button>
      </div>
    </div>
  );
};

export default ProjectCreate;
