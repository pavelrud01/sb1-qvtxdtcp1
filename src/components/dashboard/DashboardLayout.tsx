import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Calendar, 
  Settings,
  LogOut,
  BookOpen,
  UserCircle2,
  ChevronDown,
  Plus,
  Sparkles,
  Video,
  FileText,
  Search,
  X,
  BarChart3,
  Building2,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Project {
  id: string;
  name: string;
  created_at: string;
}

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [contentType, setContentType] = useState<'video' | 'post' | null>(null);
  const [postType, setPostType] = useState<'text' | 'text-image' | null>(null);
  const [contentPrompt, setContentPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [expandedMenuItems, setExpandedMenuItems] = useState<string[]>([]);

  // Состояния для параметров контента
  const [selectedContentType, setSelectedContentType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedClientProfile, setSelectedClientProfile] = useState('');
  const [selectedWritingStyle, setSelectedWritingStyle] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Главная' },
    { path: '/dashboard/analytics', icon: <BarChart3 size={20} />, label: 'Аналитика' },
    { path: '/dashboard/content-ideas', icon: <Sparkles size={20} />, label: 'Идеи контента' },
    { path: '/dashboard/trends', icon: <TrendingUp size={20} />, label: 'Тренды' },
    { 
      path: '/dashboard/brand',
      icon: <Building2 size={20} />,
      label: 'Ваш бренд',
      subItems: [
        { path: '/dashboard/brand/brand', label: 'Бренд' },
        { path: '/dashboard/brand/competitors', label: 'Конкуренты' },
        { path: '/dashboard/brand/audience', label: 'Аудитория' },
        { path: '/dashboard/brand/strategy', label: 'Контент стратегия' },
        { path: '/dashboard/brand/social', label: 'Социальные сети' },
      ]
    },
    { path: '/dashboard/calendar', icon: <Calendar size={20} />, label: 'Календарь' },
    { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Настройки' },
    ...(isAdmin ? [{ path: '/dashboard/cases', icon: <BookOpen size={20} />, label: 'Кейсы' }] : []),
  ];

  useEffect(() => {
    checkAdminStatus();
    loadProjects();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAdmin(user?.email === 'admin@example.com');
  };

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setProjects(projectsData || []);
      if (projectsData && projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const createNewProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data: newProject, error } = await supabase
        .from('projects')
        .insert([
          {
            name: newProjectName,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setProjects([...projects, newProject]);
      setSelectedProject(newProject);
      setNewProjectName('');
      setShowNewProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleFindIdea = () => {
    // Здесь будет логика поиска идей
    console.log('Finding ideas for:', contentPrompt);
  };

  const handleCreateContent = () => {
    // Здесь будет логика создания контента
    console.log('Creating content:', {
      type: contentType,
      postType,
      prompt: contentPrompt,
      imagePrompt,
      contentType: selectedContentType,
      product: selectedProduct,
      clientProfile: selectedClientProfile,
      writingStyle: selectedWritingStyle,
      additionalInfo
    });
    setShowContentModal(false);
    resetContentForm();
  };

  const resetContentForm = () => {
    setContentType(null);
    setPostType(null);
    setContentPrompt('');
    setImagePrompt('');
    setSelectedContentType('');
    setSelectedProduct('');
    setSelectedClientProfile('');
    setSelectedWritingStyle('');
    setAdditionalInfo('');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleMenuItem = (path: string) => {
    setExpandedMenuItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const isMenuItemActive = (path: string) => {
    if (path === '/dashboard/brand') {
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Боковое меню */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">ContentAI</h1>
            
            {/* Селектор проектов */}
            <div className="space-y-2">
              <div className="relative">
                <button
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium truncate">
                    {selectedProject?.name || 'Выберите проект'}
                  </span>
                  <ChevronDown size={20} />
                </button>

                {showProjectMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      {projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project);
                            setShowProjectMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                            selectedProject?.id === project.id ? 'bg-gray-50' : ''
                          }`}
                        >
                          {project.name}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setShowProjectMenu(false);
                          setShowNewProjectModal(true);
                        }}
                        className="w-full px-4 py-2 text-left text-[#2D46B9] hover:bg-gray-50 flex items-center"
                      >
                        <Plus size={20} className="mr-2" />
                        Создать новый проект
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Кнопка создания контента */}
              <button
                onClick={() => setShowContentModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
              >
                <Sparkles size={20} className="mr-2" />
                Создать контент
              </button>
            </div>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  {item.subItems ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMenuItem(item.path)}
                        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm ${
                          isMenuItemActive(item.path)
                            ? 'bg-[#2D46B9] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            expandedMenuItems.includes(item.path) ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {expandedMenuItems.includes(item.path) && (
                        <ul className="pl-10 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                className={`block px-4 py-2 rounded-lg text-sm ${
                                  location.pathname === subItem.path
                                    ? 'bg-[#2D46B9] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm ${
                        isMenuItemActive(item.path)
                          ? 'bg-[#2D46B9] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LogOut size={20} />
              <span className="ml-3">Выйти</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Модальное окно создания нового проекта */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Создание нового проекта</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Название проекта"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={createNewProject}
                disabled={!newProjectName.trim()}
                className="px-4 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors disabled:opacity-50"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания контента */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-center w-full">
                {contentType === 'video' ? 'Создание сценария ролика' : 
                 contentType === 'post' ? 'Создать пост' : 'Создать контент'}
              </h2>
              <button
                onClick={() => {
                  setShowContentModal(false);
                  resetContentForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {!contentType ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setContentType('post')}
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all text-center"
                >
                  <FileText size={32} className="mx-auto mb-2 text-[#2D46B9]" />
                  <span className="font-medium">Пост</span>
                  <p className="text-sm text-gray-600 mt-2">Блог, социальные сети</p>
                </button>
                <button
                  onClick={() => setContentType('video')}
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all text-center"
                >
                  <Video size={32} className="mx-auto mb-2 text-[#2D46B9]" />
                  <span className="font-medium">Видео контент</span>
                  <p className="text-sm text-gray-600 mt-2">Reels, Stories</p>
                </button>
              </div>
            ) : contentType === 'post' && !postType ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPostType('text')}
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all text-center"
                >
                  <FileText size={32} className="mx-auto mb-2 text-[#2D46B9]" />
                  <span className="font-medium">Текст</span>
                  <p className="text-sm text-gray-600 mt-2">Только текстовый контент</p>
                </button>
                <button
                  onClick={() => setPostType('text-image')}
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#2D46B9] hover:bg-[#F1F4FF] transition-all text-center"
                >
                  <FileText size={32} className="mx-auto mb-2 text-[#2D46B9]" />
                  <span className="font-medium">Текст + Изображение</span>
                  <p className="text-sm text-gray-600 mt-2">Текст с изображением</p>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Поле ввода с кнопкой поиска идей */}
                <div className="relative">
                  <input
                    type="text"
                    value={contentPrompt}
                    onChange={(e) => setContentPrompt(e.target.value)}
                    placeholder="Опишите, какой контент вы хотите создать..."
                    className="w-full px-4 py-3 pr-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                  />
                  <button
                    onClick={handleFindIdea}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
                  >
                    Найти идею
                  </button>
                </div>

                {postType === 'text-image' && (
                  <div className="relative">
                    <input
                      type="text"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Что хотите увидеть на изображении?"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    />
                  </div>
                )}

                {/* Параметры контента */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Выберите тип контента
                    </label>
                    <select
                      value={selectedContentType}
                      onChange={(e) => setSelectedContentType(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    >
                      <option value="">Выберите тип</option>
                      <option value="vk">Пост для VK</option>
                      <option value="instagram">Пост для Instagram</option>
                      <option value="telegram">Пост для Telegram</option>
                      <option value="facebook">Пост для Facebook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Выберите продукт
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    >
                      <option value="">Выберите продукт</option>
                      <option value="product1">Продукт 1</option>
                      <option value="product2">Продукт 2</option>
                      <option value="product3">Продукт 3</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Выберите профиль клиента
                    </label>
                    <select
                      value={selectedClientProfile}
                      onChange={(e) => setSelectedClientProfile(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    >
                      <option value="">Выберите профиль</option>
                      <option value="profile1">Профиль 1</option>
                      <option value="profile2">Профиль 2</option>
                      <option value="profile3">Профиль 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Выберите стиль письма
                    </label>
                    <select
                      value={selectedWritingStyle}
                      onChange={(e) => setSelectedWritingStyle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    >
                      <option value="">Выберите стиль</option>
                      <option value="formal">Формальный</option>
                      <option value="casual">Неформальный</option>
                      <option value="friendly">Дружелюбный</option>
                    </select>
                  </div>
                </div>

                {/* Дополнительная информация */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Есть ли дополнительная информация?
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Введите дополнительную информацию..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                  />
                </div>

                {/* Кнопки управления */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      if (postType) {
                        setPostType(null);
                      } else {
                        setContentType(null);
                      }
                      setContentPrompt('');
                      setImagePrompt('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={handleCreateContent}
                    disabled={!contentPrompt.trim()}
                    className="px-6 py-2 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors disabled:opacity-50"
                  >
                    Создать контент
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Основной контент */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;