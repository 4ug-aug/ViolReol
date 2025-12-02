import { create } from "zustand";

interface UIState {
  selectedBookId: string | null;
  isAddBookOpen: boolean;
  isAddNoteOpen: boolean;
  setSelectedBookId: (id: string | null) => void;
  setAddBookOpen: (open: boolean) => void;
  setAddNoteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedBookId: null,
  isAddBookOpen: false,
  isAddNoteOpen: false,
  setSelectedBookId: (id) => set({ selectedBookId: id }),
  setAddBookOpen: (open) => set({ isAddBookOpen: open }),
  setAddNoteOpen: (open) => set({ isAddNoteOpen: open }),
}));

