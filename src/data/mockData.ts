/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tenant, ClassSession, Reservation, MonthlyPayment, Notification, Prospect } from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Ritmo & Zumba Studio',
    logo: '⚡',
    slogan: '¡Siente la música, vive la energía y quema calorías bailando!',
    theme: 'neon-energy',
    address: 'Av. de las Energías 42, Planta Alta, Madrid',
    mapsUrl: 'https://maps.google.com/?q=Av.+de+las+Energias+42,+Madrid',
    phone: '+34 612 345 678',
    phonePrefix: '+549',
    language: 'es',
    gallery: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800'
    ],
    suggestions: [
      {
        id: 'sug-1',
        name: 'Carlos Mendoza',
        email: 'carlos@mail.com',
        phone: '+34 600 111 222',
        content: 'Me encantaría que abrieran un grupo de Zumba los sábados por la mañana.',
        date: '2026-07-14T10:00:00Z',
        type: 'suggestion'
      },
      {
        id: 'sug-2',
        name: 'Laura García',
        email: 'laura@mail.com',
        phone: '+34 600 333 444',
        content: 'El sistema de sonido de la sala principal es fantástico. ¡Sigan así!',
        date: '2026-07-15T18:30:00Z',
        type: 'comment',
        status: 'accepted'
      },
      {
        id: 'sug-2b',
        name: 'Marta Gómez',
        email: 'marta.gomez@mail.com',
        phone: '+34 600 555 666',
        content: 'Las clases de Zumba con el profesor Alberto son pura energía, salgo renovada.',
        date: '2026-07-16T11:00:00Z',
        type: 'comment',
        status: 'accepted'
      }
    ]
  },
  {
    id: 'tenant-2',
    name: 'Harmonía Zen & Step',
    logo: '🌿',
    slogan: 'El equilibrio perfecto entre la intensidad del Step y la paz mental.',
    theme: 'zen-calm',
    address: 'Calle del Silencio 8, Barrio de Salamanca, Madrid',
    mapsUrl: 'https://maps.google.com/?q=Calle+del+Silencio+8,+Madrid',
    phone: '+34 699 888 777',
    phonePrefix: '+549',
    language: 'es',
    gallery: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510894347580-fc4d0fa775a5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=800'
    ],
    suggestions: [
      {
        id: 'sug-3',
        name: 'Sofía Martínez',
        email: 'sofia@mail.com',
        phone: '+34 611 222 333',
        content: 'Agradecería que las clases de relajación post-step duraran 10 minutos más.',
        date: '2026-07-15T09:15:00Z',
        type: 'suggestion'
      },
      {
        id: 'sug-3b',
        name: 'Andrés López',
        email: 'andres@mail.com',
        phone: '+34 611 444 555',
        content: 'Un ambiente super relajante y clases muy profesionales. Muy recomendado.',
        date: '2026-07-16T10:00:00Z',
        type: 'comment',
        status: 'accepted'
      }
    ]
  },
  {
    id: 'tenant-3',
    name: 'AeroAthletics Power',
    logo: '🏋️‍♂️',
    slogan: 'Desafía tus límites con Step atlético, Cardio Jump y entrenamiento de alta potencia.',
    theme: 'coral-athletics',
    address: 'Paseo de los Atletas 120, Complejo Olímpico, Madrid',
    mapsUrl: 'https://maps.google.com/?q=Paseo+de+los+Atletas+120,+Madrid',
    phone: '+34 655 444 333',
    phonePrefix: '+549',
    language: 'es',
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517838411226-e176b6b77209?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'
    ],
    suggestions: [
      {
        id: 'sug-4',
        name: 'Marcos Silva',
        email: 'marcos@mail.com',
        phone: '+34 622 333 444',
        content: '¡Los instructores son excelentes! El nivel de exigencia es justo lo que buscaba.',
        date: '2026-07-13T14:40:00Z',
        type: 'comment',
        status: 'accepted'
      }
    ]
  }
];

export const INITIAL_CLASSES: ClassSession[] = [
  // Tenant 1 (Ritmo & Zumba)
  {
    id: 'cls-101',
    tenantId: 'tenant-1',
    name: 'Zumba Cardio Explosion',
    instructor: 'Yanis Martínez',
    time: '18:00',
    dayOfWeek: 'Lunes',
    maxCapacity: 25,
    currentBookings: 21,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
    price: 8,
    duration: '50 min'
  },
  {
    id: 'cls-102',
    tenantId: 'tenant-1',
    name: 'Zumba Gold (Iniciación)',
    instructor: 'Laura Prieto',
    time: '11:00',
    dayOfWeek: 'Martes',
    maxCapacity: 20,
    currentBookings: 12,
    image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=600',
    price: 7,
    duration: '50 min'
  },
  {
    id: 'cls-103',
    tenantId: 'tenant-1',
    name: 'Step Core Choreography',
    instructor: 'David Ruiz',
    time: '19:30',
    dayOfWeek: 'Miércoles',
    maxCapacity: 15,
    currentBookings: 14,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
    price: 9,
    duration: '60 min'
  },
  {
    id: 'cls-104',
    tenantId: 'tenant-1',
    name: 'Zumba Toning & Ritmos Latinos',
    instructor: 'Yanis Martínez',
    time: '19:00',
    dayOfWeek: 'Jueves',
    maxCapacity: 25,
    currentBookings: 18,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600',
    price: 8,
    duration: '50 min'
  },

  // Tenant 2 (Harmonía Zen & Step)
  {
    id: 'cls-201',
    tenantId: 'tenant-2',
    name: 'Step Flow & Postura',
    instructor: 'Silvia Quintana',
    time: '09:30',
    dayOfWeek: 'Lunes',
    maxCapacity: 12,
    currentBookings: 8,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    price: 12,
    duration: '60 min'
  },
  {
    id: 'cls-202',
    tenantId: 'tenant-2',
    name: 'Step & Mindful Stretch',
    instructor: 'Silvia Quintana',
    time: '18:15',
    dayOfWeek: 'Miércoles',
    maxCapacity: 15,
    currentBookings: 11,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    price: 12,
    duration: '60 min'
  },
  {
    id: 'cls-203',
    tenantId: 'tenant-2',
    name: 'Pilates Cardio con Plataforma',
    instructor: 'Gabriel Sanz',
    time: '17:00',
    dayOfWeek: 'Viernes',
    maxCapacity: 10,
    currentBookings: 9,
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600',
    price: 15,
    duration: '50 min'
  },

  // Tenant 3 (AeroAthletics Power)
  {
    id: 'cls-301',
    tenantId: 'tenant-3',
    name: 'Power Step HIIT 3D',
    instructor: 'Alex Domenech',
    time: '08:00',
    dayOfWeek: 'Martes',
    maxCapacity: 20,
    currentBookings: 19,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    price: 10,
    duration: '50 min'
  },
  {
    id: 'cls-302',
    tenantId: 'tenant-3',
    name: 'Cardio Jump & Aero Combo',
    instructor: 'Marta Valls',
    time: '19:00',
    dayOfWeek: 'Jueves',
    maxCapacity: 18,
    currentBookings: 15,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    price: 10,
    duration: '60 min'
  },
  {
    id: 'cls-303',
    tenantId: 'tenant-3',
    name: 'Step Atlético Nivel Pro',
    instructor: 'Alex Domenech',
    time: '11:00',
    dayOfWeek: 'Sábado',
    maxCapacity: 20,
    currentBookings: 8,
    image: 'https://images.unsplash.com/photo-1517838411226-e176b6b77209?auto=format&fit=crop&q=80&w=600',
    price: 12,
    duration: '60 min'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    tenantId: 'tenant-1',
    classSessionId: 'cls-101',
    className: 'Zumba Cardio Explosion',
    studentName: 'Ana Gómez',
    studentEmail: 'ana.gomez@mail.com',
    studentPhone: '+34 600 111 222',
    isFreeTrial: false,
    date: '2026-07-17',
    status: 'confirmed',
    paid: true,
    paymentMethod: 'credit_card'
  },
  {
    id: 'res-2',
    tenantId: 'tenant-1',
    classSessionId: 'cls-101',
    className: 'Zumba Cardio Explosion',
    studentName: 'Roberto Soler',
    studentEmail: 'rober.sol@mail.com',
    studentPhone: '+34 600 222 333',
    isFreeTrial: true,
    date: '2026-07-17',
    status: 'confirmed',
    paid: false
  },
  {
    id: 'res-3',
    tenantId: 'tenant-2',
    classSessionId: 'cls-201',
    className: 'Step Flow & Postura',
    studentName: 'Elena Ramos',
    studentEmail: 'elena.r@mail.com',
    studentPhone: '+34 622 333 444',
    isFreeTrial: false,
    date: '2026-07-17',
    status: 'confirmed',
    paid: true,
    paymentMethod: 'bizum'
  }
];

export const INITIAL_MONTHLY_PAYMENTS: MonthlyPayment[] = [
  // Tenant 1 (Zumba)
  {
    id: 'pay-1',
    tenantId: 'tenant-1',
    studentName: 'Juan Pérez',
    studentEmail: 'juan.perez@mail.com',
    studentPhone: '+34 611 111 111',
    planName: 'Tarifa Plana Zumba',
    amount: 35,
    dueDate: '2026-07-05',
    status: 'paid',
    lastPaidDate: '2026-07-04',
    paymentMethod: 'bizum'
  },
  {
    id: 'pay-2',
    tenantId: 'tenant-1',
    studentName: 'Clara Ortiz',
    studentEmail: 'clara.ortiz@mail.com',
    studentPhone: '+34 611 222 222',
    planName: 'Bono 10 Sesiones',
    amount: 45,
    dueDate: '2026-07-10',
    status: 'pending'
  },
  {
    id: 'pay-3',
    tenantId: 'tenant-1',
    studentName: 'David Castells',
    studentEmail: 'david.c@mail.com',
    studentPhone: '+34 611 333 333',
    planName: 'Tarifa Plana Zumba',
    amount: 35,
    dueDate: '2026-07-01',
    status: 'overdue'
  },

  // Tenant 2 (Zen & Step)
  {
    id: 'pay-4',
    tenantId: 'tenant-2',
    studentName: 'Beatriz Luengo',
    studentEmail: 'beatriz@mail.com',
    studentPhone: '+34 622 111 111',
    planName: 'Socio VIP Harmonía',
    amount: 55,
    dueDate: '2026-07-05',
    status: 'paid',
    lastPaidDate: '2026-07-05',
    paymentMethod: 'credit_card'
  },
  {
    id: 'pay-5',
    tenantId: 'tenant-2',
    studentName: 'Manuel Fuentes',
    studentEmail: 'mfuentes@mail.com',
    studentPhone: '+34 622 222 222',
    planName: 'Bono Mensual Step',
    amount: 40,
    dueDate: '2026-07-12',
    status: 'pending'
  },

  // Tenant 3 (AeroAthletics)
  {
    id: 'pay-6',
    tenantId: 'tenant-3',
    studentName: 'Carlos Baza',
    studentEmail: 'carlos.baza@mail.com',
    studentPhone: '+34 633 111 111',
    planName: 'Plan Atlético Ilimitado',
    amount: 60,
    dueDate: '2026-07-01',
    status: 'overdue'
  },
  {
    id: 'pay-7',
    tenantId: 'tenant-3',
    studentName: 'Nuria Pons',
    studentEmail: 'nuria.pons@mail.com',
    studentPhone: '+34 633 222 222',
    planName: 'Bono 8 Clases Power',
    amount: 45,
    dueDate: '2026-07-15',
    status: 'paid',
    lastPaidDate: '2026-07-14',
    paymentMethod: 'transfer'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'not-1',
    tenantId: 'tenant-1',
    recipientName: 'David Castells',
    recipientContact: 'david.c@mail.com',
    title: '⚠️ Pago Vencido - Cuota de Zumba',
    message: 'Hola David, tu cuota mensual de Zumba por valor de 35,00€ venció el 01/07/2026. Por favor realiza el pago mediante la app para evitar suspensiones de tus reservas.',
    date: '2026-07-03T09:00:00Z',
    type: 'payment_pending',
    read: false,
    sent: true
  },
  {
    id: 'not-2',
    tenantId: 'tenant-1',
    recipientName: 'Clara Ortiz',
    recipientContact: 'clara.ortiz@mail.com',
    title: '⏰ Recordatorio de Pago Pendiente',
    message: 'Hola Clara, te recordamos que tu pago de 45,00€ por tu Bono 10 Sesiones vencerá pronto el 10/07/2026. ¡Gracias por tu confianza!',
    date: '2026-07-08T10:00:00Z',
    type: 'payment_pending',
    read: true,
    sent: true
  },
  {
    id: 'not-3',
    tenantId: 'tenant-2',
    recipientName: 'Elena Ramos',
    recipientContact: 'elena.r@mail.com',
    title: '🔔 Confirmación de Reserva',
    message: '¡Tu plaza ha sido reservada con éxito! Sesión: Step Flow & Postura con Silvia Quintana el Viernes a las 09:30.',
    date: '2026-07-16T11:00:00Z',
    type: 'session_reminder',
    read: false,
    sent: true
  }
];

export const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: 'pr-1',
    tenantId: 'tenant-1',
    name: 'María Segovia',
    email: 'maria.segovia@mail.com',
    phone: '+34 600 555 666',
    classSessionId: 'cls-102',
    className: 'Zumba Gold (Iniciación)',
    registeredAt: '2026-07-15T16:20:00Z',
    converted: false
  }
];
