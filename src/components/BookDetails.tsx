import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBooks } from "@/hooks/useBooks";
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { useUpdateUserProgress } from "@/hooks/useUpdateUserProgress";
import type { BookProgress } from "@/lib/supabase";
import { useUIStore } from "@/stores/uiStore";
import { useUserStore } from "@/stores/userStore";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { AddNoteForm } from "./AddNoteForm";
import { NotesList } from "./NotesList";

const progressLabels: Record<BookProgress, string> = {
  not_started: "Not Started",
  started: "Reading",
  finished: "Finished",
};

interface BookDetailsProps {
  bookId: string;
}

export function BookDetails({ bookId }: BookDetailsProps) {
  const { data: books, isLoading } = useBooks();
  const updateProgress = useUpdateUserProgress();
  const deleteBook = useDeleteBook();
  const currentUser = useUserStore((state) => state.user);
  const setSelectedBookId = useUIStore((state) => state.setSelectedBookId);
  const isAddNoteOpen = useUIStore((state) => state.isAddNoteOpen);
  const setAddNoteOpen = useUIStore((state) => state.setAddNoteOpen);

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

  const handleViolaProgressChange = (progress: BookProgress) => {
    updateProgress.mutate({ bookId: book.id, userName: "Viola", progress });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this book?")) {
      await deleteBook.mutateAsync(book.id);
      setSelectedBookId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-stone-100">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-serif text-stone-800 truncate">
              {book.title}
            </h2>
            {book.author && (
              <p className="text-stone-500 mt-1">by {book.author}</p>
            )}
            <p className="text-xs text-stone-400 mt-2">
              Added by {book.added_by}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-stone-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
                <SelectItem value="not_started">
                  {progressLabels.not_started}
                </SelectItem>
                <SelectItem value="started">{progressLabels.started}</SelectItem>
                <SelectItem value="finished">
                  {progressLabels.finished}
                </SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="not_started">
                  {progressLabels.not_started}
                </SelectItem>
                <SelectItem value="started">{progressLabels.started}</SelectItem>
                <SelectItem value="finished">
                  {progressLabels.finished}
                </SelectItem>
              </SelectContent>
            </Select>
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
    </div>
  );
}
