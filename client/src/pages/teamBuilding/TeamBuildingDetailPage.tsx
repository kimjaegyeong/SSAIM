import { useParams } from 'react-router-dom';
import styles from './TeamBuildingPage.module.css'
import Tag from '../../features/teamBuilding/components/tag/Tag'
import { PiCrownSimpleFill } from "react-icons/pi";
import { AiOutlineMore } from "react-icons/ai";

const TeamBuildingListPage = () => {
  
  const { postId } = useParams();
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
      { id: 6, name: 'QQQ', position: 'Infra', img: 'https://picsum.photos/250/250', role: 0 },
    ],
    comments: [
      { id: 1, content: 'comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1comment1', createdAt: new Date(), author: 'XXX', authorImg: 'https://picsum.photos/250/250', position: 'FE' },
      { id: 2, content: 'comment2', createdAt: new Date(), author: 'XXX', authorImg: 'https://picsum.photos/250/250', position: 'BE' },
    ],
  }
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{data.title}</h1>
      <div className={styles.detailContainer}>
        <div className={styles.postSection}>
          <div className={styles.postHeader}>
            <div className={styles.categorySection}>
              {data.category.map((tag) => (
                  <Tag
                      key={tag}
                      text={tag}
                  />
              ))}
            </div>
            <div className={styles.positionSection}>
              {Object.entries(data.recruitment).map(([position, count]) => (
                <div key={position}>
                  <Tag text={position} /> {count}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.postContent}>
            {data.content}
          </div>
          <div className={styles.commentForm}>
            {/* 댓글 작성 및 수정/삭제 */}
          </div>
          <div className={styles.commentList}>
            {/* 댓글 목록 */}
            {data.comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <Tag text={comment.position} />
                <div className={styles.commentContent}>
                  {comment.content}
                </div>
                <div className={styles.commentAuthor}>
                  <img src={comment.authorImg} alt={comment.author} className={styles.profileImg}/>
                  <div className={styles.commentInfo}>
                    <span>{comment.author}</span>
                  </div>
                </div>
                <AiOutlineMore style={{ minWidth: '20px', minHeight: '20px' }} />
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

export default TeamBuildingListPage;