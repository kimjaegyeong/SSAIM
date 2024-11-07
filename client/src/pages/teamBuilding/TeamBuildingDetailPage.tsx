import {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TeamBuildingPage.module.css'
import Tag from '../../features/teamBuilding/components/tag/Tag'
import { AiOutlineMore } from "react-icons/ai";
import Button from '../../components/button/Button';
import TagSelector from '../../features/teamBuilding/components/tagSelector/TagSelector';
import { getPostInfo } from '@/features/teamBuilding/apis/teamBuildingDetail/getPostInfo';
import useUserStore from '@/stores/useUserStore';
import { getDomainLabel, getPositionLabel } from '../../utils/labelUtils';
import { formatDateTime } from '../../utils/formatDateTime';
import DefaultProfile from '../../assets/profile/DefaultProfile.png'
import { deletePost } from '../../features/teamBuilding/apis/teamBuildingDetail/deletePost'
import { PiCrownSimpleFill } from "react-icons/pi";
import { HiMinusCircle } from "react-icons/hi2";

type TeamBuildingMember = {
  userId: number;
  userName: string;
  profileImage: string | null;
  position: number;
};

type MemberDeleteStatus = {
  userId: number;
  position: number;
  delete: boolean;
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
  authorId: number;
  postTitle: string;
  postContent: string;
  firstDomain: number;
  secondDomain: number;
  createdDate: string;
  updatedDate: string;
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
  authorId: 0,
  postTitle: '',
  postContent: '',
  firstDomain: 0,
  secondDomain: 0,
  createdDate: '',
  updatedDate: '',
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
  const [editMembers, setEditMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<MemberDeleteStatus[]>([]);

  const navigate = useNavigate();

  const handleEditPost = () => {
    navigate(`/team-building/edit/${postId}`, { state: { data } });
  };
  
  useEffect(() => {
    getPostInfo(parseInt(postId))
      .then((response) => {
          setData(response);
          setSelectedMembers(
            response.recruitingMembers.map((member: TeamBuildingMember) => ({
              userId: member.userId,
              position: member.position,
              delete: false,
            }))
          );
      })
      .catch((err) => {
          console.error(err);
      });
  }, []);

  const isAuthor = userId === data.authorId;

  const filteredCandidates = isAuthor 
    ? data.recruitingCandidates 
    : data.recruitingCandidates.filter(candidate => candidate.userId === userId);

  // 남은 인원 계산
  const remainingFrontend = data.memberFrontend;
  const remainingBackend = data.memberBackend;
  const remainingInfra = data.memberInfra;

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

  const handleDeletePost = () => {
    deletePost(parseInt(postId))
      .then(() => {
        alert('게시글이 삭제되었습니다.');
        navigate('/team-building');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEditToggle = () => {
    if (editMembers) {
      console.log('선택된 멤버들:', selectedMembers);
    }
    setEditMembers(!editMembers);
  };

  const toggleMemberSelection = (memberId: number) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.map((member) =>
        member.userId === memberId
          ? { ...member, delete: !member.delete }
          : member
      )
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{data.postTitle}</h1>
        <div className={styles.timeSection}>
          <p>작성일 : {formatDateTime(data.createdDate)}</p>
          <p>수정일 : {formatDateTime(data.updatedDate)}</p>
        </div>
      </div>
      <div className={styles.detailContainer}>
        <div className={styles.postSection}>
          <div className={styles.postHeader}>
            <div className={styles.categorySection}>
                <Tag text={getDomainLabel(data.firstDomain)} />
                {data.secondDomain && <Tag text={getDomainLabel(data.secondDomain)} />}
            </div>
            <div className={styles.positionSection}>
              <Tag text={'FE'} /> {remainingFrontend}
              <Tag text={'BE'} /> {remainingBackend}
              <Tag text={'Infra'} /> {remainingInfra}
            </div>
          </div>
          <div className={styles.postContent}>{data.postContent}</div>
          {isAuthor ? (
            <div className={styles.buttonSection}>
              <button className={`${styles.authorButton} ${styles.startButton}`}>팀 구성 완료</button>
              <button className={`${styles.authorButton} ${styles.editButton}`} onClick={handleEditPost}>게시글 수정</button>
              <button className={`${styles.authorButton} ${styles.deleteButton}`} onClick={handleDeletePost}>게시글 삭제</button>
            </div>
          ) : (
            <div className={styles.commentForm}>
              <TagSelector />
              <input className={styles.commentInput} />
              <button className={styles.submitButton}>지원하기</button>
            </div>
          )}
          <span className={styles.applyCount}>지원 수: {data.recruitingCandidates.length}</span>
          <div className={styles.commentList}>
            {filteredCandidates.map((candidate, index) => (
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
                    src={candidate.profileImage ? candidate.profileImage : DefaultProfile}
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
            <button className={styles.editMemberButton} onClick={handleEditToggle}>
              {editMembers ? 'Done' : 'Edit'}
            </button>
          </div>
          <div className={styles.memberList}>
            {selectedMembers.map((member) => (
              <div key={member.userId} className={styles.memberItem}>
                <div className={styles.memberInfo}>
                  <img
                    src={
                      data.recruitingMembers.find((m) => m.userId === member.userId)?.profileImage ||
                      DefaultProfile
                    }
                    alt={member.userId.toString()}
                    className={styles.profileImg}
                  />
                  <span>{data.recruitingMembers.find((m) => m.userId === member.userId)?.userName}</span>
                  {member.userId === data.authorId && <PiCrownSimpleFill color="#FFCD29" />}
                  {editMembers && (
                    <HiMinusCircle
                      onClick={() => toggleMemberSelection(member.userId)}
                      className={styles.deleteMemberButton}
                      style={{
                        color: member.delete ? 'red' : 'gray',
                      }}
                    />
                  )}
                </div>
                <Tag text={getPositionLabel(member.position)} />
              </div>
            ))}
          </div>
          {editMembers && (
            <p>모집인원 수정</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamBuildingDetailPage;