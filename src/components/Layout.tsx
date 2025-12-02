import { Sidebar } from "./Sidebar";
import { BookDetails } from "./BookDetails";
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
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-stone-400">
              <p className="text-lg mb-2">Select a book from the sidebar</p>
              <p className="text-sm">or add a new one to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

