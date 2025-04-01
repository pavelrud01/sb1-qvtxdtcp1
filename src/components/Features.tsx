import React from 'react';
import { Brain, Calendar, Target, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-[#2D46B9]" />,
      title: "ИИ-генерация контента",
      description: "Создавайте привлекательные публикации, соответствующие голосу вашего бренда, для всех социальных платформ."
    },
    {
      icon: <Calendar className="h-8 w-8 text-[#2D46B9]" />,
      title: "Умное планирование",
      description: "Планируйте публикации на оптимальное время, когда ваша аудитория наиболее активна."
    },
    {
      icon: <Target className="h-8 w-8 text-[#2D46B9]" />,
      title: "Анализ аудитории",
      description: "Получайте глубокое понимание предпочтений вашей аудитории и паттернов вовлечённости."
    },
    {
      icon: <Zap className="h-8 w-8 text-[#2D46B9]" />,
      title: "Мультиплатформенность",
      description: "Создавайте и управляйте контентом для всех основных социальных сетей в одном месте."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Возможности для усиления вашего присутствия в соцсетях
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Всё необходимое для создания, планирования и анализа вашего контента
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white rounded-xl border border-gray-100 hover:border-[#2D46B9]/20 transition-all hover:shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;