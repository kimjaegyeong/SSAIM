import React, { useState, useEffect } from "react";
import styles from './TeamBuildingBoard.module.css';
import DropDown from '../filterDropDown/FilterDropDown';
import CategoryDropdown from "../filterDropDown/CategoryDropDown";
import Tag from '../tag/Tag';
import { getTeamBuildingList } from "../../apis/teamBuildingBoard/getTeamBuildingList";
import { AiOutlineProfile } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { getDomainLabel, getRegionLabel, getStatusLabel } from "../../../../utils/labelUtils";
import DefaultProfile from "../../../../assets/profile/DefaultProfile.png"

type TeamBuildingData = {
    postId: number;
    campus: number;
    postTitle: string;
    firstDomain: number;
    secondDomain: number;
    status: number;
    recruitedTotal: number;
    memberTotal: number;
    authorProfileImageUrl: string;
    authorName: string;
    memberInfra: number;
    memberBackend: number;
    memberFrontend: number;
};

const TeamBuildingBoard: React.FC = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<TeamBuildingData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        getTeamBuildingList()
            .then((response) => {
                setData(response);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
        console.log(data);
    }, []);

    // 필터링 상태 관리
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const regionOptions = [
        { value: '1', label: '서울' },
        { value: '2', label: '대전' },
        { value: '3', label: '광주' },
        { value: '4', label: '구미' },
        { value: '5', label: '부울경' },
        { value: '', label: '전체' },
    ];

    const domainCategory = [
        {
            label: '공통',
            options: [
                { value: '1', label: '웹기술' },
                { value: '2', label: '웹디자인' },
                { value: '3', label: '모바일' },
                { value: '4', label: 'AIoT' },
            ],
        },
        {
            label: '특화',
            options: [
                { value: '5', label: 'AI영상' },
                { value: '6', label: 'AI음성' },
                { value: '7', label: '추천' },
                { value: '8', label: '분산' },
                { value: '9', label: '자율주행' },
                { value: '10', label: '스마트홈' },
                { value: '11', label: 'P2P' },
                { value: '12', label: '디지털거래' },
                { value: '13', label: '메타버스' },
                { value: '14', label: '핀테크' },
            ],
        },
        {
            label: '자율',
            options: [
                { value: '15', label: '자유주제' },
                { value: '16', label: '기업연계' },
            ],
        },
    ];
    
    const stateOptions = [
        { value: '1', label: '모집' },
        { value: '0', label: '마감' },
        { value: '', label: '전체' },
    ];
    
    const positionOptions = [
        { value: '1', label: 'FE' },
        { value: '2', label: 'BE' },
        { value: '3', label: 'Infra' },
        { value: '', label: '전체' },
    ];

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
    const handleDropdownToggle = (dropdownName: string) => {
      setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    };

    const handleSelect = (type: 'region' | 'domain' | 'position' | 'state', selectedOption: { value: string }) => {
        if (type === 'region') {
            setSelectedRegion(selectedOption.value);
        } else if (type === 'domain') {
            setSelectedDomain(selectedOption.value);
        } else if (type === 'position') {
            setSelectedPosition(selectedOption.value);
        } else if (type === 'state') {
            setSelectedState(selectedOption.value);
        } 
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        const params: { [key: string]: any } = {};
      
        if (selectedRegion) {
          params.campus = parseInt(selectedRegion);
        }
        if (selectedState) {
          params.status = parseInt(selectedState);
        }
        if (selectedPosition) {
          params.position = parseInt(selectedPosition);
        }
        if (selectedDomain) {
          params.domain = parseInt(selectedDomain);
        }
        if (searchQuery.trim()) {
          params.title = searchQuery;
        }
      
        console.log('선택된 필터:', params);
    };

    return (
        <>
            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <div className={styles.filterSection}>
                        <DropDown 
                            options={regionOptions} 
                            selectedOption={selectedRegion === '' ? null : regionOptions.find(option => option.value === selectedRegion) || null} 
                            onSelect={(option) => handleSelect('region', option)} 
                            isOpen={openDropdown === '지역'}
                            onToggle={() => handleDropdownToggle('지역')}
                            placeholder="지역" 
                        />
                        <CategoryDropdown 
                            categories={domainCategory} 
                            selectedOption={
                                selectedDomain === '' ? null : domainCategory.flatMap(category => category.options).find(option => option.value === selectedDomain) || null
                            }
                            onSelect={(option) => handleSelect('domain', option)} 
                            isOpen={openDropdown === '도메인'}
                            onToggle={() => handleDropdownToggle('도메인')}
                            placeholder="도메인" 
                        />
                        <DropDown 
                            options={positionOptions} 
                            selectedOption={selectedPosition === '' ? null : positionOptions.find(option => option.value === selectedPosition) || null} 
                            onSelect={(option) => handleSelect('position', option)} 
                            isOpen={openDropdown === '직무'}
                            onToggle={() => handleDropdownToggle('직무')}
                            placeholder="직무" 
                        />
                        <DropDown 
                            options={stateOptions} 
                            selectedOption={selectedState === '' ? null : stateOptions.find(option => option.value === selectedState) || null} 
                            onSelect={(option) => handleSelect('state', option)} 
                            isOpen={openDropdown === '상태'}
                            onToggle={() => handleDropdownToggle('상태')}
                            placeholder="상태" 
                        />
                    </div>
                    <div className={styles.searchActions}>
                        <div className={styles.searchBar}>
                            <input 
                                className={styles.searchInput} 
                                type="text" 
                                placeholder="검색" 
                                value={searchQuery}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.actionButtons}>
                            <button onClick={handleSearch}><IoSearchOutline /> 검색</button> 
                            <button onClick={() => navigate('/team-building/detail/1')}><AiOutlineProfile /> 신청현황</button>
                            <button onClick={() => navigate('/team-building/create')}><FiPlus /> 팀 생성</button>
                        </div>
                    </div>
                </div>
                <div className={styles.boardContent}>
                    {!loading && data?.length > 0 ? (
                        data.map((item, index) => {
                            return (
                                <div key={index} className={styles.boardItem} onClick={() => navigate(`/team-building/detail/${item.postId}`)}>
                                    <span className={styles.region}>[{getRegionLabel(item.campus)}]</span>
                                    <span className={styles.title}>{item.postTitle}</span>
                                    <div className={styles.category}>
                                        <Tag text={getDomainLabel(item.firstDomain)} />
                                        <Tag text={getDomainLabel(item.secondDomain)} />
                                    </div>
                                    <div className={styles.state}>
                                        <Tag text={getStatusLabel(item.status)} />
                                        <span>{item.recruitedTotal ? item.recruitedTotal : 0}/{item.memberTotal}</span>
                                    </div>
                                    <div className={styles.position}>
                                        {item.memberFrontend > 0 && <Tag text={'FE'} />}
                                        {item.memberBackend > 0 && <Tag text={'BE'} />}
                                        {item.memberInfra > 0 && <Tag text={'Infra'} />}
                                    </div>
                                    <div className={styles.profile}>
                                        <img
                                            src={item.authorProfileImageUrl ? item.authorProfileImageUrl : DefaultProfile}
                                            alt="Profile Image"
                                            className={styles.profileImg}
                                        />
                                        <span>{item.authorName}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : error ? (
                        <div className={styles.noResults}>
                            데이터를 가져오지 못했습니다. 다시 시도하세요.
                        </div>
                    ) : loading ? (
                        <div className={styles.noResults}>
                            Loading...
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TeamBuildingBoard;