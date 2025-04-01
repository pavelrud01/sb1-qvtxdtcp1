import React, { useState } from 'react';
import { TrendingUp, Search, Play, MessageSquare, Heart, BarChart2, ArrowUp, Eye, ChevronRight } from 'lucide-react';

const Trends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'videos'>('posts');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const categories = [
    'Красота и здоровье',
    'Технологии',
    'Еда и рестораны',
    'Мода',
    'Образование',
    'Финансы',
    'Путешествия',
    'Спорт'
  ];

  const styles = [
    'Информативный',
    'Развлекательный',
    'Вдохновляющий',
    'Образовательный',
    'Продающий'
  ];

  const trendingPosts = [
    {
      title: 'Как правильно начать свой день: 5 привычек успешных людей',
      engagement: {
        likes: 1200,
        comments: 350,
        shares: 180,
        views: 15000
      },
      growth: '+245%',
      hashtags: ['#успех', '#саморазвитие', '#мотивация'],
      analysis: 'Пост демонстрирует высокую вовлеченность благодаря практическим советам и актуальной теме. Подходит для построения экспертности бренда.'
    },
    {
      title: 'Тренды в дизайне интерьера 2025',
      engagement: {
        likes: 890,
        comments: 230,
        shares: 150,
        views: 12000
      },
      growth: '+180%',
      hashtags: ['#дизайн', '#интерьер', '#тренды2025'],
      analysis: 'Контент на тему трендов всегда актуален. Высокий потенциал для брендов в сфере дизайна и ремонта.'
    }
  ];

  const trendingVideos = [
    {
      title: 'Утренняя рутина: 10 минут для продуктивного дня',
      engagement: {
        likes: 5600,
        comments: 890,
        shares: 2300,
        views: 89000
      },
      growth: '+320%',
      hashtags: ['#утро', '#продуктивность', '#рутина'],
      analysis: 'Короткие видео с практическими советами показывают высокую вовлеченность. Формат идеально подходит для Instagram Reels и TikTok.'
    }
  ];

  const handleSearch = () => {
    // Здесь будет логика поиска трендов
    console.log('Searching for:', searchQuery);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Тренды</h1>

      {/* Поисковая строка */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск трендов..."
            className="w-full px-4 py-3 pr-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Переключатель типа контента */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 rounded-lg flex items-center ${
            activeTab === 'posts'
              ? 'bg-[#2D46B9] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D46B9]'
          } transition-colors`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Тренды постов
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 rounded-lg flex items-center ${
            activeTab === 'videos'
              ? 'bg-[#2D46B9] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D46B9]'
          } transition-colors`}
        >
          <Play className="h-5 w-5 mr-2" />
          Тренды видео
        </button>
      </div>

      {/* Категории */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Выберите нишу</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(
                selectedCategory === category ? null : category
              )}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedCategory === category
                  ? 'bg-[#2D46B9] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D46B9]'
              } transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Стили */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Стиль повествования</h3>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(
                selectedStyle === style ? null : style
              )}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedStyle === style
                  ? 'bg-[#2D46B9] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D46B9]'
              } transition-colors`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Трендовый контент */}
      <div className="space-y-6">
        {(activeTab === 'posts' ? trendingPosts : trendingVideos).map((item, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {item.growth}
              </div>
            </div>

            {/* Метрики */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Просмотры
                </div>
                <div className="text-lg font-semibold">{item.engagement.views.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <Heart className="h-4 w-4 mr-1" />
                  Лайки
                </div>
                <div className="text-lg font-semibold">{item.engagement.likes.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Комментарии
                </div>
                <div className="text-lg font-semibold">{item.engagement.comments.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  Репосты
                </div>
                <div className="text-lg font-semibold">{item.engagement.shares.toLocaleString()}</div>
              </div>
            </div>

            {/* Хештеги */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Популярные хештеги</h4>
              <div className="flex flex-wrap gap-2">
                {item.hashtags.map((hashtag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#F1F4FF] text-[#2D46B9] rounded-full text-sm"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

            {/* Анализ */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Почему это тренд?</h4>
              <p className="text-sm text-gray-600">{item.analysis}</p>
            </div>

            <button className="mt-4 flex items-center text-[#2D46B9] hover:bg-[#F1F4FF] px-4 py-2 rounded-lg transition-colors">
              Использовать как шаблон
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;