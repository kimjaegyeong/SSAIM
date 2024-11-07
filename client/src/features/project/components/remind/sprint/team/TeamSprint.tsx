import React from 'react';
import styles from './TeamSprint.module.css';
import TeamSprintCard from './TeamSprintCard';

interface Content {
  username: string;
  userImage: string;
  content: string;
}

interface TeamSprintProps {
  contents: Content[];
}

const TeamSprint: React.FC<TeamSprintProps> = ({ contents }) => {

  return (
    <div className={styles.teamReview}>
      {contents.map((content, index) => {
        // `content.content`를 \n\n 기준으로 나누기
        const [keep, problem, trySection] = content.content.split("\n\n");

        return (
          <TeamSprintCard
            key={index}  // 각 카드에 고유한 키를 부여
            userName={content.username}
            userImage={content.userImage}
            reviewText={`🟢 Keep: ${keep}\n🟠 Problem: ${problem}\n🔵 Try: ${trySection}`}
          />
        );
      })}
    </div>
  );
};

export default TeamSprint;
