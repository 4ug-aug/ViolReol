-- Add total_pages to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS total_pages INTEGER;

-- Add current_page to user_progress table
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS current_page INTEGER DEFAULT 0;
