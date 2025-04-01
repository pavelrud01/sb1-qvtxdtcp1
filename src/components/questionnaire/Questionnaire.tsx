import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import QuestionnaireProgress from './QuestionnaireProgress';

interface Question {
  id: number;
  title: string;
  description: string;
  options?: string[];
  type: 'select' | 'text' | 'textarea' | 'multi-select' | 'complex';
  subQuestions?: {
    id: string;
    title: string;
    type: 'select' | 'text' | 'textarea' | 'file' | 'multi-select' | 'range';
    options?: string[];
    placeholder?: string;
    min?: number;
    max?: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    title: 'Основные данные о бизнесе',
    description: 'Ответьте на несколько вопросов, чтобы мы подобрали персонализированную структуру контента именно для вашего бизнеса',
    type: 'text',
  },
  {
    id: 2,
    title: 'Сфера вашего бизнеса',
    description: 'Выберите сферу, в которой работает ваш бизнес',
    options: [
      'Мода и красота',
      'Здоровье и фитнес',
      'Онлайн-образование',
      'Маркетинг',
      'Туризм и путешествия',
      'Развлечения'
    ],
    type: 'select',
  },
  {
    id: 3,
    title: 'Какова ваша главная цель в соцсетях?',
    description: 'Выберите одну или несколько целей',
    options: [
      'Узнаваемость бренда',
      'Привлечение лидов и заявок',
      'Рост продаж/трафика на сайт',
      'Вовлечённость, активное комьюнити',
      'Другое'
    ],
    type: 'multi-select',
  },
  {
    id: 4,
    title: 'Целевая аудитория',
    description: 'Расскажите подробнее о вашей целевой аудитории',
    type: 'complex',
    subQuestions: [
      {
        id: 'age_range',
        title: 'Возрастной диапазон',
        type: 'range',
        min: 18,
        max: 70
      },
      {
        id: 'geography',
        title: 'География',
        type: 'text',
        placeholder: 'Укажите страну или город вашей целевой аудитории'
      },
      {
        id: 'interests',
        title: 'Интересы',
        type: 'textarea',
        placeholder: 'Чем увлекаются, что хотят от ваших услуг/товаров'
      }
    ]
  },
  {
    id: 5,
    title: 'Конкуренты',
    description: 'Укажите информацию о ваших конкурентах',
    type: 'complex',
    subQuestions: [
      {
        id: 'link1',
        title: 'Ссылка на конкурента 1',
        type: 'text',
        placeholder: 'https://'
      },
      {
        id: 'link2',
        title: 'Ссылка на конкурента 2',
        type: 'text',
        placeholder: 'https://'
      },
      {
        id: 'link3',
        title: 'Ссылка на конкурента 3',
        type: 'text',
        placeholder: 'https://'
      },
      {
        id: 'description',
        title: 'Описание конкурентов',
        type: 'textarea',
        placeholder: 'Опишите ваших конкурентов'
      }
    ]
  },
  {
    id: 6,
    title: 'Как вы хотите позиционировать свой бренд? (Tone of Voice)',
    description: 'Выберите стиль коммуникации, который лучше всего отражает характер вашего бренда',
    type: 'select',
    options: [
      'Дружелюбный и неформальный',
      'Экспертный и профессиональный',
      'Юмористический/Игровой',
      'Минималистичный и строгий',
      'Смелый/Провокационный'
    ]
  },
  {
    id: 7,
    title: 'Ценности и описание бренда',
    description: 'Расскажите подробнее о вашем бренде, его задачах и ценностях',
    type: 'textarea'
  }
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [customAnswer, setCustomAnswer] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [showCustomField, setShowCustomField] = useState(false);
  const [complexAnswers, setComplexAnswers] = useState<Record<string, string>>({});
  const [ageRange, setAgeRange] = useState({ min: 18, max: 70 });

  const handleNext = async () => {
    let answer: any;
    
    if (currentQuestion === 0) {
      answer = brandName;
    } else if (questions[currentQuestion].type === 'complex') {
      answer = complexAnswers;
    } else if (questions[currentQuestion].type === 'multi-select') {
      answer = selectedOptions;
    } else if (questions[currentQuestion].type === 'select') {
      answer = showCustomField ? customAnswer : selectedOptions[0];
    } else {
      answer = customAnswer;
    }

    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
    
    if (currentQuestion === questions.length - 1) {
      await saveAnswers();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setCustomAnswer('');
      setSelectedOptions([]);
      setShowCustomField(false);
      setComplexAnswers({});
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[questions[currentQuestion - 1].id];
      if (currentQuestion - 1 === 0) {
        setBrandName(prevAnswer || '');
      } else if (questions[currentQuestion - 1].type === 'complex') {
        setComplexAnswers(prevAnswer || {});
      } else if (typeof prevAnswer === 'string') {
        setCustomAnswer(prevAnswer);
        setSelectedOptions([]);
      } else if (Array.isArray(prevAnswer)) {
        setSelectedOptions(prevAnswer);
        setCustomAnswer('');
      }
      setShowCustomField(false);
    }
  };

  const saveAnswers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Get the current project_id if it exists
      const { data: existingData } = await supabase
        .from('user_questionnaire')
        .select('project_id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Prepare the competitors data
      const competitorsData = {
        link1: complexAnswers.link1 || '',
        link2: complexAnswers.link2 || '',
        link3: complexAnswers.link3 || '',
        description: complexAnswers.description || ''
      };

      // Prepare the data for upsert
      const questionnaireData = {
        user_id: user.id,
        business_info: answers[1], // Brand name
        business_sphere: answers[2], // Business sphere
        business_goals: answers[3], // Social media goals
        target_audience: {
          age_range: ageRange,
          geography: complexAnswers.geography || '',
          interests: complexAnswers.interests || ''
        },
        competitors: competitorsData, // Use the prepared competitors data
        brand_tone: answers[6],
        brand_description: answers[7],
        updated_at: new Date().toISOString()
      };

      // If there's an existing project_id, include it in the upsert
      if (existingData?.project_id) {
        questionnaireData.project_id = existingData.project_id;
      }

      // Use upsert to either update existing record or create new one
      const { error: questionnaireError } = await supabase
        .from('user_questionnaire')
        .upsert(questionnaireData, {
          onConflict: 'user_id'
        });

      if (questionnaireError) throw questionnaireError;

      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: user.user_metadata.full_name,
          email: user.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      alert('Произошла ошибка при сохранении ответов');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (questions[currentQuestion].type === 'multi-select') {
      setSelectedOptions(prev => 
        prev.includes(option)
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
      if (option === 'Другое') {
        setShowCustomField(!selectedOptions.includes('Другое'));
      }
    } else {
      if (option === 'Другое') {
        setShowCustomField(true);
        setSelectedOptions([option]);
      } else {
        setSelectedOptions([option]);
        setShowCustomField(false);
      }
      setCustomAnswer('');
    }
  };

  const handleComplexAnswerChange = (id: string, value: string) => {
    setComplexAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const renderAgeRangeSlider = () => {
    return (
      <div className="space-y-4">
        <div className="relative pt-6 pb-2">
          {/* Track background */}
          <div className="h-2 bg-gray-200 rounded-full">
            {/* Active track */}
            <div
              className="absolute h-2 bg-[#2D46B9] rounded-full"
              style={{
                left: `${((ageRange.min - 18) / (70 - 18)) * 100}%`,
                width: `${((ageRange.max - ageRange.min) / (70 - 18)) * 100}%`
              }}
            />
          </div>

          {/* Min handle */}
          <div
            className="absolute w-6 h-6 bg-white border-2 border-[#2D46B9] rounded-full -mt-2 transform -translate-x-1/2 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
            style={{ left: `${((ageRange.min - 18) / (70 - 18)) * 100}%` }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startMin = ageRange.min;
              
              const handleMouseMove = (e: MouseEvent) => {
                const dx = e.clientX - startX;
                const range = 70 - 18;
                const newMin = Math.max(18, Math.min(ageRange.max - 1, startMin + Math.round(dx / (window.innerWidth * 0.8) * range)));
                setAgeRange(prev => ({ ...prev, min: newMin }));
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
              {ageRange.min}
            </span>
          </div>

          {/* Max handle */}
          <div
            className="absolute w-6 h-6 bg-white border-2 border-[#2D46B9] rounded-full -mt-2 transform -translate-x-1/2 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
            style={{ left: `${((ageRange.max - 18) / (70 - 18)) * 100}%` }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startMax = ageRange.max;
              
              const handleMouseMove = (e: MouseEvent) => {
                const dx = e.clientX - startX;
                const range = 70 - 18;
                const newMax = Math.max(ageRange.min + 1, Math.min(70, startMax + Math.round(dx / (window.innerWidth * 0.8) * range)));
                setAgeRange(prev => ({ ...prev, max: newMax }));
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
              {ageRange.max}
            </span>
          </div>
        </div>

        {/* Age labels */}
        <div className="flex justify-between text-sm text-gray-500 mt-8">
          <span>18 лет</span>
          <span>70 лет</span>
        </div>
      </div>
    );
  };

  const question = questions[currentQuestion];

  const renderQuestion = () => {
    if (currentQuestion === 0) {
      return (
        <div>
          <div className="bg-[#F1F4FF] p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {question.title}
            </h2>
            <p className="text-gray-600">
              {question.description}
            </p>
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-900 mb-2">
              Название бренда
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Введите название вашего бренда"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
            />
          </div>
        </div>
      );
    }

    if (question.type === 'complex') {
      return (
        <div className="space-y-6">
          {question.subQuestions?.map((subQuestion) => (
            <div key={subQuestion.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {subQuestion.title}
              </label>
              {subQuestion.type === 'range' ? (
                renderAgeRangeSlider()
              ) : subQuestion.type === 'text' ? (
                <input
                  type="text"
                  value={complexAnswers[subQuestion.id] || ''}
                  onChange={(e) => handleComplexAnswerChange(subQuestion.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                  placeholder={subQuestion.placeholder}
                />
              ) : (
                <textarea
                  value={complexAnswers[subQuestion.id] || ''}
                  onChange={(e) => handleComplexAnswerChange(subQuestion.id, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
                  placeholder={subQuestion.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    if (question.options) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {question.options.filter(option => option !== 'Другое').map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 text-left rounded-lg border ${
                  question.type === 'multi-select'
                    ? selectedOptions.includes(option)
                      ? 'border-[#2D46B9] bg-[#F1F4FF]'
                      : 'border-gray-200 hover:border-[#2D46B9]'
                    : selectedOptions[0] === option
                      ? 'border-[#2D46B9] bg-[#F1F4FF]'
                      : 'border-gray-200 hover:border-[#2D46B9]'
                } transition-colors`}
              >
                {option}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={customAnswer}
            onChange={(e) => setCustomAnswer(e.target.value)}
            placeholder="Напишите ваш вариант"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
          />
        </div>
      );
    }

    return (
      <textarea
        value={customAnswer}
        onChange={(e) => setCustomAnswer(e.target.value)}
        rows={5}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D46B9] focus:border-transparent"
        placeholder="Введите ваш ответ..."
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F4FF] to-white pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuestionnaireProgress currentStep={currentQuestion + 1} totalSteps={7} />
        
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          {currentQuestion > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {question.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {question.description}
              </p>
            </>
          )}

          {renderQuestion()}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="text-gray-600 hover:text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад
            </button>
            <button
              onClick={handleNext}
              disabled={loading || (!customAnswer && selectedOptions.length === 0 && !brandName && Object.keys(complexAnswers).length === 0)}
              className="bg-[#2D46B9] text-white px-8 py-3 rounded-lg hover:bg-[#2D46B9]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? (
                loading ? 'Сохранение...' : 'Завершить'
              ) : (
                'Далее'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;