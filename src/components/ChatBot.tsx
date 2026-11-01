import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  RefreshCw, 
  User, 
  FileText, 
  Building2,
  ChevronDown,
  PhoneCall
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnlineForm: () => void;
  onOpenOfflineBooking: () => void;
  onMessageCountChange?: (count: number) => void;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: 'Здравствуйте! Я **ДиваБот** — официальный консультант бюро переводов «ДИВА» в Новосибирске (ул. Станиславского, д. 2/3, этаж 3, офис 314).\n\nПомогу рассчитать примерную стоимость, подскажу требования к нотариальному заверению и апостилю или отвечу на любые вопросы.\n\n📞 Прямой телефон / WhatsApp бюро: **+7 953 775 19 97**.\n\nЧем я могу вам помочь?',
    timestamp: 'сейчас',
  },
];

const PRESET_QUESTIONS = [
  '📞 Позвонить в бюро: +7 953 775 19 97',
  'Сколько стоит перевод паспорта с нотариусом?',
  'Как сделать апостиль на диплом?',
  'Срочный перевод за 1-2 часа: условия?',
  'Где находится ваш офис в Новосибирске?',
  'В чем отличие онлайн-заказа от визита в офис?',
];

export const ChatBot: React.FC<ChatBotProps> = ({
  isOpen,
  onClose,
  onOpenOnlineForm,
  onOpenOfflineBooking,
  onMessageCountChange,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('lx_chat_history');
      if (saved) {
        // Replace any old cached phone numbers in user's browser storage
        const cleaned = saved
          .replace(/\+7\s?\(383\)\s?299-44-22/g, '+7 953 775 19 97')
          .replace(/\+7\s?\(383\)\s?299-44-23/g, '+7 953 775 19 97');
        return JSON.parse(cleaned);
      }
      return DEFAULT_MESSAGES;
    } catch (e) {
      return DEFAULT_MESSAGES;
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('lx_chat_history', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
    if (onMessageCountChange) {
      onMessageCountChange(messages.length);
    }
  }, [messages, onMessageCountChange]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to backend route
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          userMessage: text,
        }),
      });

      if (!res.ok) {
        throw new Error('Fallback to local intelligent engine');
      }

      const data = await res.json();
      const botReply = data.reply || getLocalFallbackReply(text);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      // Direct local fallback - works 100% without API key
      const localReply = getLocalFallbackReply(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: localReply,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalFallbackReply = (query: string): string => {
    const q = query.toLowerCase();
    
    // Direct phone / contacts request
    if (q.includes('телефон') || q.includes('номер') || q.includes('позвон') || q.includes('контакт') || q.includes('связа') || q.includes('ватсап') || q.includes('whatsapp') || q.includes('phone') || q.includes('call')) {
      return '📞 **Контактный номер телефона бюро «ДИВА»:**\n• **+7 953 775 19 97** (прямой телефон и WhatsApp)\n• Адрес: г. Новосибирск, ул. Станиславского, д. 2/3, 3 этаж, офис 314\n• График: Пн-Пт: 09:00 — 19:00, Сб: 10:00 — 16:00, Онлайн-прием 24/7\n\nВы можете позвонить нам прямо сейчас по номеру **+7 953 775 19 97** или задать любой вопрос в этом чате!';
    }

    if (q.includes('сколько') || q.includes('цена') || q.includes('стоим') || q.includes('тариф') || q.includes('прайс')) {
      return '💰 **Тарифы бюро «ДИВА» в Новосибирске:**\n• Паспорт с нотариусом: от 1 700 ₽\n• Стандартная страница (1800 знаков): от 650 ₽\n• Нотариальное заверение: 900 ₽/документ\n• Апостиль под ключ: 4 500 ₽\n\nПри заказе онлайн через форму на сайте действует **скидка 10%**!\nТелефон: +7 953 775 19 97.';
    }
    if (q.includes('апостиль') || q.includes('легализац') || q.includes('минюст')) {
      return '⚖️ **Апостиль и легализация:**\n• Апостиль ставится для стран Гаагской конвенции (ЕС, США, Турция и др.) — от 4 500 ₽ (с госпошлиной 2 500 ₽), срок от 1 до 5 дней.\n• Консульская легализация нужна для ОАЭ, Китая, Египта.\n\nЗапишитесь в наш офис на ул. Станиславского 2/3 (3 этаж, оф. 314) через форму «Запись в офис» для сдачи оригиналов под расписку или звоните: +7 953 775 19 97.';
    }
    if (q.includes('срочн') || q.includes('час') || q.includes('быстро') || q.includes('срок')) {
      return '⏱️ **Срочный перевод:**\n• Экстра-экспресс: от 45 минут до 2 часов (паспорта, справки, доверенности).\n• В день обращения: 4–8 часов.\n• Стандартный: 1–2 рабочих дня.\nСрочные заказы принимаем по телефону: +7 953 775 19 97.';
    }
    if (q.includes('офис') || q.includes('где') || q.includes('адрес') || q.includes('метро') || q.includes('новосибирск') || q.includes('станислав')) {
      return '📍 **Наш офис в Новосибирске:**\n• **Адрес:** г. Новосибирск, ул. Станиславского, д. 2/3, 3 этаж, офис 314\n• **Ориентир:** Ленинский район, м. Площадь Маркса (5-7 минут)\n• **График:** Пн-Пт: 09:00 — 19:00, Сб: 10:00 — 16:00, Онлайн-прием 24/7\n• **Телефон:** +7 953 775 19 97\n\nШтатный нотариус принимает прямо в офисе!';
    }
    return 'Здравствуйте! Я онлайн-консультант бюро переводов «ДИВА» (г. Новосибирск, ул. Станиславского, д. 2/3, оф. 314). Наш телефон: +7 953 775 19 97. Помогу с расчетом стоимости, подскажу правила нотариального заверения и апостиля. Вы можете оформить заказ в онлайн-форме со скидкой 10% или записаться на очный визит в офис!';
  };

  const handleResetChat = () => {
    setMessages(DEFAULT_MESSAGES);
    localStorage.removeItem('lx_chat_history');
  };

  if (!isOpen) {
    return (
      <button
        onClick={onClose} // in closed state, clicking opens it
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer group"
        aria-label="Открыть чат-бот"
      >
        <div className="relative">
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white"></span>
        </div>
        <div className="hidden sm:block text-left pr-1">
          <span className="block text-xs font-bold leading-tight">Онлайн-консультант</span>
          <span className="block text-[10px] text-indigo-100">Ответит за 2 сек</span>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-white shadow-2xl rounded-3xl border border-slate-200 flex flex-col transition-all overflow-hidden ${
        isExpanded
          ? 'inset-4 sm:inset-10 md:inset-16 max-w-5xl mx-auto'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh]'
      }`}
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-6 h-6" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">ДиваБот</h3>
              <span className="text-[9px] bg-amber-500/40 text-amber-200 px-1.5 py-0.2 rounded-sm border border-amber-400/30 font-semibold">
                ДИВА
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Консультант онлайн 24/7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Очистить историю"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
            title={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Action Pills inside Chat including direct Call */}
      <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs gap-1.5 overflow-x-auto">
        <a
          href="tel:+79537751997"
          className="py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center gap-1 shrink-0 transition-colors text-[11px]"
          title="Позвонить в бюро"
        >
          <PhoneCall className="w-3 h-3 text-emerald-600" />
          <span>+7 953 775 19 97</span>
        </a>
        <button
          onClick={() => { onClose(); onOpenOnlineForm(); }}
          className="flex-1 py-1 px-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 font-semibold flex items-center justify-center gap-1 truncate transition-colors text-[11px]"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          Онлайн расчет
        </button>
        <button
          onClick={() => { onClose(); onOpenOfflineBooking(); }}
          className="flex-1 py-1 px-2 rounded-lg bg-white border border-slate-300 hover:border-amber-500 hover:text-amber-700 text-slate-700 font-semibold flex items-center justify-center gap-1 truncate transition-colors text-[11px]"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          В офис 314
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs sm:text-sm">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white ${
                  isUser ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 shadow-xs leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                {msg.content}
                <div
                  className={`text-[9px] mt-1.5 font-medium ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-600 text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-amber-300">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white text-slate-600 border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span className="text-xs text-slate-500">ДиваБот подбирает ответ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Chips (Visible when few messages or user needs prompt) */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors border border-slate-200 shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спросите о ценах, апостиле или вставьте фразу..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-all cursor-pointer shadow-xs active:scale-95"
          aria-label="Отправить сообщение"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
