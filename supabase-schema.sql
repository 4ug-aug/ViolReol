-- ViolReol Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Books table (shared between both users)
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  cover_image_url TEXT,
  added_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- User progress table (tracks individual progress for each user per book)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL, -- 'August' or 'Viola'
  progress TEXT DEFAULT 'not_started', -- not_started, started, finished
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(book_id, user_name) -- One progress entry per user per book
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  page_number INTEGER,
  author TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE books;
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_book_id ON user_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_name);
