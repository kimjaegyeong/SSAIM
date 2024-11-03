import React, { useState, useEffect } from "react";
import styles from './TeamBuildingBoard.module.css';
import DropDown from '../filterDropDown/filterDropDown';
import Tag from '../tag/Tag';
import Bar from '../bar/Bar';
import { GrPowerReset } from "react-icons/gr";
import { AiOutlineProfile } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const TeamBuildingBoard: React.FC = () => {
    const navigate = useNavigate()
    
    const data = [
        { id: 1, title: '팀원 모집 게시글 1', region: '서울', currentMembers: 3, totalMembers: 6, category: ['자유주제', '기업연계'], position: ['FE', 'BE', 'Infra'], author: 'XXX', state: '모집' },
        { id: 2, title: '팀원 모집 게시글 2', region: '대전', currentMembers: 5, totalMembers: 6, category: ['자유주제', '기업연계'], position: ['FE', 'Infra'], author: 'XXX', state: '모집' },
        { id: 3, title: '팀원 모집 게시글 3', region: '광주', currentMembers: 6, totalMembers: 6, category: ['자유주제'], position: ['BE'], author: 'XXX', state: '모집' },
        { id: 4, title: '팀원 모집 게시글 4', region: '구미', currentMembers: 5, totalMembers: 7, category: ['자유주제'], position: ['FE', 'BE'], author: 'XXX', state: '마감' },
        { id: 5, title: '팀원 모집 게시글 5', region: '부울경', currentMembers: 2, totalMembers: 6, category: ['기업연계'], position: ['FE'], author: 'XXX', state: '모집' },
        { id: 6, title: '팀원 모집 게시글 6', region: '서울', currentMembers: 3, totalMembers: 6, category: ['자유주제', '기업연계'], position: ['FE', 'BE', 'Infra'], author: 'XXX', state: '모집' },
        { id: 7, title: '팀원 모집 게시글 7', region: '대전', currentMembers: 4, totalMembers: 5, category: ['자유주제'], position: ['BE', 'FE'], author: 'YYY', state: '모집' },
        { id: 8, title: '팀원 모집 게시글 8', region: '광주', currentMembers: 3, totalMembers: 4, category: ['기업연계'], position: ['Infra'], author: 'ZZZ', state: '마감' },
        { id: 9, title: '팀원 모집 게시글 9', region: '서울', currentMembers: 5, totalMembers: 5, category: ['자유주제', '기업연계'], position: ['FE', 'BE'], author: 'AAA', state: '모집' },
        { id: 10, title: '팀원 모집 게시글 10', region: '부울경', currentMembers: 1, totalMembers: 6, category: ['자유주제'], position: ['FE'], author: 'BBB', state: '모집' },
        { id: 11, title: '팀원 모집 게시글 11', region: '구미', currentMembers: 3, totalMembers: 6, category: ['기업연계'], position: ['BE', 'Infra'], author: 'CCC', state: '마감' },
        { id: 12, title: '팀원 모집 게시글 12', region: '서울', currentMembers: 4, totalMembers: 7, category: ['자유주제'], position: ['FE', 'Infra'], author: 'DDD', state: '모집' },
        { id: 13, title: '팀원 모집 게시글 13', region: '대전', currentMembers: 3, totalMembers: 4, category: ['기업연계'], position: ['Infra', 'BE'], author: 'EEE', state: '마감' },
        { id: 14, title: '팀원 모집 게시글 14', region: '광주', currentMembers: 5, totalMembers: 5, category: ['자유주제'], position: ['FE', 'BE', 'Infra'], author: 'FFF', state: '모집' },
        { id: 15, title: '팀원 모집 게시글 15', region: '부울경', currentMembers: 2, totalMembers: 6, category: ['자유주제'], position: ['FE'], author: 'GGG', state: '모집' },
        { id: 16, title: '팀원 모집 게시글 16', region: '서울', currentMembers: 4, totalMembers: 6, category: ['자유주제', '기업연계'], position: ['FE', 'BE', 'Infra'], author: 'HHH', state: '모집' },
        { id: 17, title: '팀원 모집 게시글 17', region: '대전', currentMembers: 3, totalMembers: 4, category: ['자유주제'], position: ['Infra'], author: 'III', state: '마감' },
        { id: 18, title: '팀원 모집 게시글 18', region: '광주', currentMembers: 5, totalMembers: 7, category: ['기업연계'], position: ['BE', 'FE'], author: 'JJJ', state: '모집' },
        { id: 19, title: '팀원 모집 게시글 19', region: '구미', currentMembers: 4, totalMembers: 6, category: ['자유주제'], position: ['Infra', 'FE'], author: 'KKK', state: '마감' },
        { id: 20, title: '팀원 모집 게시글 20', region: '부울경', currentMembers: 2, totalMembers: 6, category: ['기업연계'], position: ['FE'], author: 'LLL', state: '마감' },
        { id: 21, title: '팀원 모집 게시글 21', region: '서울', currentMembers: 4, totalMembers: 6, category: ['자유주제', '기업연계'], position: ['FE', 'BE', 'Infra'], author: 'MMM', state: '모집' },
        { id: 22, title: '팀원 모집 게시글 22', region: '대전', currentMembers: 5, totalMembers: 6, category: ['자유주제'], position: ['Infra', 'BE'], author: 'NNN', state: '모집' },
        { id: 23, title: '팀원 모집 게시글 23', region: '광주', currentMembers: 3, totalMembers: 5, category: ['자유주제'], position: ['BE', 'FE'], author: 'OOO', state: '마감' },
        { id: 24, title: '팀원 모집 게시글 24', region: '부울경', currentMembers: 1, totalMembers: 6, category: ['기업연계'], position: ['Infra'], author: 'PPP', state: '모집' },
        { id: 25, title: '팀원 모집 게시글 25', region: '서울', currentMembers: 5, totalMembers: 5, category: ['자유주제', '기업연계'], position: ['FE', 'Infra'], author: 'QQQ', state: '모집' },
        { id: 26, title: '팀원 모집 게시글 26', region: '구미', currentMembers: 4, totalMembers: 6, category: ['자유주제'], position: ['BE', 'Infra'], author: 'RRR', state: '마감' },
        { id: 27, title: '팀원 모집 게시글 27', region: '광주', currentMembers: 3, totalMembers: 4, category: ['기업연계'], position: ['FE'], author: 'SSS', state: '모집' },
        { id: 28, title: '팀원 모집 게시글 28', region: '서울', currentMembers: 2, totalMembers: 7, category: ['자유주제', '기업연계'], position: ['BE', 'FE', 'Infra'], author: 'TTT', state: '모집' },
        { id: 29, title: '팀원 모집 게시글 29', region: '부울경', currentMembers: 3, totalMembers: 6, category: ['자유주제'], position: ['FE'], author: 'UUU', state: '마감' },
        { id: 30, title: '팀원 모집 게시글 30', region: '대전', currentMembers: 6, totalMembers: 6, category: ['기업연계'], position: ['Infra', 'BE'], author: 'VVV', state: '마감' }
    ];
    

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 필터링 상태 관리
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedMembers, setSelectedMembers] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const regionOptions = [
        { value: '서울', label: '서울' },
        { value: '대전', label: '대전' },
        { value: '광주', label: '광주' },
        { value: '구미', label: '구미' },
        { value: '부울경', label: '부울경' },
    ];
    const memberOptions = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
    ];
    const positionOptions = [
        { value: 'FE', label: 'FE' },
        { value: 'BE', label: 'BE' },
        { value: 'Infra', label: 'Infra' },
    ];

    const filteredData = data.filter((item) => {
        const regionMatch = selectedRegion ? item.region === selectedRegion : true;
        const membersMatch = selectedMembers ? item.currentMembers.toString() === selectedMembers : true;
        const positionMatch = selectedPosition ? item.position.includes(selectedPosition) : true;
        const searchMatch = searchQuery ? item.title.includes(searchQuery) : true;
        return regionMatch && membersMatch && positionMatch && searchMatch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);
    
    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    const endPage = Math.min(totalPages, startPage + 4);

    const handleSelect = (type: 'region' | 'members' | 'position', selectedOption: { value: string }) => {
        if (type === 'region') {
            setSelectedRegion(selectedOption.value);
        } else if (type === 'members') {
            setSelectedMembers(selectedOption.value);
        } else if (type === 'position') {
            setSelectedPosition(selectedOption.value);
        }
        setCurrentPage(1);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSelectedRegion('');
        setSelectedMembers('');
        setSelectedPosition('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <>
            <div className={styles.board}>
                <div className={styles.boardHeader}>
                    <div className={styles.filterSection}>
                        <DropDown 
                            options={regionOptions} 
                            selectedOption={regionOptions.find(option => option.value === selectedRegion) || null} 
                            onSelect={(option) => handleSelect('region', option)} 
                            placeholder="지역" 
                        />
                        <DropDown 
                            options={memberOptions} 
                            selectedOption={memberOptions.find(option => option.value === selectedMembers) || null} 
                            onSelect={(option) => handleSelect('members', option)} 
                            placeholder="인원" 
                        />
                        <DropDown 
                            options={positionOptions} 
                            selectedOption={positionOptions.find(option => option.value === selectedPosition) || null} 
                            onSelect={(option) => handleSelect('position', option)} 
                            placeholder="직무" 
                        />
                        <GrPowerReset onClick={resetFilters} className={styles.resetButton} color="949494"/>
                    </div>
                    <div className={styles.searchActions}>
                        <div className={styles.searchBar}>
                            <input 
                                className={styles.searchInput} 
                                type="text" 
                                placeholder="검색" 
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className={styles.actionButtons}> 
                            <button onClick={() => navigate('/team-building/detail/1')}><AiOutlineProfile /> 신청현황</button>
                            <button onClick={() => navigate('/team-building/create')}><FiPlus /> 팀 생성</button>
                        </div>
                    </div>
                </div>
                <div className={styles.boardContent}>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div key={index} className={styles.boardItem} onClick={() => navigate(`/team-building/detail/${item.id}`)}>
                                <span className={styles.region}>[{item.region}]</span>
                                <span className={styles.title}>{item.title}</span>
                                <div className={styles.category}>
                                    {item.category.map((cat, catIndex) => (
                                        <Tag key={catIndex} text={cat} />
                                    ))}
                                </div>
                                <div className={styles.state}>
                                    <Tag text={item.state}/>
                                    <span>{item.currentMembers}/{item.totalMembers}</span>
                                </div>
                                <div className={styles.position}>
                                    {item.position.map((pos, posIndex) => (
                                        <Tag key={posIndex} text={pos} />
                                    ))}
                                </div>
                                <div className={styles.profile}>
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL2n26IeEdZUIp0w4g7VtqjHtLzGv-0RbZFQ&s" alt="Profile Image" className={styles.profileImg} />
                                    <span>{item.author}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                    {filteredData.length > 0 && (
                        <div className={`${styles.pagination}`}>
                            <button 
                                onClick={() => setCurrentPage((prev) => prev - 1)} 
                                disabled={currentPage === 1}
                            >
                                이전
                            </button>

                            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                                const pageNumber = startPage + i;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`${currentPage === pageNumber ? styles.active : ''}`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button 
                                onClick={() => setCurrentPage((prev) => prev + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TeamBuildingBoard;