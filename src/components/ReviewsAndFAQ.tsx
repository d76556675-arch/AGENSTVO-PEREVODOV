import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Star, 
  Quote, 
  ShieldCheck, 
  CheckCircle2, 
  Building 
} from 'lucide-react';
import { FAQ_LIST } from '../data/agencyData';

const CLIENT_REVIEWS = [
  {
    id: 1,
    author: 'Константин Васильев',
    role: 'Юрист международной практики, LegalCorp',
    text: 'Переводили пакет корпоративных договоров на 85 страниц с английского и немецкого для закрытия сделки. Сделали за 2 дня с вычиткой носителем. Юридическая терминология безупречна, ни одной неточности.',
    rating: 5,
    tag: 'Юридический перевод',
  },
  {
    id: 2,
    author: 'Мария Селезнева',
    role: 'Поступление в магистратуру (Мюнхен, TUM)',
    text: 'Нужен был срочный перевод диплома с приложением и школьного аттестата с нотариальным заверением и апостилем. Записалась в офис на Тверской через сайт, всё сделали без задержек. Вуз в Германии принял без замечаний!',
    rating: 5,
    tag: 'Апостиль и нотариат',
  },
  {
    id: 3,
    author: 'Артем Дронов',
    role: 'Руководитель отдела закупок, МедТехПром',
    text: 'Регулярно заказываем через онлайн-форму перевод инструкций к медицинскому диагностическому оборудованию с китайского языка. Скорость феноменальная, верстка 1-в-1 с оригиналами схем.',
    rating: 5,
    tag: 'Технический перевод',
  },
];

export const ReviewsAndFAQ: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Reviews Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Отзывы клиентов
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mt-3">
              Нам доверяют частные лица и корпорации
            </h2>
            <p className="mt-2 text-slate-700 text-sm sm:text-base">
              Более 45 000 переведенных документов и 99.8% положительных оценок на независимых платформах.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENT_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold bg-white text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    «{rev.text}»
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <div className="font-bold text-xs text-slate-900">{rev.author}</div>
                  <div className="text-[11px] text-slate-700">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Corporate Clients Logo Bar */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>
                <strong>Корпоративным клиентам:</strong> Работаем по договору с НДС и без НДС, постоплата до 30 дней, выделенный персональный менеджер.
              </span>
            </div>
            <a
              href="mailto:b2b@lingua-express.ru"
              className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shrink-0 text-xs"
            >
              Запросить типовой договор
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-200">
              <HelpCircle className="w-3.5 h-3.5" />
              Ответы на популярные вопросы
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
              Часто задаваемые вопросы
            </h3>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-sm text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-700 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
