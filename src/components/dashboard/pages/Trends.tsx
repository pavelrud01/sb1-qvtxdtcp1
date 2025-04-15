import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  MessageSquare, 
  Heart, 
  BarChart2,
  ExternalLink,
  Image,
  Calendar as CalendarIcon,
  ChevronDown,
  X,
  Play,
  User,
  Instagram,
  Youtube,
  Facebook
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TrendPost {
  id: string;
  imageUrl: string | null;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  externalUrl: string;
  hashtags: string[];
  platform: 'instagram' | 'youtube' | 'tiktok' | 'facebook';
  type: 'post' | 'reel' | 'video';
  channelName: string;
  engagement: number;
}

const Trends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategories, setShowCategories] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<'post' | 'reel' | 'video' | ''>('');
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'youtube' | 'tiktok' | 'facebook' | ''>('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Бьюти',
    'Спорт и фитнес',
    'Еда и рестораны',
    'Мода',
    'Технологии'
  ];

  const contentTypes = [
    { value: 'post', label: 'Пост' },
    { value: 'reel', label: 'Reels' },
    { value: 'video', label: 'Видео' }
  ];

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' }
  ];

  const [trendingPosts] = useState<TrendPost[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Как правильно начать свой день: 5 привычек успешных людей #успех #саморазвитие #мотивация',
      likes: 1200,
      comments: 350,
      timestamp: '2025-05-15T08:30:00Z',
      externalUrl: 'https://instagram.com/p/example1',
      hashtags: ['#успех', '#саморазвитие', '#мотивация'],
      platform: 'instagram',
      type: 'post',
      channelName: '@lifestyle_expert',
      engagement: 4.5
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Тренды в дизайне интерьера 2025 #дизайн #интерьер #тренды2025',
      likes: 890,
      comments: 230,
      timestamp: '2025-05-14T15:45:00Z',
      externalUrl: 'https://youtube.com/watch?v=example2',
      hashtags: ['#дизайн', '#интерьер', '#тренды2025'],
      platform: 'youtube',
      type: 'video',
      channelName: 'Design Masters',
      engagement: 3.8
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Утренняя рутина: 10 минут для продуктивного дня #утро #продуктивность #рутина',
      likes: 5600,
      comments: 890,
      timestamp: '2025-05-15T07:15:00Z',
      externalUrl: 'https://tiktok.com/@user/video/example3',
      hashtags: ['#утро', '#продуктивность', '#рутина'],
      platform: 'tiktok',
      type: 'reel',
      channelName: '@morning_routine',
      engagement: 6.2
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Здоровое питание: 5 рецептов для энергичного дня #здоровье #рецепты #пп',
      likes: 3200,
      comments: 450,
      timestamp: '2025-05-15T09:30:00Z',
      externalUrl: 'https://instagram.com/p/example4',
      hashtags: ['#здоровье', '#рецепты', '#пп'],
      platform: 'instagram',
      type: 'post',
      channelName: '@healthy_food',
      engagement: 5.1
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Топ упражнений для домашних тренировок #фитнес #спорт #тренировки',
      likes: 4100,
      comments: 320,
      timestamp: '2025-05-15T10:15:00Z',
      externalUrl: 'https://youtube.com/watch?v=example5',
      hashtags: ['#фитнес', '#спорт', '#тренировки'],
      platform: 'youtube',
      type: 'video',
      channelName: 'FitnessPro',
      engagement: 4.8
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Модные тренды весны 2025 #мода #стиль #тренды',
      likes: 2800,
      comments: 410,
      timestamp: '2025-05-15T11:00:00Z',
      externalUrl: 'https://facebook.com/posts/example6',
      hashtags: ['#мода', '#стиль', '#тренды'],
      platform: 'facebook',
      type: 'post',
      channelName: 'Fashion Today',
      engagement: 4.2
    }
  ]);

  const handleSearch = () => {
    setLoading(true);
    // Имитация поиска
    setTimeout(() => setLoading(false), 800);
  };

  const handleGenerateSimilar = (post: TrendPost) => {
    console.log('Generating similar content for:', post);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'tiktok':
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0011.14-4.02v-7a8.16 8.16 0 004.65 1.48V7.1a4.79 4.79 0 01-1.2-.41z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Тренды</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        {/* Поисковая строка и кнопка */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск трендов..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors flex items-center whitespace-nowrap"
          >
            <Search className="h-5 w-5 mr-2" />
            Найти
          </button>
        </div>

        {/* Фильтры */}
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
          >
            <option value="">Выберите сферу</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
          >
            <option value="">Все типы контента</option>
            {contentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
          >
            <option value="">Все платформы</option>
            {platforms.map(platform => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D46B9]"></div>
          <span className="ml-3 text-gray-600">Загрузка трендов...</span>
        </div>
      ) : trendingPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Превью контента */}
              <div className="relative aspect-[4/3]">
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt="Превью поста" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {(post.type === 'video' || post.type === 'reel') && (
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Информация о посте */}
              <div className="p-4">
                {/* Канал и платформа */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium">{post.channelName}</span>
                  </div>
                  <div className="flex items-center">
                    {getPlatformIcon(post.platform)}
                  </div>
                </div>

                {/* Описание */}
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.caption}</p>

                {/* Хештеги */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.hashtags.map((tag) => (
                    <span key={tag} className="text-xs text-[#2D46B9] bg-[#F1F4FF] px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Дата */}
                <div className="text-xs text-gray-500 mb-3">
                  {formatDate(post.timestamp)}
                </div>

                {/* Метрики */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-sm font-medium">{post.likes.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Лайки</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-sm font-medium">{post.comments.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Комментарии</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <div className="text-sm font-medium">{post.engagement}%</div>
                    <div className="text-xs text-gray-500">Вовлечённость</div>
                  </div>
                </div>

                {/* Кнопка генерации */}
                <button
                  onClick={() => handleGenerateSimilar(post)}
                  className="w-full py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors text-sm flex items-center justify-center"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Сгенерировать похожее
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">Тренды не найдены</h3>
            <p className="text-gray-500 mt-2">
              Попробуйте изменить параметры поиска или выбрать другую сферу
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trends;