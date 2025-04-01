import React from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                window.scrollTo(0, 0);
              }}
            >
              <Sparkles className="h-8 w-8 text-[#2D46B9]" />
              <span className="ml-2 text-xl font-semibold">ContentAI</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-[#2D46B9] transition-colors">Возможности</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-[#2D46B9] transition-colors">Как это работает</a>
            <Link to="/cases" className="text-gray-600 hover:text-[#2D46B9] transition-colors">Кейсы</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-[#2D46B9] transition-colors">Тарифы</Link>
            <Link to="/login" className="bg-[#2D46B9] text-white px-4 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors">
              Войти
            </Link>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-[#2D46B9]">Возможности</a>
            <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-[#2D46B9]">Как это работает</a>
            <Link to="/cases" className="block px-3 py-2 text-gray-600 hover:text-[#2D46B9]">Кейсы</Link>
            <Link to="/pricing" className="block px-3 py-2 text-gray-600 hover:text-[#2D46B9]">Тарифы</Link>
            <Link to="/login" className="block w-full mt-2 bg-[#2D46B9] text-white px-4 py-2 rounded-lg hover:bg-[#2D46B9]/90 text-center">
              Войти
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;