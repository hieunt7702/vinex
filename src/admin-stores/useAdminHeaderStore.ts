import { create } from 'zustand';

interface HeaderState {
  title: string;
  description: string;
  setHeader: (data: { title: string; description?: string }) => void;
  resetHeader: () => void;
}

const DEFAULT_TITLE = 'Hệ Thống Quản Trị VINEX';
const DEFAULT_DESCRIPTION = 'Nông sản Việt cao cấp & Quà tặng doanh nghiệp';

export const useAdminHeaderStore = create<HeaderState>((set) => ({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  setHeader: (data) =>
    set((state) => {
      const newTitle = data.title;
      const newDesc = data.description || '';
      if (state.title === newTitle && state.description === newDesc) {
        return state;
      }
      return {
        title: newTitle,
        description: newDesc,
      };
    }),
  resetHeader: () =>
    set((state) => {
      if (state.title === DEFAULT_TITLE && state.description === DEFAULT_DESCRIPTION) {
        return state;
      }
      return {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
      };
    }),
}));
