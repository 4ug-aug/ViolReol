import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBooks } from "@/hooks/useBooks";
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { useUpdateUserProgress } from "@/hooks/useUpdateUserProgress";
import type { BookProgress } from "@/lib/supabase";
import { useUIStore } from "@/stores/uiStore";
import { useUserStore } from "@/stores/userStore";
import { ChevronLeft, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddNoteForm } from "./AddNoteForm";
import { EditBookDialog } from "./EditBookDialog";
import { NotesList } from "./NotesList";

const progressLabels: Record<BookProgress, string> = {
  wishlist: "Wishlist",
  not_started: "Not Started",
  started: "Reading",
  finished: "Finished",
};

interface BookDetailsProps {
  bookId: string;
}

interface StarRatingProps {
  rating: number | null;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

function StarRating({ rating, onChange, readonly }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(null)}
          className={`focus:outline-none transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <Star
            className={`h-4 w-4 ${
              star <= (hoverRating ?? rating ?? 0)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-stone-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function BookDetails({ bookId }: BookDetailsProps) {
  const { data: books, isLoading } = useBooks();
  const updateProgress = useUpdateUserProgress();
  const deleteBook = useDeleteBook();
  const currentUser = useUserStore((state) => state.user);
  const setSelectedBookId = useUIStore((state) => state.setSelectedBookId);
  const isAddNoteOpen = useUIStore((state) => state.isAddNoteOpen);
  const setAddNoteOpen = useUIStore((state) => state.setAddNoteOpen);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Local state for sliders to prevent lagginess
  const [augustLocalProgress, setAugustLocalProgress] = useState<number | null>(null);
  const [violaLocalProgress, setViolaLocalProgress] = useState<number | null>(null);

  const book = books?.find((b) => b.id === bookId);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-stone-400">Book not found</p>
      </div>
    );
  }

  const handleAugustProgressChange = (progress: BookProgress) => {
    updateProgress.mutate({ bookId: book.id, userName: "August", progress });
  };

  const handleAugustPageChange = (page: number) => {
    updateProgress.mutate({
      bookId: book.id,
      userName: "August",
      progress: "started",
      currentPage: page,
    });
  };

  const handleAugustRatingChange = (rating: number) => {
    updateProgress.mutate({
      bookId: book.id,
      userName: "August",
      progress: book.augustProgress,
      rating,
    });
  };

  const handleViolaProgressChange = (progress: BookProgress) => {
    updateProgress.mutate({ bookId: book.id, userName: "Viola", progress });
  };

  const handleViolaPageChange = (page: number) => {
    updateProgress.mutate({
      bookId: book.id,
      userName: "Viola",
      progress: "started",
      currentPage: page,
    });
  };

  const handleViolaRatingChange = (rating: number) => {
    updateProgress.mutate({
      bookId: book.id,
      userName: "Viola",
      progress: book.violaProgress,
      rating,
    });
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteBook.mutateAsync(book.id);
    setSelectedBookId(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-stone-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedBookId(null)}
          className="mb-4 text-stone-500 hover:text-stone-800 -ml-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Library
        </Button>
        <div className="flex items-start gap-4 mb-6">
          {book.cover_image_url && (
            <img
              src={book.cover_image_url}
              alt={`${book.title} cover`}
              className="w-32 h-48 object-cover rounded-lg shadow-md shrink-0"
              onError={(e) => {
                // Hide image on error
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <div className="flex items-start justify-between gap-4 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-serif text-stone-800 truncate">
                {book.title}
              </h2>
              {book.author && (
                <p className="text-stone-500 mt-1">by {book.author}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-stone-400">
                <span>Added by {book.added_by}</span>
                {book.total_pages && (
                  <>
                    <span>•</span>
                    <span>{book.total_pages} pages</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                className="text-stone-400 hover:text-stone-600 shrink-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-stone-400 hover:text-red-500 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* August's Progress */}
          <div
            className={`p-4 rounded-xl border ${
              currentUser === "August"
                ? "bg-amber-50/50 border-amber-200"
                : "bg-stone-50 border-stone-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌻</span>
              <span className="font-medium text-stone-700 text-sm">August</span>
            </div>
            <div className="mb-4">
              <StarRating
                rating={book.augustRating}
                onChange={handleAugustRatingChange}
                readonly={currentUser !== "August"}
              />
            </div>
            <Select
              value={book.augustProgress}
              onValueChange={handleAugustProgressChange}
              disabled={currentUser !== "August"}
            >
              <SelectTrigger
                className={`w-full ${
                  currentUser !== "August" ? "opacity-60" : ""
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wishlist">
                  {progressLabels.wishlist}
                </SelectItem>
                <SelectItem value="not_started">
                  {progressLabels.not_started}
                </SelectItem>
                <SelectItem value="started">{progressLabels.started}</SelectItem>
                <SelectItem value="finished">
                  {progressLabels.finished}
                </SelectItem>
              </SelectContent>
            </Select>

            {book.augustProgress === "started" && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>
                    {book.total_pages
                      ? `${Math.round(
                          ((augustLocalProgress ?? book.augustCurrentPage ?? 0) /
                            book.total_pages) *
                            100
                        )}%`
                      : "Progress"}
                  </span>
                  <span>
                    {book.total_pages
                      ? `${
                          augustLocalProgress ?? book.augustCurrentPage ?? 0
                        } / ${book.total_pages} p`
                      : `${
                          augustLocalProgress ?? book.augustCurrentPage ?? 0
                        }%`}
                  </span>
                </div>
                <Slider
                  disabled={currentUser !== "August"}
                  value={[
                    book.total_pages
                      ? ((augustLocalProgress ??
                          book.augustCurrentPage ??
                          0) /
                          book.total_pages) *
                        100
                      : augustLocalProgress ?? book.augustCurrentPage ?? 0,
                  ]}
                  onValueChange={(vals) => {
                    const pct = vals[0];
                    const newPage = book.total_pages
                      ? Math.round((pct / 100) * book.total_pages)
                      : Math.round(pct);
                    setAugustLocalProgress(newPage);
                  }}
                  onValueCommit={(vals) => {
                    const pct = vals[0];
                    const newPage = book.total_pages
                      ? Math.round((pct / 100) * book.total_pages)
                      : Math.round(pct);
                    handleAugustPageChange(newPage);
                    setAugustLocalProgress(null); // Reset local state after commit
                  }}
                  max={100}
                  step={1}
                  className={currentUser !== "August" ? "opacity-50" : ""}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    disabled={currentUser !== "August"}
                    value={
                      augustLocalProgress ?? book.augustCurrentPage ?? 0
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      // Update immediately for input as it's not as spammy as slider
                      handleAugustPageChange(val);
                    }}
                    className="h-8 text-xs bg-white/50"
                  />
                  <span className="text-xs text-stone-500 whitespace-nowrap">
                    {book.total_pages ? `/ ${book.total_pages} p` : "%"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Viola's Progress */}
          <div
            className={`p-4 rounded-xl border ${
              currentUser === "Viola"
                ? "bg-violet-50/50 border-violet-200"
                : "bg-stone-50 border-stone-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌸</span>
              <span className="font-medium text-stone-700 text-sm">Viola</span>
            </div>
            <div className="mb-4">
              <StarRating
                rating={book.violaRating}
                onChange={handleViolaRatingChange}
                readonly={currentUser !== "Viola"}
              />
            </div>
            <Select
              value={book.violaProgress}
              onValueChange={handleViolaProgressChange}
              disabled={currentUser !== "Viola"}
            >
              <SelectTrigger
                className={`w-full ${
                  currentUser !== "Viola" ? "opacity-60" : ""
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wishlist">
                  {progressLabels.wishlist}
                </SelectItem>
                <SelectItem value="not_started">
                  {progressLabels.not_started}
                </SelectItem>
                <SelectItem value="started">{progressLabels.started}</SelectItem>
                <SelectItem value="finished">
                  {progressLabels.finished}
                </SelectItem>
              </SelectContent>
            </Select>

            {book.violaProgress === "started" && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>
                    {book.total_pages
                      ? `${Math.round(
                          ((violaLocalProgress ?? book.violaCurrentPage ?? 0) /
                            book.total_pages) *
                            100
                        )}%`
                      : "Progress"}
                  </span>
                  <span>
                    {book.total_pages
                      ? `${
                          violaLocalProgress ?? book.violaCurrentPage ?? 0
                        } / ${book.total_pages} p`
                      : `${
                          violaLocalProgress ?? book.violaCurrentPage ?? 0
                        }%`}
                  </span>
                </div>
                <Slider
                  disabled={currentUser !== "Viola"}
                  value={[
                    book.total_pages
                      ? ((violaLocalProgress ??
                          book.violaCurrentPage ??
                          0) /
                          book.total_pages) *
                        100
                      : violaLocalProgress ?? book.violaCurrentPage ?? 0,
                  ]}
                  onValueChange={(vals) => {
                    const pct = vals[0];
                    const newPage = book.total_pages
                      ? Math.round((pct / 100) * book.total_pages)
                      : Math.round(pct);
                    setViolaLocalProgress(newPage);
                  }}
                  onValueCommit={(vals) => {
                    const pct = vals[0];
                    const newPage = book.total_pages
                      ? Math.round((pct / 100) * book.total_pages)
                      : Math.round(pct);
                    handleViolaPageChange(newPage);
                    setViolaLocalProgress(null); // Reset local state after commit
                  }}
                  max={100}
                  step={1}
                  className={currentUser !== "Viola" ? "opacity-50" : ""}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    disabled={currentUser !== "Viola"}
                    value={
                      violaLocalProgress ?? book.violaCurrentPage ?? 0
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      // Update immediately for input
                      handleViolaPageChange(val);
                    }}
                    className="h-8 text-xs bg-white/50"
                  />
                  <span className="text-xs text-stone-500 whitespace-nowrap">
                    {book.total_pages ? `/ ${book.total_pages} p` : "%"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-medium text-stone-700">Notes</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAddNoteOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <NotesList bookId={bookId} />
        </div>
      </div>

      {/* Add Note Modal */}
      <AddNoteForm
        open={isAddNoteOpen}
        onOpenChange={setAddNoteOpen}
        bookId={bookId}
      />

      {/* Edit Book Modal */}
      <EditBookDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        book={book}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
