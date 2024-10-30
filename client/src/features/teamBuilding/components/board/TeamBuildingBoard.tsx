import React from "react";
import styles from './TeamBuildingBoard.module.css';
import DropDown from '../filterDrop/filterDropDown';

const TeamBuildingBoard: React.FC = () => {
    const regionOptions = [
        { value: 'option1', label: '서울' },
        { value: 'option2', label: '대전' },
        { value: 'option3', label: '광주' },
        { value: 'option4', label: '구미' },
        { value: 'option5', label: '부울경' },
    ];
    const memberOptions = [
        { value: 'option1', label: '1' },
        { value: 'option2', label: '2' },
        { value: 'option3', label: '3' },
        { value: 'option4', label: '4' },
        { value: 'option5', label: '5' },
        { value: 'option6', label: '6' },
        { value: 'option7', label: '7' },
    ];
    const positionOptions = [
        { value: 'option1', label: 'FE' },
        { value: 'option2', label: 'BE' },
        { value: 'option3', label: 'Infra' },
    ];

    const handleSelect = (selectedOption: Option) => {
        console.log('선택된 옵션:', selectedOption);
    };

    return (
        <>
            {/* 게시판 전체 */}
            <div className={styles.board}>
                {/* 게시판 상단 구역(필터, 검색, 생성 버튼) */}
                <div className={styles.borderHeader}>
                    <div className={styles.dropDownSection}>
                        <DropDown options={regionOptions} onSelect={handleSelect} placeholder="지역" />
                        <DropDown options={memberOptions} onSelect={handleSelect} placeholder="인원" />
                        <DropDown options={positionOptions} onSelect={handleSelect} placeholder="직무" />
                    </div>
                    <div className={styles.searchSection}>
                        <input type="text" />
                        <button>신청현황</button>
                        <button>팀 생성</button>
                    </div>
                </div>
                {/* 게시글 목록 */}
                <div className={styles.borderContent}>
                    <div className={styles.borderItem}>
                        <p>지역</p>
                        <p>게시글 제목</p>
                        {/* 태그 */}
                        {/* 인원 수 */}
                        <div>
                            <img src="" alt="" />
                            <p>작성자</p>
                        </div>
                    </div>
                </div>
                {/* 페이지 목차 */}
                <div></div>
            </div>
        </>
    );
};

export default TeamBuildingBoard;