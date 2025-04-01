/*
  # Social Media Accounts Schema

  1. New Tables
    - `social_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - связь с profiles
      - `platform` (text) - платформа (instagram, facebook, etc)
      - `account_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Включен RLS для таблицы `social_accounts`
    - Политики для:
      - Чтение своих аккаунтов
      - Создание/обновление/удаление своих аккаунтов
*/

-- Создаем enum для платформ
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook', 'twitter', 'tiktok', 'linkedin');

-- Создаем таблицу социальных аккаунтов
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform social_platform NOT NULL,
  account_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, account_name)
);

-- Включаем Row Level Security
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности
CREATE POLICY "Пользователи могут читать свои социальные аккаунты"
  ON social_accounts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Пользователи могут создавать свои социальные аккаунты"
  ON social_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Пользователи могут обновлять свои социальные аккаунты"
  ON social_accounts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Пользователи могут удалять свои социальные аккаунты"
  ON social_accounts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();