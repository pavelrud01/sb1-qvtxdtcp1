import React, { useState, useEffect } from 'react';
import { BarChart2, Target, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { Link } from 'react-router-dom';

interface ContentStrategyData {
  business_goals: string[];
}

const ContentStrategy = () => {
  const [loading, setLoading] = useState(true);
  const [strategyData, setStrategyData] = useState<ContentStrategyData | null>(null);

  useEffect(() => {
    loadStrategyData();
  }, []);

  const loadStrategyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('user_questionnaire')
        .select('business_goals')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Parse the business_goals data if it's a string
      if (data && typeof data.business_goals === 'string') {
        try {
          data.business_goals = JSON.parse(data.business_goals);
        } catch (e) {
          console.error('Error parsing business_goals data:', e);
        }
      }

      setStrategyData(data);
    } catch (error) {
      console.error('Error loading strategy data:', error);
    } finally {
      setLoading(false);
    }
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

  if (!strategyData?.business_goals) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Данные о целях контента не заполнены
          </h2>
          <p className="text-gray-600 mb-8">
            Пожалуйста, заполните анкету, чтобы определить цели вашего контента
          </p>
          <Link
            to="/questionnaire"
            className="inline-flex items-center px-6 py-3 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
          >
            <span>Заполнить анкету</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Контент стратегия</h1>

      <div className="space-y-6">
        {/* Цели */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-[#2D46B9] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Цели контент-маркетинга</h2>
            </div>
            <Link
              to="/questionnaire"
              className="flex items-center px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors"
            >
              Обновить цели
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цели контента
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {strategyData.business_goals.map((goal, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-[#2D46B9] rounded-full mr-3"></div>
                      <span className="text-gray-900">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Типы контента */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart2 className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Типы контента</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Основные форматы
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent" multiple>
                <option>Текстовые посты</option>
                <option>Видео</option>
                <option>Истории</option>
                <option>Карусели</option>
                <option>Прямые эфиры</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Приоритетные темы
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent h-32"
                placeholder="Перечислите основные темы..."
              />
            </div>
          </div>
        </div>

        {/* Частота публикаций */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Calendar className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Частота публикаций</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Публикаций в день
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                placeholder="Количество"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Лучшее время
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дни недели
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent" multiple>
                <option>Понедельник</option>
                <option>Вторник</option>
                <option>Среда</option>
                <option>Четверг</option>
                <option>Пятница</option>
                <option>Суббота</option>
                <option>Воскресенье</option>
              </select>
            </div>
          </div>
        </div>

        {/* Тон и стиль */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <MessageSquare className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Тон и стиль</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Стиль коммуникации
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent">
                <option>Формальный</option>
                <option>Дружелюбный</option>
                <option>Экспертный</option>
                <option>Развлекательный</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Особенности стиля
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent h-24"
                placeholder="Опишите особенности стиля коммуникации..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStrategy;