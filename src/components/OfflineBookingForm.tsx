import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Car, 
  Check, 
  Printer, 
  Sparkles, 
  QrCode, 
  FileCheck2, 
  AlertCircle 
} from 'lucide-react';
import { OFFICE_BRANCHES } from '../data/agencyData';
import { OfflineAppointment } from '../types';

interface OfflineBookingFormProps {
  onAppointmentBooked: (appointment: OfflineAppointment) => void;
  selectedBranchId?: string;
}

export const OfflineBookingForm: React.FC<OfflineBookingFormProps> = ({
  onAppointmentBooked,
  selectedBranchId,
}) => {
  const [branchId, setBranchId] = useState(selectedBranchId || 'stanislavskogo');
  const [visitReason, setVisitReason] = useState('apostille_submission');
  
  // Date selection: default to tomorrow or today
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:30');

  // Visitor fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [needPass, setNeedPass] = useState(false);

  // Document checklist ticks
  const [checkedDocs, setCheckedDocs] = useState<string[]>([
    'Паспорт гражданина РФ (для договора и доверенности)',
  ]);

  // Ticket modal
  const [bookedTicket, setBookedTicket] = useState<OfflineAppointment | null>(null);

  const selectedBranch = OFFICE_BRANCHES.find((b) => b.id === branchId) || OFFICE_BRANCHES[0];

  const timeSlots = [
    '09:30', '10:15', '11:00', '11:30', '12:15', '13:00', 
    '14:00', '14:45', '15:30', '16:15', '17:00', '18:00'
  ];

  const visitReasons = [
    { id: 'apostille_submission', title: 'Сдача оригиналов на Апостиль', desc: 'Дипломы, свидетельства ЗАГС под расписку' },
    { id: 'notary_presence', title: 'Нотариальное заверение с присутствием', desc: 'Удостоверение подписи переводчика' },
    { id: 'urgent_translation', title: 'Срочный перевод при вас (30-60 мин)', desc: 'Паспорта, права, справки' },
    { id: 'sworn_consultation', title: 'Консультация эксперта бюро «ДИВА»', desc: 'Оценка пакета документов для ВНЖ/вуза' },
    { id: 'pickup_ready', title: 'Получение готового перевода', desc: 'Забор документов с гербовыми печатями' },
  ];

  const checklistItems = [
    'Паспорт гражданина РФ (для договора)',
    'Оригиналы документов, подлежащих переводу / апостилированию',
    'Образец написания ФИО латиницей (по загранпаспорту)',
    'Доверенность (если сдаете документы за третье лицо)',
  ];

  const toggleChecklist = (item: string) => {
    if (checkedDocs.includes(item)) {
      setCheckedDocs(checkedDocs.filter((d) => d !== item));
    } else {
      setCheckedDocs([...checkedDocs, item]);
    }
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Пожалуйста, укажите имя и телефон для оформления записи и связи.');
      return;
    }

    const ticketNumber = `DIVA-TICK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: OfflineAppointment = {
      id: `APP-${Date.now()}`,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      visitReason: visitReasons.find((r) => r.id === visitReason)?.title || 'Визит в офис',
      clientName,
      clientPhone,
      clientEmail,
      needPass,
      carPlate: carPlate || undefined,
      documentsToBring: checkedDocs,
      createdAt: new Date().toISOString(),
      ticketNumber,
    };

    onAppointmentBooked(newAppointment);
    setBookedTicket(newAppointment);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <section id="offline-booking" className="py-16 sm:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Офлайн-прием в Новосибирске без очередей
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            Запись на личный визит в бюро «ДИВА»
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Забронируйте удобное время для сдачи оригиналов под опись: 
            <strong className="text-white"> г. Новосибирск, ул. Станиславского, д. 2/3, этаж 3, офис 314</strong>. 
            Штатный нотариус на месте.
          </p>
        </div>

        {/* Booking Container */}
        <form onSubmit={handleBookAppointment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Controls Left */}
          <div className="lg:col-span-8 space-y-8 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700/80">
            
            {/* Step 1: Branch Selection */}
            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">1</span>
                Отделение в Новосибирске (ул. Станиславского, д. 2/3, оф. 314)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OFFICE_BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBranchId(b.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      branchId === b.id
                        ? 'bg-indigo-950/90 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                        : 'bg-slate-900/60 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{b.name.replace('Офис ', '')}</span>
                      {branchId === b.id && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="text-[11px] text-slate-300 line-clamp-2 mb-2 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{b.metro}</span>
                    </div>
                    <div className="text-[10px] text-indigo-300 font-medium">
                      {b.hours.split('|')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Purpose of Visit */}
            <div className="border-t border-slate-700 pt-6">
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">2</span>
                Цель очного визита
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {visitReasons.map((vr) => (
                  <button
                    key={vr.id}
                    type="button"
                    onClick={() => setVisitReason(vr.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      visitReason === vr.id
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-xs'
                        : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{vr.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{vr.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Date & Time Slot */}
            <div className="border-t border-slate-700 pt-6">
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">3</span>
                Дата и время визита
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Дата приема:</label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-8">
                  <label className="block text-xs text-slate-400 mb-1 font-semibold">Свободное время:</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedTimeSlot === time
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Visitor details & Pass */}
            <div className="border-t border-slate-700 pt-6">
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">4</span>
                Данные посетителя (для оформления пропуска в БЦ)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">ФИО полностью *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Телефон для SMS-талона *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Email (для копии талона)</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Guest car pass */}
              {selectedBranch.parkingAvailable && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Car className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Нужен гостевой паркинг? Введите госномер авто:</span>
                  </div>
                  <input
                    type="text"
                    value={carPlate}
                    onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
                    placeholder="А 777 АА 777"
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 placeholder-slate-600 uppercase focus:ring-1 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            {/* Checklist of what to bring */}
            <div className="border-t border-slate-700 pt-6">
              <span className="block text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                Памятка: что взять с собой на очный прием
              </span>
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <label
                    key={item}
                    onClick={() => toggleChecklist(item)}
                    className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none"
                  >
                    <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-colors ${
                      checkedDocs.includes(item)
                        ? 'bg-amber-400 border-amber-400 text-slate-950 font-bold'
                        : 'border-slate-600 bg-slate-900'
                    }`}>
                      {checkedDocs.includes(item) && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Selected Branch Card & Submission */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-950 rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-5">
              
              {/* Branch visual */}
              <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-700">
                <img
                  src={selectedBranch.image}
                  alt={selectedBranch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-sm">
                    Выбранный филиал
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">{selectedBranch.name}</h4>
                </div>
              </div>

              {/* Branch info list */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedBranch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{selectedBranch.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Пропуск оформляется автоматически</span>
                </div>
              </div>

              {/* Selected Slot preview */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Дата и время:</span>
                  <span className="font-bold text-white text-sm">{selectedDate} в {selectedTimeSlot}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block text-xs">Без очереди</span>
                  <span className="text-[10px] text-slate-400">Гарантия брони</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Забронировать визит и талон
              </button>

              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                После отправки вы получите электронный талон с QR-кодом для прохода через турникет.
              </p>
            </div>
          </div>

        </form>

      </div>

      {/* Appointment Ticket Modal */}
      {bookedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Электронный талон на визит</h3>
                  <p className="text-xs text-slate-700">Офис «ЛингваЭкспресс» ждет вас</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookedTicket(null)}
                className="text-slate-700 hover:text-slate-900 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* QR Mockup & Ticket Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-700 uppercase font-semibold">Номер талона:</span>
                  <div className="text-xl font-extrabold text-amber-600 tracking-wider">
                    {bookedTicket.ticketNumber}
                  </div>
                </div>
                <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center text-slate-800">
                  <QrCode className="w-12 h-12" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-200 pt-3">
                <div>
                  <span className="text-[10px] text-slate-700 block">Филиал:</span>
                  <strong className="text-slate-900">{bookedTicket.branchName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-700 block">Время приема:</span>
                  <strong className="text-slate-900">{bookedTicket.date} в {bookedTicket.timeSlot}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-700 block">Цель визита:</span>
                  <strong className="text-slate-900">{bookedTicket.visitReason}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-700 block">Посетитель:</span>
                  <strong className="text-slate-900">{bookedTicket.clientName}</strong>
                </div>
              </div>

              {bookedTicket.carPlate && (
                <div className="text-[11px] bg-amber-50 p-2 rounded-lg text-amber-900 font-semibold border border-amber-200">
                  🚗 Заказан въезд на подземный паркинг: {bookedTicket.carPlate}
                </div>
              )}
            </div>

            <div className="text-xs text-slate-700 space-y-1">
              <p>
                ✓ Пропуск заказан на бюро пропусков бизнес-центра. Пожалуйста, предъявите оригинал паспорта на ресепшн.
              </p>
              <p>
                SMS с точным маршрутом отправлена на номер <strong>{bookedTicket.clientPhone}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Печать пропуска
              </button>
              <button
                type="button"
                onClick={() => setBookedTicket(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
