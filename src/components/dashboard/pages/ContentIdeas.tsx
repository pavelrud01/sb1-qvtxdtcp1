import React, { useState } from 'react';
import { Search, BookOpen, TrendingUp, Calendar, Lightbulb, ChevronRight } from 'lucide-react';

const ContentIdeas = () => {
  const [prompt, setPrompt] = useState('');

  const handleGenerateIdeas = () => {
    // Здесь будет логика генерации идей
    console.log('Generating ideas for:', prompt);
  };

  const ideaCategories = [
    {
      icon: <BookOpen className="h-6 w-6 text-[#2D46B9]" />,
      title: 'База готовых шаблонов по нишам',
      description: 'Используйте проверенные шаблоны для вашей ниши'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Анализ трендов в нише',
      description: 'Узнайте, что сейчас популярно в вашей нише'
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Предложение тем на основе инфоповодов',
      description: 'Актуальные темы и новости в вашей сфере'
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Календарь событий и праздников',
      description: 'Планируйте контент с учетом важных дат'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Генерация идей на основе успешных постов',
      description: 'Вдохновляйтесь лучшими примерами в вашей нише'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Идеи контента</h1>

      {/* Поле ввода */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Поиск идей для контента
          </h2>
          <p className="text-gray-600">
            Опишите, какие идеи вы ищете, и мы поможем вам найти вдохновение
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Например: идеи для постов о здоровом питании..."
            className="w-full px-4 py-3 pr-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
          />
          <button
            onClick={handleGenerateIdeas}
            disabled={!prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Категории идей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideaCategories.map((category, index) => (
          <button
            key={index}
            className="p-6 bg-white rounded-xl border border-gray-200 text-left hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#F1F4FF] rounded-lg">
                {category.icon}
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#2D46B9]" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentIdeas;