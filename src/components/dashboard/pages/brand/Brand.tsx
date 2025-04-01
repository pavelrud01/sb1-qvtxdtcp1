import React, { useEffect, useState } from 'react';
import { Building2, Palette, MessageSquare, ArrowRight } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { Link } from 'react-router-dom';

interface BrandData {
  business_info: string;
  business_sphere: string;
  brand_tone: string;
  brand_description: string;
}

const Brand = () => {
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<BrandData | null>(null);

  useEffect(() => {
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
        .maybeSingle();

      if (error) throw error;

      // Transform the data to match our interface
      if (data) {
        const transformedData: BrandData = {
          business_info: data.business_info || '',
          business_sphere: data.business_sphere || '',
          brand_tone: data.brand_tone || '',
          brand_description: data.brand_description || ''
        };
        setBrandData(transformedData);
      }
    } catch (error) {
      console.error('Error loading brand data:', error);
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

  if (!brandData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Данные о бренде не заполнены
          </h2>
          <p className="text-gray-600 mb-8">
            Пожалуйста, заполните анкету, чтобы мы могли лучше понять ваш бренд
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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Бренд</h1>

      <div className="space-y-6">
        {/* Основная информация */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Building2 className="h-6 w-6 text-[#2D46B9] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Информация о бренде</h2>
            </div>
            <Link
              to="/questionnaire"
              className="flex items-center px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors"
            >
              Обновить данные
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название бренда
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">
                  {brandData.business_info || 'Не указано'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сфера бренда
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">
                  {brandData.business_sphere || 'Не указано'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание бренда
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {brandData.brand_description || 'Описание не заполнено'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Тон коммуникации */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <MessageSquare className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Тон коммуникации</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Стиль общения
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">
                  {brandData.brand_tone || 'Не указано'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Визуальный стиль */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Palette className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Визуальный стиль</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Основной цвет
              </label>
              <input
                type="color"
                className="w-full h-10 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дополнительный цвет
              </label>
              <input
                type="color"
                className="w-full h-10 rounded-lg border border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;