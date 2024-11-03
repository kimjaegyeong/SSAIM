import { create } from 'zustand';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  profileImage: string;
}

interface TeamStore {
  members: TeamMember[];
  addMember: (member: TeamMember) => void;
  removeMember: (id: number) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
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
      members: state.members.filter((member) => member.id !== id),
    })),
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));

export default useTeamStore;
