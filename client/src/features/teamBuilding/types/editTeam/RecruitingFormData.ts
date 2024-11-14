export interface recruitingMembers {
    userId: number;
    position: number;
    delete: boolean;

}

export interface RecruitingFormData {
    title: string;
    content: string;
    startDate: string | null;
    endDate: string | null;
    firstDomain: number;
    secondDomain?: number;
    campus: number;
    memberTotal: number;
    infraLimit: number;
    infraCurrent: number;
    backendLimit: number;
    backendCurrent: number;
    frontLimit: number;
    frontCurrent: number;
    recruitingMembers: Array<{
        userId: number;
        position: number;
        delete: number;
    }>;
}