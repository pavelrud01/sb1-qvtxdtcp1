import React, { useState, useEffect } from 'react';
import { Target, Plus, ArrowRight, Link as LinkIcon, Trash2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { Link } from 'react-router-dom';

interface CompetitorData {
  competitors: {
    link1: string;
    link2: string;
    link3: string;
    description: string;
  };
}

const Competitors = () => {
  const [loading, setLoading] = useState(true);
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);

  useEffect(() => {
    loadCompetitorData();
  }, []);

  const loadCompetitorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('user_questionnaire')
        .select('competitors')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Parse the competitors data if it's a string
      if (data && typeof data.competitors === 'string') {
        try {
          data.competitors = JSON.parse(data.competitors);
        } catch (e) {
          console.error('Error parsing competitors data:', e);
        }
      }
      
      setCompetitorData(data);
    } catch (error) {
      console.error('Error loading competitor data:', error);
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

  if (!competitorData?.competitors) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Данные о конкурентах не заполнены
          </h2>
          <p className="text-gray-600 mb-8">
            Пожалуйста, заполните анкету, чтобы добавить информацию о конкурентах
          </p>
          <Link
            to="/questionnaire"
            className="inline-flex items-center px-6 py-3 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
          >
            Заполнить анкету
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  const competitors = [
    { id: 1, name: 'Конкурент 1', url: competitorData.competitors.link1 },
    { id: 2, name: 'Конкурент 2', url: competitorData.competitors.link2 },
    { id: 3, name: 'Конкурент 3', url: competitorData.competitors.link3 }
  ].filter(competitor => competitor.url);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Конкуренты</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Анализ конкурентов</h2>
          </div>
          <Link
            to="/questionnaire"
            className="flex items-center px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Обновить данные
          </Link>
        </div>

        <div className="space-y-4">
          {competitors.map((competitor) => (
            <div
              key={competitor.id}
              className="p-6 border border-gray-200 rounded-lg hover:border-[#2D46B9] transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название компании
                  </label>
                  <input
                    type="text"
                    value={competitor.name}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сайт
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={competitor.url}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
                    />
                    <a
                      href={competitor.url.startsWith('http') ? competitor.url : `https://${competitor.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 p-2 text-gray-400 hover:text-[#2D46B9] transition-colors"
                    >
                      <LinkIcon size={20} />
                    </a>
                    <button className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {competitors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Нет добавленных конкурентов
            </div>
          )}

          <button
            onClick={() => {/* Add competitor logic */}}
            className="w-full mt-4 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#2D46B9] hover:text-[#2D46B9] transition-all flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добавить конкурента
          </button>
        </div>

        {competitorData.competitors.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Описание конкурентов
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {competitorData.competitors.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Competitors;