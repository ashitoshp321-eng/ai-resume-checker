import { create } from 'zustand';

interface AppState {
  jdId: number | null;
  resumeIds: number[];
  setJdId: (id: number) => void;
  addResumeIds: (ids: number[]) => void;
  clearResumes: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  jdId: null,
  resumeIds: [],
  setJdId: (id) => set({ jdId: id }),
  addResumeIds: (ids) => set((state) => ({ 
    resumeIds: [...new Set([...state.resumeIds, ...ids])] 
  })),
  clearResumes: () => set({ resumeIds: [] }),
  reset: () => set({ jdId: null, resumeIds: [] }),
}));
