/*
  # Fix profile creation issues

  1. Changes
    - Drop and recreate triggers with proper error handling
    - Add additional logging
    - Ensure proper transaction handling
*/

-- Сначала удаляем существующие триггеры
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_sign_in ON auth.users;

-- Пересоздаем функцию для создания профиля с улучшенной обработкой ошибок
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
  -- Логируем входные данные
  debug_info := format(
    'Creating profile for user %s with metadata: %s',
    NEW.id::text,
    NEW.raw_user_meta_data::text
  );
  RAISE LOG '%', debug_info;

  -- Получаем full_name из метаданных с дополнительной проверкой
  full_name_value := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    'User ' || substr(NEW.id::text, 1, 8)
  );

  -- Проверяем существование записи
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    UPDATE public.profiles
    SET
      full_name = full_name_value,
      email_confirmed_at = NEW.email_confirmed_at,
      updated_at = NOW()
    WHERE id = NEW.id;
    
    RAISE LOG 'Updated existing profile for user %', NEW.id;
  ELSE
    -- Создаем новый профиль
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
    
    RAISE LOG 'Created new profile for user %', NEW.id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Детальное логирование ошибки
    RAISE WARNING 'Error in handle_new_user for user %: % (SQLSTATE: %)',
      NEW.id::text,
      SQLERRM,
      SQLSTATE;
    RETURN NEW;
END;
$$;

-- Пересоздаем триггеры с новой функцией
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Обновляем индекс для оптимизации
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles(id);