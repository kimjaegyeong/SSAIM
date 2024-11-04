import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MeetingModal.module.css';
import Button from '../../../../components/button/Button'

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Participant {
  id: number;
  name: string;
  imageUrl: string;
  selected?: boolean;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    
    // 회의 제목을 위한 state 추가
    const [meetingTitle, setMeetingTitle] = useState<string>('');

    const [participants, setParticipants] = useState<Participant[]>([
      { id: 1, name: "여대기", imageUrl: "/profile1.jpg", selected: false },
      { id: 2, name: "조성인", imageUrl: "/profile2.jpg", selected: false },
      { id: 3, name: "조원빈", imageUrl: "/profile3.jpg", selected: false },
      { id: 4, name: "박지용", imageUrl: "/profile4.jpg", selected: false },
      { id: 5, name: "강수연", imageUrl: "/profile5.jpg", selected: false },
      { id: 6, name: "김재경", imageUrl: "/profile6.jpg", selected: false }
    ]);

    const areAllSelected = participants.every(participant => participant.selected);

    const handleSelectAll = () => {
      setParticipants(participants.map(participant => ({
        ...participant,
        selected: !areAllSelected
      })));
    };

    const handleParticipantSelect = (participantId: number) => {
      setParticipants(participants.map(participant => 
        participant.id === participantId
          ? { ...participant, selected: !participant.selected }
          : participant
      ));
    };

    // 회의 제목 입력 핸들러
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMeetingTitle(e.target.value);
    };

    const handleButtonClick = () => {
      // 선택된 참가자만 필터링
      const selectedParticipants = participants.filter(participant => participant.selected);
      console.log('회의 생성 정보: ',meetingTitle, selectedParticipants)
      
      // state를 query parameter로 전달
      navigate(`/project/${projectId}/meeting/create`, {
        state: {
          meetingTitle,
          selectedParticipants
        }
      });
    };

    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          <h2 className={styles.h2}>회의 정보 입력</h2>
          <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>
                  <label>회의 제목 : </label>
                  <input 
                    type="text"
                    value={meetingTitle}
                    onChange={handleTitleChange}
                    placeholder="회의 제목을 입력하세요"
                  />
              </div>
              <div className={styles.inputParticipants}>
                  <div className={styles.labelParticipants}>
                      <label>참가자 : </label>
                      <p 
                        className={styles.p}
                        onClick={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      >
                        {areAllSelected ? '전체 해제' : '전체 선택'}
                      </p>
                  </div>
                  <div className={styles.selectParticipants}>
                      {participants.map((participant) => (
                          <div key={participant.id} className={styles.participantItem}>
                              <input
                                  type="checkbox"
                                  id={`participant-${participant.id}`}
                                  className={styles.participantCheckbox}
                                  checked={participant.selected}
                                  onChange={() => handleParticipantSelect(participant.id)}
                              />
                              <label 
                                  htmlFor={`participant-${participant.id}`}
                                  className={styles.participantLabel}
                              >
                              <img 
                                  src={participant.imageUrl} 
                                  alt={participant.name}
                                  className={styles.participantImage}
                              />
                              </label>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
          <Button size="medium" colorType="green" onClick={handleButtonClick}>회의 시작하기</Button>
        </div>
      </div>
    );
};

export default MeetingModal;