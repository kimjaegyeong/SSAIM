import {create} from 'zustand';

interface TeamMember {
  id: number; // 유니크 아이디
  name: string;
  email: string;
  profileImage: string;
}

interface TeamStore {
  members: TeamMember[];
  addMember: (member: TeamMember) => void;
  removeMember: (id: number) => void;
}

const useTeamStore = create<TeamStore>((set) => ({
  members: [],
  addMember: (member) =>
    set((state) => {
      if (state.members.length < 10) {
        return { members: [...state.members, member] };
      }
      return state; // 10명이 넘으면 추가하지 않음
    }),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    })),
}));

export default useTeamStore;
