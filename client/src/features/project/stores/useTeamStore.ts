import { create } from 'zustand';
import { TeamMemberDTO } from '@features/project/types/TeamMemberDTO';

interface TeamStore {
  members: TeamMemberDTO[];
  addMember: (member: TeamMemberDTO) => void;
  removeMember: (id: number) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  leaderId: number | null;
  setLeaderId: (leaderId: number) => void;
  startDate: string | null;
  endDate: string | null;
  postId: number | null;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setPostId: (id: number) => void;
  resetStore: () => void; // 스토어 초기화 함수 추가
}

const initialState = {
  members: [],
  isModalOpen: false,
  leaderId: null,
  startDate: null, // 초기 상태 추가
  endDate: null,   // 초기 상태 추가
  postId: null,    // 초기 상태 추가
};

const useTeamStore = create<TeamStore>((set) => ({
  ...initialState,
  addMember: (member) =>
    set((state) => {
      if (state.members.length < 10) {
        return { members: [...state.members, member] };
      }
      return state;
    }),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.userId !== id),
    })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setLeaderId: (leaderId) => {
    set((state) => ({
      ...state,
      leaderId: leaderId,
    }));
  },
  setStartDate: (date) =>
    set((state) => ({
      ...state,
      startDate: date,
    })),
  setEndDate: (date) =>
    set((state) => ({
      ...state,
      endDate: date,
    })),
  setPostId: (id) =>
    set((state) => ({
      ...state,
      postId: id,
    })),
  resetStore: () => set({ ...initialState }),
}));

export default useTeamStore;
