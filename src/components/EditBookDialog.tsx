import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateBook } from "@/hooks/useUpdateBook";
import { fetchBookCovers } from "@/lib/bookCover";
import type { BookWithProgress } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { CoverSelectionDialog } from "./CoverSelectionDialog";

interface EditBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: BookWithProgress;
}

export function EditBookDialog({
  open,
  onOpenChange,
  book,
}: EditBookDialogProps) {
  const updateBook = useUpdateBook();

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author || "");
  const [totalPages, setTotalPages] = useState(
    book.total_pages?.toString() || ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isFetchingCovers, setIsFetchingCovers] = useState(false);
  const [foundCovers, setFoundCovers] = useState<string[]>([]);
  const [showCoverSelection, setShowCoverSelection] = useState(false);
  
  // We need to track if we're saving after a cover selection
  const [pendingUpdate, setPendingUpdate] = useState<{
    title: string;
    author?: string;
    total_pages?: number;
  } | null>(null);

  // Reset form when book changes
  useEffect(() => {
    if (open) {
      setTitle(book.title);
      setAuthor(book.author || "");
      setTotalPages(book.total_pages?.toString() || "");
      setError(null);
    }
  }, [book, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);
    const totalPagesNum = totalPages ? parseInt(totalPages, 10) : undefined;

    try {
      await updateBook.mutateAsync({
        id: book.id,
        title: title.trim(),
        author: author.trim() || undefined,
        total_pages: totalPagesNum,
        cover_image_url: book.cover_image_url || undefined,
      });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Update book error:", err);
      setError(
        err?.message || "Failed to update book. Please try again."
      );
    }
  };

  const handleChangeCover = async () => {
    if (!title.trim()) return;

    // Save current form state
    setPendingUpdate({
      title: title.trim(),
      author: author.trim() || undefined,
      total_pages: totalPages ? parseInt(totalPages, 10) : undefined,
    });

    setIsFetchingCovers(true);
    try {
      const covers = await fetchBookCovers(title, author);
      setFoundCovers(covers);
      setIsFetchingCovers(false);
      setShowCoverSelection(true);
    } catch (err) {
      console.error("Failed to fetch covers:", err);
      setIsFetchingCovers(false);
      setFoundCovers([]);
      setShowCoverSelection(true);
    }
  };

  const handleCoverSelect = async (coverUrl: string | null) => {
    if (!pendingUpdate) return;

    try {
      await updateBook.mutateAsync({
        id: book.id,
        title: pendingUpdate.title,
        author: pendingUpdate.author,
        total_pages: pendingUpdate.total_pages,
        cover_image_url: coverUrl || undefined,
      });

      setShowCoverSelection(false);
      onOpenChange(false);
      setPendingUpdate(null);
    } catch (err: any) {
      console.error("Update book error:", err);
      setError(
        err?.message || "Failed to update book. Please try again."
      );
      setShowCoverSelection(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <label className="text-sm text-stone-600 mb-1.5 block">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Great Gatsby"
                required
              />
            </div>
            <div>
              <label className="text-sm text-stone-600 mb-1.5 block">
                Author (optional)
              </label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="F. Scott Fitzgerald"
              />
            </div>
            <div>
              <label className="text-sm text-stone-600 mb-1.5 block">
                Total Pages (optional)
              </label>
              <Input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="300"
              />
            </div>
            
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleChangeCover}
                disabled={isFetchingCovers}
              >
                {isFetchingCovers ? "Finding covers..." : "Change Cover Image"}
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isFetchingCovers}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isFetchingCovers || updateBook.isPending}
                className="bg-stone-800 hover:bg-stone-700"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CoverSelectionDialog
        open={showCoverSelection}
        onOpenChange={setShowCoverSelection}
        covers={foundCovers}
        isLoading={isFetchingCovers}
        onSelect={handleCoverSelect}
      />
    </>
  );
}
