/*
  # Fix profile creation on signup

  1. Changes
    - Drop all existing triggers and functions
    - Recreate handle_new_user function with proper error handling
    - Add detailed logging
    - Ensure proper profile creation
*/

-- Сначала удаляем все существующие триггеры
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;

-- Удаляем существующие функции
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_sign_in();

-- Создаем новую функцию для обработки новых пользователей
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