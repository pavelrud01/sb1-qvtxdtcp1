import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Case {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
}

const PublicCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('is_published', true)
        .order('order', { ascending: true });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Наши кейсы
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Истории успеха наших клиентов и примеры того, как ContentAI помогает бизнесу расти
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((case_) => (
            <div
              key={case_.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {case_.image_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={case_.image_url}
                    alt={case_.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {case_.title}
                </h3>
                <p className="text-gray-600">
                  {case_.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {cases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Кейсы пока не добавлены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicCases;