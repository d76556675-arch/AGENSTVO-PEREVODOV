import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  PhoneCall, 
  Mail, 
  Car, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { OFFICE_BRANCHES } from '../data/agencyData';
import { GoogleOfficeMap } from './GoogleOfficeMap';
import { SupportedLang, TRANSLATIONS } from '../i18n/translations';

interface OfficesSectionProps {
  onBookBranch: (branchId: string) => void;
  lang?: SupportedLang;
}

export const OfficesSection: React.FC<OfficesSectionProps> = ({ onBookBranch, lang = 'ru' }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section id="offices" className="py-16 sm:py-24 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold mb-3 border border-slate-300">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            {lang === 'ru' ? 'г. Новосибирск • Ленинский район' : 'Novosibirsk • Leninsky District'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            {lang === 'ru' ? 'Офис бюро переводов «ДИВА» и интерактивная карта' : 'DIVA Bureau Office & Interactive Map'}
          </h2>
          <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            {lang === 'ru' 
              ? 'Ждем вас по адресу: г. Новосибирск, ул. Станиславского, д. 2/3, этаж 3, офис 314. Прием документов, проставление апостиля и нотариальное удостоверение у дежурного нотариуса.'
              : 'Visit us at: Novosibirsk, 2/3 Stanislavskogo St., 3rd floor, Office 314. Document submission, apostille, and notary on site.'}
          </p>
        </div>

        {/* Interactive Google Map Embedded */}
        <div className="mb-12">
          <GoogleOfficeMap onBookAppointment={() => onBookBranch('stanislavskogo')} />
        </div>

        {/* Office cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OFFICE_BRANCHES.map((office) => (
            <div
              key={office.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={office.image}
                    alt={office.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  {office.id === 'moscow-city' && (
                    <div className="absolute top-3 right-3 text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-md animate-pulse">
                      Круглосуточно 24/7
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-lg text-white leading-snug">{office.name}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 text-xs">
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {office.tagline}
                  </p>

                  <div className="space-y-2.5 text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-indigo-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      <span>{office.metro}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{office.hours}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                      <a href={`tel:${office.phone.replace(/\D/g, '')}`} className="font-bold text-slate-900 hover:text-indigo-600">
                        {office.phone}
                      </a>
                    </div>
                  </div>

                  {/* Feature tags */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {office.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => onBookBranch(office.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Записаться в этот офис</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Note on parking and safety */}
        <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700 gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>
              <strong>Как нас найти:</strong> г. Новосибирск, ул. Станиславского, д. 2/3 (здание БЦ), 3 этаж, офис 314. 
              Вход свободный, просторная парковка у здания.
            </span>
          </div>
          <span className="text-emerald-700 font-bold whitespace-nowrap bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Офис 314 • Ждем вас!
          </span>
        </div>

      </div>
    </section>
  );
};
