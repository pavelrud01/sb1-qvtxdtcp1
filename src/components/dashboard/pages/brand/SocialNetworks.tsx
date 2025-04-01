import React from 'react';
import { Instagram, Facebook, Twitter as TwitterIcon, Linkedin, Youtube, Send, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

const SocialNetworks = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Социальные сети</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Подключенные аккаунты</h2>
          <button className="flex items-center px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Добавить аккаунт
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, color: 'bg-pink-500' },
            { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, color: 'bg-blue-600' },
            { name: 'Twitter', icon: <TwitterIcon className="h-5 w-5" />, color: 'bg-blue-400' },
            { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, color: 'bg-blue-700' },
            { name: 'YouTube', icon: <Youtube className="h-5 w-5" />, color: 'bg-red-600' },
            { name: 'Telegram', icon: <Send className="h-5 w-5" />, color: 'bg-blue-500' },
          ].map((platform, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#2D46B9] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 ${platform.color} rounded-lg text-white`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{platform.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      <span>Не подключено</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors">
                    Подключить
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#F1F4FF] rounded-lg">
          <p className="text-sm text-gray-600">
            Подключите ваши социальные сети для автоматической публикации контента и аналитики
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialNetworks;