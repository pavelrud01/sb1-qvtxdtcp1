/*
  # User Profiles Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - связан с auth.users
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `subscription_tier` (text) - тариф пользователя
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Включен RLS для таблицы `profiles`
    - Политики для:
      - Чтение своего профиля
      - Обновление своего профиля
      - Создание профиля при регистрации
*/

-- Создаем enum для тарифов
CREATE TYPE subscription_tier AS ENUM ('start', 'professional', 'corporate');

-- Создаем таблицу профилей
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  subscription_tier subscription_tier DEFAULT 'start',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
CREATE POLICY "Пользователи могут читать свой профиль"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свой профиль"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Пользователи могут создать свой профиль при регистрации"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Создаем функцию для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();