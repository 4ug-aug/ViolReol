import { supabase, type Book, type BookInsert } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: BookInsert): Promise<Book> => {
      // Insert the book
      const { data, error } = await supabase
        .from("books")
        .insert(book)
        .select()
        .single();

      if (error) throw error;

      // Create initial progress entries for both users
      const { error: progressError } = await supabase
        .from("user_progress")
        .insert([
          { book_id: data.id, user_name: "August", progress: "not_started" },
          { book_id: data.id, user_name: "Viola", progress: "not_started" },
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
