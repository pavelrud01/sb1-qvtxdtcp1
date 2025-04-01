import React, { useState, useEffect } from 'react';
import { Target, Building2, Users, MessageSquare, Image as ImageIcon, Link as LinkIcon, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface QuestionnaireData {
  business_info: string;
  competitors: string;
  target_audience: string;
  business_goals: string[];
  brand_tone: string;
}

interface ContentGeneratorProps {
  template?: string;
  initialPrompt?: string;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ template, initialPrompt }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<QuestionnaireData | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    postGoal: '',
    customBusinessInfo: '',
    useProfileData: true,
    imageUrl: '',
    customPrompt: location.state?.prompt || '',
    keywords: '',
    businessLinks: '',
  });

  const postGoals = [
    'Продажа товара/услуги',
    'Повышение узнаваемости',
    'Вовлечение аудитории',
    'Информирование',
    'Развлечение',
  ];

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data: questionnaireData, error } = await supabase
        .from('user_questionnaire')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfileData(questionnaireData);
      
      if (questionnaireData) {
        setFormData(prev => ({
          ...prev,
          keywords: Array.isArray(questionnaireData.business_goals) 
            ? questionnaireData.business_goals.join(', ')
            : questionnaireData.business_goals,
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);

      // Проверяем размер файла (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Изображение должно быть меньше 10MB');
      }

      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения');
      }

      // Создаем превью для отображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Загружаем файл в Storage
      const { error: uploadError, data } = await supabase.storage
        .from('content-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Получаем публичный URL файла
      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при загрузке изображения');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика генерации контента
    console.log('Generating content with:', {
      ...formData,
      profileData: formData.useProfileData ? profileData : null,
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Назад
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <Sparkles className="h-6 w-6 text-[#2D46B9] mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">
            {template ? `Создание ${template.toLowerCase()}` : 'Создание контента'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Цель поста */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цель поста
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {postGoals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, postGoal: goal }))}
                  className={`p-3 text-sm text-center rounded-lg border ${
                    formData.postGoal === goal
                      ? 'border-[#2D46B9] bg-[#F1F4FF] text-[#2D46B9]'
                      : 'border-gray-200 text-gray-600 hover:border-[#2D46B9]'
                  } transition-colors`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Данные профиля */}
          {profileData && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Данные профиля
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.useProfileData}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev,
                      useProfileData: e.target.checked 
                    }))}
                    className="h-4 w-4 text-[#2D46B9] focus:ring-[#2D46B9] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Использовать данные профиля
                  </span>
                </label>
              </div>
              
              {formData.useProfileData ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {profileData.business_info}
                  </p>
                </div>
              ) : (
                <textarea
                  value={formData.customBusinessInfo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev,
                    customBusinessInfo: e.target.value 
                  }))}
                  placeholder="Введите информацию о бизнесе..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                />
              )}
            </div>
          )}

          {/* Изображение */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Изображение
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#2D46B9] transition-colors">
              {imagePreview ? (
                <div className="space-y-2 text-center">
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, imageUrl: '' }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  {uploadingImage && (
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Загрузка...
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#2D46B9] hover:text-[#2D46B9]/80 focus-within:outline-none"
                    >
                      <span>Загрузить изображение</span>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG до 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Промпт */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание желаемого поста
            </label>
            <textarea
              value={formData.customPrompt}
              onChange={(e) => setFormData(prev => ({ 
                ...prev,
                customPrompt: e.target.value 
              }))}
              placeholder="Опишите, какой пост вы хотите получить..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
            />
          </div>

          {/* Ключевые слова */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ключевые слова
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ 
                ...prev,
                keywords: e.target.value 
              }))}
              placeholder="Введите ключевые слова через запятую"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
            />
          </div>

          {/* Ссылки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ссылки на бизнес
            </label>
            <textarea
              value={formData.businessLinks}
              onChange={(e) => setFormData(prev => ({ 
                ...prev,
                businessLinks: e.target.value 
              }))}
              placeholder="Укажите ссылки на ваш сайт, социальные сети и т.д."
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#2D46B9] text-white px-8 py-3 rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
            >
              Сгенерировать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentGenerator;