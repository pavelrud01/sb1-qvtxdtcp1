/*
  # Пересоздание структуры базы данных

  1. Создание базовых типов
  2. Создание таблиц
  3. Настройка безопасности и триггеров
  4. Настройка прав доступа
*/

-- Создание типов
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
    CREATE TYPE subscription_tier AS ENUM ('start', 'professional', 'corporate');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'social_platform') THEN
    CREATE TYPE social_platform AS ENUM ('instagram', 'facebook', 'twitter', 'tiktok', 'linkedin');
  END IF;
END $$;

-- Удаление существующих триггеров auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users CASCADE;

-- Удаление существующих функций
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_sign_in() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Удаление существующих таблиц
DROP TABLE IF EXISTS social_accounts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Создание основных таблиц
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_confirmed_at timestamptz,
  full_name text,
  avatar_url text,
  phone text,
  subscription_tier subscription_tier DEFAULT 'start',
  last_sign_in_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform social_platform NOT NULL,
  account_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, account_name)
);

-- Включение RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггеров для updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Создание функции для обработки новых пользователей
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  full_name_value text;
BEGIN
  full_name_value := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    'User ' || substr(NEW.id::text, 1, 8)
  );

  INSERT INTO public.profiles (
    id,
    full_name,
    email_confirmed_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    full_name_value,
    NEW.email_confirmed_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Создание функции для обновления времени входа
CREATE OR REPLACE FUNCTION public.handle_user_sign_in()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    last_sign_in_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Создание триггеров для обработки пользователей
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_sign_in();

-- Создание политик безопасности
DO $$
BEGIN
  -- Удаляем существующие политики если они есть
  DROP POLICY IF EXISTS "Пользователи могут читать свой профиль" ON profiles;
  DROP POLICY IF EXISTS "Пользователи могут обновлять свой профиль" ON profiles;
  DROP POLICY IF EXISTS "Пользователи могут читать свои социальные аккаунты" ON social_accounts;
  DROP POLICY IF EXISTS "Пользователи могут управлять своими социальными аккаунтами" ON social_accounts;
  
  -- Создаем новые политики
  CREATE POLICY "Пользователи могут читать свой профиль"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Пользователи могут обновлять свой профиль"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Пользователи могут читать свои социальные аккаунты"
    ON social_accounts FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

  CREATE POLICY "Пользователи могут управлять своими социальными аккаунтами"
    ON social_accounts FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
END $$;

-- Установка прав доступа
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Создание индексов
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles(id);
CREATE INDEX IF NOT EXISTS social_accounts_user_id_idx ON social_accounts(user_id);