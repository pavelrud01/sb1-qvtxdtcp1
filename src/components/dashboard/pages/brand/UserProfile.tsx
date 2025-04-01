import React from 'react';
import { UserCircle2, Mail, Phone, Calendar } from 'lucide-react';

const UserProfile = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Профиль пользователя</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <UserCircle2 className="h-6 w-6 text-[#2D46B9] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Личные данные</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
              placeholder="Ваше имя"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                placeholder="+7 (999) 999-99-99"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата регистрации
            </label>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                value="15.02.2025"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-[#2D46B9] text-white px-6 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;