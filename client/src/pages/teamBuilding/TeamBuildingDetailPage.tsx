import {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TeamBuildingPage.module.css'
import Tag from '../../features/teamBuilding/components/tag/Tag'
import { AiOutlineMore } from "react-icons/ai";
import Button from '../../components/button/Button';
import TagSelector from '../../features/teamBuilding/components/tagSelector/TagSelector';
import useUserStore from '@/stores/useUserStore';
import { getDomainLabel, getPositionLabel } from '../../utils/labelUtils';
import { formatDateTime } from '../../utils/formatDateTime';
import DefaultProfile from '../../assets/profile/DefaultProfile.png'
import { getPostInfo, deletePost, createComment, deleteComment } from '../../features/teamBuilding/apis/teamBuildingDetail/teamBuildingDetail'
import { PiCrownSimpleFill } from "react-icons/pi";
import { HiMinusCircle } from "react-icons/hi2";
import RecruitmentSelector from '@/features/teamBuilding/components/createTeam/recruitmentSelector/RecruitmentSelector';
import { editRecruiting } from '@/features/teamBuilding/apis/editTeam/editRecruiting';

interface Recruitment {
  FE: number;
  BE: number;
  Infra: number;
}

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
  recruitingMemberId: number;
};

type TeamBuildingData = {
  postId: number;
  campus: number;
  authorId: number;
  candidateCount: number;
  startDate: string;
  endDate: string;
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
  candidateCount: 0,
  startDate: '',
  endDate: '',
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
  const [selectedTag, setSelectedTag] = useState<number>(1);
  const [message, setMessage] = useState<string>('');

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

  const handleTagChange = (tag: number) => {
    setSelectedTag(tag);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const filteredCandidates = isAuthor 
    ? data.recruitingCandidates 
    : data.recruitingCandidates.filter(candidate => candidate.userId === userId);

  const toggleModal = (commentId: number) => {
    if (activeCommentId === commentId) {
      setActiveCommentId(null);
    } else {
      setActiveCommentId(commentId);
      setIsCommentEditing(false);
      setEditedCommentContent('');
    }
  };

  const handleSubmitComment = () => {
    if (userId === null) {
      return;
    }

    if (!message.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }

    const params = {
      userId: userId,
      position: selectedTag,
      message: message,
    };
    console.log(params);

    createComment(data.postId, params)
     .then((response) => {
        console.log(response);
        setMessage('');
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      }); 
  };

  const handleEditComment = (commentContent:string) => {
    setIsCommentEditing(true);
    setEditedCommentContent(commentContent);
  };

  const handleSaveComment = () => {
    setIsCommentEditing(false);
    setActiveCommentId(null);
  };

  const handleDeleteComment = (postId:string, commentId: number) => {
    deleteComment(parseInt(postId), commentId)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNChange = (n: number) => {
    if (data.recruitedTotal > n) {
        alert(
            `현재 모집된 멤버 수(${data.recruitedTotal})가 총 모집 인원(${n})을 초과할 수 없습니다.`
        );
        return;
    }

    // 현재 recruitingMembers의 각 포지션의 최소값 계산
    const calculateMinimumRecruitment = () => {
        const FECount = data.recruitingMembers.filter(
            (member) => member.position === 1
        ).length;

        const BECount = data.recruitingMembers.filter(
            (member) => member.position === 2
        ).length;

        const InfraCount = data.recruitingMembers.filter(
            (member) => member.position === 3
        ).length;

        return { FECount, BECount, InfraCount };
    };

    const { FECount, BECount, InfraCount } = calculateMinimumRecruitment();

    setData((prevData) => {
        const adjustedRecruitment = {
            memberFrontend: FECount,
            memberBackend: BECount,
            memberInfra: InfraCount,
        };

        return {
            ...prevData,
            memberTotal: n,
            ...adjustedRecruitment,
        };
    });
  };

  const handleSliderChange = (role: keyof Recruitment, value: number) => {
    const parsedValue = isNaN(value) ? 0 : value;

    const otherTotal =
        role === 'FE'
            ? data.memberBackend + data.memberInfra
            : role === 'BE'
            ? data.memberFrontend + data.memberInfra
            : data.memberFrontend + data.memberBackend;

    const maxAllowed = data.memberTotal - otherTotal;

    setData((prevData) => ({
        ...prevData,
        [role === 'FE'
            ? 'memberFrontend'
            : role === 'BE'
            ? 'memberBackend'
            : 'memberInfra']: Math.min(parsedValue, maxAllowed),
    }));

    console.log(`Updated ${role} to ${Math.min(parsedValue, maxAllowed)}`);
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
      // Done 버튼 검증
      const totalMembers = data.memberFrontend + data.memberBackend + data.memberInfra;

      // 모집 인원 합이 총 인원을 초과하거나 부족한 경우
      if (totalMembers !== data.memberTotal) {
          alert(
              `총 모집 인원(${data.memberTotal})과 세부 포지션 합(${totalMembers})이 일치하지 않습니다.`
          );
          return;
      }

      // 모집된 멤버 수가 총 모집 인원을 초과하는 경우
      if (data.recruitedTotal > data.memberTotal) {
          alert(
              `현재 모집된 멤버 수(${data.recruitedTotal})가 총 모집 인원(${data.memberTotal})을 초과할 수 없습니다.`
          );
          return;
      }
      handleSubmit()
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

  const handleSubmit = async () => {
    const formData = {
        title: data.postTitle,
        content: data.postContent,
        startDate: data.startDate,
        endDate: data.endDate,
        firstDomain: data.firstDomain,
        secondDomain: data.secondDomain,
        campus: data.campus,
        memberTotal: data.memberTotal,
        memberInfra: data.memberInfra,
        memberBackend: data.memberBackend,
        memberFrontend: data.memberFrontend,
        recruitingMembers: data.recruitingMembers.map((member) => ({
            userId: member.userId,
            position: member.position,
            delete: selectedMembers.find((m) => m.userId === member.userId)?.delete ? 1 : 0,
        })),
    };
    
    try {
        await editRecruiting(data.postId, formData); // 서버에 요청을 보냅니다.
    } catch (error) {
        console.error(error); // 에러를 콘솔에 출력합니다.
        alert("데이터를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요."); // 사용자에게 에러 메시지를 표시합니다.
    }
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
              <Tag text={'FE'} /> {data.memberFrontend}
              <Tag text={'BE'} /> {data.memberBackend}
              <Tag text={'Infra'} /> {data.memberInfra}
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
              <TagSelector onTagChange={handleTagChange} />
              <input
                className={styles.commentInput}
                value={message}
                onChange={handleMessageChange}
                placeholder="지원 메시지를 입력하세요"
              />
              <button onClick={handleSubmitComment} className={styles.submitButton}>지원하기</button>
            </div>
          )}
          <span className={styles.applyCount}>지원 수: {data.candidateCount}</span>
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
                        <button className={styles.modalButton} onClick={() => {handleDeleteComment(postId, candidate.recruitingMemberId )}}>삭제</button>
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
            {isAuthor &&
              <button className={styles.editMemberButton} onClick={handleEditToggle}>
                {editMembers ? 'Done' : 'Edit'}
              </button>
            }
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
            <RecruitmentSelector
              recruitment={{
                  FE: data.memberFrontend,
                  BE: data.memberBackend,
                  Infra: data.memberInfra,
              }}
              N={data.memberTotal}
              inputValue={data.memberTotal.toString()}
              onInputChange={(value) => {
                  const total = parseInt(value, 10);
                  handleNChange(total);
              }}
              onSliderChange={handleSliderChange}
              onNChange={handleNChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamBuildingDetailPage;