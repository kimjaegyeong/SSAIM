import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './MeetingDetail.module.css';
import Button from '../../../../components/button/Button';
import SelectSpeakerModal from './SelectSpeakerModal';
import { ImPencil } from "react-icons/im";
import { fectchMeetingDetail } from '../../apis/meeting/fectchMeetingDetail';
import { createAISummary } from '../../apis/meeting/createAISummary';
import { editSpeakers } from '../../apis/meeting/editSpeakers';
import { deleteMeeting } from '../../apis/meeting/deleteMeeting';
import { MeetingDetailDTO, Speaker } from '../../types/meeting/MeetingDTO';
import { formatMeetingTime, formatMeetingDuration } from '../../utils/meetingTime';
import { useProjectInfo } from '@features/project/hooks/useProjectInfo';
import Loading from '@/components/loading/Loading';
import DefaultProfile from '@/assets/profile/DefaultProfile.png';

const MeetingDetail = () => {
  const navigate = useNavigate();
  const { projectId, meetingId } = useParams<{ projectId: string, meetingId: string }>();
  const { data: projectInfo } = useProjectInfo(Number(projectId));
  const [meetingData, setMeetingData] = useState<MeetingDetailDTO | null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const segmentRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>('');

  // fectchMeetingDetail API 호출
  useEffect(() => {
    const getMeetingDetail = async () => {
      if (projectId && meetingId) {
        try {
          const data = await fectchMeetingDetail(Number(projectId), Number(meetingId));
          setMeetingData(data);
          setEditedTitle(data.meetingTitle);
        } catch (error) {
          console.error('Failed to fetch meeting details:', error);
        }
      }
    };
    getMeetingDetail();
  }, [projectId, meetingId]);

  // 편집 모드 활성화 함수
  const enableEditing = () => {
    setIsEditing(true);
  };

  // 완료 버튼 클릭 시 제목 저장 및 편집 모드 종료
  const handleTitleSave = () => {
    setMeetingData((prevData) => prevData ? { ...prevData, meetingTitle: editedTitle } : prevData);
    setIsEditing(false);
  };


  // AI 요약 생성 API 호출
  const handleAISummaryClick = async () => {
    if (projectId && meetingId) {
      setIsLoading(true);
      try {
        const response = await createAISummary(Number(projectId), Number(meetingId));
        setSummaryText(response.meetingSummary);
      } catch (error) {
        console.error('Failed to create AI summary:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 화자 변경 모달 열기
  const handleEditSpeakerClick = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  // 화자 변경 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  // 화자 변경 API 호출
  const handleSelectSpeaker = async (member: Speaker) => {
    if (!projectId || !meetingId || !selectedSpeaker) return;

    const requestBody = [
      {
        label: selectedSpeaker.label,
        name: member.name,
      },
    ];

    try {
      const updatedData = await editSpeakers(Number(projectId), Number(meetingId), requestBody);
      console.log('Speaker updated:', updatedData);

      setMeetingData((prevData) => {
        if (!prevData) return null;

        const updatedSegments = prevData.sttResponseDto.segments.map((segment) =>
          segment.speaker.label === selectedSpeaker.label
            ? { ...segment, speaker: { ...segment.speaker, name: member.name } }
            : segment
        );

        const updatedSpeakers = prevData.sttResponseDto.speakers.map((speaker) =>
          speaker.label === selectedSpeaker.label ? { ...speaker, name: member.name } : speaker
        );

        return {
          ...prevData,
          sttResponseDto: {
            ...prevData.sttResponseDto,
            segments: updatedSegments,
            speakers: updatedSpeakers,
          },
        };
      });
    } catch (error) {
      console.error('Failed to update speaker:', error);
    }

    closeModal();
  };

  // 음성 시간 처리
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime * 1000);
    }
  };

  // 자동 스크롤 처리할 문장 명시
  const isActiveSegment = (start: number, end: number) => {
    return currentTime >= start && currentTime <= end;
  };

  // 자동 스크롤 처리
  useEffect(() => {
    const activeIndex = meetingData?.sttResponseDto.segments.findIndex((segment) =>
      isActiveSegment(segment.start, segment.end)
    );

    if (activeIndex !== undefined && activeIndex !== -1 && segmentRefs.current[activeIndex]) {
      segmentRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, meetingData]);

  // deleteMeeting을 호출하는 함수
  const handleDeleteMeeting = async () => {
    if (projectId && meetingId) {
      try {
        await deleteMeeting(Number(projectId), Number(meetingId));
        alert('회의가 성공적으로 삭제되었습니다.');
        navigate(`/project/${projectId}/meeting`); // 삭제 후 회의 목록 페이지로 이동
      } catch (error) {
        console.error('Failed to delete meeting:', error);
        alert('회의 삭제에 실패했습니다.');
      }
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.stickyBox}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              {/* 제목 수정 가능 */}
              {isEditing ? (
                <div className={styles.titleEditContainer}>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className={styles.titleInput}
                  />
                  <button onClick={handleTitleSave} className={styles.saveButton}>완료</button>
                </div>
              ) : (
                <h3 className={styles.title}>{meetingData?.meetingTitle || "회의 제목 불러오는 중"}</h3>
              )}
              {!isEditing && (
                <ImPencil onClick={enableEditing} style={{ color: "black", cursor: 'pointer' }} />
              )}
              {/* 회의 날짜 및 소요 시간 */}
              <div className={styles.meetingInfo}>
                <span className={styles.date}>
                  {meetingData ? formatMeetingTime(meetingData.meetingCreateTime) : "날짜 불러오는 중"}
                </span>
                <span className={styles.duration}>
                  {meetingData?.meetingVoiceTime === -1
                    ? "알 수 없음"
                    : meetingData
                    ? formatMeetingDuration(meetingData.meetingVoiceTime)
                    : ""}
                </span>
              </div>
            </div>
            <button className={styles.deleteButton} onClick={handleDeleteMeeting} > 삭제 </button>
          </div>
          {/* 음성 파일 컨트롤러 */}
          <div className={styles.voicePlay}>
            {meetingData?.meetingVoiceUrl ? (
              <audio controls src={meetingData.meetingVoiceUrl} ref={audioRef} onTimeUpdate={handleTimeUpdate}>
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p>음성 파일을 불러오는 중입니다.</p>
            )}
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.participants}>
            {meetingData?.sttResponseDto.segments.map((segment, index) => {
              const matchingMember = projectInfo?.projectMembers.find(
                (member) => member.name === segment.speaker.name
              );
              const profileImage = matchingMember?.profileImage || DefaultProfile;

              return (
                <div key={index} className={styles.participantBox}>
                  <img src={profileImage} alt={DefaultProfile} />
                  <div className={styles.participantComment}>
                    {/* 화자 수정 가능 */}
                    <p className={styles.participantName} onClick={() => handleEditSpeakerClick(segment.speaker)}>
                      {segment.speaker.name}
                    </p>
                    {/* 음성 텍스트 싱크 추적 가능 */}
                    <p
                      ref={(el) => (segmentRefs.current[index] = el)}
                      className={`${styles.comment} ${isActiveSegment(segment.start, segment.end) ? styles.highlight : ''}`}
                    >
                      {segment.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="green" onClick={handleAISummaryClick}>
          🤖 AI 요약 확인하기
        </Button>
        {isLoading ? (
          <Loading />
        ) : (
          summaryText && (
            <div className={styles.summaryBox}>
              <h3 className={styles.h3}>📑 요약 내용</h3>
              <div className={styles.summaryText}>
                <ReactMarkdown>{summaryText}</ReactMarkdown>
              </div>
            </div>
          )
        )}
      </div>
      {selectedSpeaker && (
        <SelectSpeakerModal
          isOpen={isModalOpen}
          onClose={closeModal}
          projectId={Number(projectId)}
          onSelect={handleSelectSpeaker}
          selectedSpeaker={selectedSpeaker}
        />
      )}
    </div>
  );
};

export default MeetingDetail;
