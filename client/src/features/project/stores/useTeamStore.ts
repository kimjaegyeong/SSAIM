import { create } from 'zustand';
import { TeamMemberDTO } from '@features/project/types/TeamMemberDTO';

interface TeamStore {
  members: TeamMemberDTO[];
  addMember: (member: TeamMemberDTO) => void;
  removeMember: (id: number) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  leaderId: number|null;
  setLeaderId: (leaderId: number) => void;
}

const useTeamStore = create<TeamStore>((set) => ({
  members: [],
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
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  leaderId: null,
  setLeaderId: (leaderId) => {
    set((state) => ({
      ...state,
      leaderId: leaderId, // leaderId 값을 업데이트
    }));
  },
}));

export default useTeamStore;
