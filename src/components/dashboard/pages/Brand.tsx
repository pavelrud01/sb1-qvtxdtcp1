import React from 'react';
import { Palette, Edit2 } from 'lucide-react';

const Brand = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Настройки бренда</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Palette className="h-6 w-6 text-[#2D46B9] mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Голос бренда</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тон коммуникации
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent">
                <option>Профессиональный</option>
                <option>Дружелюбный</option>
                <option>Неформальный</option>
                <option>Экспертный</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Стиль письма
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent">
                <option>Информативный</option>
                <option>Развлекательный</option>
                <option>Образовательный</option>
                <option>Мотивирующий</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ключевые сообщения
            </label>
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    placeholder={`Ключевое сообщение ${index}`}
                  />
                  <button className="ml-2 p-2 text-gray-400 hover:text-[#2D46B9]">
                    <Edit2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Запрещённые темы и слова
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent h-24"
              placeholder="Введите темы и слова, которые не следует использовать"
            />
          </div>

          <div className="flex justify-end">
            <button className="bg-[#2D46B9] text-white px-6 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;