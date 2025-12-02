import { supabase, type Book, type BookInsert } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: BookInsert): Promise<Book> => {
      // Extract initialProgress (not a column in books table), keep added_by
      const { initialProgress, ...bookData } = book;
      
      // Insert the book (bookData includes added_by, title, author, cover_image_url)
      const { data, error } = await supabase
        .from("books")
        .insert(bookData)
        .select()
        .single();

      if (error) throw error;

      // Create initial progress entries for both users
      // The user adding the book gets initialProgress (or "not_started"), the other gets "not_started"
      const addingUserProgress = initialProgress || "not_started";
      const addedBy = book.added_by;
      const otherUser = addedBy === "August" ? "Viola" : "August";
      
      const { error: progressError } = await supabase
        .from("user_progress")
        .insert([
          { book_id: data.id, user_name: addedBy, progress: addingUserProgress },
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
