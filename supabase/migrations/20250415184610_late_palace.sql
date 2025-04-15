/*
  # Add Trending Posts Tables

  1. New Tables
    - `instagram_posts`
      - Stores trending posts data from Instagram/TikTok
      - Includes metrics like likes and comments
      - Tracks post metadata and hashtags
    
    - `posts_history`
      - Tracks historical metrics for posts
      - Records likes and comments over time
      - Enables trend analysis

  2. Security
    - RLS enabled on all tables
    - Authenticated users can view data
*/

-- Create media_type enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
    CREATE TYPE media_type AS ENUM ('VIDEO', 'IMAGE', 'CAROUSEL');
  END IF;
END $$;

-- Create instagram_posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  post_id text PRIMARY KEY,
  caption text,
  media_type media_type NOT NULL,
  like_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  permalink text NOT NULL,
  timestamp timestamptz NOT NULL,
  hashtag text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts_history table
CREATE TABLE IF NOT EXISTS posts_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id text REFERENCES instagram_posts(post_id) ON DELETE CASCADE,
  like_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  checked_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_history ENABLE ROW LEVEL SECURITY;

-- Create policies for instagram_posts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can view trending posts" ON instagram_posts;
  
  CREATE POLICY "Authenticated users can view trending posts"
    ON instagram_posts FOR SELECT
    TO authenticated
    USING (true);
END $$;

-- Create policies for posts_history
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can view posts history" ON posts_history;
  
  CREATE POLICY "Authenticated users can view posts history"
    ON posts_history FOR SELECT
    TO authenticated
    USING (true);
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS instagram_posts_timestamp_idx ON instagram_posts(timestamp);
CREATE INDEX IF NOT EXISTS instagram_posts_hashtag_idx ON instagram_posts(hashtag);
CREATE INDEX IF NOT EXISTS posts_history_post_id_idx ON posts_history(post_id);
CREATE INDEX IF NOT EXISTS posts_history_checked_at_idx ON posts_history(checked_at);

-- Create function to record post history
CREATE OR REPLACE FUNCTION public.record_post_history()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF (NEW.like_count != OLD.like_count OR NEW.comments_count != OLD.comments_count) THEN
    INSERT INTO posts_history (
      post_id,
      like_count,
      comments_count
    ) VALUES (
      NEW.post_id,
      NEW.like_count,
      NEW.comments_count
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS update_instagram_posts_updated_at ON instagram_posts;
CREATE TRIGGER update_instagram_posts_updated_at
  BEFORE UPDATE ON instagram_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS record_post_metrics_history ON instagram_posts;
CREATE TRIGGER record_post_metrics_history
  AFTER UPDATE ON instagram_posts
  FOR EACH ROW
  EXECUTE FUNCTION record_post_history();

-- Create view for trending analysis
CREATE OR REPLACE VIEW trending_posts AS
SELECT 
  p.*,
  COALESCE(
    (
      SELECT jsonb_build_object(
        'previous_likes', ph.like_count,
        'previous_comments', ph.comments_count,
        'checked_at', ph.checked_at
      )
      FROM posts_history ph
      WHERE ph.post_id = p.post_id
      ORDER BY ph.checked_at DESC
      LIMIT 1
    ),
    '{}'::jsonb
  ) as previous_metrics
FROM instagram_posts p
WHERE p.timestamp >= NOW() - INTERVAL '7 days'
ORDER BY p.like_count DESC;

-- Add helpful comments
COMMENT ON TABLE instagram_posts IS 'Stores trending posts from social media platforms';
COMMENT ON TABLE posts_history IS 'Tracks historical metrics for trending posts';
COMMENT ON VIEW trending_posts IS 'Shows trending posts from the last 7 days with their metrics history';