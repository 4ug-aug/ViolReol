import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type NoteInsert, type Note } from "@/lib/supabase";

export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: NoteInsert): Promise<Note> => {
      const { data, error } = await supabase
        .from("notes")
        .insert(note)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", data.book_id] });
    },
  });
}

