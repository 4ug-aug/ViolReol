import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type BookProgress, type User, type BookWithProgress } from "@/lib/supabase";

interface UpdateProgressParams {
  bookId: string;
  userName: User;
  progress: BookProgress;
  currentPage?: number;
  rating?: number;
}

export function useUpdateUserProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, userName, progress, currentPage, rating }: UpdateProgressParams) => {
      // Try to upsert (update if exists, insert if not)
      const updateData: any = {
        book_id: bookId,
        user_name: userName,
        progress,
        updated_at: new Date().toISOString(),
      };

      if (currentPage !== undefined) {
        updateData.current_page = currentPage;
      }

      if (rating !== undefined) {
        updateData.rating = rating;
      }

      const { data, error } = await supabase
        .from("user_progress")
        .upsert(
          updateData,
          {
            onConflict: "book_id,user_name",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newProgress) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["books"] });

      // Snapshot the previous value
      const previousBooks = queryClient.getQueryData<BookWithProgress[]>(["books"]);

      // Optimistically update to the new value
      if (previousBooks) {
        queryClient.setQueryData<BookWithProgress[]>(["books"], (old) => {
          if (!old) return [];
          return old.map((book) => {
            if (book.id === newProgress.bookId) {
              const isAugust = newProgress.userName === "August";
              return {
                ...book,
                augustProgress: isAugust ? newProgress.progress : book.augustProgress,
                augustCurrentPage:
                  isAugust && newProgress.currentPage !== undefined
                    ? newProgress.currentPage
                    : book.augustCurrentPage,
                augustRating:
                  isAugust && newProgress.rating !== undefined
                    ? newProgress.rating
                    : book.augustRating,
                violaProgress: !isAugust ? newProgress.progress : book.violaProgress,
                violaCurrentPage:
                  !isAugust && newProgress.currentPage !== undefined
                    ? newProgress.currentPage
                    : book.violaCurrentPage,
                violaRating:
                  !isAugust && newProgress.rating !== undefined
                    ? newProgress.rating
                    : book.violaRating,
              };
            }
            return book;
          });
        });
      }

      // Return a context object with the snapshotted value
      return { previousBooks };
    },
    onError: (_err, _newProgress, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousBooks) {
        queryClient.setQueryData(["books"], context.previousBooks);
      }
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

