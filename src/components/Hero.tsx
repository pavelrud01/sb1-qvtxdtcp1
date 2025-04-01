import { ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F1F4FF] to-white overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2D46B9]/5 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-[#2D46B9]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Анимированный заголовок */}
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
                Создавайте контент
                <br />
                с помощью{' '}
                <span className="relative">
                  <span className="relative z-10 text-[#2D46B9]">
                    искусственного интеллекта
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#2D46B9]/20 transform -skew-x-12" />
                </span>
              </h1>
            </div>

            {/* Подзаголовок */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Генерируйте уникальный контент для социальных сетей на месяцы вперёд за считанные минуты. 
              Наш ИИ понимает голос вашего бренда и создаёт публикации, которые находят отклик у вашей аудитории.
            </p>

            {/* Кнопки действия */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button
                onClick={handleGetStarted}
                className="group bg-[#2D46B9] text-white px-8 py-4 rounded-xl hover:bg-[#2D46B9]/90 transition-all transform hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <span className="text-lg font-medium">Начать бесплатно</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-[#2D46B9] text-[#2D46B9] hover:bg-[#F1F4FF] transition-all transform hover:scale-105 flex items-center justify-center">
                <span className="text-lg font-medium">Смотреть демо</span>
              </button>
            </div>

            {/* Статистика */}
            <div className="flex justify-center items-center gap-12 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2D46B9] mb-1">50K+</div>
                <div className="text-gray-600">Постов создано</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2D46B9] mb-1">1000+</div>
                <div className="text-gray-600">Активных брендов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2D46B9] mb-1">98%</div>
                <div className="text-gray-600">Довольных клиентов</div>
              </div>
            </div>

            {/* Социальные сети */}
            <div className="flex justify-center items-center gap-8">
              <div className="text-gray-400 text-sm">Поддерживаемые платформы:</div>
              <div className="flex gap-6">
                <Instagram className="h-6 w-6 text-gray-600 hover:text-[#2D46B9] transition-colors cursor-pointer" />
                <Facebook className="h-6 w-6 text-gray-600 hover:text-[#2D46B9] transition-colors cursor-pointer" />
                <Twitter className="h-6 w-6 text-gray-600 hover:text-[#2D46B9] transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;