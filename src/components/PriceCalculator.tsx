import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Check, 
  Stamp, 
  ShieldCheck 
} from 'lucide-react';
import { LANGUAGES } from '../data/agencyData';

interface PriceCalculatorProps {
  onApplyParams: (params: {
    sourceLang: string;
    targetLang: string;
    pages: number;
    notary: boolean;
    apostille: boolean;
    urgency: 'standard' | 'rush' | 'express';
  }) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onApplyParams }) => {
  const [sourceLang, setSourceLang] = useState('ru');
  const [targetLang, setTargetLang] = useState('en');
  const [pages, setPages] = useState(3);
  const [needNotary, setNeedNotary] = useState(true);
  const [needApostille, setNeedApostille] = useState(false);
  const [urgency, setUrgency] = useState<'standard' | 'rush' | 'express'>('standard');

  const targetLangObj = LANGUAGES.find((l) => l.code === targetLang) || LANGUAGES[1];
  const ratePerPage = targetLangObj.ratePerPage;

  let urgencyMultiplier = 1;
  if (urgency === 'rush') urgencyMultiplier = 1.35;
  if (urgency === 'express') urgencyMultiplier = 1.75;

  const translationTotal = Math.round(pages * ratePerPage * urgencyMultiplier);
  const notaryTotal = needNotary ? 900 : 0;
  const apostilleTotal = needApostille ? 4500 : 0;

  const grossTotal = translationTotal + notaryTotal + apostilleTotal;
  const onlineDiscount = Math.round(grossTotal * 0.1);
  const finalPrice = grossTotal - onlineDiscount;

  let timelineText = '1-2 рабочих дня';
  if (urgency === 'rush') timelineText = 'Сегодня к вечеру (4-8 ч)';
  if (urgency === 'express') timelineText = 'Срочно за 45-90 минут';

  const handleApply = () => {
    onApplyParams({
      sourceLang,
      targetLang,
      pages,
      notary: needNotary,
      apostille: needApostille,
      urgency,
    });
    const el = document.getElementById('online-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
            <Calculator className="w-3.5 h-3.5" />
            Интерактивный экспресс-калькулятор
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Рассчитайте стоимость за 10 секунд
          </h2>
          <p className="mt-2 text-slate-700 text-sm sm:text-base">
            Прозрачные фиксированные тарифы без скрытых коэффициентов и наценок.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="space-y-6">
              
              {/* Languages */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Язык оригинала:</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={`c-src-${l.code}`} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Язык перевода:</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={`c-tgt-${l.code}`} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pages slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Объем документа (страниц по 1800 знаков):
                  </label>
                  <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {pages} {pages === 1 ? 'страница' : pages < 5 ? 'страницы' : 'страниц'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={pages}
                  onChange={(e) => setPages(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-700 mt-1">
                  <span>1 стр. (паспорт)</span>
                  <span>10 стр. (договор)</span>
                  <span>50+ стр. (книга/устав)</span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needNotary}
                    onChange={(e) => setNeedNotary(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Нотариальное заверение</span>
                    <span className="text-[11px] text-slate-700">Официальная подпись нотариуса (+900 ₽)</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={needApostille}
                    onChange={(e) => setNeedApostille(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Штамп «Апостиль»</span>
                    <span className="text-[11px] text-slate-700">Под ключ с госпошлиной (+4 500 ₽)</span>
                  </div>
                </label>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Срочность:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', title: 'Обычная' },
                    { id: 'rush', title: 'Срочно' },
                    { id: 'express', title: 'Экспресс' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as any)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        urgency === u.id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {u.title}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Result Card */}
            <div className="bg-slate-900 text-white p-7 rounded-3xl border border-slate-800 space-y-5 text-left shadow-xl">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Предварительный расчет:</span>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-sm">
                  -10% онлайн
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Тариф за страницу:</span>
                  <span className="font-semibold text-white">{ratePerPage} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Срок выполнения:</span>
                  <span className="font-semibold text-amber-300">{timelineText}</span>
                </div>
                <div className="flex justify-between">
                  <span>Нотариус:</span>
                  <span className="font-semibold text-white">{needNotary ? '900 ₽' : 'Не требуется'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Апостиль:</span>
                  <span className="font-semibold text-white">{needApostille ? '4 500 ₽' : 'Не требуется'}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Итоговая стоимость:</span>
                  <span className="text-3xl font-extrabold text-white">
                    {finalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 text-right mt-0.5 line-through">
                  {grossTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Оформить с этими параметрами</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
