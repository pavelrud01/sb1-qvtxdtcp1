import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, CreditCard } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface UserProfile {
  full_name: string;
  email: string;
}

const Settings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Настройки</h1>

      <div className="space-y-6">
        {/* Профиль */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Профиль</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={profile?.full_name || ''}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Bell className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Уведомления</h2>
          </div>

          <div className="space-y-4">
            {['Email-уведомления', 'Push-уведомления', 'Уведомления в браузере'].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2D46B9]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D46B9]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Безопасность */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Безопасность</h2>
          </div>

          <button className="w-full px-4 py-2 text-[#2D46B9] border border-[#2D46B9] rounded-lg hover:bg-[#2D46B9]/5 transition-colors mb-4">
            Изменить пароль
          </button>

          <button className="w-full px-4 py-2 text-[#2D46B9] border border-[#2D46B9] rounded-lg hover:bg-[#2D46B9]/5 transition-colors">
            Двухфакторная аутентификация
          </button>
        </div>

        {/* Тариф */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-[#2D46B9] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Тариф и оплата</h2>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Текущий тариф</span>
              <span className="text-[#2D46B9] font-medium">Профессиональный</span>
            </div>
            <div className="text-sm text-gray-500">
              Следующее списание 15 мая 2025
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors">
            Изменить тариф
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;