import styles from './ProjectCreate.module.css';
import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../../../components/button/Button';
import TeamMemberGrid from './teamMember/TeamMemberGrid';
import { ProjectCreateDTO } from '@features/project/types/ProjectDTO';
import { createProject } from '@features/project/apis/createProject';
import { useNavigate } from 'react-router-dom';
import { transformToProjectMember } from '@features/project/utils/transformers';
import { deletePost } from '@/features/teamBuilding/apis/teamBuildingDetail/teamBuildingDetail';
import useTeamStore from '../../stores/useTeamStore';
import { showToast } from '@/utils/toastUtils';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import useUserStore from '@/stores/useUserStore';
import { toast } from 'react-toastify';
const ProjectCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { members, leaderId, postId, startDate, endDate, setStartDate, setEndDate, addMember } = useTeamStore();
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);
  const [projectData, setProjectData] = useState<ProjectCreateDTO>({
    title: '',
    name: '',
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: endDate ? new Date(endDate) : new Date(),
    teamMembers: [],
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null); // 미리보기 URL 상태 추가
  useEffect(() => {
    if (members?.length === 0 && userId && userInfo)
      addMember({
        userId: userId,
        userName: userInfo?.userName,
        userEmail: userInfo?.userEmail,
        userProfileImage: userInfo?.userProfileImage,
      });
  }, [userId, members.length, addMember, userInfo]);
  useEffect(() => {
    setProjectData((prevData) => ({
      ...prevData,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
    }));
  }, [startDate, endDate]);
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert('허용된 이미지 형식(.jpg, .jpeg, .png, .gif)만 업로드 가능합니다.');
        return;
      }
      setProjectImage(file);
      setProjectImagePreview(URL.createObjectURL(file)); // 미리보기 URL 설정
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // 20글자 제한
    const type = name === 'title' ? '프로젝트 이름' : '팀 이름'
    const toastId = `${type}-length-warning`
    if (value.length > 20) {
      if (!toast.isActive(toastId)) {
      
        showToast.warn(`${name === 'title' ? '프로젝트 이름' : '팀 이름'}은 최대 20자까지 입력 가능합니다.`, {
          toastId: `${name === 'title' ? '프로젝트 이름' : '팀 이름'}-length-warning`, // 고유 ID로 중복 방지
        });
      }
      return;
    }

    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    const formattedDate = date ? date.toISOString() : ''; // 빈 문자열로 대체
    if (field === 'startDate') {
      setStartDate(formattedDate); // 항상 string 전달
    } else if (field === 'endDate') {
      setEndDate(formattedDate); // 항상 string 전달
    }
  };

  const handleSubmit = async () => {
    if (!projectData.title || !projectData.title.trim()) {
      showToast.warn('프로젝트 명을 입력하세요.');
      return;
    }
    if (!projectData.name || !projectData.name.trim()) {
      showToast.warn('팀명을 입력하세요.');
      return;
    }
    if (!Array.isArray(members) || !members.length) {
      showToast.warn('팀원을 추가해주세요.');
      return;
    }
    if (!members.find((member) => member.userId === leaderId)) {
      showToast.warn('팀장을 선택해주세요.');
      return;
    }
    // 날짜 유효성 검사
    if (
      projectData.startDate &&
      projectData.endDate &&
      new Date(projectData.startDate) > new Date(projectData.endDate)
    ) {
      showToast.warn('시작일자는 종료일자보다 빠르거나 같아야 합니다.');
      return;
    }
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

      await createProject(updatedProjectData, projectImage).then(() => {
        if (postId) {
          deletePost(postId);
        }
      });
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
            maxLength={20} // 제목 20글자 제한
          />
          <input
            type="text"
            name="name"
            placeholder="팀 이름"
            value={projectData.name}
            onChange={handleInputChange}
            className={styles.input}
            maxLength={20} // 제목 20글자 제한
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
