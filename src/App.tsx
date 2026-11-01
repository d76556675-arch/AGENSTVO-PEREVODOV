import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OnlineOrderForm } from './components/OnlineOrderForm';
import { OfflineBookingForm } from './components/OfflineBookingForm';
import { ChatBot } from './components/ChatBot';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ServicesSection } from './components/ServicesSection';
import { PriceCalculator } from './components/PriceCalculator';
import { OfficesSection } from './components/OfficesSection';
import { ReviewsAndFAQ } from './components/ReviewsAndFAQ';
import { Footer } from './components/Footer';
import { INITIAL_ORDERS } from './data/agencyData';
import { TranslationOrder, OfflineAppointment } from './types';
import { SupportedLang } from './i18n/translations';

export default function App() {
  // Current UI language: 'ru' or 'en'
  const [lang, setLang] = useState<SupportedLang>(() => {
    try {
      const savedLang = localStorage.getItem('diva_lang');
      return savedLang === 'en' || savedLang === 'ru' ? savedLang : 'ru';
    } catch (e) {
      return 'ru';
    }
  });

  // Google Maps Platform Quota Defense listener
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleToggleLang = (newLang: SupportedLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('diva_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  // Orders list with local storage persistence
  const [orders, setOrders] = useState<TranslationOrder[]>(() => {
    try {
      const saved = localStorage.getItem('lx_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  // Appointments list
  const [appointments, setAppointments] = useState<OfflineAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('lx_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals & UI states
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState<string | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('stanislavskogo');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lx_orders', JSON.stringify(orders));
    } catch (e) {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('lx_appointments', JSON.stringify(appointments));
    } catch (e) {
      // ignore
    }
  }, [appointments]);

  // Handlers
  const handleOrderCreated = (newOrder: TranslationOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleAppointmentBooked = (newAppointment: OfflineAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleOpenOnlineForm = () => {
    const el = document.getElementById('online-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenOfflineBooking = (branchId?: string) => {
    if (branchId) {
      setSelectedBranchId(branchId);
    }
    const el = document.getElementById('offline-booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTracker = (orderId?: string) => {
    setSearchOrderId(orderId);
    setIsTrackerOpen(true);
  };

  const handleSelectService = (serviceId: string) => {
    handleOpenOnlineForm();
  };

  const handleApplyCalculatorParams = (params: any) => {
    handleOpenOnlineForm();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Tier 1 / Tier 2 Google Maps Quota Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Navbar with RU/EN Language Switcher */}
      <Navbar
        onOpenOnlineForm={handleOpenOnlineForm}
        onOpenOfflineBooking={handleOpenOfflineBooking}
        onOpenTracker={() => handleOpenTracker()}
        onOpenChat={() => setIsChatOpen(true)}
        unreadChatCount={unreadChatCount}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenOnlineForm={handleOpenOnlineForm}
          onOpenOfflineBooking={() => handleOpenOfflineBooking()}
          onSearchOrder={(id) => handleOpenTracker(id)}
          lang={lang}
        />

        {/* Dual Form Section: 1. Online Form */}
        <OnlineOrderForm
          onOrderCreated={handleOrderCreated}
          onOpenTracker={(id) => handleOpenTracker(id)}
        />

        {/* Services & Tariffs */}
        <ServicesSection
          onSelectService={handleSelectService}
          onBookOffice={() => handleOpenOfflineBooking()}
        />

        {/* Dual Form Section: 2. Offline Appointment Booking Form */}
        <OfflineBookingForm
          onAppointmentBooked={handleAppointmentBooked}
          selectedBranchId={selectedBranchId}
        />

        {/* Interactive Price Calculator */}
        <PriceCalculator
          onApplyParams={handleApplyCalculatorParams}
        />

        {/* Physical Office Branches in Novosibirsk & Interactive Google Map */}
        <OfficesSection
          onBookBranch={(bId) => handleOpenOfflineBooking(bId)}
          lang={lang}
        />

        {/* Client Reviews, Corporate Offer & FAQ */}
        <ReviewsAndFAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenOnlineForm={handleOpenOnlineForm}
        onOpenOfflineBooking={() => handleOpenOfflineBooking()}
        onOpenTracker={() => handleOpenTracker()}
        onOpenChat={() => setIsChatOpen(true)}
        lang={lang}
      />

      {/* Modals & Floating Widgets */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialSearchId={searchOrderId}
      />

      <ChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(!isChatOpen)}
        onOpenOnlineForm={handleOpenOnlineForm}
        onOpenOfflineBooking={() => handleOpenOfflineBooking()}
        onMessageCountChange={(count) => {
          if (!isChatOpen && count > 1) {
            setUnreadChatCount(1);
          } else {
            setUnreadChatCount(0);
          }
        }}
      />
    </div>
  );
}
