import React from 'react';
import { Sparkles, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handlePrivacyClick = () => {
    window.open('https://www.socialrise.ru/privacy', '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-[#2D46B9]" />
              <span className="ml-2 text-xl font-semibold">ContentAI</span>
            </div>
            <p className="text-gray-400">
              Помогаем брендам создавать контент для социальных сетей с помощью искусственного интеллекта.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Продукт</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Возможности</a></li>
              <li><Link to="/cases" className="text-gray-400 hover:text-white transition-colors">Кейсы</Link></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Тарифы</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Компания</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">О нас</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Блог</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Карьера</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Контакты</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Авторизация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Регистрация
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  Вход
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  className="inline-block bg-[#2D46B9] text-white px-4 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
                >
                  Начать бесплатно
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#2D46B9]" />
                <a href="mailto:support@contentai.ru" className="text-gray-400 hover:text-white transition-colors">
                  support@contentai.ru
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-[#2D46B9]" />
                <a href="tel:+78001234567" className="text-gray-400 hover:text-white transition-colors">
                  8 (800) 123-45-67
                </a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-end space-y-4 md:space-y-0 md:space-x-6">
              <button 
                onClick={handlePrivacyClick}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Политика конфиденциальности
              </button>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Условия использования</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Политика cookies</a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 ContentAI. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;