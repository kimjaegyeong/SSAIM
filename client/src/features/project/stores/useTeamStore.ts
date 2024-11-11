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
  resetStore: () => void; // 스토어 초기화 함수 추가
}

const initialState = {
  members: [],
  isModalOpen: false,
  leaderId: null,
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
      leaderId: leaderId, // leaderId 값을 업데이트
    }));
  },
  resetStore: () => set({ ...initialState }), // 초기 상태로 재설정
}));

export default useTeamStore;
