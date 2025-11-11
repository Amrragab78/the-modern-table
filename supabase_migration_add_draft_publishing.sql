-- Add draft and scheduled publishing columns to menu_items table
-- Run this in your Supabase SQL Editor

ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS publish_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update existing items to be published (not drafts)
UPDATE menu_items 
SET is_draft = false, publish_at = NULL 
WHERE is_draft IS NULL;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_publishing 
ON menu_items(available, is_draft, publish_at);
