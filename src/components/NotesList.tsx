import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/hooks/useNotes";
import { Loader2, MessageSquare } from "lucide-react";

interface NotesListProps {
  bookId: string;
}

export function NotesList({ bookId }: NotesListProps) {
  const { data: notes, isLoading, error } = useNotes(bookId);

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
        Failed to load notes
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-stone-300 mb-2" />
          <p className="text-stone-400 text-sm">No notes yet</p>
          <p className="text-stone-300 text-xs mt-1">
            Add a note to share your thoughts
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className={`p-4 ${
              note.author === "August"
                ? "bg-amber-50/50 border-amber-100"
                : "bg-violet-50/50 border-violet-100"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    note.author === "August"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {note.author === "August" ? "🌻" : "🌸"}
                </div>
                <span className="text-sm font-medium text-stone-600">
                  {note.author}
                </span>
              </div>
              {note.page_number && (
                <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                  p. {note.page_number}
                </span>
              )}
            </div>
            <p className="text-stone-700 text-sm whitespace-pre-wrap">
              {note.text}
            </p>
            <p className="text-[10px] text-stone-400 mt-2">
              {new Date(note.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

