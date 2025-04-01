import React from 'react';
import { ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-[#F1F4FF] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Создавайте контент с помощью
            <span className="text-[#2D46B9]"> магии ИИ</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Генерируйте контент для социальных сетей на месяцы вперёд за считанные минуты. Наш ИИ понимает голос вашего бренда и создаёт публикации, которые находят отклик у вашей аудитории.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={handleGetStarted}
              className="bg-[#2D46B9] text-white px-8 py-4 rounded-lg hover:bg-[#2D46B9]/90 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Начать создавать
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-[#2D46B9] text-[#2D46B9] px-8 py-4 rounded-lg hover:bg-[#F1F4FF] transition-all">
              Смотреть демо
            </button>
          </div>
          <div className="flex justify-center items-center gap-6 text-gray-400">
            <Instagram className="h-6 w-6" />
            <Facebook className="h-6 w-6" />
            <Twitter className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;