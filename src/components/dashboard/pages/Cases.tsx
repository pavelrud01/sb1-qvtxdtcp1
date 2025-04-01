import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Case {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  is_published: boolean;
  order: number;
}

const Cases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    is_published: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);

      // Проверяем размер файла (максимум 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Изображение должно быть меньше 2MB');
      }

      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения');
      }

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Загружаем файл в Storage
      const { error: uploadError } = await supabase.storage
        .from('cases')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Получаем публичный URL файла
      const { data: { publicUrl } } = supabase.storage
        .from('cases')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при загрузке изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCase?.id) {
        // Обновление существующего кейса
        const { error } = await supabase
          .from('cases')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url || null,
            is_published: formData.is_published,
          })
          .eq('id', editingCase.id);

        if (error) throw error;
      } else {
        // Создание нового кейса
        const { error } = await supabase
          .from('cases')
          .insert([
            {
              title: formData.title,
              description: formData.description,
              image_url: formData.image_url || null,
              order: cases.length,
              is_published: formData.is_published,
            },
          ]);

        if (error) throw error;
      }

      // Очищаем форму и обновляем список
      setFormData({ title: '', description: '', image_url: '', is_published: false });
      setEditingCase(null);
      await loadCases();
    } catch (error) {
      console.error('Error saving case:', error);
      alert('Ошибка при сохранении кейса');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот кейс?')) return;

    try {
      // Если есть изображение, удаляем его из Storage
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('cases')
            .remove([fileName]);
        }
      }

      // Удаляем запись из базы данных
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      alert('Ошибка при удалении кейса');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('cases')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadCases();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Ошибка при изменении статуса публикации');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Управление кейсами</h1>
        {!editingCase && (
          <button
            onClick={() => setEditingCase({ id: '', title: '', description: '', image_url: null, is_published: false, order: 0 })}
            className="flex items-center bg-[#2D46B9] text-white px-4 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Добавить кейс
          </button>
        )}
      </div>

      {/* Форма редактирования/создания */}
      {editingCase && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              {editingCase.id ? 'Редактирование кейса' : 'Новый кейс'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Изображение
              </label>
              <div className="space-y-2">
                {formData.image_url && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center justify-center w-full h-12 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-[#2D46B9] focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <Upload size={20} className={uploadingImage ? 'animate-bounce' : ''} />
                    <span className="font-medium text-sm text-gray-600">
                      {uploadingImage ? 'Загрузка...' : 'Выберите изображение'}
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Максимальный размер: 2MB. Поддерживаемые форматы: JPG, PNG, GIF
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="h-4 w-4 text-[#2D46B9] focus:ring-[#2D46B9] border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                Опубликовать сразу
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setEditingCase(null);
                  setFormData({ title: '', description: '', image_url: '', is_published: false });
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="bg-[#2D46B9] text-white px-6 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список кейсов */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изображение
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заголовок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {case_.image_url ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={case_.image_url}
                          alt={case_.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {case_.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {case_.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        case_.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {case_.is_published ? 'Опубликован' : 'Черновик'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => togglePublish(case_.id, case_.is_published)}
                        className="text-gray-600 hover:text-[#2D46B9]"
                        title={case_.is_published ? 'Снять с публикации' : 'Опубликовать'}
                      >
                        {case_.is_published ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingCase(case_);
                          setFormData({
                            title: case_.title,
                            description: case_.description,
                            image_url: case_.image_url || '',
                            is_published: case_.is_published,
                          });
                        }}
                        className="text-gray-600 hover:text-[#2D46B9]"
                        title="Редактировать"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(case_.id, case_.image_url)}
                        className="text-gray-600 hover:text-red-600"
                        title="Удалить"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cases;