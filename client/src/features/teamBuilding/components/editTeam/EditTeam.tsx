import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditTeam.module.css";
import Button from "../../../../components/button/Button";
import useUserStore from '@/stores/useUserStore';
import ProjectDatePicker from '../createTeam/projectDatePicker/ProjectDatePicker';
import RegionSelector from "../createTeam/regionSelector/RegionSelector";
import TitleInput from "../createTeam/titleInput/TitleInput";
import ContentInput from "../createTeam/contentInput/ContentInput";
import DomainSelector from "../createTeam/domainSelector/DomainSelector";

interface Recruitment {
    FE: number;
    BE: number;
    Infra: number;
}

interface EditTeamProps {
    initialData?: any;
}

const TeamCreation: React.FC<EditTeamProps>= ({ initialData }) => {
    const [selectedRegion, setSelectedRegion] = useState<number | null>(initialData?.campus || null);
    const [title, setTitle] = useState<string>(initialData?.postTitle || "");
    const [content, setContent] = useState<string>(initialData?.postContent || "");
    const [recruitment, setRecruitment] = useState<Recruitment>({
        FE: initialData?.memberFrontend || 0,
        BE: initialData?.memberBackend || 0,
        Infra: initialData?.memberInfra || 0,
    });
    const [selectedDomains, setSelectedDomains] = useState<number[]>([initialData?.firstDomain, initialData?.secondDomain].filter(Boolean));
    const [startDate, setStartDate] = useState<string>(initialData?.startDate || "");
    const [endDate, setEndDate] = useState<string>(initialData?.endDate || "");
    const [N, setN] = useState<number>(initialData?.memberTotal || 0);
    const navigate = useNavigate();
    const { userId } = useUserStore();

    useEffect(() => {
        if (initialData) {
            setSelectedRegion(initialData.campus);
            setTitle(initialData.postTitle);
            setContent(initialData.postContent);
            setRecruitment({
                FE: initialData.memberFrontend,
                BE: initialData.memberBackend,
                Infra: initialData.memberInfra,
            });
            setSelectedDomains([initialData.firstDomain, initialData.secondDomain].filter(Boolean));
            setStartDate(initialData.startDate);
            setEndDate(initialData.endDate);
            setN(initialData.memberTotal);
        }
    }, [initialData]);

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
            author: userId,
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
        
        console.log(formData);

        navigate(`/team-building/detail/${initialData.postId}`);
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