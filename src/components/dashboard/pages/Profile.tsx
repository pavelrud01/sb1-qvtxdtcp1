import React, { useEffect, useState } from 'react';
import { UserCircle2, Building2, Users, Target, MessageSquare, ArrowRight, Edit2, ChevronDown, Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Link } from 'react-router-dom';

interface QuestionnaireData {
  business_info: string;
  competitors: string;
  target_audience: string;
  business_goals: string[];
  brand_tone: string;
}

interface Project {
  id: string;
  name: string;
  created_at: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<QuestionnaireData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [brandSettings, setBrandSettings] = useState({
    tone: 'Профессиональный',
    style: 'Информативный',
    messages: ['', '', ''],
    forbiddenTopics: '',
  });

  useEffect(() => {
    loadProjects();
    loadQuestionnaireData();
  }, [selectedProject]);

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

  const loadQuestionnaireData = async () => {
    if (!selectedProject) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      const { data: questionnaireData, error } = await supabase
        .from('user_questionnaire')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', selectedProject.id)
        .maybeSingle();

      if (error) throw error;
      setData(questionnaireData);
    } catch (error) {
      console.error('Error loading questionnaire data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSettingChange = (field: string, value: string | string[]) => {
    setBrandSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const sections = [
    {
      icon: <Building2 className="h-6 w-6 text-[#2D46B9]" />,
      title: 'О бизнесе',
      content: data?.business_info || '',
    },
    {
      icon: <Target className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Конкуренты',
      content: data?.competitors || '',
    },
    {
      icon: <Users className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Целевая аудитория',
      content: data?.target_audience || '',
    },
    {
      icon: <Target className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Бизнес цели',
      content: data?.business_goals ? (
        Array.isArray(data.business_goals) 
          ? data.business_goals.join(', ')
          : data.business_goals
      ) : '',
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-[#2D46B9]" />,
      title: 'Тональность бренда',
      content: data?.brand_tone || '',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowProjectMenu(!showProjectMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{selectedProject?.name || 'Выберите проект'}</span>
              <ChevronDown size={20} />
            </button>

            {showProjectMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
          <h1 className="text-2xl font-semibold text-gray-900">Профиль бизнеса</h1>
        </div>
        <Link
          to="/questionnaire"
          className="inline-flex items-center px-4 py-2 text-sm text-[#2D46B9] hover:bg-[#F1F4FF] rounded-lg transition-colors"
        >
          Изменить
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

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

      <div className="space-y-6">
        {!data && selectedProject ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <UserCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Профиль проекта не заполнен
              </h2>
              <p className="text-gray-600 mb-6">
                Пожалуйста, заполните анкету, чтобы мы могли лучше понять ваш бизнес и предложить персонализированные решения.
              </p>
              <Link
                to="/questionnaire"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#2D46B9] text-white rounded-lg hover:bg-[#2D46B9]/90 transition-colors"
              >
                Заполнить анкету
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Основная информация */}
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  {section.icon}
                  <h2 className="text-lg font-semibold text-gray-900 ml-2">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Настройки бренда */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-[#2D46B9] mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Настройки бренда</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тон коммуникации
                    </label>
                    <select
                      value={brandSettings.tone}
                      onChange={(e) => handleBrandSettingChange('tone', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    >
                      <option>Профессиональный</option>
                      <option>Дружелюбный</option>
                      <option>Неформальный</option>
                      <option>Экспертный</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Стиль письма
                    </label>
                    <select
                      value={brandSettings.style}
                      onChange={(e) => handleBrandSettingChange('style', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                    >
                      <option>Информативный</option>
                      <option>Развлекательный</option>
                      <option>Образовательный</option>
                      <option>Мотивирующий</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ключевые сообщения
                  </label>
                  <div className="space-y-3">
                    {brandSettings.messages.map((message, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => {
                            const newMessages = [...brandSettings.messages];
                            newMessages[index] = e.target.value;
                            handleBrandSettingChange('messages', newMessages);
                          }}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                          placeholder={`Ключевое сообщение ${index + 1}`}
                        />
                        <button className="ml-2 p-2 text-gray-400 hover:text-[#2D46B9]">
                          <Edit2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Запрещённые темы и слова
                  </label>
                  <textarea
                    value={brandSettings.forbiddenTopics}
                    onChange={(e) => handleBrandSettingChange('forbiddenTopics', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent h-24"
                    placeholder="Введите темы и слова, которые не следует использовать"
                  />
                </div>

                <div className="flex justify-end">
                  <button className="bg-[#2D46B9] text-white px-6 py-2 rounded-lg hover:bg-[#2D46B9]/90 transition-colors">
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;