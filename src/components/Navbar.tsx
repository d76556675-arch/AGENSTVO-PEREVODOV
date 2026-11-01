import React, { useState } from 'react';
import { 
  Globe2, 
  PhoneCall, 
  FileText, 
  Building2, 
  Search, 
  Bot, 
  Menu, 
  X, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Languages
} from 'lucide-react';
import { SupportedLang, TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  onOpenOnlineForm: () => void;
  onOpenOfflineBooking: (branchId?: string) => void;
  onOpenTracker: () => void;
  onOpenChat: () => void;
  unreadChatCount: number;
  lang: SupportedLang;
  onToggleLang: (lang: SupportedLang) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOnlineForm,
  onOpenOfflineBooking,
  onOpenTracker,
  onOpenChat,
  unreadChatCount,
  lang,
  onToggleLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Прием заказов онлайн и выдача в офисах 24/7
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Лицензия № 77-04/189 • Сертификат ISO 17100
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-amber-400" />
              Срочный перевод от 45 минут
            </span>
            <button 
              onClick={onOpenTracker}
              className="text-amber-300 hover:text-white transition-colors flex items-center gap-1 font-semibold underline decoration-dotted underline-offset-4"
            >
              <Search className="w-3 h-3" />
              Отследить статус заказа
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform font-bold text-xl">
              Д
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-serif">
                  ДИВА
                </span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-sm border border-amber-300">
                  БЮРО ПЕРЕВОДОВ
                </span>
              </div>
              <p className="text-[11px] text-slate-700 tracking-wide font-medium">
                г. Новосибирск, ул. Станиславского, д. 2/3, оф. 314
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <button 
              onClick={() => scrollTo('services')} 
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {t.navServices}
            </button>
            <button 
              onClick={() => scrollTo('online-form')} 
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              {t.navOnline}
            </button>
            <button 
              onClick={() => scrollTo('offline-booking')} 
              className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Building2 className="w-4 h-4 text-amber-500" />
              {t.navOffline}
            </button>
            <button 
              onClick={() => scrollTo('calculator')} 
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {t.navCalc}
            </button>
            <button 
              onClick={() => scrollTo('offices')} 
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {t.navOffice}
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher (RU / EN) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => onToggleLang('ru')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  lang === 'ru'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Русский язык"
              >
                <span>🇷🇺</span>
                <span>RU</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="English language"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* Phone */}
            <a 
              href="tel:+79537751997" 
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors text-right"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-slate-900 leading-tight">
                  +7 953 775 19 97
                </span>
                <span className="block text-[10px] text-emerald-600 font-medium">
                  {t.cityLabel}
                </span>
              </div>
            </a>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-all border border-slate-200"
              title={t.chatConsultant}
            >
              <Bot className="w-5 h-5 text-indigo-600" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* Main Action Button */}
            <button
              onClick={onOpenOnlineForm}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {t.calcOnlineBtn}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenChat}
              className="relative p-2 rounded-lg bg-indigo-50 text-indigo-600"
            >
              <Bot className="w-5 h-5" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenOnlineForm(); }}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
            >
              <FileText className="w-4 h-4" />
              {t.navOnline}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenOfflineBooking(); }}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              {t.navOffline}
            </button>
          </div>

          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2 bg-slate-100 rounded-xl text-xs font-bold">
            <span className="text-slate-600">Язык / Language:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onToggleLang('ru')}
                className={`px-3 py-1 rounded-lg ${lang === 'ru' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              >
                🇷🇺 RU
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`px-3 py-1 rounded-lg ${lang === 'en' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700 border-t border-slate-100 pt-3">
            <button onClick={() => scrollTo('services')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-50">
              Услуги и тарифы
            </button>
            <button onClick={() => scrollTo('calculator')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-50">
              Калькулятор стоимости
            </button>
            <button onClick={() => scrollTo('offices')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-50">
              Офис в Новосибирске (ул. Станиславского 2/3)
            </button>
            <button onClick={() => scrollTo('faq')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-50">
              Частые вопросы (FAQ)
            </button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }} className="text-left py-2 px-3 rounded-lg bg-amber-50 text-amber-900 font-semibold flex items-center justify-between">
              <span>Отследить статус заказа</span>
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <a href="tel:+79537751997" className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              +7 953 775 19 97
            </a>
            <span className="text-xs text-slate-700 font-medium">Новосибирск</span>
          </div>
        </div>
      )}
    </header>
  );
};
