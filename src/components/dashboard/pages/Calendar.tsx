import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Instagram, Facebook, Twitter, Linkedin as LinkedIn, Youtube, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isEqual, parseISO } from 'date-fns';
import ru from 'date-fns/locale/ru';

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform_id: string;
  scheduled_for: string;
  status: 'draft' | 'scheduled' | 'published';
  content_type: 'post' | 'story' | 'reel' | 'video';
}

interface Platform {
  id: string;
  name: string;
  icon: string;
}

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  linkedin: <LinkedIn className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  telegram: <Send className="h-4 w-4" />,
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  useEffect(() => {
    loadPlatforms();
    loadScheduledPosts();
  }, [currentDate]);

  const loadPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('social_platforms')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error loading platforms:', error);
    }
  };

  const loadScheduledPosts = async () => {
    try {
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);

      const { data, error } = await supabase
        .from('generated_posts')
        .select(`
          id,
          title,
          content,
          platform_id,
          scheduled_for,
          status,
          content_type
        `)
        .gte('scheduled_for', startDate.toISOString())
        .lte('scheduled_for', endDate.toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      setScheduledPosts(data || []);
    } catch (error) {
      console.error('Error loading scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowScheduleModal(true);
  };

  const handleSchedulePost = async (post: ScheduledPost) => {
    try {
      const { error } = await supabase
        .from('generated_posts')
        .update({ status: 'scheduled' })
        .eq('id', post.id);

      if (error) throw error;
      
      await loadScheduledPosts();
      setShowScheduleModal(false);
    } catch (error) {
      console.error('Error scheduling post:', error);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => 
      isEqual(parseISO(post.scheduled_for), date)
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Календарь публикаций</h1>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center bg-[#2D46B9] text-white px-4 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Запланировать пост
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Календарь */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'LLLL yyyy', { locale: ru })}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Сегодня
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {days.map((day, dayIdx) => {
              const posts = getPostsForDate(day);
              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDateClick(day)}
                  className={`
                    bg-white p-2 h-32 cursor-pointer hover:bg-gray-50 transition-colors
                    ${!isSameMonth(day, currentDate) && 'text-gray-400'}
                    ${isToday(day) && 'bg-blue-50'}
                  `}
                >
                  <time
                    dateTime={format(day, 'yyyy-MM-dd')}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm
                      ${isToday(day) && 'bg-[#2D46B9] text-white'}
                    `}
                  >
                    {format(day, 'd')}
                  </time>
                  <div className="mt-1">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="mb-1 px-2 py-1 text-xs rounded-md bg-[#F1F4FF] text-[#2D46B9] truncate"
                      >
                        {post.title || 'Без названия'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Список запланированных постов */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Clock className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Запланировано</h2>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => {
                const platform = platforms.find(p => p.id === post.platform_id);
                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {platform && platformIcons[platform.icon.toLowerCase()]}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {platform?.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(parseISO(post.scheduled_for), 'dd.MM.yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2 line-clamp-2">{post.title || post.content}</p>
                    <div className="flex items-center">
                      {post.status === 'scheduled' ? (
                        <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Запланировано
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Черновик
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                Нет запланированных постов
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;