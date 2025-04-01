/*
  # Пересоздание базовой структуры базы данных

  1. Очистка
    - Удаление существующих триггеров и функций
    - Удаление таблиц с каскадным удалением зависимостей
  2. Создание структуры
    - Создание типов enum
    - Создание основных таблиц
    - Настройка RLS и политик
  3. Функции и триггеры
    - Создание служебных функций
    - Настройка автоматических триггеров
*/

-- Сначала удаляем все существующие триггеры
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON social_accounts;

-- Удаляем существующие функции с каскадным удалением зависимостей
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_sign_in() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Удаляем таблицы с каскадным удалением зависимостей
DROP TABLE IF EXISTS social_accounts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Создаем enum если он не существует
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
    CREATE TYPE subscription_tier AS ENUM ('start', 'professional', 'corporate');
  END IF;
END $$;

-- Создаем таблицу profiles заново
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

-- Включаем RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Создаем функцию для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Создаем улучшенную функцию для создания профиля
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  full_name_value text;
BEGIN
  -- Получаем full_name из метаданных
  full_name_value := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    'User ' || substr(NEW.id::text, 1, 8)
  );

  -- Создаем профиль
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
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Создаем функцию для обновления времени входа
CREATE OR REPLACE FUNCTION public.handle_user_sign_in()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    last_sign_in_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error updating sign in time for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Создаем триггеры
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_sign_in();

-- Добавляем политики безопасности
DO $$
BEGIN
  -- Удаляем существующие политики если они есть
  DROP POLICY IF EXISTS "Пользователи могут читать свой профиль" ON profiles;
  DROP POLICY IF EXISTS "Пользователи могут обновлять свой профиль" ON profiles;
  
  -- Создаем новые политики
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
END $$;

-- Добавляем индекс для оптимизации поиска по id
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles(id);