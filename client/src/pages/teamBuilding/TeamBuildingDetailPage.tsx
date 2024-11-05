import {useState} from 'react'
import { useParams } from 'react-router-dom';
import styles from './TeamBuildingPage.module.css'
import Tag from '../../features/teamBuilding/components/tag/Tag'
import { PiCrownSimpleFill } from "react-icons/pi";
import { AiOutlineMore } from "react-icons/ai";
import Button from '../../components/button/Button';
import TagSelector from '../../features/teamBuilding/components/tagSelector/TagSelector';

const TeamBuildingDetailPage = () => {
  
  const { postId } = useParams();

  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState('');

  const data = {
    postId: 1,
    title: `팀원 모집 게시글 ${postId}`,
    content: '팀원 모집 게시글 내용',
    createdAt: new Date(),
    category: ['자유주제', '기업연계'],
    region: '서울',
    author: 'XXX',
    recruitment: {'FE': 3, 'BE': 2, 'Infra': 1},
    member: [
      { id: 1, name: 'XXX', position: 'FE', img: 'https://picsum.photos/250/250', role: 1 },
      { id: 2, name: 'YYY', position: 'BE', img: 'https://picsum.photos/250/250', role: 0 },
      { id: 3, name: 'ZZZ', position: 'Infra', img: 'https://picsum.photos/250/250', role: 0 },
      { id: 4, name: 'WWW', position: 'FE', img: 'https://picsum.photos/250/250', role: 0 },
      { id: 5, name: 'VVV', position: 'BE', img: 'https://picsum.photos/250/250', role: 0 },
      { id: 6, name: 'QQQ', position: 'FE', img: 'https://picsum.photos/250/250', role: 0 },
    ],
    comments: [
      { id: 1, content: 'comment1', createdAt: new Date(), author: 'XXX', authorImg: 'https://picsum.photos/250/250', position: 'FE' },
      { id: 2, content: 'comment2', createdAt: new Date(), author: 'XXX', authorImg: 'https://picsum.photos/250/250', position: 'BE' },
    ],
  }

  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState(data.content);
  
  const loggedInUser = {
    name: 'aaa',
  };

  const isAuthor = loggedInUser?.name === data.author;

  const toggleModal = (commentId: number) => {
    if (activeCommentId === commentId) {
      setActiveCommentId(null);
    } else {
      setActiveCommentId(commentId);
      setIsCommentEditing(false);
      setEditedCommentContent('');
    }
  };

  const handleEditPost = () => {
    setIsPostEditing(true);
  };
  
  const handleSavePost = () => {
    setIsPostEditing(false);
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
      <h1 className={styles.pageTitle}>{data.title}</h1>
      <div className={styles.detailContainer}>
        <div className={styles.postSection}>
          <div className={styles.postHeader}>
            <div className={styles.categorySection}>
              {data.category.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
            <div className={styles.positionSection}>
            {Object.entries(data.recruitment).map(([position, count]) => {
              const currentPositionCount = data.member.filter(member => member.position === position).length;
              const remainingCount = count - currentPositionCount;

              return (
                <div key={position}>
                  <Tag text={position} /> {remainingCount}
                </div>
              );
            })}
            </div>
          </div>
          <div className={styles.postContent}>
            {isPostEditing ? (
              <textarea
                value={editedPostContent}
                onChange={(e) => setEditedPostContent(e.target.value)}
                className={styles.editPostInput}
              />
            ) : (
              data.content
            )}
          </div>
          {isAuthor ? (
            <div className={styles.buttonSection}>
              {isPostEditing ? (
                <button onClick={handleSavePost} className={`${styles.authorButton} ${styles.startButton}`}>저장</button>
              ) : (
                <>
                  <button className={`${styles.authorButton} ${styles.startButton}`}>팀 구성 완료</button>
                  <button onClick={handleEditPost} className={`${styles.authorButton} ${styles.editButton}`}>게시글 수정</button>
                  <button className={`${styles.authorButton} ${styles.deleteButton}`}>게시글 삭제</button>
                </>
              )}
            </div>
          ) : (
            <div className={styles.commentForm}>
              <TagSelector />
              <input className={styles.commentInput} />
              <button className={styles.submitButton}>지원하기</button>
            </div>
          )}
          <div className={styles.commentList}>
            {data.comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <Tag text={comment.position} disablePointerCursor={true}/>
                <div className={styles.commentContent}>
                  {isCommentEditing && activeCommentId === comment.id ? (
                    <input
                      type="text"
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    comment.content
                  )}
                </div>
                <div className={styles.commentAuthor}>
                  <img
                    src={comment.authorImg}
                    alt={comment.author}
                    className={styles.profileImg}
                  />
                  <div className={styles.commentInfo}>
                    <span>{comment.author}</span>
                  </div>
                </div>
                
                {isCommentEditing && activeCommentId === comment.id ? (
                  <Button onClick={handleSaveComment} size='custom' colorType='blue'>
                    저장
                  </Button>
                ) : (
                  <div className={styles.moreButtonWrapper}>
                    <AiOutlineMore
                      onClick={() => toggleModal(comment.id)}
                      className={styles.moreButton}
                    />
                    {activeCommentId === comment.id && !isCommentEditing && (
                      <div className={styles.modal}>
                        {isAuthor ? (
                          <button 
                            className={styles.modalButton}
                          >
                            수락
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditComment(comment.content)}
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
          <p>모집 현황</p>
          <div className={styles.memberList}>
            {data.member.map((member) => (
              <div key={member.id} className={styles.memberItem}>
                <div className={styles.memberInfo}>
                  <img src={member.img} alt={member.name} className={styles.profileImg}/>
                  <span>{member.name}</span>
                  {member.role === 1 && <PiCrownSimpleFill color='#FFCD29'/>}
                </div>
                <Tag text={member.position}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuildingDetailPage;