/*
  # Fix user registration issues

  1. Changes
    - Drop and recreate handle_new_user function with proper error handling
    - Add detailed logging for debugging
    - Fix duplicate metadata access
    - Add proper exception handling
*/

-- Пересоздаем функцию для обработки новых пользователей с улучшенным логированием
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  full_name_value text;
  debug_info text;
BEGIN
  -- Логируем входные данные для отладки
  debug_info := format(
    'Creating profile for user %s with metadata: %s',
    NEW.id::text,
    NEW.raw_user_meta_data::text
  );
  RAISE NOTICE '%', debug_info;

  -- Получаем full_name из метаданных
  full_name_value := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    'User ' || substr(NEW.id::text, 1, 8)
  );

  -- Логируем извлеченное имя
  RAISE NOTICE 'Extracted full_name: %', full_name_value;

  -- Пробуем создать профиль
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

  RAISE NOTICE 'Profile created successfully for user %', NEW.id::text;
  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Детальное логирование ошибки
    RAISE WARNING 'Error in handle_new_user for user %: % (SQLSTATE: %)',
      NEW.id::text,
      SQLERRM,
      SQLSTATE;
    -- Возвращаем NEW, чтобы не блокировать создание пользователя
    RETURN NEW;
END;
$$;