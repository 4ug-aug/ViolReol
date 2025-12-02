import { supabase, type Note } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useNotes(bookId: string | null) {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!bookId) return;

    const channel = supabase
      .channel(`notes-${bookId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `book_id=eq.${bookId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notes", bookId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookId, queryClient]);

  return useQuery({
    queryKey: ["notes", bookId],
    queryFn: async (): Promise<Note[]> => {
      if (!bookId) return [];

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false });

      // If table doesn't exist yet, return empty array
      if (error) {
        const isTableNotFound =
          error.code === "42P01" ||
          error.message?.includes("relation") ||
          error.message?.includes("does not exist") ||
          error.message?.includes("Could not find");

        if (isTableNotFound) {
          return [];
        }
        throw error;
      }
      return data ?? [];
    },
    enabled: !!bookId,
  });
}

