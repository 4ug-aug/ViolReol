import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL: string = "https://mbqtzjcgdopsmhaqgyaw.supabase.co";
const SUPABASE_ANON_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icXR6amNnZG9wc21oYXFneWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODA0MTcsImV4cCI6MjA4MDE1NjQxN30.Yi-4Z0qY8nim-PGZ3aw80VxO1Yr7Wyb4RehuA79KKv0";

// Check if credentials are configured
const isConfigured =
  SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY" &&
  SUPABASE_URL.startsWith("http");

// Create client only if configured, otherwise create a mock that will show setup message
export const supabase: SupabaseClient = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (null as unknown as SupabaseClient);

export const isSupabaseConfigured = isConfigured;

// Type definitions for our database
export type User = "August" | "Viola";

export type BookProgress = "not_started" | "started" | "finished";

export interface Book {
  id: string;
  title: string;
  author: string | null;
  added_by: User;
  created_at: string;
}

export interface UserProgress {
  id: string;
  book_id: string;
  user_name: User;
  progress: BookProgress;
  created_at: string;
  updated_at: string;
}

// Book with progress for both users
export interface BookWithProgress extends Book {
  augustProgress: BookProgress;
  violaProgress: BookProgress;
}

export interface Note {
  id: string;
  book_id: string;
  text: string;
  page_number: number | null;
  author: User;
  created_at: string;
}

export interface BookInsert {
  title: string;
  author?: string;
  added_by: User;
}

export interface NoteInsert {
  book_id: string;
  text: string;
  page_number?: number | null;
  author: User;
}

