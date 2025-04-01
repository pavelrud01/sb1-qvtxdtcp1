-- Создаем bucket для кейсов если он не существует
INSERT INTO storage.buckets (id, name)
VALUES ('cases', 'cases')
ON CONFLICT (id) DO NOTHING;

-- Включаем Row Level Security для объектов
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если они есть
DROP POLICY IF EXISTS "Публичный доступ на чтение кейсов" ON storage.objects;
DROP POLICY IF EXISTS "Загрузка файлов кейсов" ON storage.objects;
DROP POLICY IF EXISTS "Обновление файлов кейсов" ON storage.objects;
DROP POLICY IF EXISTS "Удаление файлов кейсов" ON storage.objects;

-- Создаем политики доступа для bucket 'cases'

-- Разрешаем публичный доступ на чтение
CREATE POLICY "Публичный доступ на чтение кейсов"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cases');

-- Разрешаем аутентифицированным пользователям загружать файлы
CREATE POLICY "Загрузка файлов кейсов"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cases');

-- Разрешаем пользователям обновлять свои файлы
CREATE POLICY "Обновление файлов кейсов"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cases' AND owner = auth.uid())
WITH CHECK (bucket_id = 'cases');

-- Разрешаем пользователям удалять свои файлы
CREATE POLICY "Удаление файлов кейсов"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cases' AND owner = auth.uid());