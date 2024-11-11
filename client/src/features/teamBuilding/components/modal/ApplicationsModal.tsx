import React, { useEffect, useState } from 'react';
import styles from './ApplicationsModal.module.css';
import Tag from '../tag/Tag';
import { getDomainLabel, getPositionLabel, getApplicationStatusLabel } from '../../../../utils/labelUtils';
import { getApplications } from '@features/teamBuilding/apis/teamBuildingBoard/teamBuildingBoard';
import { useNavigate } from 'react-router-dom';

interface ApplicationData {
    applicantId: number;
    recruitingId: number;
    recruitingTitle: string;
    firstDomain: number;
    secondDomain: number;
    position: number;
    status: number;
}

interface ApplicationsModalProps {
    userId: number | null;
    onClose: () => void;
}

const ApplicationsModal: React.FC<ApplicationsModalProps> = ({ userId, onClose }) => {
    const [applications, setApplications] = useState<ApplicationData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                if (userId === null) {
                    setLoading(false);
                    return;
                }
                const response = await getApplications(userId); // API 호출
                setApplications(response);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [userId]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>데이터를 가져오는 중 오류가 발생했습니다.</div>;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>신청 현황</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {applications.length === 0 ? (
                        <div className={styles.noApplications}>신청내역이 없습니다.</div>
                    ) : (
                        applications.map((application, index) => (
                            <div
                                key={index}
                                className={styles.applicationRow}
                                onClick={() => navigate(`/team-building/detail/${application.recruitingId}`)}
                            >
                                <span className={styles.title}>{application.recruitingTitle}</span>
                                <div className={styles.tags}>
                                    <Tag text={getDomainLabel(application.firstDomain)} />
                                    {application.secondDomain && (
                                        <Tag text={getDomainLabel(application.secondDomain)} />
                                    )}
                                </div>
                                <Tag text={getPositionLabel(application.position)} />
                                <span
                                    className={`${styles.status} ${
                                        application.status === 1
                                            ? styles.accepted
                                            : application.status === 0
                                            ? styles.pending
                                            : styles.rejected
                                    }`}
                                >
                                    {getApplicationStatusLabel(application.status)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationsModal;
