import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddBook } from "@/hooks/useAddBook";
import { useUserStore } from "@/stores/userStore";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface AddBookFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBookForm({ open, onOpenChange }: AddBookFormProps) {
  const user = useUserStore((state) => state.user);
  const addBook = useAddBook();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    setError(null);

    try {
      await addBook.mutateAsync({
        title: title.trim(),
        author: author.trim() || undefined,
        added_by: user,
      });

      setTitle("");
      setAuthor("");
      setError(null);
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <p className="text-xs text-stone-400">
            Both readers will start with "Not Started" progress
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || addBook.isPending}
              className="bg-stone-800 hover:bg-stone-700"
            >
              {addBook.isPending ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
