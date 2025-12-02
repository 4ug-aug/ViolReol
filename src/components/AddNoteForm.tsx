import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAddNote } from "@/hooks/useAddNote";
import { useUserStore } from "@/stores/userStore";

interface AddNoteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
}

export function AddNoteForm({ open, onOpenChange, bookId }: AddNoteFormProps) {
  const user = useUserStore((state) => state.user);
  const addNote = useAddNote();

  const [text, setText] = useState("");
  const [pageNumber, setPageNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const parsedPage = pageNumber ? parseInt(pageNumber, 10) : null;

    await addNote.mutateAsync({
      book_id: bookId,
      text: text.trim(),
      page_number: parsedPage && !isNaN(parsedPage) ? parsedPage : null,
      author: user,
    });

    setText("");
    setPageNumber("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Add a Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm text-stone-600 mb-1.5 block">
              Your thoughts
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I loved this part where..."
              rows={4}
              required
            />
          </div>
          <div>
            <label className="text-sm text-stone-600 mb-1.5 block">
              Page number (optional)
            </label>
            <Input
              type="number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="42"
              min={1}
            />
          </div>
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
              disabled={!text.trim() || addNote.isPending}
              className="bg-stone-800 hover:bg-stone-700"
            >
              {addNote.isPending ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

