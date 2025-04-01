import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  FileText, 
  BarChart2, 
  ChevronRight, 
  AlertCircle,
  FileText as FileTextIcon,
  Search as SearchIcon,
  BarChart2 as BarChart2Icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface BrandData {
  business_info?: string;
  competitors?: {
    link1?: string;
    link2?: string;
    link3?: string;
    description?: string;
  };
  target_audience?: {
    age_range?: {
      min: number;
      max: number;
    };
    geography?: string;
    interests?: string;
  };
  business_goals?: string[];
  brand_tone?: string;
  brand_description?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadBrandData();
  }, []);

  const loadBrandData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('user_questionnaire')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setBrandData(data);
    } catch (error) {
      console.error('Error loading brand data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!brandData) return 0;
    
    const fields = [
      { key: 'business_info', value: brandData.business_info },
      { key: 'competitors', value: brandData.competitors?.description },
      { key: 'target_audience', value: brandData.target_audience?.interests },
      { key: 'business_goals', value: brandData.business_goals },
      { key: 'brand_tone', value: brandData.brand_tone },
      { key: 'brand_description', value: brandData.brand_description }
    ];
    
    const completedFields = fields.filter(field => {
      if (Array.isArray(field.value)) {
        return field.value.length > 0;
      }
      return field.value && String(field.value).trim() !== '';
    });

    return Math.round((completedFields.length / fields.length) * 100);
  };

  const incompleteFields = [
    {
      title: 'Информация о бизнесе',
      description: 'Расскажите о вашем бизнесе и его особенностях',
      completed: !!brandData?.business_info
    },
    {
      title: 'Конкуренты',
      description: 'Укажите ваших основных конкурентов',
      completed: !!brandData?.competitors?.description
    },
    {
      title: 'Целевая аудитория',
      description: 'Опишите вашу целевую аудиторию',
      completed: !!brandData?.target_audience?.interests
    },
    {
      title: 'Цели бизнеса',
      description: 'Определите основные цели вашего бизнеса',
      completed: !!brandData?.business_goals?.length
    },
    {
      title: 'Тон бренда',
      description: 'Выберите подходящий тон коммуникации',
      completed: !!brandData?.brand_tone
    }
  ];

  const incompleteSlidesCount = incompleteFields.filter(field => !field.completed).length;

  const aiRecommendations = [
    {
      title: 'Оптимизация контента',
      description: 'Рекомендуется увеличить частоту публикаций в Instagram для повышения охвата.',
    },
    {
      title: 'Вовлечение аудитории',
      description: 'Используйте больше вопросов и опросов в stories для повышения взаимодействия.',
    },
    {
      title: 'Анализ конкурентов',
      description: 'Ваши конкуренты активно используют видео-контент. Рассмотрите возможность создания reels.',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Генерация контента */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Генерация контента
          </h2>
          <p className="text-gray-600">
            Создавайте уникальный контент для вашего бренда
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/dashboard/content-generator', { state: { template: 'idea' } })}
            className="p-6 text-left border border-gray-200 rounded-lg hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <SearchIcon className="h-6 w-6 text-[#2D46B9]" />
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#2D46B9]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Найти идею для контента</h3>
            <p className="text-sm text-gray-600">
              Получите идеи для создания контента
            </p>
          </button>

          <button
            onClick={() => navigate('/dashboard/content-generator', { state: { template: 'post' } })}
            className="p-6 text-left border border-gray-200 rounded-lg hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <FileTextIcon className="h-6 w-6 text-[#2D46B9]" />
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#2D46B9]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Написать социальный пост</h3>
            <p className="text-sm text-gray-600">
              Создайте пост для социальных сетей
            </p>
          </button>

          <button
            onClick={() => navigate('/dashboard/content-generator', { state: { template: 'strategy' } })}
            className="p-6 text-left border border-gray-200 rounded-lg hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart2Icon className="h-6 w-6 text-[#2D46B9]" />
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#2D46B9]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Создать контент-стратегию</h3>
            <p className="text-sm text-gray-600">
              Разработайте план контента
            </p>
          </button>
        </div>
      </div>

      {/* Отчет по бренду */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Завершите настройку своего бренда ({calculateProfileCompletion()}%)
            </h2>
            <p className="text-gray-600">
              Заполните профиль бренда для получения персонализированных рекомендаций
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors flex items-center"
          >
            Перейти к настройкам
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>

        {/* Прогресс бар */}
        <div className="h-2 bg-gray-100 rounded-full mb-6">
          <div
            className="h-full bg-[#2D46B9] rounded-full transition-all duration-500"
            style={{ width: `${calculateProfileCompletion()}%` }}
          />
        </div>

        {/* Карусель незаполненных полей */}
        {incompleteSlidesCount > 0 && (
          <div className="relative overflow-hidden mb-6">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {incompleteFields.filter(field => !field.completed).map((field, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 p-4 bg-[#F1F4FF] rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{field.title}</h3>
                  <p className="text-sm text-gray-600">{field.description}</p>
                </div>
              ))}
            </div>
            {incompleteSlidesCount > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: incompleteSlidesCount }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-[#2D46B9]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Советы от ИИ ассистента */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Sparkles className="h-6 w-6 text-[#2D46B9] mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Рекомендации по улучшению
          </h2>
        </div>

        <div className="space-y-4">
          {aiRecommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-[#F1F4FF] rounded-lg"
            >
              <AlertCircle className="h-5 w-5 text-[#2D46B9] mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {recommendation.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {recommendation.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;