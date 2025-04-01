/*
  # Настройка политик безопасности для хранилища

  1. Настройка политик для bucket 'public'
    - Создание политик для публичного доступа
    - Настройка прав для аутентифицированных пользователей
  
  2. Безопасность
    - Включение RLS для объектов
    - Настройка политик для управления файлами
*/

-- Включаем Row Level Security для объектов
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если они есть
DROP POLICY IF EXISTS "Публичный доступ на чтение" ON storage.objects;
DROP POLICY IF EXISTS "Аутентифицированные пользователи могут загружать файлы" ON storage.objects;
DROP POLICY IF EXISTS "Владельцы могут обновлять свои файлы" ON storage.objects;
DROP POLICY IF EXISTS "Владельцы могут удалять свои файлы" ON storage.objects;

-- Создаем политики доступа

-- Разрешаем публичный доступ на чтение для всех файлов в bucket 'public'
CREATE POLICY "Публичный доступ на чтение"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public');

-- Разрешаем аутентифицированным пользователям загружать файлы
CREATE POLICY "Аутентифицированные пользователи могут загружать файлы"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public'
  AND (ARRAY[SPLIT_PART(name, '/', 1)])[1] = 'cases'
);

-- Разрешаем пользователям обновлять свои файлы
CREATE POLICY "Владельцы могут обновлять свои файлы"
ON storage.objects FOR UPDATE
TO authenticated
USING (owner = auth.uid())
WITH CHECK (
  bucket_id = 'public'
  AND (ARRAY[SPLIT_PART(name, '/', 1)])[1] = 'cases'
);

-- Разрешаем пользователям удалять свои файлы
CREATE POLICY "Владельцы могут удалять свои файлы"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'public'
  AND owner = auth.uid()
  AND (ARRAY[SPLIT_PART(name, '/', 1)])[1] = 'cases'
);