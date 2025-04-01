import React from 'react';
import { Check } from 'lucide-react';
import Navigation from '../Navigation';
import Footer from '../Footer';

const PricingPage = () => {
  const plans = [
    {
      name: "Старт",
      price: "2900",
      description: "Идеально для частных лиц и малого бизнеса",
      features: [
        "5 аккаунтов соцсетей",
        "100 ИИ-постов в месяц",
        "Базовая аналитика",
        "Планирование на 7 дней"
      ]
    },
    {
      name: "Профессиональный",
      price: "7900",
      description: "Идеально для растущего бизнеса",
      features: [
        "15 аккаунтов соцсетей",
        "500 ИИ-постов в месяц",
        "Расширенная аналитика",
        "Планирование на 30 дней",
        "Настройка голоса бренда",
        "Приоритетная поддержка"
      ],
      popular: true
    },
    {
      name: "Корпоративный",
      price: "19900",
      description: "Для больших команд и агентств",
      features: [
        "Безлимитные аккаунты",
        "Безлимитные ИИ-посты",
        "Кастомная аналитика",
        "Планирование на 90 дней",
        "Доступ к API",
        "Персональный менеджер"
      ]
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[#F1F4FF] to-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Выберите подходящий тариф
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Начните с бесплатного периода и выберите тариф, который подходит именно вам
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`p-8 bg-white rounded-xl ${
                  plan.popular 
                    ? 'ring-2 ring-[#2D46B9] shadow-lg transform scale-105' 
                    : 'border border-gray-100'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-[#2D46B9] bg-[#F1F4FF] mb-4">
                    Популярный
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}₽</span>
                  <span className="text-gray-600">/месяц</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-[#2D46B9] mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-[#2D46B9] text-white hover:bg-[#2D46B9]/90'
                      : 'border-2 border-[#2D46B9] text-[#2D46B9] hover:bg-[#F1F4FF]'
                  }`}
                >
                  Начать бесплатный период
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Остались вопросы?
            </h2>
            <p className="text-gray-600 mb-6">
              Наша команда поддержки готова помочь вам выбрать оптимальный тариф
            </p>
            <button className="bg-white text-[#2D46B9] px-8 py-3 rounded-lg border-2 border-[#2D46B9] hover:bg-[#F1F4FF] transition-colors">
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;