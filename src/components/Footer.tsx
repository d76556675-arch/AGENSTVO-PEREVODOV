import React from 'react';
import { 
  Globe2, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Search, 
  FileText, 
  Building2 
} from 'lucide-react';
import { SupportedLang, TRANSLATIONS } from '../i18n/translations';

interface FooterProps {
  onOpenOnlineForm: () => void;
  onOpenOfflineBooking: () => void;
  onOpenTracker: () => void;
  onOpenChat: () => void;
  lang?: SupportedLang;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOnlineForm,
  onOpenOfflineBooking,
  onOpenTracker,
  onOpenChat,
  lang = 'ru',
}) => {
  const t = TRANSLATIONS[lang];
  const isEn = lang === 'en';
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                {isEn ? 'D' : 'Д'}
              </div>
              <div>
                <span className="font-extrabold text-2xl text-white font-serif tracking-tight">
                  {t.brandName}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {isEn ? 'Translation Bureau • Novosibirsk' : 'Бюро переводов • г. Новосибирск'}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {isEn 
                ? 'Official certified translation bureau in Novosibirsk. Professional translations in 120+ languages, same-day notarization, apostille via Ministry of Justice, and consular legalization.' 
                : 'Официальное агентство переводов в Новосибирске. Профессиональный перевод на 120+ языков, нотариальное удостоверение день в день, апостиль в Минюсте и консульская легализация.'}
            </p>

            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isEn ? 'Licensed activity • Certified translators' : 'Лицензированная деятельность • Аккредитованные переводчики'}</span>
            </div>
          </div>

          {/* Online & Offline Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              {isEn ? 'Work Formats' : 'Форматы работы'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenOnlineForm}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  {isEn ? 'Online Order (10% off)' : 'Онлайн-заявка (скидка 10%)'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOfflineBooking}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  {isEn ? 'Office Booking (Off. 314)' : 'Запись в офис (оф. 314)'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  {isEn ? 'Track Order Status' : 'Отследить статус заказа'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenChat}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left text-amber-300"
                >
                  💬 {isEn ? 'DivaBot Assistant' : 'Чат-бот ДиваБот'}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              {isEn ? 'Our Services' : 'Услуги бюро'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>{isEn ? 'Passports & certificates' : 'Перевод паспортов и справок'}</li>
              <li>{isEn ? 'Notarization (from 900 ₽)' : 'Нотариальное заверение (900 ₽)'}</li>
              <li>{isEn ? 'Turnkey Apostille (4,500 ₽)' : 'Апостиль под ключ (4 500 ₽)'}</li>
              <li>{isEn ? 'Legal contracts & charters' : 'Юридические договоры и уставы'}</li>
              <li>{isEn ? 'Medical records & tests' : 'Медицинские выписки и анализы'}</li>
              <li>{isEn ? 'Rush translation from 45 min' : 'Срочный перевод от 45 минут'}</li>
            </ul>
          </div>

          {/* Contacts & Branches */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              {isEn ? 'Office Contacts' : 'Контакты офиса'}
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:+79537751997" className="text-white font-bold hover:text-indigo-400">
                  +7 953 775 19 97
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <a href="mailto:info@diva-perevod.ru" className="hover:text-white">
                  info@diva-perevod.ru
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{isEn ? 'Novosibirsk, 2/3 Stanislavskogo St., 3rd fl., Office 314' : 'г. Новосибирск, ул. Станиславского, д. 2/3, 3 этаж, офис 314'}</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{isEn ? 'Mon-Fri 09:00–19:00, Sat 10:00–16:00' : 'Пн-Пт 09:00–19:00, Сб 10:00–16:00'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} {isEn ? 'DIVA Translation Bureau (Novosibirsk, 2/3 Stanislavskogo St., Office 314). All rights reserved.' : 'Бюро Переводов «ДИВА» (г. Новосибирск, ул. Станиславского, д. 2/3, оф. 314). Все права защищены.'}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">{isEn ? 'Privacy Policy' : 'Политика конфиденциальности'}</span>
            <span className="hover:text-slate-400 cursor-pointer">{isEn ? 'NDA Statement' : 'Положение об NDA'}</span>
            <span className="hover:text-slate-400 cursor-pointer">{isEn ? 'Site Map' : 'Карта сайта'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
