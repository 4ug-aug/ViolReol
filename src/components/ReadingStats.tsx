import { useBooks } from "@/hooks/useBooks";

export function ReadingStats() {
  const { data: books } = useBooks();

  if (!books || books.length === 0) {
    return null;
  }

  const augustFinished = books.filter(
    (book) => book.augustProgress === "finished"
  ).length;
  const violaFinished = books.filter(
    (book) => book.violaProgress === "finished"
  ).length;
  const bothFinished = books.filter(
    (book) =>
      book.augustProgress === "finished" && book.violaProgress === "finished"
  ).length;

  return (
    <div className="px-4 py-3 border-b border-stone-100">
      <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-2">
        Books Finished
      </p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🌻</span>
          <span className="text-lg font-medium text-amber-600">
            {augustFinished}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🌸</span>
          <span className="text-lg font-medium text-violet-600">
            {violaFinished}
          </span>
        </div>
        {bothFinished > 0 && (
          <div
            className="flex items-center gap-1.5 ml-auto"
            title="Finished together"
          >
            <span className="text-xs text-stone-400">Together:</span>
            <span className="text-sm font-medium text-emerald-600">
              {bothFinished}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

