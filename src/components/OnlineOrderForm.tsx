import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Trash2, 
  ChevronRight, 
  Calculator, 
  Stamp, 
  Copy, 
  Printer, 
  Send 
} from 'lucide-react';
import { LANGUAGES, SERVICE_CATEGORIES } from '../data/agencyData';
import { TranslationOrder, UrgencyLevel, DeliveryMethod, ServiceType } from '../types';

interface OnlineOrderFormProps {
  onOrderCreated: (order: TranslationOrder) => void;
  onOpenTracker: (orderId: string) => void;
}

export const OnlineOrderForm: React.FC<OnlineOrderFormProps> = ({
  onOrderCreated,
  onOpenTracker,
}) => {
  // Form State
  const [sourceLang, setSourceLang] = useState('ru');
  const [targetLang, setTargetLang] = useState('en');
  const [serviceType, setServiceType] = useState<ServiceType>('documents');
  const [docTitle, setDocTitle] = useState('');
  
  // Input mode: files or direct text
  const [inputMode, setInputMode] = useState<'files' | 'text'>('files');
  const [files, setFiles] = useState<Array<{ name: string; size: number }>>([
    { name: 'document_scan_2026.pdf', size: 1420000 },
  ]);
  const [manualText, setManualText] = useState('');
  const [manualPages, setManualPages] = useState(1);

  // AI text analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // Options
  const [notarizationCount, setNotarizationCount] = useState(1);
  const [needApostille, setNeedApostille] = useState(false);
  const [apostilleCountry, setApostilleCountry] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('standard');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('email_digital');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Contacts
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Result modal state
  const [submittedOrder, setSubmittedOrder] = useState<TranslationOrder | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Quick swap languages
  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  // Calculate pages
  let estimatedPages = 1;
  if (inputMode === 'files') {
    estimatedPages = Math.max(1, files.length * 2);
  } else {
    // 1 standard page is 1800 chars
    const charCount = manualText.length;
    estimatedPages = charCount > 0 ? Math.ceil(charCount / 1800) : manualPages;
  }

  // Cost calculation
  const targetLanguageObj = LANGUAGES.find((l) => l.code === targetLang) || LANGUAGES[1];
  const baseRate = targetLanguageObj.ratePerPage;
  let subtotal = estimatedPages * baseRate;

  // Additional service multiplier
  if (serviceType === 'medical' || serviceType === 'legal') {
    subtotal += estimatedPages * 200; // complexity surcharge
  }

  // Notarization cost: 900 RUB per copy
  const notaryTotal = notarizationCount * 900;

  // Apostille cost: 4500 RUB flat (incl state fee)
  const apostilleTotal = needApostille ? 4500 : 0;

  // Urgency multiplier
  let urgencyMultiplier = 1.0;
  if (urgency === 'rush') urgencyMultiplier = 1.35;
  if (urgency === 'express') urgencyMultiplier = 1.75;

  // Courier delivery fee
  const deliveryFee = deliveryMethod === 'courier' ? 450 : 0;

  const preDiscountTotal = Math.round(subtotal * urgencyMultiplier + notaryTotal + apostilleTotal + deliveryFee);
  const onlineDiscount = Math.round(preDiscountTotal * 0.1); // 10% online discount
  const finalCost = preDiscountTotal - onlineDiscount;

  // Mock file upload handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        size: f.size,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: f.size,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // AI text analysis call
  const handleAnalyzeText = async () => {
    const textToAnalyze = manualText || `Документ типа ${serviceType} с языка ${sourceLang} на ${targetLang}`;
    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/analyze-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          sourceLang,
          targetLang,
          serviceType,
          urgency,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAiAnalysisResult(data.analysis);
      } else {
        setAiAnalysisResult('Анализ текста: стандартная юридическая/документальная терминология. Рекомендован присяжный переводчик и вычитка носителем.');
      }
    } catch (err) {
      setAiAnalysisResult('Оценка выполнена: объем соответствует стандартному документу. Переводчик в офисе на ул. Станиславского будет назначен в течение 10 минут.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Order Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Пожалуйста, укажите ваше имя и контактный телефон для связи.');
      return;
    }

    // Generate readable Order ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `DIVA-${randomNum}`;

    let estimatedHours = 24;
    if (urgency === 'rush') estimatedHours = 8;
    if (urgency === 'express') estimatedHours = 3;

    const completionDate = new Date(Date.now() + estimatedHours * 60 * 60 * 1000);
    const formattedCompletion = completionDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: TranslationOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sourceLang,
      targetLang,
      serviceType,
      docTitle: docTitle || `Документ (${serviceType})`,
      pageCount: estimatedPages,
      notarizationCount,
      needApostille,
      apostilleCountry: needApostille ? apostilleCountry : undefined,
      urgency,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'courier' ? deliveryAddress : undefined,
      clientName,
      clientPhone,
      clientEmail,
      notes,
      files: files.length > 0 ? files : [{ name: 'Введенный текст.txt', size: manualText.length }],
      totalCost: finalCost,
      status: 'received',
      estimatedCompletion: formattedCompletion,
      assignedSpecialist: 'Назначается старший лингвист отдела',
    };

    onOrderCreated(newOrder);
    setSubmittedOrder(newOrder);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore in SSR/test
    }
  };

  const copyOrderId = () => {
    if (submittedOrder) {
      navigator.clipboard.writeText(submittedOrder.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <section id="online-form" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Онлайн-оформление без поездки в офис
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Оформление заказа и расчет стоимости
          </h2>
          <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            Загрузите файлы или введите текст, выберите языковую пару и дополнительные опции. 
            Калькулятор моментально рассчитает точную стоимость со скидкой 10%.
          </p>
        </div>

        {/* Main Grid: Form Left + Summary Card Right */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-8 space-y-8 bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200">
            
            {/* Step 1: Language Pair Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Языковая пара
                </label>
                <button
                  type="button"
                  onClick={handleSwapLangs}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  ⇄ Поменять местами
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Source Lang */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">Язык оригинала:</span>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden shadow-xs"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={`src-${lang.code}`} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Lang */}
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">Язык перевода:</span>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden shadow-xs"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={`tgt-${lang.code}`} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.ratePerPage} ₽/стр)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Popular quick buttons */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px] text-slate-700 font-medium">Популярные направления:</span>
                {[
                  { s: 'ru', t: 'en', label: 'RU → EN' },
                  { s: 'en', t: 'ru', label: 'EN → RU' },
                  { s: 'ru', t: 'zh', label: 'RU → CN' },
                  { s: 'ru', t: 'de', label: 'RU → DE' },
                  { s: 'ru', t: 'tr', label: 'RU → TR' },
                  { s: 'ru', t: 'es', label: 'RU → ES' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => { setSourceLang(item.s); setTargetLang(item.t); }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      sourceLang === item.s && targetLang === item.t
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Service Type / Document Category */}
            <div className="border-t border-slate-200 pt-6">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Тематика и тип перевода
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'documents', label: 'Паспорта и документы', icon: '📄', note: 'Личные документы' },
                  { id: 'legal', label: 'Юридический', icon: '⚖️', note: 'Договоры, уставы' },
                  { id: 'medical', label: 'Медицинский', icon: '🩺', note: 'Выписки, справки' },
                  { id: 'technical', label: 'Технический', icon: '⚙️', note: 'Инструкции, схемы' },
                  { id: 'financial', label: 'Финансовый', icon: '📊', note: 'Отчеты, аудит' },
                  { id: 'notary', label: 'Нотариальное заверение', icon: '🔏', note: 'Срочное заверение' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setServiceType(st.id as ServiceType)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      serviceType === st.id
                        ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-lg mb-1">{st.icon}</div>
                    <div className="text-xs font-bold leading-tight">{st.label}</div>
                    <div className="text-[10px] text-slate-700 mt-0.5">{st.note}</div>
                  </button>
                ))}
              </div>

              {/* Document title input */}
              <div className="mt-4">
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Название документа (напр.: Паспорт РФ + Диплом бакалавра)"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 3: Input Mode (Files or Text) */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Прикрепить файлы или вставить текст
                </label>
                <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setInputMode('files')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      inputMode === 'files' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    📁 Файлы (PDF/DOC/JPG)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      inputMode === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    ✍️ Текст
                  </button>
                </div>
              </div>

              {inputMode === 'files' ? (
                <div>
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white rounded-2xl p-6 text-center cursor-pointer transition-colors"
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      multiple
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Перетащите файлы сюда или <span className="text-indigo-600 underline">выберите на диске</span>
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      Поддерживаем: PDF, DOCX, DOC, XLS, JPG, PNG, TIFF до 50 Мб
                    </p>
                  </div>

                  {/* Uploaded files list */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                            <span className="text-slate-700">({(file.size / 1024 / 1024).toFixed(2)} МБ)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 text-slate-700 hover:text-rose-500 transition-colors"
                            title="Удалить файл"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={5}
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Вставьте исходный текст для перевода сюда..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-700">
                    <span>
                      Символов с пробелами: <strong className="text-slate-800">{manualText.length}</strong> | 
                      Примерно страниц: <strong className="text-slate-800">{Math.max(1, Math.ceil(manualText.length / 1800))}</strong>
                    </span>
                    <button
                      type="button"
                      disabled={isAnalyzing || manualText.length < 10}
                      onClick={handleAnalyzeText}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border border-indigo-200 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {isAnalyzing ? 'ИИ анализирует...' : 'ИИ-экспертиза текста'}
                    </button>
                  </div>

                  {aiAnalysisResult && (
                    <div className="p-3.5 rounded-xl bg-indigo-900/5 border border-indigo-200 text-xs text-slate-800 space-y-1">
                      <div className="font-bold text-indigo-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Заключение ИИ-эксперта ЛингваЭкспресс:
                      </div>
                      <p className="whitespace-pre-line text-slate-700 leading-relaxed">{aiAnalysisResult}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 4: Add-on Options (Notary, Apostille, Urgency, Delivery) */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                Дополнительные услуги и заверение
              </label>

              {/* Notary Counter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Stamp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Нотариальное заверение подписи</span>
                    <span className="text-[11px] text-slate-700">Официальное удостоверение нотариусом г. Новосибирска (+900 ₽/экз)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNotarizationCount((c) => Math.max(0, c - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-900">{notarizationCount}</span>
                  <button
                    type="button"
                    onClick={() => setNotarizationCount((c) => c + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-700 ml-1">экз.</span>
                </div>
              </div>

              {/* Apostille Toggle */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Проставление штампа «Апостиль»</span>
                      <span className="text-[11px] text-slate-700">Включает госпошлину 2 500 ₽ и подачу в Минюст/МВД по НСО (+4 500 ₽)</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needApostille}
                      onChange={(e) => setNeedApostille(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {needApostille && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={apostilleCountry}
                      onChange={(e) => setApostilleCountry(e.target.value)}
                      placeholder="Для какой страны оформляется документ? (напр.: Германия, Испания, Кипр)"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Urgency Selector */}
              <div>
                <span className="block text-xs font-bold text-slate-800 mb-2">Срочность выполнения:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'standard', title: 'Стандартный', time: '1-2 рабочих дня', badge: 'Базовый тариф' },
                    { id: 'rush', title: 'Срочный (+35%)', time: 'В день обращения (4-8 ч)', badge: 'Популярно' },
                    { id: 'express', title: 'Экстра-экспресс (+75%)', time: 'От 45 минут до 2 часов', badge: 'Супер-скорость' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as UrgencyLevel)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        urgency === u.id
                          ? 'bg-indigo-50/80 border-indigo-600 text-slate-900 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{u.title}</div>
                      <div className="text-[11px] text-slate-700 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {u.time}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery method */}
              <div>
                <span className="block text-xs font-bold text-slate-800 mb-2">Способ получения готового перевода:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'email_digital', label: 'Email + ЭЦП (PDF)', desc: 'Бесплатно, моментально' },
                    { id: 'courier', label: 'Курьер до двери (+350 ₽)', desc: 'По Новосибирску в день готовности' },
                    { id: 'office_pickup', label: 'Самовывоз из офиса', desc: 'ул. Станиславского 2/3, оф. 314' },
                  ].map((del) => (
                    <button
                      key={del.id}
                      type="button"
                      onClick={() => setDeliveryMethod(del.id as DeliveryMethod)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        deliveryMethod === del.id
                          ? 'bg-indigo-50/80 border-indigo-600 text-slate-900 ring-2 ring-indigo-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{del.label}</div>
                      <div className="text-[10px] text-slate-700 mt-0.5">{del.desc}</div>
                    </button>
                  ))}
                </div>

                {deliveryMethod === 'courier' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Адрес доставки в Новосибирске (улица, дом, квартира/офис)"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 5: Contact Info */}
            <div className="border-t border-slate-200 pt-6">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">5</span>
                Контактные данные заявителя
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ваше имя *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Александр Иванов"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Телефон / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Электронная почта</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="mail@example.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="mt-3">
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Дополнительные пожелания (транслитерация имени по загранпаспорту, специфические требования ведомства и т.д.)"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

          </div>

          {/* Right Summary & Checkout Sticky Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-base text-white">Расчет стоимости</h3>
                </div>
                <span className="text-[11px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md">
                  Скидка 10%
                </span>
              </div>

              {/* Items Breakdown */}
              <div className="py-4 space-y-2.5 text-xs text-slate-300 border-b border-slate-800">
                <div className="flex justify-between">
                  <span>Перевод ({estimatedPages} стр. x {baseRate} ₽):</span>
                  <span className="font-semibold text-white">{subtotal} ₽</span>
                </div>

                {urgency !== 'standard' && (
                  <div className="flex justify-between text-amber-300">
                    <span>Надбавка за срочность ({urgency === 'rush' ? '+35%' : '+75%'}):</span>
                    <span className="font-semibold">+{Math.round(subtotal * (urgencyMultiplier - 1))} ₽</span>
                  </div>
                )}

                {notarizationCount > 0 && (
                  <div className="flex justify-between">
                    <span>Нотариальное заверение ({notarizationCount} экз.):</span>
                    <span className="font-semibold text-white">+{notaryTotal} ₽</span>
                  </div>
                )}

                {needApostille && (
                  <div className="flex justify-between text-indigo-300">
                    <span>Апостиль + госпошлина 2 500 ₽:</span>
                    <span className="font-semibold text-white">+{apostilleTotal} ₽</span>
                  </div>
                )}

                {deliveryMethod === 'courier' && (
                  <div className="flex justify-between">
                    <span>Курьерская доставка по Москве:</span>
                    <span className="font-semibold text-white">+450 ₽</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-400 font-medium pt-1">
                  <span>Онлайн-скидка первого заказа (-10%):</span>
                  <span>-{onlineDiscount} ₽</span>
                </div>
              </div>

              {/* Total & Guarantee */}
              <div className="pt-4 pb-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-medium">Итого к оплате:</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {finalCost.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="block text-[10px] text-slate-400 line-through">
                      {preDiscountTotal.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/40">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Гарантия фиксированной цены (без скрытых доплат)</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Оформить заказ онлайн
              </button>

              <p className="text-[10px] text-slate-400 text-center mt-3 leading-relaxed">
                Нажимая кнопку, вы подтверждаете согласие на обработку данных и получение уведомлений о готовности.
              </p>
            </div>

            {/* Offline visit teaser card */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-950 text-xs">
              <span className="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
                Нужно сдать физический оригинал?
              </span>
              <p className="text-slate-800 text-[11px] leading-relaxed">
                Для апостиля или нотариальной копии с оригинала вы также можете{' '}
                <a href="#offline-booking" className="font-bold underline text-indigo-700 hover:text-indigo-900">
                  забронировать личный визит в офис
                </a>{' '}
                без очереди.
              </p>
            </div>
          </div>

        </form>

      </div>

      {/* Confirmation Modal when Order is Created */}
      {submittedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Заказ успешно оформлен!</h3>
                  <p className="text-xs text-slate-700">Мы уже передали документы в работу</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmittedOrder(null)}
                className="text-slate-700 hover:text-slate-900 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Ticket Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Номер вашего заказа:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-indigo-600 tracking-wider">
                    {submittedOrder.id}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="p-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
                    title="Скопировать"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {copiedId && (
                <div className="text-[10px] text-emerald-600 font-bold text-right">
                  ✓ Номер скопирован в буфер!
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-700">
                <div>
                  <span className="block text-[10px] text-slate-700 uppercase">Языковая пара:</span>
                  <span className="font-semibold text-slate-900">
                    {submittedOrder.sourceLang.toUpperCase()} → {submittedOrder.targetLang.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-700 uppercase">Ориентировочная готовность:</span>
                  <span className="font-semibold text-slate-900">{submittedOrder.estimatedCompletion}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-700 uppercase">Сумма к оплате:</span>
                  <span className="font-semibold text-emerald-600">{submittedOrder.totalCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-700 uppercase">Клиент:</span>
                  <span className="font-semibold text-slate-900">{submittedOrder.clientName}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed space-y-1">
              <p>
                Менеджер проекта свяжется с вами по номеру <strong className="text-slate-900">{submittedOrder.clientPhone}</strong> в течение 10 минут для подтверждения транслитерации и старта работы.
              </p>
              <p>
                Вы можете следить за каждым этапом выполнения перевода в нашем онлайн-трекере.
              </p>
            </div>

            {/* Actions inside modal */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const id = submittedOrder.id;
                  setSubmittedOrder(null);
                  onOpenTracker(id);
                }}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                Отследить в трекере
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Распечатать квитанцию
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
