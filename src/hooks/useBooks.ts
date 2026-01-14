import { supabase, type Book, type BookWithProgress, type UserProgress } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useBooks() {
  const queryClient = useQueryClient();

  // Set up realtime subscriptions for both books and user_progress
  useEffect(() => {
    const booksChannel = supabase
      .channel("books-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["books"] });
        }
      )
      .subscribe();

    const progressChannel = supabase
      .channel("progress-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_progress" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["books"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(booksChannel);
      supabase.removeChannel(progressChannel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["books"],
    queryFn: async (): Promise<BookWithProgress[]> => {
      // Fetch books
      const { data: books, error: booksError } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (booksError) {
        const isTableNotFound =
          booksError.code === "42P01" ||
          booksError.message?.includes("relation") ||
          booksError.message?.includes("does not exist") ||
          booksError.message?.includes("Could not find");

        if (isTableNotFound) {
          return [];
        }
        throw booksError;
      }

      if (!books || books.length === 0) {
        return [];
      }

      // Fetch all user progress
      const { data: progress, error: progressError } = await supabase
        .from("user_progress")
        .select("*");

      // Handle missing progress table gracefully
      const progressData: UserProgress[] = progressError ? [] : (progress ?? []);

      // Combine books with progress
      return books.map((book: Book): BookWithProgress => {
        const augustProgress = progressData.find(
          (p) => p.book_id === book.id && p.user_name === "August"
        );
        const violaProgress = progressData.find(
          (p) => p.book_id === book.id && p.user_name === "Viola"
        );

        return {
          ...book,
          augustProgress: augustProgress?.progress ?? "not_started",
          augustCurrentPage: augustProgress?.current_page ?? 0,
          augustRating: augustProgress?.rating ?? null,
          violaProgress: violaProgress?.progress ?? "not_started",
          violaCurrentPage: violaProgress?.current_page ?? 0,
          violaRating: violaProgress?.rating ?? null,
        };
      });
    },
  });
}
