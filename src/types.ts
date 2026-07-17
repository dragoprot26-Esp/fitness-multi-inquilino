/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tenant {
  id: string;
  name: string;
  logo: string;
  slogan: string;
  theme: 'neon-energy' | 'zen-calm' | 'coral-athletics';
  address: string;
  mapsUrl: string;
  phone: string;
  phonePrefix?: string;
  language?: 'es' | 'en';
  currencySymbol?: string;
  enableOnlinePayments?: boolean;
  suggestions: Suggestion[];
  gallery: string[];
  gallerySlots?: GallerySlot[];
  customHeroImage?: string;
  customFontHeading?: string;
  customFontBody?: string;
  customHeroTextColor?: string;
  customHeroSloganColor?: string;
  customServiceTitleColor?: string;
  customClassTitleColor?: string;
  customNeonGlow?: boolean;
  customCardTextColor?: string;
  customCardBgColor?: string;
  customScheduleBadgeBgColor?: string;
  customScheduleBadgeTextColor?: string;
  customPlans?: string[];
  customBgMusicUrl?: string;
  customBgMusicPlaylist?: MusicTrack[];
}

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  isPredefined?: boolean;
}

export interface GallerySlot {
  id: string;
  title: string;
  images: string[];
}

export interface Suggestion {
  id: string;
  name: string;
  email: string;
  phone?: string;
  content: string;
  date: string;
  type?: 'comment' | 'suggestion';
  status?: 'pending' | 'accepted' | 'denied';
  reply?: string;
  repliedAt?: string;
}

export interface ClassSession {
  id: string;
  tenantId: string;
  name: string;
  instructor: string;
  time: string; // e.g. "18:00"
  dayOfWeek: string; // e.g. "Lunes", "Martes"
  maxCapacity: number;
  currentBookings: number;
  image: string;
  price: number;
  duration: string; // e.g. "60 min"
}

export interface Reservation {
  id: string;
  tenantId: string;
  classSessionId: string;
  className: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  isFreeTrial: boolean;
  date: string;
  status: 'confirmed' | 'cancelled';
  paid: boolean;
  paymentMethod?: 'credit_card' | 'bizum' | 'cash' | 'transfer';
}

export interface MonthlyPayment {
  id: string;
  tenantId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  planName: string; // e.g. "Socio VIP Ilimitado", "Pase Mensual Zumba"
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  lastPaidDate?: string;
  paymentMethod?: 'credit_card' | 'bizum' | 'cash' | 'transfer';
}

export interface Notification {
  id: string;
  tenantId: string;
  recipientName: string;
  recipientContact: string; // email or phone
  title: string;
  message: string;
  date: string;
  type: 'session_reminder' | 'payment_pending' | 'success_payment';
  read: boolean;
  sent: boolean;
}

export interface Prospect {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  classSessionId: string;
  className: string;
  registeredAt: string;
  converted: boolean; // if they have been registered as an active student
}
