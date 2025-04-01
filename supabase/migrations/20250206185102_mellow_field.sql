/*
  # Add cases management

  1. New Tables
    - `cases`
      - `id` (uuid, primary key)
      - `title` (text) - Заголовок кейса
      - `description` (text) - Описание кейса
      - `image_url` (text) - URL изображения
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `is_published` (boolean) - Статус публикации
      - `order` (integer) - Порядок отображения

  2. Security
    - Enable RLS on `cases` table
    - Add policies for admin access
*/

-- Создаем таблицу для кейсов
CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_published boolean DEFAULT false,
  "order" integer DEFAULT 0
);

-- Включаем RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
CREATE POLICY "Все могут просматривать опубликованные кейсы"
  ON cases FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Администраторы могут управлять всеми кейсами"
  ON cases FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@example.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'admin@example.com'
  );

-- Создаем индекс для сортировки
CREATE INDEX cases_order_idx ON cases("order");

-- Создаем триггер для обновления updated_at
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();