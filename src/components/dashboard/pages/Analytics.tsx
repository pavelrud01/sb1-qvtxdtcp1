import React from 'react';
import { TrendingUp, Users, MessageSquare, BarChart3, Activity } from 'lucide-react';

const Analytics = () => {
  const stats = [
    {
      label: 'Охват',
      value: '12.5K',
      change: '+14%',
      icon: <Users className="h-5 w-5 text-[#2D46B9]" />,
    },
    {
      label: 'Вовлечённость',
      value: '4.2K',
      change: '+7%',
      icon: <MessageSquare className="h-5 w-5 text-[#2D46B9]" />,
    },
    {
      label: 'Рост',
      value: '2.1K',
      change: '+21%',
      icon: <BarChart3 className="h-5 w-5 text-[#2D46B9]" />,
    },
    {
      label: 'Активность',
      value: '8.7K',
      change: '+12%',
      icon: <Activity className="h-5 w-5 text-[#2D46B9]" />,
    },
    {
      label: 'Подписчики',
      value: '25.3K',
      change: '+18%',
      icon: <TrendingUp className="h-5 w-5 text-[#2D46B9]" />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Аналитика</h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200"
          >
            <div className="flex items-center mb-2">
              <div className="p-2 bg-[#F1F4FF] rounded-lg mr-3">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {stat.change} за последние 30 дней
            </div>
          </div>
        ))}
      </div>

      {/* Здесь будут добавлены графики и более детальная аналитика */}
    </div>
  );
};

export default Analytics;