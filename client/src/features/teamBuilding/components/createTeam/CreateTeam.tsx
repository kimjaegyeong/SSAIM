import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateTeam.module.css";
import Tag from "../tag/Tag";
import Button from "../../../../components/button/Button";
import { createRecruiting } from "../../apis/createTeam/createRecruiting";
import useUserStore from '@/stores/useUserStore';

interface Recruitment {
    FE: number;
    BE: number;
    Infra: number;
}

const TeamCreation: React.FC = () => {
    const user = useUserStore();
    const navigate = useNavigate();
    const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [recruitment, setRecruitment] = useState<Recruitment>({ FE: 0, BE: 0, Infra: 0 });
    const [selectedDomains, setSelectedDomains] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedMyPosition, setSelectedMyPosition] = useState<string | null>(null);
    const [N, setN] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>("0");
    const totalPositions = recruitment.FE + recruitment.BE + recruitment.Infra;

    useEffect(() => {
        setRecruitment({ FE: 0, BE: 0, Infra: 0 });
    }, [N]);

    const domains = [
        { id: 1, categoryId: 1, name: "웹기술" },
        { id: 2, categoryId: 1, name: "웹디자인" },
        { id: 3, categoryId: 1, name: "모바일" },
        { id: 4, categoryId: 1, name: "AIoT" },
        { id: 5, categoryId: 2, name: "AI영상" },
        { id: 6, categoryId: 2, name: "AI음성" },
        { id: 7, categoryId: 2, name: "추천" },
        { id: 8, categoryId: 2, name: "분산" },
        { id: 9, categoryId: 2, name: "자율주행" },
        { id: 10, categoryId: 2, name: "스마트홈" },
        { id: 11, categoryId: 2, name: "P2P" },
        { id: 12, categoryId: 2, name: "디지털거래" },
        { id: 13, categoryId: 2, name: "메타버스" },
        { id: 14, categoryId: 2, name: "핀테크" },
        { id: 15, categoryId: 3, name: "자유주제" },
        { id: 16, categoryId: 3, name: "기업연계" },
    ];

    const campus = [
        { id: 1, name: "서울" },
        { id: 2, name: "대전" },
        { id: 3, name: "광주" },
        { id: 4, name: "구미" },
        { id: 5, name: "부울경" },
    ]

    const handleRegionChange = (id: number) => {
        if (selectedRegion === id) {
            setSelectedRegion(null);
        } else {
            setSelectedRegion(id);
        }
    };

    const getDomainCategory = (domainId: number) => {
        const domain = domains.find((d) => d.id === domainId);
        if (!domain) return null;
    
        if (domain.categoryId === 1) return "common";
        if (domain.categoryId === 2) return "specialized";
        if (domain.categoryId === 3) return "autonomous";
        return null;
    };

    const handleDomainClick = (domainId: number) => {
        const domainCategory = getDomainCategory(domainId);
        const selectedCategories = selectedDomains.map(getDomainCategory);
    
        if (
            selectedCategories.length > 0 &&
            !selectedCategories.includes(domainCategory)
        ) {
            alert("다른 대분류의 도메인은 선택할 수 없습니다.");
            return;
        }
    
        if (selectedDomains.includes(domainId)) {
            setSelectedDomains(selectedDomains.filter((id) => id !== domainId));
        } else if (selectedDomains.length < 2) {
            setSelectedDomains([...selectedDomains, domainId]);
        } else {
            alert("최대 2개의 도메인만 선택할 수 있습니다.");
        }
    };

    const handleMyPositionClick = (position: string) => {
        if (selectedMyPosition === position) {
            setSelectedMyPosition(null);
        } else {
            setSelectedMyPosition(position);
        }
    };

    const handleSliderChange = (role: keyof Recruitment, value: number) => {
        const parsedValue = isNaN(value) ? 0 : value;
        const otherTotal = totalPositions - recruitment[role];
        const maxAllowed = N - otherTotal;
      
        if (parsedValue <= maxAllowed) {
            setRecruitment({ ...recruitment, [role]: parsedValue });
        } else {
            setRecruitment({ ...recruitment, [role]: maxAllowed });
        }
    };

    const convertToLocalDate = (dateString: string): string | null => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    const handleSubmit = () => {
        // 유효성 검사
        if (!title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
      
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
      
        if (!startDate || !endDate) {
            alert("프로젝트 기간을 설정해주세요.");
            return;
        }
      
        if (!selectedRegion) {
            alert("캠퍼스를 선택해주세요.");
            return;
        }
      
        if (selectedDomains.length === 0) {
            alert("최소 하나의 도메인을 선택해주세요.");
            return;
        }
      
        if (N === 0) {
            alert("모집 인원은 최소 1명 이상이어야 합니다.");
            return;
        }

        const totalMembers = recruitment.Infra + recruitment.BE + recruitment.FE;
        if (N !== totalMembers) {
            alert(`총 모집 인원(${N})과 세부 모집 인원의 합(${totalMembers})이 일치하지 않습니다.`);
            return;
        }

        const localStartDate = convertToLocalDate(startDate);
        const localEndDate = convertToLocalDate(endDate);
    
        const formData = {
            author: user.userId,
            title,
            content,
            startDate: localStartDate,
            endDate: localEndDate,
            firstDomain: selectedDomains[0],
            secondDomain: selectedDomains[1] || null,
            campus: selectedRegion,
            memberTotal: N,
            memberInfra: recruitment.Infra,
            memberBackend: recruitment.BE,
            memberFrontend: recruitment.FE,
        };
        
        createRecruiting(formData)

        navigate('/team-building');
    };

    return (
        <>
            <div className={styles.teamCreationForm}>
                {/* 왼쪽 섹션 */}
                <div className={styles.formSection}>
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
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>지역 선택</label>
                        <div className={styles.regionOptions}>
                            {campus.map((city) => (
                                <label key={city.id} className={styles.regionLabel}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRegion === city.id}
                                        onChange={() => handleRegionChange(city.id)}
                                    />{" "}
                                    {city.name}
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
                            {["common", "specialized", "autonomous"].map((category) => {
                                const categoryDomains = domains.filter(
                                    (domain) =>
                                        (category === "common" && domain.categoryId === 1) ||
                                        (category === "specialized" && domain.categoryId === 2) ||
                                        (category === "autonomous" && domain.categoryId === 3)
                                );
                                const categoryName =
                                    category === "common" ? "공통" : category === "specialized" ? "특화" : "자율";

                                return (
                                    <div key={category} className={styles.domainWrapper}>
                                        <div
                                            className={`${styles.categoryBox} ${
                                                selectedDomains.some((domainId) => {
                                                    const domain = domains.find((d) => d.id === domainId);
                                                    return (
                                                        (category === "common" && domain?.categoryId === 1) ||
                                                        (category === "specialized" && domain?.categoryId === 2) ||
                                                        (category === "autonomous" && domain?.categoryId === 3)
                                                    );
                                                })
                                                    ? styles.activeCategory
                                                    : ""
                                            }`}
                                        >
                                            {categoryName}
                                        </div>
                                        <div className={styles.tagList}>
                                            {categoryDomains.map((domain) => (
                                                <Tag
                                                    key={domain.id}
                                                    text={domain.name}
                                                    badgeText={
                                                        selectedDomains.includes(domain.id)
                                                            ? (selectedDomains.indexOf(domain.id) + 1).toString()
                                                            : undefined
                                                    }
                                                    useDefaultColors={!selectedDomains.includes(domain.id)}
                                                    onClick={() => handleDomainClick(domain.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.sectionLabel}>
                            모집 인원
                            <input
                                type="number"
                                min={0}
                                max={9}
                                value={inputValue}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value === "") {
                                        setInputValue("");
                                        return;
                                    }
                                    let numericValue = parseInt(value);
                                    if (numericValue > 9) numericValue = 9;
                                    if (numericValue < 0) numericValue = 0;
                                    setInputValue(numericValue.toString());
                                    setN(numericValue);
                                }}
                                onBlur={() => {
                                    if (inputValue === "") {
                                        setInputValue("0");
                                        setN(0);
                                    }
                                }}
                                onFocus={(e) => e.target.select()}
                                className={styles.numberInput}
                            />
                        </label>
                        <div className={styles.recruitmentOptions}>
                            {(["FE", "BE", "Infra"] as const).map((role) => (
                                <div key={role} className={styles.role}>
                                    <div>
                                        <Tag text={role}/>
                                    </div>
                                    <span>{recruitment[role]}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max={N}
                                        value={recruitment[role]}
                                        onChange={(e) => handleSliderChange(role, parseInt(e.target.value))}
                                        className={styles.slider}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className={styles.myPosition}>
                            <span>내 포지션</span>
                            <div className={styles.myPositionTag}>
                                {["FE", "BE", "Infra", "미정"].map((tag) => (
                                    <Tag
                                        key={tag}
                                        text={tag}
                                        useDefaultColors={selectedMyPosition !== tag}
                                        onClick={() => handleMyPositionClick(tag)}
                                    />
                                ))}
                            </div>
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