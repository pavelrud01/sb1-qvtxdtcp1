import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Play, 
  MessageSquare, 
  Heart, 
  BarChart2, 
  ArrowUp, 
  Eye, 
  ChevronRight, 
  Calendar, 
  Clock, 
  RefreshCw, 
  ExternalLink,
  Image
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
  platform: 'instagram' | 'tiktok';
}

const Trends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'top' | 'recent'>('top');
  const [selectedHashtag, setSelectedHashtag] = useState<string>('');
  const [customHashtag, setCustomHashtag] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<'24h' | '7d'>('24h');
  const [sortBy, setSortBy] = useState<'likes' | 'growth' | 'engagement'>('likes');
  const [loading, setLoading] = useState(false);

  // Sample trending posts data
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
      platform: 'instagram'
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Тренды в дизайне интерьера 2025 #дизайн #интерьер #тренды2025',
      likes: 890,
      comments: 230,
      timestamp: '2025-05-14T15:45:00Z',
      externalUrl: 'https://instagram.com/p/example2',
      hashtags: ['#дизайн', '#интерьер', '#тренды2025'],
      platform: 'instagram'
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
      platform: 'tiktok'
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Новый тренд в макияже: #lattemakeup покоряет соцсети! Показываю, как повторить этот образ',
      likes: 7800,
      comments: 1240,
      timestamp: '2025-05-14T19:20:00Z',
      externalUrl: 'https://instagram.com/p/example4',
      hashtags: ['#lattemakeup', '#макияж', '#бьютитренд'],
      platform: 'instagram'
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1604106314724-d3e77444c2b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      caption: 'Минималистичный #nailart, который подойдет для любого случая #маникюр #минимализм',
      likes: 3400,
      comments: 520,
      timestamp: '2025-05-15T12:10:00Z',
      externalUrl: 'https://instagram.com/p/example5',
      hashtags: ['#nailart', '#маникюр', '#минимализм'],
      platform: 'instagram'
    }
  ]);

  const popularHashtags = [
    '#lattemakeup',
    '#nailart',
    '#утренняярутина',
    '#интерьер2025',
    '#саморазвитие',
    '#продуктивность'
  ];

  useEffect(() => {
    // This would be where you fetch data from an API based on filters
    const fetchTrendingPosts = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch data based on filters
        // For now, we'll just filter the existing data
        let filteredPosts = [...trendingPosts];
        
        // Filter by hashtag if selected
        const hashtagToFilter = selectedHashtag || customHashtag;
        if (hashtagToFilter) {
          filteredPosts = filteredPosts.filter(post => 
            post.hashtags.some(tag => tag.toLowerCase().includes(hashtagToFilter.toLowerCase())) ||
            post.caption.toLowerCase().includes(hashtagToFilter.toLowerCase())
          );
        }
        
        // Filter by time period
        const now = new Date();
        const timeLimit = timePeriod === '24h' 
          ? new Date(now.getTime() - 24 * 60 * 60 * 1000) 
          : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        filteredPosts = filteredPosts.filter(post => new Date(post.timestamp) > timeLimit);
        
        // Sort posts
        if (sortBy === 'likes') {
          filteredPosts.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === 'engagement') {
          filteredPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
        }
        
        // Filter by tab
        if (activeTab === 'recent') {
          filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        
        setTrendingPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, [selectedHashtag, customHashtag, timePeriod, sortBy, activeTab]);

  const handleSearch = () => {
    setCustomHashtag(searchQuery);
    setSelectedHashtag('');
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Тренды</h1>

      {/* Фильтры */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Поиск хештега */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Хештег или тема
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введите хештег или тему..."
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[#2D46B9]"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Выбор периода */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Период
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimePeriod('24h')}
                className={`flex items-center px-4 py-3 rounded-lg border ${
                  timePeriod === '24h'
                    ? 'bg-[#2D46B9] text-white border-[#2D46B9]'
                    : 'border-gray-300 text-gray-700 hover:border-[#2D46B9]'
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                Последние 24 часа
              </button>
              <button
                onClick={() => setTimePeriod('7d')}
                className={`flex items-center px-4 py-3 rounded-lg border ${
                  timePeriod === '7d'
                    ? 'bg-[#2D46B9] text-white border-[#2D46B9]'
                    : 'border-gray-300 text-gray-700 hover:border-[#2D46B9]'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Последние 7 дней
              </button>
            </div>
          </div>

          {/* Сортировка */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сортировка
            </label>
            <div className="flex">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
              >
                <option value="likes">По популярности</option>
                <option value="growth">По приросту</option>
                <option value="engagement">По вовлеченности</option>
              </select>
              <button
                onClick={handleRefresh}
                className="ml-2 p-3 text-gray-600 hover:text-[#2D46B9] border border-gray-300 rounded-lg hover:border-[#2D46B9]"
                disabled={loading}
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Популярные хештеги */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Популярные хештеги
          </label>
          <div className="flex flex-wrap gap-2">
            {popularHashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedHashtag(tag);
                  setCustomHashtag('');
                  setSearchQuery('');
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedHashtag === tag
                    ? 'bg-[#2D46B9] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Переключатель типа контента */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('top')}
            className={`px-6 py-3 rounded-lg flex items-center ${
              activeTab === 'top'
                ? 'bg-[#2D46B9] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D46B9]'
            } transition-colors`}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            ТОП за {timePeriod === '24h' ? '24 часа' : '7 дней'}
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-6 py-3 rounded-lg flex items-center ${
              activeTab === 'recent'
                ? 'bg-[#2D46B9] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D46B9]'
            } transition-colors`}
          >
            <Clock className="h-5 w-5 mr-2" />
            Новое
          </button>
        </div>
      </div>

      {/* Трендовый контент */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-[#2D46B9] animate-spin" />
            <span className="ml-3 text-gray-600">Загрузка трендов...</span>
          </div>
        ) : trendingPosts.length > 0 ? (
          trendingPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Превью изображения */}
                <div className="md:w-1/4">
                  {post.imageUrl ? (
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={post.imageUrl} 
                        alt="Превью поста" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.platform === 'instagram' ? 'bg-pink-100 text-pink-800' : 'bg-black text-white'
                    }`}>
                      {post.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                    </span>
                  </div>
                </div>
                
                {/* Контент и метрики */}
                <div className="md:w-3/4">
                  <div className="mb-3">
                    <p className="text-gray-900 mb-2 line-clamp-3">{post.caption}</p>
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
                    <p className="text-sm text-gray-500">
                      {formatDate(post.timestamp)}
                    </p>
                  </div>
                  
                  {/* Метрики */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Heart className="h-4 w-4 mr-1 text-pink-500" />
                        Лайки
                      </div>
                      <div className="text-lg font-semibold">{post.likes.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <MessageSquare className="h-4 w-4 mr-1 text-blue-500" />
                        Комментарии
                      </div>
                      <div className="text-lg font-semibold">{post.comments.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <BarChart2 className="h-4 w-4 mr-1 text-[#2D46B9]" />
                        Вовлеченность
                      </div>
                      <div className="text-lg font-semibold">
                        {((post.likes + post.comments) / (post.likes * 0.01)).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Кнопка подробнее */}
                  <div className="flex justify-end">
                    <a 
                      href={post.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors"
                    >
                      Подробнее
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Тренды не найдены</h3>
              <p className="text-gray-500 mt-2">
                Попробуйте изменить параметры поиска или выбрать другой хештег
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;