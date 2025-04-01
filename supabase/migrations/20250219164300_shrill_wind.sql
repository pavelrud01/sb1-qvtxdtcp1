/*
  # Add business sphere column

  1. Changes
    - Add business_sphere column to user_questionnaire table
    - Make it nullable to maintain compatibility with existing data
*/

-- Add business_sphere column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_questionnaire' AND column_name = 'business_sphere'
  ) THEN
    ALTER TABLE user_questionnaire ADD COLUMN business_sphere text;
  END IF;
END $$;