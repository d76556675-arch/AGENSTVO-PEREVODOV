import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Clock, 
  Users, 
  Award,
  Zap,
  MapPin
} from 'lucide-react';
import { SupportedLang, TRANSLATIONS } from '../i18n/translations';

interface HeroProps {
  onOpenOnlineForm: () => void;
  onOpenOfflineBooking: () => void;
  onSearchOrder: (orderId: string) => void;
  lang: SupportedLang;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenOnlineForm,
  onOpenOfflineBooking,
  onSearchOrder,
  lang,
}) => {
  const [quickOrderId, setQuickOrderId] = useState('');
  const t = TRANSLATIONS[lang];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickOrderId.trim()) {
      onSearchOrder(quickOrderId.trim());
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Main Pitch */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t.heroPill}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] font-serif">
              {t.heroTitle1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-300">
                {t.heroTitleHighlight}
              </span>
              <br />{t.heroTitle2}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Two Main Dual Pathways (Online vs Offline) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Pathway 1: Online Form */}
              <div 
                onClick={onOpenOnlineForm}
                className="group relative p-5 rounded-2xl bg-gradient-to-br from-indigo-600/90 to-blue-700/80 border border-indigo-400/40 hover:border-indigo-300 shadow-xl shadow-indigo-950/40 cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="absolute top-3 right-3 text-[11px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Zap className="w-3 h-3 fill-slate-950" />
                  Скидка -10%
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3 backdrop-blur-xs">
                  <FileText className="w-5 h-5 text-indigo-200" />
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-200 transition-colors flex items-center gap-2">
                  {t.onlineCardTitle}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-indigo-100/90 mt-1.5 leading-relaxed">
                  {t.onlineCardDesc}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-indigo-200 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {t.onlineCardTime}
                </div>
              </div>

              {/* Pathway 2: Offline Office Appointment */}
              <div 
                onClick={onOpenOfflineBooking}
                className="group relative p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 shadow-xl shadow-slate-950/40 cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                  {t.offlineCardTitle}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {t.offlineCardDesc}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {t.offlineCardPlace}
                </div>
              </div>
            </div>

            {/* Quick Order Tracker Bar */}
            <div className="pt-2">
              <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={quickOrderId}
                    onChange={(e) => setQuickOrderId(e.target.value)}
                    placeholder={t.quickSearchPlaceholder}
                    className="w-full bg-transparent px-2.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  {t.checkStatusBtn}
                </button>
              </form>
            </div>

            {/* Key benefits bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.benefitSworn}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.benefitLegal}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.benefitCourier}</span>
              </div>
            </div>

          </div>

          {/* Right Interactive Card / Agency Credentials */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-md">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-lg">
                    Д
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Бюро переводов «ДИВА»</h4>
                    <p className="text-xs text-slate-400">г. Новосибирск, ул. Станиславского 2/3</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    ★ 4.98
                  </span>
                  <span className="text-[10px] text-slate-400">2ГИС • Яндекс</span>
                </div>
              </div>

              {/* Agency Highlights */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-100 block">Нотариальное заверение в офисе 314</span>
                    <span className="text-slate-400 block mt-0.5">
                      Сотрудничество с аккредитованными нотариусами Новосибирска без задержек.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-100 block">Срочный перевод день в день</span>
                    <span className="text-slate-400 block mt-0.5">
                      Стандартный паспорт или водительские права переводим за 45-60 минут.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-100 block">100% принятие ведомствами</span>
                    <span className="text-slate-400 block mt-0.5">
                      МВД, ГУВМ, суды, банки, вузы (НГУ, НГТУ) и консульства зарубежных стран.
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-800 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">120+</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">Языков</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-indigo-400">14 лет</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">В Сибири</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-400">35 000+</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">Переводов</div>
                </div>
              </div>

              {/* Live Chat Bot Teaser inside card */}
              <div className="mt-5 p-3.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-bold text-white block">ИИ-консультант «ДиваБот»</span>
                    <span className="text-indigo-200 text-[11px]">Консультирует по ценам и апостилю</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Онлайн
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
