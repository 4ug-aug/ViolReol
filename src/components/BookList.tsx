import { ScrollArea } from "@/components/ui/scroll-area";
import { useBooks } from "@/hooks/useBooks";
import type { BookProgress } from "@/lib/supabase";
import { useUIStore } from "@/stores/uiStore";
import { BookOpen, Loader2 } from "lucide-react";

const progressIcons: Record<BookProgress, string> = {
  wishlist: "☆",
  not_started: "○",
  started: "◐",
  finished: "●",
};

const progressColors: Record<BookProgress, string> = {
  wishlist: "text-amber-400",
  not_started: "text-stone-300",
  started: "text-amber-500",
  finished: "text-emerald-500",
};

export function BookList() {
  const { data: books, isLoading, error } = useBooks();
  const selectedBookId = useUIStore((state) => state.selectedBookId);
  const setSelectedBookId = useUIStore((state) => state.setSelectedBookId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">
        Failed to load books
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="p-6 text-center">
        <BookOpen className="h-8 w-8 mx-auto text-stone-300 mb-2" />
        <p className="text-stone-400 text-sm">No books yet</p>
        <p className="text-stone-300 text-xs mt-1">Add your first book!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => setSelectedBookId(book.id)}
            className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
              selectedBookId === book.id
                ? "bg-stone-100"
                : "hover:bg-stone-50"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                {book.cover_image_url && (
                  <img
                    src={book.cover_image_url}
                    alt={`${book.title} cover`}
                    className="w-12 h-16 object-cover rounded shrink-0"
                    onError={(e) => {
                      // Hide image on error
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-800 truncate text-sm">
                    {book.title}
                  </p>
                  {book.author && (
                    <p className="text-xs text-stone-400 truncate mt-0.5">
                      {book.author}
                    </p>
                  )}
                </div>
              </div>
              {/* Progress indicators for both users */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-sm ${progressColors[book.augustProgress]}`}
                  title={`August: ${book.augustProgress.replace("_", " ")}`}
                >
                  🌻{progressIcons[book.augustProgress]}
                </span>
                <span
                  className={`text-sm ${progressColors[book.violaProgress]}`}
                  title={`Viola: ${book.violaProgress.replace("_", " ")}`}
                >
                  🌸{progressIcons[book.violaProgress]}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-stone-300 mt-1">
              Added by {book.added_by}
            </p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
