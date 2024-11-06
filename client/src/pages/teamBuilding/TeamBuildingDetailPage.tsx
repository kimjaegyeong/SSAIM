import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import styles from './TeamBuildingPage.module.css'
import Tag from '../../features/teamBuilding/components/tag/Tag'
import { AiOutlineMore } from "react-icons/ai";
import Button from '../../components/button/Button';
import TagSelector from '../../features/teamBuilding/components/tagSelector/TagSelector';
import { getPostInfo } from '@/features/teamBuilding/apis/teamBuildingDetail/getPostInfo';
import useUserStore from '@/stores/useUserStore';
import { getDomainLabel, getPositionLabel } from '../../utils/labelUtils';


type TeamBuildingMember = {
  userId: number;
  userName: string;
  profileImage: string | null;
  position: number;
};

type TeamBuildingCandidate = {
  userId: number;
  userName: string;
  profileImage: string | null;
  position: number;
  message: string | null;
  status: number;
};

type TeamBuildingData = {
  postId: number;
  campus: number;
  postTitle: string;
  postContent: string;
  firstDomain: number;
  secondDomain: number;
  status: number;
  recruitedTotal: number;
  memberTotal: number;
  authorProfileImageUrl: string;
  authorName: string;
  memberInfra: number;
  memberBackend: number;
  memberFrontend: number;
  recruitingMembers: TeamBuildingMember[];
  recruitingCandidates: TeamBuildingCandidate[];
};

const initialData: TeamBuildingData = {
  postId: 0,
  campus: 0,
  postTitle: '',
  postContent: '',
  firstDomain: 0,
  secondDomain: 0,
  status: 0,
  recruitedTotal: 0,
  memberTotal: 0,
  authorProfileImageUrl: '',
  authorName: '',
  memberInfra: 0,
  memberBackend: 0,
  memberFrontend: 0,
  recruitingMembers: [],
  recruitingCandidates: []
};

const TeamBuildingDetailPage = () => {
  const { userId } = useUserStore();
  const { postId = '' } = useParams();
  const [data, setData] = useState<TeamBuildingData>(initialData);
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  
  useEffect(() => {
    getPostInfo(parseInt(postId))
      .then((response) => {
          console.log(response,111);
          setData(response);
      })
      .catch((err) => {
          console.error(err);
      });
    console.log(data, 222);
  }, []);

  const isAuthor = userId === 1;

  const toggleModal = (commentId: number) => {
    if (activeCommentId === commentId) {
      setActiveCommentId(null);
    } else {
      setActiveCommentId(commentId);
      setIsCommentEditing(false);
      setEditedCommentContent('');
    }
  };

  const handleEditComment = (commentContent:string) => {
    setIsCommentEditing(true);
    setEditedCommentContent(commentContent);
  };

  const handleSaveComment = () => {
    setIsCommentEditing(false);
    setActiveCommentId(null);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{data.postTitle}</h1>
      <div className={styles.detailContainer}>
        <div className={styles.postSection}>
          <div className={styles.postHeader}>
            <div className={styles.categorySection}>
                <Tag text={getDomainLabel(data.firstDomain)} />
                <Tag text={getDomainLabel(data.secondDomain)} />
            </div>
            <div className={styles.positionSection}>
              <Tag text={'FE'} /> {data.memberFrontend}
              <Tag text={'BE'} /> {data.memberBackend}
              <Tag text={'Infra'} /> {data.memberInfra}
            </div>
          </div>
          <div className={styles.postContent}>{data.postContent}</div>
          {isAuthor ? (
            <div className={styles.buttonSection}>
                <button className={`${styles.authorButton} ${styles.startButton}`}>팀 구성 완료</button>
                <button className={`${styles.authorButton} ${styles.editButton}`}>게시글 수정</button>
                <button className={`${styles.authorButton} ${styles.deleteButton}`}>게시글 삭제</button>
            </div>
          ) : (
            <div className={styles.commentForm}>
              <TagSelector />
              <input className={styles.commentInput} />
              <button className={styles.submitButton}>지원하기</button>
            </div>
          )}
          <div className={styles.commentList}>
            {(data.recruitingCandidates || []).map((candidate: TeamBuildingCandidate , index: number) => (
              <div key={index} className={styles.commentItem}>
                <Tag text={getPositionLabel(candidate.position)} disablePointerCursor={true}/>
                <div className={styles.commentContent}>
                  {isCommentEditing && activeCommentId === index ? (
                    <input
                      type="text"
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    candidate.message
                  )}
                </div>
                <div className={styles.commentAuthor}>
                  <img
                    src={candidate.profileImage ?? undefined}
                    alt={candidate.userName}
                    className={styles.profileImg}
                  />
                  <div className={styles.commentInfo}>
                    <span>{candidate.userName}</span>
                  </div>
                </div>
                
                {isCommentEditing && activeCommentId === index ? (
                  <Button onClick={handleSaveComment} size='custom' colorType='blue'>
                    저장
                  </Button>
                ) : (
                  <div className={styles.moreButtonWrapper}>
                    <AiOutlineMore
                      onClick={() => toggleModal(index)}
                      className={styles.moreButton}
                    />
                    {activeCommentId === index && !isCommentEditing && (
                      <div className={styles.modal}>
                        {isAuthor ? (
                          <button 
                            className={styles.modalButton}
                          >
                            수락
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditComment(candidate.message ? candidate.message : '')}
                            className={styles.modalButton}
                          >
                            수정
                          </button>
                        )}
                        <button className={styles.modalButton}>삭제</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.teamSection}>
          <div className={styles.teamSectionHeader}>
            <span>모집 현황</span>
            <button>Edit</button>
          </div>
          <div className={styles.memberList}>
            {(data.recruitingMembers || []).map((member: TeamBuildingMember) => (
              <div key={member.userId} className={styles.memberItem}>
                <div className={styles.memberInfo}>
                  <img src={member.profileImage ?? undefined} alt={member.userName} className={styles.profileImg}/>
                  <span>{member.userName}</span>
                  {/* {member.role === 1 && <PiCrownSimpleFill color='#FFCD29'/>} */}
                </div>
                <Tag text={getPositionLabel(member.position)}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuildingDetailPage;