import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddBook } from "@/hooks/useAddBook";
import { useUserStore } from "@/stores/userStore";
import { fetchBookCovers } from "@/lib/bookCover";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { CoverSelectionDialog } from "./CoverSelectionDialog";

interface AddBookFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBookForm({ open, onOpenChange }: AddBookFormProps) {
  const user = useUserStore((state) => state.user);
  const addBook = useAddBook();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [addToWishlist, setAddToWishlist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingCovers, setIsFetchingCovers] = useState(false);
  const [foundCovers, setFoundCovers] = useState<string[]>([]);
  const [showCoverSelection, setShowCoverSelection] = useState(false);
  const [pendingBookData, setPendingBookData] = useState<{
    title: string;
    author?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    setError(null);

    // Store book data for later use
    const bookData = {
      title: title.trim(),
      author: author.trim() || undefined,
    };
    setPendingBookData(bookData);

    // Fetch covers
    setIsFetchingCovers(true);
    try {
      const covers = await fetchBookCovers(bookData.title, bookData.author);
      setFoundCovers(covers);
      setIsFetchingCovers(false);
      // Show cover selection dialog
      setShowCoverSelection(true);
    } catch (err) {
      console.error("Failed to fetch covers:", err);
      setIsFetchingCovers(false);
      // If cover fetch fails, proceed without cover
      setFoundCovers([]);
      setShowCoverSelection(true);
    }
  };

  const handleCoverSelect = async (coverUrl: string | null) => {
    if (!pendingBookData || !user) return;

    setError(null);

    try {
      await addBook.mutateAsync({
        title: pendingBookData.title,
        author: pendingBookData.author,
        cover_image_url: coverUrl || undefined,
        added_by: user,
        initialProgress: addToWishlist ? "wishlist" : "not_started",
      });

      // Reset form
      setTitle("");
      setAuthor("");
      setAddToWishlist(false);
      setError(null);
      setFoundCovers([]);
      setPendingBookData(null);
      setShowCoverSelection(false);
      onOpenChange(false);
    } catch (err: any) {
      // Check if it's a table-not-found error
      const isTableNotFound =
        err?.code === "42P01" ||
        err?.message?.includes("relation") ||
        err?.message?.includes("does not exist") ||
        err?.message?.includes("Could not find");

      if (isTableNotFound) {
        setError(
          "Database tables not found. Please run the SQL schema from supabase-schema.sql in your Supabase SQL Editor."
        );
      } else {
        setError(err?.message || "Failed to add book. Please try again.");
      }
      // Close cover selection on error
      setShowCoverSelection(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset everything when dialog closes
      setTitle("");
      setAuthor("");
      setAddToWishlist(false);
      setError(null);
      setFoundCovers([]);
      setPendingBookData(null);
      setShowCoverSelection(false);
    }
    onOpenChange(open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Add a New Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <label className="text-sm text-stone-600 mb-1.5 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Great Gatsby"
                required
                disabled={isFetchingCovers}
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
                disabled={isFetchingCovers}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="wishlist"
                checked={addToWishlist}
                onCheckedChange={(checked) => setAddToWishlist(checked === true)}
                disabled={isFetchingCovers}
              />
              <label
                htmlFor="wishlist"
                className="text-xs text-stone-600 cursor-pointer"
              >
                Add to my wishlist
              </label>
            </div>
            {!addToWishlist && (
              <p className="text-xs text-stone-400">
                Both readers will start with "Not Started" progress
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDialogClose(false)}
                disabled={isFetchingCovers}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isFetchingCovers || addBook.isPending}
                className="bg-stone-800 hover:bg-stone-700"
              >
                {isFetchingCovers ? "Finding covers..." : "Add Book"}
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
