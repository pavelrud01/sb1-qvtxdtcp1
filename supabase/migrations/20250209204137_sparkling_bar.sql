/*
  # Content Generation System Tables

  1. New Tables
    - `content_templates`
      - Template structure for different types of content
    - `content_trends`
      - Daily trends data for different niches
    - `generated_posts`
      - User generated content storage
    - `social_platforms`
      - Supported social media platforms

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create enum for post status
CREATE TYPE post_status AS ENUM ('draft', 'published', 'scheduled', 'archived');

-- Create enum for content type
CREATE TYPE content_type AS ENUM ('post', 'story', 'reel', 'video');

-- Create social platforms table
CREATE TABLE social_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content templates table
CREATE TABLE content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  structure jsonb NOT NULL,
  category text NOT NULL,
  platform_id uuid REFERENCES social_platforms(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content trends table
CREATE TABLE content_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  topic text NOT NULL,
  hashtags text[] NOT NULL,
  popularity_score float NOT NULL,
  region text,
  source text,
  valid_until timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create generated posts table
CREATE TABLE generated_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES content_templates(id),
  platform_id uuid REFERENCES social_platforms(id),
  title text,
  content text NOT NULL,
  hashtags text[],
  media_urls text[],
  status post_status DEFAULT 'draft',
  content_type content_type DEFAULT 'post',
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE social_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for social_platforms
CREATE POLICY "Everyone can view active platforms"
  ON social_platforms FOR SELECT
  TO authenticated
  USING (active = true);

-- Create policies for content_templates
CREATE POLICY "Everyone can view templates"
  ON content_templates FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for content_trends
CREATE POLICY "Everyone can view trends"
  ON content_trends FOR SELECT
  TO authenticated
  USING (valid_until >= now());

-- Create policies for generated_posts
CREATE POLICY "Users can view their own posts"
  ON generated_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create posts"
  ON generated_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON generated_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON generated_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX content_templates_category_idx ON content_templates(category);
CREATE INDEX content_trends_category_idx ON content_trends(category);
CREATE INDEX content_trends_valid_until_idx ON content_trends(valid_until);
CREATE INDEX generated_posts_user_id_idx ON generated_posts(user_id);
CREATE INDEX generated_posts_status_idx ON generated_posts(status);
CREATE INDEX generated_posts_scheduled_for_idx ON generated_posts(scheduled_for);

-- Add triggers for updated_at
CREATE TRIGGER update_social_platforms_updated_at
  BEFORE UPDATE ON social_platforms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at
  BEFORE UPDATE ON content_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_trends_updated_at
  BEFORE UPDATE ON content_trends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_posts_updated_at
  BEFORE UPDATE ON generated_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default social platforms
INSERT INTO social_platforms (name, icon) VALUES
  ('Instagram', 'instagram'),
  ('Facebook', 'facebook'),
  ('Twitter', 'twitter'),
  ('LinkedIn', 'linkedin'),
  ('YouTube', 'youtube'),
  ('Telegram', 'send')
ON CONFLICT DO NOTHING;

-- Insert default content templates
INSERT INTO content_templates (name, description, structure, category) VALUES
  (
    'Продающий пост',
    'Шаблон для создания продающего контента',
    '{
      "structure": [
        {"type": "heading", "description": "Привлекающий внимание заголовок"},
        {"type": "problem", "description": "Описание проблемы"},
        {"type": "solution", "description": "Ваше решение"},
        {"type": "benefits", "description": "Выгоды и преимущества"},
        {"type": "proof", "description": "Социальное доказательство"},
        {"type": "call_to_action", "description": "Призыв к действию"},
        {"type": "hashtags", "description": "Релевантные хештеги"}
      ]
    }',
    'sales'
  ),
  (
    'Вовлекающий контент',
    'Шаблон для создания интерактивного контента',
    '{
      "structure": [
        {"type": "question", "description": "Вовлекающий вопрос"},
        {"type": "context", "description": "Контекст или история"},
        {"type": "points", "description": "Ключевые моменты"},
        {"type": "interaction", "description": "Призыв к взаимодействию"},
        {"type": "hashtags", "description": "Релевантные хештеги"}
      ]
    }',
    'engagement'
  ),
  (
    'Экспертный контент',
    'Шаблон для демонстрации экспертности',
    '{
      "structure": [
        {"type": "insight", "description": "Экспертное наблюдение"},
        {"type": "explanation", "description": "Подробное объяснение"},
        {"type": "examples", "description": "Примеры из практики"},
        {"type": "tips", "description": "Практические советы"},
        {"type": "conclusion", "description": "Заключение"},
        {"type": "hashtags", "description": "Профессиональные хештеги"}
      ]
    }',
    'expertise'
  ),
  (
    'Развлекательный контент',
    'Шаблон для создания легкого контента',
    '{
      "structure": [
        {"type": "hook", "description": "Захватывающее начало"},
        {"type": "story", "description": "Интересная история или факт"},
        {"type": "punchline", "description": "Неожиданный поворот или вывод"},
        {"type": "interaction", "description": "Вовлечение аудитории"},
        {"type": "hashtags", "description": "Трендовые хештеги"}
      ]
    }',
    'entertainment'
  )
ON CONFLICT DO NOTHING;