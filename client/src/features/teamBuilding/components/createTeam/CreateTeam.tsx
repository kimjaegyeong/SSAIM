import React, { useState } from "react";
import styles from "./CreateTeam.module.css";
import Tag from "../tag/Tag";
import Button from "../../../../components/button/Button";

interface Recruitment {
    FE: number;
    BE: number;
    Infra: number;
}

const TeamCreation: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [recruitment, setRecruitment] = useState<Recruitment>({ FE: 0, BE: 0, Infra: 0 });
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

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
        }
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
                            <div>
                                {[
                                    "웹기술", "웹디자인", "모바일", "AIoT"
                                ].map((tag) => (
                                    <Tag
                                        key={tag}
                                        text={tag}
                                        useDefaultColors={!selectedDomains.includes(tag)}
                                        onClick={() => handleDomainClick(tag)}
                                    />
                                ))}
                                <hr />
                                {[
                                    "AI영상", "AI음성", "추천", "분산", "자율주행", "스마트홈", "P2P",
                                    "디지털거래", "메타버스", "핀테크"
                                ].map((tag) => (
                                    <Tag
                                        key={tag}
                                        text={tag}
                                        useDefaultColors={!selectedDomains.includes(tag)}
                                        onClick={() => handleDomainClick(tag)}
                                    />
                                ))}
                                <hr />
                                {[
                                    "자유주제", "기업연계"
                                ].map((tag) => (
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
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>모집 인원 수</label>
                        <div className={styles.recruitmentOptions}>
                            {(["FE", "BE", "Infra"] as const).map((role) => (
                                <div key={role} className={styles.role}>
                                    <Tag text={role}/>
                                    <input
                                        type="number"
                                        value={recruitment[role]}
                                        onChange={(e) =>
                                            setRecruitment({
                                                ...recruitment,
                                                [role]: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        min="0"
                                        max="10"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttonSection}>
                <Button size="custom" colorType="red" >취소</Button>
                <Button size="custom" colorType="blue" >생성</Button>
            </div>
        </>
    );
};

export default TeamCreation;