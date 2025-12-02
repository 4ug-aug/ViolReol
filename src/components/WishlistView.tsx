import { ScrollArea } from "@/components/ui/scroll-area";
import { useBooks } from "@/hooks/useBooks";
import { useUIStore } from "@/stores/uiStore";
import { Gift, Loader2 } from "lucide-react";

export function WishlistView() {
  const { data: books, isLoading, error } = useBooks();
  const setSelectedBookId = useUIStore((state) => state.setSelectedBookId);

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
        Failed to load wishlist
      </div>
    );
  }

  if (!books) {
    return null;
  }

  // Filter books where at least one user has it on their wishlist
  const wishlistBooks = books.filter(
    (book) =>
      book.augustProgress === "wishlist" || book.violaProgress === "wishlist"
  );

  if (wishlistBooks.length === 0) {
    return (
      <div className="p-6 text-center">
        <Gift className="h-8 w-8 mx-auto text-stone-300 mb-2" />
        <p className="text-stone-400 text-sm">No wishlist items yet</p>
        <p className="text-stone-300 text-xs mt-1">
          Add books to your wishlist to see them here!
        </p>
      </div>
    );
  }

  // Group by user
  const augustWishlist = wishlistBooks.filter(
    (book) => book.augustProgress === "wishlist"
  );
  const violaWishlist = wishlistBooks.filter(
    (book) => book.violaProgress === "wishlist"
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* August's Wishlist */}
        {augustWishlist.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌻</span>
              <h3 className="font-medium text-stone-700">August's Wishlist</h3>
              <span className="text-xs text-stone-400">
                ({augustWishlist.length})
              </span>
            </div>
            <div className="space-y-2">
              {augustWishlist.map((book) => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className="w-full text-left p-3 rounded-lg bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {book.cover_image_url && (
                      <img
                        src={book.cover_image_url}
                        alt={`${book.title} cover`}
                        className="w-12 h-16 object-cover rounded shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-800 text-sm">
                        {book.title}
                      </p>
                      {book.author && (
                        <p className="text-xs text-stone-500 mt-0.5">
                          {book.author}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Viola's Wishlist */}
        {violaWishlist.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌸</span>
              <h3 className="font-medium text-stone-700">Viola's Wishlist</h3>
              <span className="text-xs text-stone-400">
                ({violaWishlist.length})
              </span>
            </div>
            <div className="space-y-2">
              {violaWishlist.map((book) => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className="w-full text-left p-3 rounded-lg bg-violet-50/50 border border-violet-100 hover:bg-violet-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {book.cover_image_url && (
                      <img
                        src={book.cover_image_url}
                        alt={`${book.title} cover`}
                        className="w-12 h-16 object-cover rounded shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-800 text-sm">
                        {book.title}
                      </p>
                      {book.author && (
                        <p className="text-xs text-stone-500 mt-0.5">
                          {book.author}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

