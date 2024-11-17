import React, { useMemo, useState, useEffect } from 'react';
import styles from './SprintCreate.module.css';
import { useParams } from 'react-router-dom';
import { useSprintQuery } from '@/features/project/hooks/sprint/useSprintQuery';
import { format } from 'date-fns';
import IssueCreateForm from './IssueCreateForm';
import { useSprintIssueStore } from '@/features/project/stores/useSprintIssueStore ';
import { IssueDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
import { useIssueInSprintQuery } from '@/features/project/hooks/sprint/useIssueInSprintQuery';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
// import { useEpicListData } from '@/features/project/hooks/sprint/useEpicListData';
import Button from '@/components/button/Button';
import SprintCreateModal from './SprintAutoCreateModal';
import EditableIssue from './EditableIssue';
import { IssueCreateDTO } from '@/features/project/types/sprint/IssueCreateDTO';
import { generateIssueOnSprint } from '@/features/project/apis/sprint/generate/generateIssueOnSprint';
import { showToast } from '@/utils/toastUtils';

const SprintCreate: React.FC = () => {
  //userInfo
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);
  const userName = userInfo?.userName;

  // projectId, sprintId
  const { projectId, sprintId } = useParams();

  // queries
  const { data: sprint } = useSprintQuery(Number(projectId), Number(sprintId));
  const { data: issueInSprint } = useIssueInSprintQuery(Number(projectId), Number(sprintId));
  // const { data: epicList } = useEpicListData(Number(projectId));

  // stores
  const { tempIssueList, addIssue, initializeTempIssueList } = useSprintIssueStore();

  // 자동 생성 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(issueInSprint, tempIssueList);
  // const epicCodeMap = useMemo(() => {
  //   const map: Record<string, string> = {};
  //   epicList?.forEach((epic) => {
  //     map[epic.key] = epic.summary;
  //   });
  //   return map;
  // }, [epicList]);

  const weekdays = useMemo(() => {
    if (!sprint?.startDate || !sprint?.endDate) return [];
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const days = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        days.push(format(day, 'yyyy-MM-dd'));
      }
    }
    return days;
  }, [sprint]);
  // 초기화: 컴포넌트가 로드될 때 tempIssueList 초기화
  useEffect(() => {
    if (weekdays.length && sprint) {
      initializeTempIssueList(new Date(sprint?.startDate), new Date(sprint?.endDate));
    }
  }, [weekdays, initializeTempIssueList, sprint]);

  const issuesByDay = useMemo(() => {
    const dayIssueMap: Record<string, Record<string, IssueDTO[]>> = {};
    weekdays.forEach((day) => {
      dayIssueMap[day] = { temp: [], issues: [] };
    });
    issueInSprint
      ?.filter((issue: IssueDTO) => {
        return issue.allocator === userName;
      })
      .forEach((issue: IssueDTO) => {
        const match = issue?.summary.match(/(\d{6})/);
        if (match) {
          const dateStr = match[0];
          const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
          const month = parseInt(dateStr.slice(2, 4), 10) - 1;
          const date = parseInt(dateStr.slice(4, 6), 10);
          const dateObj = new Date(year, month, date);
          const day = format(dateObj, 'yyyy-MM-dd');
          console.log(day);
          dayIssueMap[day]?.issues.push(issue);
        }
      });
    console.log(dayIssueMap);
    return dayIssueMap;
  }, [issueInSprint, userName, weekdays]);
  console.log(weekdays);

  const handleAssignIssueToSprint = async () => {
    if (!projectId || !sprintId) {
      console.error('Project ID or Sprint ID is missing.');
      return;
    }

    // tempIssueList를 API 요청 형식으로 변환
    const request = tempIssueList.map((day) => ({
      day: day.day,
      tasks: day.tasks.map((task) => ({
        summary: task.summary,
        description: task.description,
        issueType: task.issueType,
        storyPoint: task.storyPoint,
        epic: task.epic,
        assignee: task.assignee,
      })),
    }));

    try {
      // API 호출
      const response = await generateIssueOnSprint(Number(projectId), Number(sprintId), request);
      console.log('Issues successfully assigned to sprint:', response);
      showToast.success('이슈가 스프린트에 성공적으로 할당되었습니다.');
    } catch (error) {
      console.error('Failed to assign issues to sprint:', error);
      showToast.error('이슈를 스프린트에 할당하는 데 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{sprint?.name}</h2>
        <div>
          <Button
            size="small"
            colorType="purple"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            🚀 AI 자동생성
          </Button>
          <Button size="small" colorType="purple" onClick={handleAssignIssueToSprint}>
            저장하기
          </Button>
        </div>
      </div>
      <hr />
      <IssueCreateForm weekdays={weekdays} onAddIssue={addIssue} />
      <hr />
      <h3>주간 계획표</h3>
      <div className={styles.weeklyProgressContainer}>
        <div className={styles.contentheader}>
          {weekdays.map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.issueGrid}>
          {weekdays.map((day) => (
            <div key={day} className={styles.dayColumn}>
              {issuesByDay[day]?.issues.map((issue: IssueDTO) => (
                <EditableIssue day={new Date(day)} issueData={issue} isEditable={false} />
              ))}
              {tempIssueList
                .find((e) => {
                  return e.day === day;
                })
                ?.tasks.map((issue: IssueCreateDTO) => (
                  <EditableIssue day={new Date(day)} issueData={issue} isEditable={true} />
                ))}
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <SprintCreateModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default SprintCreate;
