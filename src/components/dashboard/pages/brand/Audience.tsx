import React, { useEffect, useState } from 'react';
import { Users, Target, BarChart2, ArrowRight } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { Link } from 'react-router-dom';

interface AudienceData {
  target_audience: {
    age_range: {
      min: number;
      max: number;
    };
    geography: string;
    interests: string;
  };
}

const Audience = () => {
  const [loading, setLoading] = useState(true);
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);

  useEffect(() => {
    loadAudienceData();
  }, []);

  const loadAudienceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('user_questionnaire')
        .select('target_audience')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Parse the target_audience data if it's a string
      if (data && typeof data.target_audience === 'string') {
        try {
          data.target_audience = JSON.parse(data.target_audience);
        } catch (e) {
          console.error('Error parsing target_audience data:', e);
        }
      }

      setAudienceData(data);
    } catch (error) {
      console.error('Error loading audience data:', error);
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

  if (!audienceData?.target_audience) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Данные о целевой аудитории не заполнены
          </h2>
          <p className="text-gray-600 mb-8">
            Пожалуйста, заполните анкету, чтобы мы могли лучше понять вашу аудиторию
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Аудитория</h1>

      <div className="space-y-6">
        {/* Целевая аудитория */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-[#2D46B9] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Целевая аудитория</h2>
            </div>
            <Link
              to="/questionnaire"
              className="flex items-center px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors"
            >
              Обновить данные
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Возрастной диапазон
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">От</span>
                    <span className="ml-2 text-lg font-semibold text-gray-900">
                      {audienceData.target_audience.age_range?.min || '-'} лет
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">До</span>
                    <span className="ml-2 text-lg font-semibold text-gray-900">
                      {audienceData.target_audience.age_range?.max || '-'} лет
                    </span>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2D46B9]"
                    style={{
                      width: `${((audienceData.target_audience.age_range?.max - audienceData.target_audience.age_range?.min) / (70 - 18)) * 100}%`,
                      marginLeft: `${((audienceData.target_audience.age_range?.min - 18) / (70 - 18)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                География
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">
                  {audienceData.target_audience.geography || 'Не указано'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Интересы и особенности
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {audienceData.target_audience.interests || 'Не указано'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Боли и потребности */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Target className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Боли и потребности</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Основные проблемы
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent h-24"
                placeholder="Опишите основные проблемы вашей аудитории..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ключевые потребности
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent h-24"
                placeholder="Опишите ключевые потребности вашей аудитории..."
              />
            </div>
          </div>
        </div>

        {/* Интересы */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <BarChart2 className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Интересы</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Основные интересы аудитории
            </label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {audienceData.target_audience.interests || 'Не указано'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audience;