import { Sidebar } from "./Sidebar";
import { BookDetails } from "./BookDetails";
import { LibraryView } from "./LibraryView";
import { useUIStore } from "@/stores/uiStore";

export function Layout() {
  const selectedBookId = useUIStore((state) => state.selectedBookId);

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {selectedBookId ? (
          <BookDetails bookId={selectedBookId} />
        ) : (
          <LibraryView />
        )}
      </main>
    </div>
  );
}

