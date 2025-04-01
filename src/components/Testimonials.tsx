import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Анна Иванова",
      role: "Маркетинг-менеджер",
      company: "ТехСтарт",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
      content: "ContentAI преобразил нашу стратегию в социальных сетях. Мы экономим часы каждую неделю и видим лучшую вовлечённость."
    },
    {
      name: "Михаил Петров",
      role: "Директор по соцсетям",
      company: "Рост Медиа",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150",
      content: "ИИ-генерируемый контент невероятно аутентичен и идеально резонирует с нашей аудиторией. Это настоящий прорыв!"
    },
    {
      name: "Елена Смирнова",
      role: "Контент-создатель",
      company: "Креатив Студио",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150",
      content: "Сначала я скептически относилась к ИИ-контенту, но качество и последовательность полностью убедили меня."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Нас любят маркетинговые команды по всему миру
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Узнайте, что говорят наши клиенты о своём опыте
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;