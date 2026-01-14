-- Add rating column to user_progress table
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);
