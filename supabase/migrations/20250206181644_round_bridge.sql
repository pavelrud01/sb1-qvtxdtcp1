/*
  # Добавление поля email в профиль

  1. Добавление поля email в таблицу profiles
  2. Обновление функции handle_new_user для сохранения email
*/

-- Добавляем поле email в таблицу profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;

-- Обновляем функцию для обработки новых пользователей
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
    email,
    full_name,
    email_confirmed_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email, -- Сохраняем email пользователя
    full_name_value,
    NEW.email_confirmed_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$;