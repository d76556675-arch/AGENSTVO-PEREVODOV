import React from 'react';
import { 
  FileText, 
  Scale, 
  Stamp, 
  Stethoscope, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Languages 
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/agencyData';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
  onBookOffice: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onBookOffice,
}) => {
  return (
    <section id="services" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Комплексные лингвистические услуги в Новосибирске
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mt-3">
              Услуги бюро переводов «ДИВА»
            </h2>
            <p className="mt-2 text-slate-700 text-sm sm:text-base leading-relaxed">
              Все виды переводов выполняются дипломированными лингвистами, проверяются профильными редакторами и официально заверяются у нотариуса.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBookOffice}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              Очный прием в офисе
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.map((serv) => (
            <div
              key={serv.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-indigo-400/80 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {serv.id === 'documents' && <FileText className="w-6 h-6" />}
                    {serv.id === 'legal' && <Scale className="w-6 h-6" />}
                    {serv.id === 'apostille' && <Stamp className="w-6 h-6" />}
                    {serv.id === 'medical' && <Stethoscope className="w-6 h-6" />}
                    {serv.id === 'technical' && <Cpu className="w-6 h-6" />}
                    {serv.id === 'notary' && <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {serv.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {serv.title}
                </h3>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {serv.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">{serv.priceText}</span>
                  <span className="text-[11px] text-slate-700 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {serv.timeline}
                  </span>
                </div>
                <button
                  onClick={() => onSelectService(serv.id)}
                  className="px-3 py-2 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  Заказать
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guaranteed Quality Strip */}
        <div className="mt-12 p-6 rounded-3xl bg-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">Нужен редкий язык или синхронный переводчик на конференцию?</h4>
              <p className="text-xs text-indigo-200 mt-0.5">
                Работаем с хинди, фарси, корейским, сербским, арабским и еще 100+ языками мира.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectService('oral')}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md active:scale-95"
          >
            Получить индивидуальный расчет
          </button>
        </div>

      </div>
    </section>
  );
};
