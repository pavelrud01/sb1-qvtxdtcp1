import React, { useState, useEffect } from 'react';
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
  X
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
}

interface DateRange {
  start: Date;
  end: Date;
}

const Trends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | 'custom'>('24h');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<'post' | 'reel' | 'video' | ''>('');
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'youtube' | 'tiktok' | 'facebook' | ''>('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Бьюти',
    'Спорт и фитнес',
    'Еда и рестораны',
    'Мода',
    'Технологии',
    'Образование',
    'Путешествия',
    'Здоровье',
    'Бизнес',
    'Развлечения'
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

  const [trendingPosts, setTrendingPosts] = useState<TrendPost[]>([
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
      type: 'post'
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
      type: 'video'
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
      type: 'reel'
    }
  ]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredPosts = [...trendingPosts];
      
      if (selectedCategory || customCategory) {
        const category = selectedCategory || customCategory;
        filteredPosts = filteredPosts.filter(post => 
          post.caption.toLowerCase().includes(category.toLowerCase()) ||
          post.hashtags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
        );
      }
      
      if (selectedContentType) {
        filteredPosts = filteredPosts.filter(post => post.type === selectedContentType);
      }
      
      if (selectedPlatform) {
        filteredPosts = filteredPosts.filter(post => post.platform === selectedPlatform);
      }
      
      const now = new Date();
      let timeLimit: Date;
      
      if (selectedPeriod === '24h') {
        timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (selectedPeriod === '7d') {
        timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        timeLimit = dateRange.start;
      }
      
      filteredPosts = filteredPosts.filter(post => {
        const postDate = new Date(post.timestamp);
        return selectedPeriod === 'custom'
          ? postDate >= dateRange.start && postDate <= dateRange.end
          : postDate >= timeLimit;
      });
      
      setTrendingPosts(filteredPosts);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSimilar = (post: TrendPost) => {
    console.log('Generating similar content for:', post);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Тренды</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Период
            </label>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-[#2D46B9] focus:outline-none focus:ring-2 focus:ring-[#2D46B9]"
            >
              <span className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                {selectedPeriod === '24h' ? 'Последние 24 часа' :
                 selectedPeriod === '7d' ? 'Последние 7 дней' :
                 'Выбрать период'}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>
            
            {showDatePicker && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedPeriod('24h');
                      setShowDatePicker(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Последние 24 часа
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPeriod('7d');
                      setShowDatePicker(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Последние 7 дней
                  </button>
                  <hr className="my-2" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Свой период:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={format(dateRange.start, 'yyyy-MM-dd')}
                        onChange={(e) => setDateRange(prev => ({
                          ...prev,
                          start: new Date(e.target.value)
                        }))}
                        className="px-2 py-1 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="date"
                        value={format(dateRange.end, 'yyyy-MM-dd')}
                        onChange={(e) => setDateRange(prev => ({
                          ...prev,
                          end: new Date(e.target.value)
                        }))}
                        className="px-2 py-1 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPeriod('custom');
                        setShowDatePicker(false);
                      }}
                      className="w-full px-4 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90"
                    >
                      Применить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сфера
            </label>
            <div className="relative">
              <input
                type="text"
                value={customCategory || selectedCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setSelectedCategory('');
                }}
                placeholder="Выберите или введите сферу..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
              />
              {(customCategory || selectedCategory) && (
                <button
                  onClick={() => {
                    setCustomCategory('');
                    setSelectedCategory('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCustomCategory('');
                  }}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedCategory === category
                      ? 'bg-[#2D46B9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип контента
            </label>
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
            >
              <option value="">Все типы</option>
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Источник
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
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
        
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Найти
          </button>
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
              <div className="aspect-video relative">
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
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  post.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
                  post.platform === 'youtube' ? 'bg-red-100 text-red-800' :
                  post.platform === 'tiktok' ? 'bg-black text-white' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {platforms.find(p => p.value === post.platform)?.label}
                </span>
              </div>

              <div className="p-4">
                <p className="text-gray-900 mb-2 line-clamp-2">{post.caption}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.hashtags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-[#F1F4FF] text-[#2D46B9] rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  {formatDate(post.timestamp)}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-600 text-xs mb-1">
                      <Heart className="h-3 w-3 mr-1 text-pink-500" />
                      Лайки
                    </div>
                    <div className="text-sm font-semibold">{post.likes.toLocaleString()}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-600 text-xs mb-1">
                      <MessageSquare className="h-3 w-3 mr-1 text-blue-500" />
                      Комментарии
                    </div>
                    <div className="text-sm font-semibold">{post.comments.toLocaleString()}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-gray-600 text-xs mb-1">
                      <BarChart2 className="h-3 w-3 mr-1 text-[#2D46B9]" />
                      Вовлеченность
                    </div>
                    <div className="text-sm font-semibold">
                      {((post.likes + post.comments) / (post.likes * 0.01)).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleGenerateSimilar(post)}
                    className="px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors text-sm"
                  >
                    Сгенерировать похожее
                  </button>
                  <a 
                    href={post.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-500 hover:text-[#2D46B9] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
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