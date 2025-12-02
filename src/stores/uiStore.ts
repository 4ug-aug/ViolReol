import { create } from "zustand";

type ViewMode = "books" | "wishlist";

interface UIState {
  selectedBookId: string | null;
  viewMode: ViewMode;
  isAddBookOpen: boolean;
  isAddNoteOpen: boolean;
  setSelectedBookId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setAddBookOpen: (open: boolean) => void;
  setAddNoteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedBookId: null,
  viewMode: "books",
  isAddBookOpen: false,
  isAddNoteOpen: false,
  setSelectedBookId: (id) => set({ selectedBookId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setAddBookOpen: (open) => set({ isAddBookOpen: open }),
  setAddNoteOpen: (open) => set({ isAddNoteOpen: open }),
}));

