export interface Recruitment {
    FE: number;
    BE: number;
    Infra: number;
}

export type TeamBuildingMember = {
    userId: number;
    userName: string;
    profileImage: string | null;
    position: number;
};

export type MemberDeleteStatus = {
    userId: number;
    position: number;
    delete: boolean;
};

export type TeamBuildingCandidate = {
    userId: number;
    userName: string;
    profileImage: string | null;
    position: number;
    message: string | null;
    status: number;
    recruitingMemberId: number;
};

export type TeamBuildingData = {
    postId: number;
    campus: number;
    authorId: number;
    candidateCount: number;
    startDate: string;
    endDate: string;
    postTitle: string;
    postContent: string;
    firstDomain: number;
    secondDomain: number;
    createdDate: string;
    updatedDate: string;
    status: number;
    recruitedTotal: number;
    memberTotal: number;
    authorProfileImageUrl: string;
    authorName: string;
    memberInfra: number;
    memberBackend: number;
    memberFrontend: number;
    recruitingMembers: TeamBuildingMember[];
    recruitingCandidates: TeamBuildingCandidate[];
};