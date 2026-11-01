import React, { useState } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  UserCheck, 
  Download, 
  AlertCircle 
} from 'lucide-react';
import { TranslationOrder } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: TranslationOrder[];
  initialSearchId?: string;
}

const STATUS_STEPS = [
  { key: 'received', title: '1. Заказ принят', desc: 'Документы зарегистрированы, назначен лингвист' },
  { key: 'in_progress', title: '2. Перевод в работе', desc: 'Лингвист выполняет перевод с глоссарием' },
  { key: 'proofreading', title: '3. Вычитка редактором', desc: 'Проверка терминологии и верстки носителем' },
  { key: 'notarization', title: '4. Нотариат / Апостиль', desc: 'Удостоверение подписи у нотариуса' },
  { key: 'ready', title: '5. Готов к выдаче', desc: 'Финальный пакет готов к отправке / забору' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialSearchId,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchId || '');
  const [activeOrder, setActiveOrder] = useState<TranslationOrder | null>(() => {
    if (initialSearchId) {
      return orders.find((o) => o.id.toLowerCase() === initialSearchId.toLowerCase()) || orders[0] || null;
    }
    return orders[0] || null;
  });

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) => o.id.toLowerCase() === q || o.clientPhone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );
    if (found) {
      setActiveOrder(found);
    } else {
      alert(`Заказ с номером "${searchQuery}" не найден. Попробуйте один из демонстрационных номеров: ${orders.slice(0, 3).map((o) => o.id).join(', ')}`);
    }
  };

  const getStepIndex = (status: TranslationOrder['status']) => {
    switch (status) {
      case 'received': return 0;
      case 'in_progress': return 1;
      case 'proofreading': return 2;
      case 'notarization': return 3;
      case 'ready':
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Проверка статуса заказа</h3>
              <p className="text-xs text-slate-700">Отслеживание этапов перевода и готовности</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 text-lg font-bold p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введите номер заказа (напр. LX-10482) или телефон"
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Найти
          </button>
        </form>

        {/* Quick chip demo orders */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-700">Быстрый выбор заказа:</span>
          {orders.slice(0, 4).map((ord) => (
            <button
              key={ord.id}
              onClick={() => { setActiveOrder(ord); setSearchQuery(ord.id); }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                activeOrder?.id === ord.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {ord.id} ({ord.sourceLang.toUpperCase()}→{ord.targetLang.toUpperCase()})
            </button>
          ))}
        </div>

        {/* Order Details & Progress Timeline */}
        {activeOrder ? (
          <div className="space-y-6 pt-2">
            
            {/* Summary banner */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">
                  Заказ {activeOrder.id}
                </span>
                <h4 className="font-bold text-base text-white mt-0.5">{activeOrder.docTitle}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Заявитель: {activeOrder.clientName} • {activeOrder.clientPhone}
                </p>
              </div>
              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                <span className="text-[10px] text-slate-400 block">Ориентир готовности:</span>
                <span className="text-sm font-bold text-emerald-400">{activeOrder.estimatedCompletion}</span>
                <span className="block text-xs text-slate-300 mt-0.5">{activeOrder.totalCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            {/* Stepper Visualizer */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Этапы выполнения перевода:
              </span>
              <div className="space-y-3">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div
                      key={step.key}
                      className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-50/80 border-indigo-400 ring-1 ring-indigo-400/20 shadow-xs'
                          : isDone
                          ? 'bg-white border-slate-200 text-slate-700'
                          : 'bg-slate-50 border-slate-200/60 opacity-60 text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isCurrent ? 'text-indigo-950' : 'text-slate-800'}`}>
                            {step.title}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                              Сейчас в работе
                            </span>
                          )}
                          {isDone && (
                            <span className="text-[10px] text-emerald-600 font-bold">Выполнено ✓</span>
                          )}
                        </div>
                        <p className="text-slate-700 mt-0.5 text-[11px]">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Specialist & File info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Ответственный эксперт: <strong className="text-slate-900">{activeOrder.assignedSpecialist || 'Старший лингвист бюро'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Прикреплено документов: <strong className="text-slate-900">{activeOrder.files.length} шт.</strong> ({activeOrder.files.map((f) => f.name).join(', ')})
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 text-slate-700 text-xs">
            Заказ не выбран. Пожалуйста, введите номер заказа в поле поиска выше.
          </div>
        )}

      </div>
    </div>
  );
};
