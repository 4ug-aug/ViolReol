import { BookList } from "./BookList";
import { AddBookForm } from "./AddBookForm";
import { ReadingStats } from "./ReadingStats";
import { useUserStore } from "@/stores/userStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";

export function Sidebar() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const setAddBookOpen = useUIStore((state) => state.setAddBookOpen);
  const isAddBookOpen = useUIStore((state) => state.isAddBookOpen);

  return (
    <aside className="w-72 h-full bg-white border-r border-stone-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-100">
        <h1 className="text-xl font-serif text-stone-800">ViolReol</h1>
        <p className="text-xs text-stone-400 mt-0.5">Your shared book collection</p>
      </div>

      {/* Reading Stats */}
      <ReadingStats />

      {/* Book List */}
      <div className="flex-1 overflow-hidden">
        <BookList />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-stone-100 bg-stone-50/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                user === "August"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-violet-100 text-violet-700"
              }`}
            >
              {user === "August" ? "🌻" : "🌸"}
            </div>
            <span className="text-sm font-medium text-stone-600">{user}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-stone-400 hover:text-stone-600"
              onClick={clearUser}
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
          <Button
            size="sm"
            onClick={() => setAddBookOpen(true)}
            className="bg-stone-800 hover:bg-stone-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Add Book Modal */}
      <AddBookForm open={isAddBookOpen} onOpenChange={setAddBookOpen} />
    </aside>
  );
}

