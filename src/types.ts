export type Language = {
  code: string;
  name: string;
  flag: string;
  ratePerPage: number; // in RUB
  popular?: boolean;
};

export type ServiceType = 
  | 'documents' // Личные документы (паспорт, диплом, права)
  | 'legal' // Юридический перевод
  | 'medical' // Медицинский перевод
  | 'technical' // Технический перевод
  | 'financial' // Финансово-экономический
  | 'notary' // Нотариальное заверение
  | 'apostille' // Апостиль и легализация
  | 'oral' // Устный перевод
  | 'software'; // Локализация сайтов и ПО

export type UrgencyLevel = 'standard' | 'rush' | 'express';

export type DeliveryMethod = 'email_digital' | 'courier' | 'office_pickup';

export interface TranslationOrder {
  id: string;
  createdAt: string;
  sourceLang: string;
  targetLang: string;
  serviceType: ServiceType;
  docTitle?: string;
  pageCount: number;
  wordCount?: number;
  notarizationCount: number;
  needApostille: boolean;
  apostilleCountry?: string;
  urgency: UrgencyLevel;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
  files: Array<{ name: string; size: number }>;
  totalCost: number;
  status: 'received' | 'in_progress' | 'proofreading' | 'notarization' | 'ready' | 'delivered';
  estimatedCompletion: string;
  assignedSpecialist?: string;
}

export interface OfficeBranch {
  id: string;
  name: string;
  tagline: string;
  address: string;
  metro: string;
  hours: string;
  phone: string;
  email: string;
  passRequired: boolean;
  parkingAvailable: boolean;
  features: string[];
  image: string;
}

export interface OfflineAppointment {
  id: string;
  branchId: string;
  branchName: string;
  date: string;
  timeSlot: string;
  visitReason: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  needPass: boolean;
  carPlate?: string;
  documentsToBring: string[];
  createdAt: string;
  ticketNumber: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionPrompt?: string;
}
