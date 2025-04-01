import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Подключите аккаунты",
      description: "Подключите ваши социальные сети всего за пару кликов"
    },
    {
      number: "02",
      title: "Определите стиль",
      description: "Расскажите о вашем бренде и целевой аудитории"
    },
    {
      number: "03",
      title: "Создавайте контент",
      description: "Позвольте ИИ создавать публикации под ваш бренд"
    },
    {
      number: "04",
      title: "Планируйте и анализируйте",
      description: "Планируйте посты и отслеживайте их эффективность"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F1F4FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Как это работает
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Начните работу за считанные минуты с нашим простым процессом настройки
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-bold text-[#2D46B9]/10 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <CheckCircle2 className="absolute top-6 right-6 h-6 w-6 text-[#2D46B9]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;