import { Input } from "@/components/ui/input";
import { useBooks } from "@/hooks/useBooks";
import type { BookWithProgress } from "@/lib/supabase";
import { useUIStore } from "@/stores/uiStore";
import { BookOpen, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const ITEMS_PER_PAGE = 12;

export function LibraryView() {
  const { data: books, isLoading } = useBooks();
  const setSelectedBookId = useUIStore((state) => state.setSelectedBookId);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
      </div>
    );
  }

  if (!books) return null;

  // Filter for "Real Books" (exclude if anyone has it on wishlist)
  const realBooks = books.filter(
    (book) =>
      book.augustProgress !== "wishlist" && book.violaProgress !== "wishlist"
  );

  // Filter by search
  const filteredBooks = realBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-full flex flex-col bg-stone-50/30">
      {/* Header */}
      <div className="p-8 pb-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif text-stone-800 mb-2">
              Book Nook
            </h1>
            <p className="text-stone-500">
              {realBooks.length} books in your collection
            </p>
          </div>
          <div className="w-64 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="pl-9 bg-white border-stone-200"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {paginatedBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBookId(book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-stone-400">
            <BookOpen className="h-12 w-12 mb-4 opacity-20" />
            <p>No books found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-stone-500 mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({
  book,
  onClick,
}: {
  book: BookWithProgress;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start text-left w-full focus:outline-none"
    >
      <div className="relative w-full aspect-[2/3] mb-3 rounded-md overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 bg-white border border-stone-100">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-50 text-stone-300">
            <BookOpen className="h-8 w-8" />
          </div>
        )}
        
        {/* Overlay Progress Indicators */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
             <span className="text-xs" title="August">🌻</span>
             <StatusDot status={book.augustProgress} />
           </div>
           <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
             <span className="text-xs" title="Viola">🌸</span>
             <StatusDot status={book.violaProgress} />
           </div>
        </div>
      </div>
      
      <h3 className="font-serif font-medium text-stone-800 line-clamp-1 w-full group-hover:text-stone-600 transition-colors">
        {book.title}
      </h3>
      {book.author && (
        <p className="text-xs text-stone-500 line-clamp-1">{book.author}</p>
      )}
    </button>
  );
}

function StatusDot({ status }: { status: string }) {
  let color = "bg-stone-400"; // not_started
  if (status === "started") color = "bg-amber-400";
  if (status === "finished") color = "bg-emerald-400";
  
  return <div className={`w-1.5 h-1.5 rounded-full ${color}`} />;
}
