import { supabase, type Book } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateBookParams {
  id: string;
  title: string;
  author?: string;
  total_pages?: number;
  cover_image_url?: string;
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: UpdateBookParams): Promise<Book> => {
      const { data, error } = await supabase
        .from("books")
        .update({
          title: book.title,
          author: book.author,
          total_pages: book.total_pages,
          cover_image_url: book.cover_image_url,
        })
        .eq("id", book.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
