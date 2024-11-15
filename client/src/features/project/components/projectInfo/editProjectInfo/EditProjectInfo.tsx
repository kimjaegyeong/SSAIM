import styles from './EditProjectInfo.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import React, { useState, useEffect } from 'react';
import TeamMemberGrid from '@features/project/components/projectCreate/teamMember/TeamMemberGrid';
import { ProjectDTO, ProjectEditMutationData, ProjectEditMemberDTO } from '@/features/project/types/ProjectDTO';
import { useEditProjectInfoMutation } from '@/features/project/hooks/useEditProjectInfoMutation';
import defaultTeamIcon from '@/assets/project/defaultTeamIcon.png';
import useTeamStore from '@/features/project/stores/useTeamStore';
import { useParams } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';

interface EditProjectInfoModalProps {
  projectInfo: ProjectDTO;
  onClose: () => void;
}

const EditProjectInfoModal: React.FC<EditProjectInfoModalProps> = ({ projectInfo, onClose }) => {
  const [startDate, setStartDate] = useState<Date | null>(projectInfo.startDate);
  const [endDate, setEndDate] = useState<Date | null>(projectInfo.endDate);
  const [image, setImage] = useState(projectInfo.projectImage || defaultTeamIcon);
  const [projectTitle, setProjectTitle] = useState(projectInfo.title);
  const [teamName, setTeamName] = useState(projectInfo.name);
  const { resetStore, setLeaderId, addMember, members, leaderId } = useTeamStore();
  const { projectId } = useParams();
  const { userId } = useUserStore();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null); // 이미지 파일 상태 추가
  const editProjectInfoMutation = useEditProjectInfoMutation(Number(projectId), userId);

  useEffect(() => {
    resetStore();
    setLeaderId(-1);
    projectInfo.projectMembers.forEach((member) => {
      addMember({ userId: member.userId, userName: member.name, userProfileImage: member.profileImage });
      if (member.role === 1) {
        setLeaderId(member.userId);
      }
    });
  }, [projectInfo.projectMembers]);

  const handleImageClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (!allowedExtensions.exec(file.name)) {
          alert('허용된 이미지 형식(.jpg, .jpeg, .png, .gif)만 업로드 가능합니다.');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setImage(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
        setProfileImageFile(file); // 선택된 파일을 상태에 저장
      }
    };
    fileInput.click();
  };

  const handleSave = () => {
    const projectMemberEditList: ProjectEditMemberDTO[] = members.reduce((acc, member) => {
      const originalMember = projectInfo.projectMembers.find((e) => member.userId === e.userId);

      if (!originalMember) {
        // 새로운 팀원이 추가된 경우
        acc.push({
          userId: member.userId,
          role: member.userId === leaderId ? 1 : 0,
          update: true,
        });
      } else if (originalMember.role === 1 && originalMember.userId !== leaderId) {
        // 팀장이었다가 다른 팀원에게 팀장 줌
        acc.push({
          projectMemberId: originalMember.pmId,
          role: 0,
          update: true,
        });
      } else if (originalMember.role === 0 && originalMember.userId === leaderId) {
        // 팀장이 팀원이 된 경우
        acc.push({
          projectMemberId: originalMember.pmId,
          role: 1,
          update: true,
        });
      }

      return acc;
    }, [] as ProjectEditMemberDTO[]);
    const projectMemberDeleteList: ProjectEditMemberDTO[] = projectInfo.projectMembers.reduce((acc, member) => {
      if (!members.find((e) => e.userId === member.userId)) {
        //팀원이 삭제된 경우
        acc.push({ projectMemberId: member.pmId, update: true, delete: true });
      }
      return acc;
    }, [] as ProjectEditMemberDTO[]);
    if (projectId) {
      const mutationData: ProjectEditMutationData = {
        projectEditData: {
          title: projectTitle,
          name: teamName,
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
          projectMembers: [...projectMemberEditList, ...projectMemberDeleteList],
        },
      };
      console.log(mutationData.projectEditData.projectMembers);
      // profileImageFile이 있을 경우에만 mutationData에 추가
      if (profileImageFile) {
        mutationData.profileImage = profileImageFile;
      }

      editProjectInfoMutation.mutate(mutationData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.topSection}>
          <div className={styles.imageSection} onClick={handleImageClick}>
            <img src={image} alt="대표 사진" className={styles.image} />
          </div>
          <div className={styles.infoSection}>
            <input
              type="text"
              placeholder="프로젝트 이름"
              className={styles.input}
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="팀 이름"
              className={styles.input}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
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
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="시작일 선택"
              className={styles.dateInput}
            />
          </div>
          <span className={styles.dateSeparator}>~</span>
          <div>
            <label>프로젝트 종료일자:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="종료일 선택"
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.buttonSection}>
          <button className={styles.saveButton} onClick={handleSave}>
            수정 완료
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectInfoModal;
