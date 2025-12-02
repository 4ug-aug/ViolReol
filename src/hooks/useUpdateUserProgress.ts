import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type BookProgress, type User } from "@/lib/supabase";

interface UpdateProgressParams {
  bookId: string;
  userName: User;
  progress: BookProgress;
}

export function useUpdateUserProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, userName, progress }: UpdateProgressParams) => {
      // Try to upsert (update if exists, insert if not)
      const { data, error } = await supabase
        .from("user_progress")
        .upsert(
          {
            book_id: bookId,
            user_name: userName,
            progress,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "book_id,user_name",
          }
        )
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

