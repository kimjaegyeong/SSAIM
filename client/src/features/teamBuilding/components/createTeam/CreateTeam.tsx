import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateTeam.module.css";
import Button from "../../../../components/button/Button";
import { createRecruiting } from "../../apis/createTeam/createRecruiting";
import useUserStore from '@/stores/useUserStore';
import ProjectDatePicker from './projectDatePicker/ProjectDatePicker';
import RegionSelector from "./regionSelector/RegionSelector";
import TitleInput from "./titleInput/TitleInput";
import ContentInput from "./contentInput/ContentInput";
import DomainSelector from "./domainSelector/DomainSelector";
import RecruitmentSelector from "./recruitmentSelector/RecruitmentSelector";
import { getPositionLabel } from "../../../../utils/labelUtils";
import Tag from "../tag/Tag";

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
    const [N, setN] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>("0");
    const totalPositions = recruitment.FE + recruitment.BE + recruitment.Infra;
    const [selectedMyPosition, setSelectedMyPosition] = useState<number | null>(null);


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

    const getDomainCategory = (domainId: number) => {
        const domain = domains.find((d) => d.id === domainId);
        if (!domain) return null;
    
        if (domain.categoryId === 1) return "common";
        if (domain.categoryId === 2) return "specialized";
        if (domain.categoryId === 3) return "autonomous";
        return null;
    };

    const handleMyPositionClick = (position: number) => {
        if (selectedMyPosition === position) {
            setSelectedMyPosition(null);
        } else {
            setSelectedMyPosition(position);
        }
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

    const handleSubmit = async () => {
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

        if (!selectedMyPosition) {
            alert("내 포지션을 선택해주세요.");
            return;
        }

        const totalMembers = recruitment.Infra + recruitment.BE + recruitment.FE;
        if (N !== totalMembers) {
            alert(`총 모집 인원(${N})과 세부 모집 인원의 합(${totalMembers})이 일치하지 않습니다.`);
            return;
        }

        const localStartDate = convertToLocalDate(startDate);
        const localEndDate = convertToLocalDate(endDate);
        const memberFrontend = selectedMyPosition === 0 ? recruitment.FE - 1 : recruitment.FE
        const memberBackend = selectedMyPosition === 1 ? recruitment.BE - 1 : recruitment.BE
        const memberInfra = selectedMyPosition === 2 ? recruitment.Infra - 1 : recruitment.Infra
        
        if (memberBackend < 0 || memberFrontend < 0 || memberInfra < 0) {
            alert("내 포지션과 일치하는 인원이 모집 인원보다 많습니다.");
            return;
        }
    
        const formData = {
            author: user.userId,
            title,
            content,
            startDate: localStartDate,
            endDate: localEndDate,
            firstDomain: selectedDomains[0],
            campus: selectedRegion,
            memberTotal: N,
            memberFrontend: memberFrontend,
            memberBackend: memberBackend,
            memberInfra: memberInfra,
            position: selectedMyPosition,
            ...(selectedDomains[1] ? { secondDomain: selectedDomains[1] } : {}),
        };
        
        try {
            await createRecruiting(formData); // 서버에 요청을 보냅니다.
            navigate('/team-building'); // 성공 시 페이지 이동
        } catch (error) {
            console.error(error); // 에러를 콘솔에 출력합니다.
            alert("데이터를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요."); // 사용자에게 에러 메시지를 표시합니다.
        }
    };

    return (
        <>
            <div className={styles.teamCreationForm}>
                {/* 왼쪽 섹션 */}
                <div className={styles.formSection}>
                    <ProjectDatePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                    <RegionSelector
                        selectedRegion={selectedRegion}
                        regions={campus}
                        onRegionChange={setSelectedRegion}
                    />
                    <TitleInput title={title} onTitleChange={setTitle} />
                    <ContentInput content={content} onContentChange={setContent} />
                </div>
                {/* 오른쪽 섹션 */}
                <div className={styles.selectionSection}>
                    <DomainSelector domains={domains} selectedDomains={selectedDomains} onDomainClick={handleDomainClick} />
                    <RecruitmentSelector recruitment={recruitment} totalPositions={totalPositions} N={N} inputValue={inputValue} onInputChange={setInputValue} onSliderChange={handleSliderChange} onNChange={setN} />
                    <div className={styles.myPosition}>
                        <span>내 포지션</span>
                        <div className={styles.myPositionTag}>
                            {[0, 1, 2].map((tag) => (
                                <Tag
                                    key={tag}
                                    text={getPositionLabel(tag)}
                                    useDefaultColors={selectedMyPosition !== tag}
                                    onClick={() => handleMyPositionClick(tag)}
                                />
                            ))}
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