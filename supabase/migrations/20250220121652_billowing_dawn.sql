-- Add brand_description column to user_questionnaire
ALTER TABLE user_questionnaire 
ADD COLUMN IF NOT EXISTS brand_description text;

-- Create a function to safely convert text to jsonb
CREATE OR REPLACE FUNCTION safe_to_jsonb(v text) 
RETURNS jsonb AS $$
BEGIN
  IF v IS NULL OR v = '' THEN
    RETURN '{}'::jsonb;
  END IF;
  BEGIN
    RETURN v::jsonb;
  EXCEPTION WHEN OTHERS THEN
    RETURN '{}'::jsonb;
  END;
END;
$$ LANGUAGE plpgsql;

-- Update the competitors column to be JSONB
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_questionnaire' 
    AND column_name = 'competitors'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE user_questionnaire 
    ALTER COLUMN competitors TYPE jsonb 
    USING safe_to_jsonb(competitors);
  END IF;
END $$;

-- Update the target_audience column to be JSONB
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_questionnaire' 
    AND column_name = 'target_audience'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE user_questionnaire 
    ALTER COLUMN target_audience TYPE jsonb 
    USING safe_to_jsonb(target_audience);
  END IF;
END $$;

-- Drop the helper function
DROP FUNCTION IF EXISTS safe_to_jsonb(text);