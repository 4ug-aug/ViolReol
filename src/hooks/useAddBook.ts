import { supabase, type Book, type BookInsert } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: BookInsert): Promise<Book> => {
      // Extract initialProgress and remove it from book data
      const { initialProgress, added_by, ...bookData } = book;
      
      // Insert the book
      const { data, error } = await supabase
        .from("books")
        .insert(bookData)
        .select()
        .single();

      if (error) throw error;

      // Create initial progress entries for both users
      // The user adding the book gets initialProgress (or "not_started"), the other gets "not_started"
      const addingUserProgress = initialProgress || "not_started";
      const otherUser = added_by === "August" ? "Viola" : "August";
      
      const { error: progressError } = await supabase
        .from("user_progress")
        .insert([
          { book_id: data.id, user_name: added_by, progress: addingUserProgress },
          { book_id: data.id, user_name: otherUser, progress: "not_started" },
        ]);

      // Don't fail the whole operation if progress insert fails
      if (progressError) {
        console.warn("Failed to create progress entries:", progressError);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
