/*
  # Обновление схемы базы данных

  1. Таблицы
    - Проверка и создание таблицы profiles
  2. Безопасность
    - Включение RLS
    - Обновление политик безопасности
  3. Функции и триггеры
    - Пересоздание функций для обработки пользователей
    - Обновление триггеров
*/

-- Убедимся, что таблица profiles существует со всеми необходимыми полями
CREATE TABLE IF NOT EXISTS profiles (
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

-- Удаляем старые триггеры если они существуют
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;

-- Пересоздаем функцию для обработки новых пользователей
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  full_name_value text;
BEGIN
  -- Безопасное извлечение full_name из метаданных
  full_name_value := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    'User ' || substr(NEW.id::text, 1, 8)
  );

  -- Вставляем новую запись
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
    -- Логируем ошибку (можно настроить более детальное логирование)
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Пересоздаем функцию для обновления времени входа
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
    RAISE WARNING 'Error in handle_user_sign_in: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Создаем новые триггеры
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_sign_in
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_sign_in();

-- Добавляем политики безопасности с проверкой существования
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