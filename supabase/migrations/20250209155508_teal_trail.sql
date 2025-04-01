/*
  # Add User Questionnaire Table

  1. New Tables
    - `user_questionnaire`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `business_info` (text)
      - `competitors` (text)
      - `target_audience` (text)
      - `business_goals` (jsonb)
      - `brand_tone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_questionnaire` table
    - Add policies for authenticated users to manage their own questionnaire data
*/

-- Create the user questionnaire table
CREATE TABLE IF NOT EXISTS user_questionnaire (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_info text,
  competitors text,
  target_audience text,
  business_goals jsonb,
  brand_tone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_questionnaire ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own questionnaire"
  ON user_questionnaire
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their questionnaire"
  ON user_questionnaire
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their questionnaire"
  ON user_questionnaire
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_questionnaire_updated_at
  BEFORE UPDATE ON user_questionnaire
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX user_questionnaire_user_id_idx ON user_questionnaire(user_id);