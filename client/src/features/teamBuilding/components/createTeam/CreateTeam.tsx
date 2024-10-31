import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateTeam.module.css";
import Tag from "../tag/Tag";
import Button from "../../../../components/button/Button";
import NumberInput from "../numberInput/NumberInput";

interface Recruitment {
    FE: number;
    BE: number;
    Infra: number;
}

const TeamCreation: React.FC = () => {
    const navigate = useNavigate();
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [recruitment, setRecruitment] = useState<Recruitment>({ FE: 0, BE: 0, Infra: 0 });
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handleRegionChange = (city: string) => {
        if (selectedRegion === city) {
            setSelectedRegion(null);
        } else {
            setSelectedRegion(city);
        }
    };

    const handleDomainClick = (domain: string) => {
        if (selectedDomains.includes(domain)) {
            setSelectedDomains(selectedDomains.filter((item) => item !== domain));
        } else if (selectedDomains.length < 2) {
            setSelectedDomains([...selectedDomains, domain]);
        } else {
            alert("최대 2개의 도메인만 선택할 수 있습니다.");
        }
    };

    const handleSubmit = () => {
        // 데이터 유효성 검사
        const totalPositions = recruitment.FE + recruitment.BE + recruitment.Infra;
        if (!title || !content || !selectedRegion || selectedDomains.length === 0 || totalPositions === 0) {
            alert("모든 필드를 채워주세요. 모집 인원 수는 최소 1명 이상이어야 합니다.");
            return;
        }
    
        const formData = {
            title,
            content,
            region: selectedRegion,
            domains: selectedDomains,
            recruitment,
            startDate,
            endDate,
        };
    
        console.log("준비된 데이터:", formData);
        
        //API 호출 자리

        navigate('/team-building');
    };

    return (
        <>
            <div className={styles.teamCreationForm}>
                {/* 왼쪽 섹션 */}
                <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>지역 선택</label>
                        <div className={styles.regionOptions}>
                            {["서울", "대전", "광주", "구미", "부울경"].map((city) => (
                                <label key={city}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRegion === city}
                                        onChange={() => handleRegionChange(city)}
                                    />{" "}
                                    {city}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>게시글 제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="게시글 제목을 입력하세요"
                            className={styles.textInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>게시글 본문</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="게시글 본문을 입력하세요"
                            className={styles.textArea}
                        ></textarea>
                    </div>
                </div>
                {/* 오른쪽 섹션 */}
                <div className={styles.selectionSection}>
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>도메인 선택(최대 2개)</label>
                        <div className={styles.tagOptions}>
                            {/* 공통 */}
                            <div className={styles.domainWrapper}>
                                <div className={styles.categoryBox}>공통</div>
                                <div className={styles.tagList}>
                                    {["웹기술", "웹디자인", "모바일", "AIoT"].map((tag) => (
                                        <Tag
                                            key={tag}
                                            text={tag}
                                            useDefaultColors={!selectedDomains.includes(tag)}
                                            onClick={() => handleDomainClick(tag)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* 특화 */}
                            <div className={styles.domainWrapper}>
                                <div className={styles.categoryBox}>특화</div>
                                <div className={styles.tagList}>
                                    {["AI영상", "AI음성", "추천", "분산", "자율주행", "스마트홈", "P2P", "디지털거래"].map((tag) => (
                                        <Tag
                                            key={tag}
                                            text={tag}
                                            useDefaultColors={!selectedDomains.includes(tag)}
                                            onClick={() => handleDomainClick(tag)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* 자율 */}
                            <div className={styles.domainWrapper}>
                                <div className={styles.categoryBox}>자율</div>
                                <div className={styles.tagList}>
                                    {["자유주제", "기업연계"].map((tag) => (
                                        <Tag
                                            key={tag}
                                            text={tag}
                                            useDefaultColors={!selectedDomains.includes(tag)}
                                            onClick={() => handleDomainClick(tag)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>모집 인원 수</label>
                        <div className={styles.recruitmentOptions}>
                            {(["FE", "BE", "Infra"] as const).map((role) => (
                                <div key={role} className={styles.role}>
                                    <Tag text={role}/>
                                    <NumberInput/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>프로젝트 기간</label>
                        <div className={styles.dateInputs}>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={styles.dateInput}
                            />
                            <span className={styles.dateSeparator}>~</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={styles.dateInput}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttonSection}>
                <Button size="custom" colorType="blue" onClick={handleSubmit}>생성</Button>
                <Button size="custom" colorType="red" onClick={() => {navigate(-1)}}>취소</Button>
            </div>
        </>
    );
};

export default TeamCreation;