/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, ClassSession, Reservation, MonthlyPayment, Notification, Prospect, Suggestion } from '../types';
import {
  INITIAL_TENANTS,
  INITIAL_CLASSES,
  INITIAL_RESERVATIONS,
  INITIAL_MONTHLY_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROSPECTS
} from '../data/mockData';
import { cloudLoad, cloudSave, cambiarPasswordDueno, zumbPublica, zumbAgregarReserva, zumbAgregarProspecto, zumbAgregarSugerencia, zumbVersion, CloudData } from '../lib/cloud';

interface AppContextType {
  activeTenant: Tenant;
  setActiveTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  classes: ClassSession[];
  reservations: Reservation[];
  monthlyPayments: MonthlyPayment[];
  notifications: Notification[];
  prospects: Prospect[];
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (b: boolean) => void;
  bloqueada: boolean;
  publicCodigo: string | null;
  adminLicenseVerified: boolean;
  setAdminLicenseVerified: (b: boolean) => void;
  iniciarSesionNube: (codigo: string) => void;
  cambiarClave: (newPassword: string) => Promise<{ ok: boolean; msg?: string }>;
  
  // Dynamic Theme
  currentTheme: 'neon-energy' | 'zen-calm' | 'coral-athletics';
  setCurrentTheme: (theme: 'neon-energy' | 'zen-calm' | 'coral-athletics') => void;
  panelTheme: 'claro' | 'medio' | 'oscuro';
  setPanelTheme: (t: 'claro' | 'medio' | 'oscuro') => void;
  
  // Actions
  addSession: (session: Omit<ClassSession, 'id' | 'tenantId' | 'currentBookings'>) => void;
  updateSession: (session: ClassSession) => void;
  deleteSession: (id: string) => void;
  
  addReservation: (res: Omit<Reservation, 'id' | 'tenantId' | 'date' | 'status'> & { date?: string }) => { success: boolean; message: string };
  cancelReservation: (id: string) => void;
  
  addProspect: (prospect: Omit<Prospect, 'id' | 'tenantId' | 'registeredAt' | 'converted'>) => void;
  convertProspectToStudent: (prospectId: string, planName: string, amount: number) => void;
  deleteProspect: (id: string) => void;
  
  addMonthlyPayment: (payment: Omit<MonthlyPayment, 'id' | 'tenantId' | 'status'> & { status?: 'paid' | 'pending' | 'overdue'; paymentMethod?: 'credit_card' | 'bizum' | 'cash' | 'transfer'; lastPaidDate?: string }) => void;
  updatePaymentStatus: (paymentId: string, status: 'paid' | 'pending' | 'overdue', method?: 'credit_card' | 'bizum' | 'cash' | 'transfer') => void;
  deletePayment: (id: string) => void;
  sendLatePaymentNotice: (paymentId: string, channel: 'email' | 'whatsapp') => void;
  updateClientDetails: (oldEmailOrName: string, name: string, email: string, phone: string) => void;
  deleteClient: (emailOrName: string) => void;
  
  addSuggestion: (name: string, email: string, content: string, type?: 'comment' | 'suggestion', phone?: string) => void;
  updateSuggestionStatus: (id: string, status: 'accepted' | 'denied') => void;
  replyToSuggestion: (id: string, reply: string) => void;
  
  // Alerts
  triggerAutoNotifications: () => { count: number; messages: string[] };
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  deleteNotification: (id: string) => void;
  
  // Config
  updateTenantSettings: (settings: Partial<Tenant>) => void;
  importBackup: (backup: {
    tenants: any[];
    classes: any[];
    reservations: any[];
    monthlyPayments: any[];
    prospects: any[];
    notifications: any[];
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or default to mock data
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('fit_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    const saved = localStorage.getItem('fit_active_tenant_id');
    return saved || 'tenant-1';
  });

  const [classes, setClasses] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('fit_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('fit_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment[]>(() => {
    const saved = localStorage.getItem('fit_payments');
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_PAYMENTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('fit_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const saved = localStorage.getItem('fit_prospects');
    return saved ? JSON.parse(saved) : INITIAL_PROSPECTS;
  });

  const [cloudCodigo, setCloudCodigo] = useState<string | null>(null);
  const [publicCodigo, setPublicCodigo] = useState<string | null>(null);
  const [bloqueada, setBloqueada] = useState<boolean>(false);
  // Guardado local a prueba de errores (si el localStorage se llena, la nube es el respaldo real)
  const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) { /* cuota llena u otros: se ignora */ } };
  const [panelTheme, setPanelThemeState] = useState<'claro' | 'medio' | 'oscuro'>(() => {
    const saved = localStorage.getItem('fit_panel_theme');
    return (saved === 'claro' || saved === 'medio' || saved === 'oscuro') ? saved : 'oscuro';
  });
  const setPanelTheme = (t: 'claro' | 'medio' | 'oscuro') => { setPanelThemeState(t); lsSet('fit_panel_theme', t); };

  // Admin login states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('fit_admin_logged');
    return saved !== null ? saved === 'true' : false;
  });
  const [adminLicenseVerified, setAdminLicenseVerified] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('fit_license_verified');
    return saved !== null ? saved === 'true' : false;
  });

  // Active tenant object
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // Sync theme with the active tenant default, but allow manual dynamic switching in the UI!
  const [currentTheme, setCurrentTheme] = useState<'neon-energy' | 'zen-calm' | 'coral-athletics'>(
    activeTenant.theme
  );

  useEffect(() => {
    setCurrentTheme(activeTenant.theme);
  }, [activeTenantId]);

  // Modo oscuro por clase: en el panel manda panelTheme; en público, el tema del local
  useEffect(() => {
    const dark = isAdminLoggedIn ? (panelTheme !== 'claro') : (currentTheme === 'neon-energy');
    document.documentElement.classList.toggle('dark', dark);
  }, [isAdminLoggedIn, panelTheme, currentTheme]);

  // Save changes to localStorage
  useEffect(() => {
    lsSet('fit_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    lsSet('fit_active_tenant_id', activeTenantId);
  }, [activeTenantId]);

  useEffect(() => {
    lsSet('fit_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    lsSet('fit_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    lsSet('fit_payments', JSON.stringify(monthlyPayments));
  }, [monthlyPayments]);

  useEffect(() => {
    lsSet('fit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    lsSet('fit_prospects', JSON.stringify(prospects));
  }, [prospects]);

  // Session saving
  useEffect(() => {
    sessionStorage.setItem('fit_admin_logged', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    sessionStorage.setItem('fit_license_verified', String(adminLicenseVerified));
  }, [adminLicenseVerified]);

  // --- MOLDE CyC: sesión en la nube (carga + autosave) ---
  const iniciarSesionNube = (codigo: string) => {
    const cod = (codigo || '').toUpperCase();
    if (!cod) return;
    setCloudCodigo(cod);
    setTenants(prev => {
      if (prev.some(t => t.id === cod)) return prev;
      const base = prev.find(t => t.id === activeTenantId) || prev[0];
      return [{ ...base, id: cod }, ...prev];
    });
    setActiveTenantId(cod);
    cloudLoad(cod).then(data => {
      if (!data) return;
      if (data.tenants && data.tenants.length) {
        const ct = data.tenants as Tenant[];
        setTenants(prev => { const otros = prev.filter(t => !ct.some(c => c.id === t.id)); return [...ct, ...otros]; });
      }
      if (data.classes) setClasses(data.classes as ClassSession[]);
      if (data.reservations) setReservations(data.reservations as Reservation[]);
      if (data.monthlyPayments) setMonthlyPayments(data.monthlyPayments as MonthlyPayment[]);
      if (data.notifications) setNotifications(data.notifications as Notification[]);
      if (data.prospects) setProspects(data.prospects as Prospect[]);
    });
  };

  // Autosave a la nube (debounce 1.5s) — sincroniza entre dispositivos
  useEffect(() => {
    if (!cloudCodigo || !isAdminLoggedIn) return;
    const t = setTimeout(() => {
      const datos: CloudData = {
        tenants: tenants.filter(t => t.id === cloudCodigo),
        classes: classes.filter(c => c.tenantId === cloudCodigo),
        reservations: reservations.filter(r => r.tenantId === cloudCodigo),
        monthlyPayments: monthlyPayments.filter(p => p.tenantId === cloudCodigo),
        notifications: notifications.filter(n => n.tenantId === cloudCodigo),
        prospects: prospects.filter(p => p.tenantId === cloudCodigo),
      };
      cloudSave(cloudCodigo, datos);
    }, 1500);
    return () => clearTimeout(t);
  }, [cloudCodigo, isAdminLoggedIn, tenants, classes, reservations, monthlyPayments, notifications, prospects]);

  const cambiarClave = (newPassword: string) => cambiarPasswordDueno(cloudCodigo || activeTenantId, newPassword);

  // PÚBLICO: cargar la tienda por ?codigo= (sin login) al abrir
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigo = (params.get('codigo') || '').toUpperCase();
    if (!codigo) return;
    setPublicCodigo(codigo);
    setIsAdminLoggedIn(false);
    zumbPublica(codigo).then(data => {
      if (!data) return;
      if ((data as any).bloqueada) { setBloqueada(true); return; }  // kill switch
      setBloqueada(false);
      if (data.tenants && data.tenants.length) {
        const ct = data.tenants as Tenant[];
        setTenants(prev => { const otros = prev.filter(t => !ct.some(c => c.id === t.id)); return [...ct, ...otros]; });
        setActiveTenantId(codigo);
      }
      if (data.classes) setClasses(data.classes as ClassSession[]);
    });
  }, []);

  // PÚBLICO: refresco en vivo (clases/tema/config) sin recargar
  useEffect(() => {
    if (!publicCodigo || isAdminLoggedIn) return;
    let lastVer = '';
    const iv = setInterval(async () => {
      const ver = await zumbVersion(publicCodigo);
      if (!ver || ver === lastVer) return; // nada cambió → no baja imágenes
      const data = await zumbPublica(publicCodigo);
      if (!data) return;
      lastVer = ver;
      if ((data as any).bloqueada) { setBloqueada(true); return; }  // kill switch
      setBloqueada(false);
      if (data.tenants && data.tenants.length) {
        const ct = data.tenants as Tenant[];
        setTenants(prev => { const otros = prev.filter(t => !ct.some(c => c.id === t.id)); return [...ct, ...otros]; });
      }
      if (data.classes) setClasses(data.classes as ClassSession[]);
    }, 30000);
    return () => clearInterval(iv);
  }, [publicCodigo, isAdminLoggedIn]);

  // PANEL: poll de reservas/prospectos/sugerencias entrantes (merge por id)
  useEffect(() => {
    if (!cloudCodigo || !isAdminLoggedIn) return;
    let lastVer = '';
    const iv = setInterval(async () => {
      const ver = await zumbVersion(cloudCodigo);
      if (!ver || ver === lastVer) return; // nada cambió → no baja imágenes
      const data = await cloudLoad(cloudCodigo);
      if (!data) return;
      lastVer = ver;
      if (data.reservations) setReservations(prev => { const ids = new Set(prev.map(r => r.id)); const nu = (data.reservations as Reservation[]).filter(r => !ids.has(r.id)); return nu.length ? [...prev, ...nu] : prev; });
      if (data.prospects) setProspects(prev => { const ids = new Set(prev.map(p => p.id)); const nu = (data.prospects as Prospect[]).filter(p => !ids.has(p.id)); return nu.length ? [...prev, ...nu] : prev; });
      if (data.tenants && data.tenants.length) {
        const lic = (data.tenants as Tenant[]).find(t => t.id === cloudCodigo);
        if (lic && (lic as any).suggestions) {
          setTenants(prev => prev.map(t => {
            if (t.id !== cloudCodigo) return t;
            const ids = new Set((t.suggestions || []).map(sg => sg.id));
            const nu = (lic as any).suggestions.filter((sg: any) => !ids.has(sg.id));
            return nu.length ? { ...t, suggestions: [...nu, ...(t.suggestions || [])] } : t;
          }));
        }
      }
    }, 30000);
    return () => clearInterval(iv);
  }, [cloudCodigo, isAdminLoggedIn]);

  const setActiveTenant = (tenant: Tenant) => {
    setActiveTenantId(tenant.id);
  };

  // ACTIONS IMPLEMENTATION

  // Classes management
  const addSession = (session: Omit<ClassSession, 'id' | 'tenantId' | 'currentBookings'>) => {
    const newSession: ClassSession = {
      ...session,
      id: `cls-${Date.now()}`,
      tenantId: activeTenant.id,
      currentBookings: 0
    };
    setClasses(prev => [...prev, newSession]);
  };

  const updateSession = (updated: ClassSession) => {
    setClasses(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const deleteSession = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    // Cancel related reservations
    setReservations(prev => prev.map(r => r.classSessionId === id ? { ...r, status: 'cancelled' } : r));
  };

  // Reservations
  const addReservation = (res: Omit<Reservation, 'id' | 'tenantId' | 'date' | 'status'> & { date?: string }) => {
    const targetClass = classes.find(c => c.id === res.classSessionId);
    if (!targetClass) return { success: false, message: 'La clase seleccionada no existe.' };

    if (targetClass.currentBookings >= targetClass.maxCapacity) {
      return { success: false, message: 'Lo sentimos, esta clase ya ha alcanzado su capacidad máxima.' };
    }

    const newRes: Reservation = {
      ...res,
      id: `res-${Date.now()}`,
      tenantId: activeTenant.id,
      date: res.date || new Date().toISOString().split('T')[0],
      status: 'confirmed'
    };

    // Increment current bookings
    setClasses(prev => prev.map(c => c.id === res.classSessionId ? { ...c, currentBookings: c.currentBookings + 1 } : c));
    setReservations(prev => [...prev, newRes]);
    zumbAgregarReserva(activeTenant.id, newRes);

    // Send mock notification confirmation
    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      tenantId: activeTenant.id,
      recipientName: res.studentName,
      recipientContact: res.studentEmail,
      title: res.isFreeTrial ? '🎁 Confirmación de Clase Gratis' : '🔔 Confirmación de Reserva',
      message: `¡Hola ${res.studentName}! Hemos reservado tu plaza para "${targetClass.name}" con ${targetClass.instructor} el ${targetClass.dayOfWeek} a las ${targetClass.time} (${targetClass.duration}). ¡Te esperamos!`,
      date: new Date().toISOString(),
      type: 'session_reminder',
      read: false,
      sent: true
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: '¡Tu plaza ha sido reservada con éxito!' };
  };

  const cancelReservation = (id: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    
    // Decrement class currentBookings
    setClasses(prev => prev.map(c => c.id === reservation.classSessionId ? { ...c, currentBookings: Math.max(0, c.currentBookings - 1) } : c));
  };

  // Free trial class (Prospects) - Auto register in the db for the future!
  const addProspect = (prospect: Omit<Prospect, 'id' | 'tenantId' | 'registeredAt' | 'converted'>) => {
    const newProspect: Prospect = {
      ...prospect,
      id: `pr-${Date.now()}`,
      tenantId: activeTenant.id,
      registeredAt: new Date().toISOString(),
      converted: false
    };
    setProspects(prev => [...prev, newProspect]);
    zumbAgregarProspecto(activeTenant.id, newProspect);

    // Send notification
    const newNotif: Notification = {
      id: `not-pr-${Date.now()}`,
      tenantId: activeTenant.id,
      recipientName: prospect.name,
      recipientContact: prospect.email,
      title: '🎁 Registro de Clase de Prueba Gratis',
      message: `¡Hola ${prospect.name}! Has solicitado una clase gratis de "${prospect.className}". Tus datos han sido guardados para el auto-registro en el sistema de reservas. Un asesor se pondrá en contacto pronto en el teléfono ${prospect.phone}.`,
      date: new Date().toISOString(),
      type: 'session_reminder',
      read: false,
      sent: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const convertProspectToStudent = (prospectId: string, planName: string, amount: number) => {
    const prospect = prospects.find(p => p.id === prospectId);
    if (!prospect) return;

    // 1. Mark prospect as converted
    setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, converted: true } : p));

    // 2. Add to monthly payment list (Active enrollment)
    const newPayment: MonthlyPayment = {
      id: `pay-${Date.now()}`,
      tenantId: activeTenant.id,
      studentName: prospect.name,
      studentEmail: prospect.email,
      studentPhone: prospect.phone,
      planName: planName,
      amount: amount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'pending'
    };
    setMonthlyPayments(prev => [...prev, newPayment]);

    // 3. Make reservation for the requested class
    addReservation({
      classSessionId: prospect.classSessionId,
      className: prospect.className,
      studentName: prospect.name,
      studentEmail: prospect.email,
      studentPhone: prospect.phone,
      isFreeTrial: false,
      paid: false
    });

    // 4. Notify success
    const newNotif: Notification = {
      id: `not-conv-${Date.now()}`,
      tenantId: activeTenant.id,
      recipientName: prospect.name,
      recipientContact: prospect.email,
      title: '🎉 ¡Bienvenido como Alumno Oficial!',
      message: `¡Hola ${prospect.name}! Hemos activado tu plan "${planName}". Tus datos se han registrado automáticamente. Tu primer cargo de ${amount.toFixed(2)}€ se ha programado para el día de pago habitual.`,
      date: new Date().toISOString(),
      type: 'success_payment',
      read: false,
      sent: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const deleteProspect = (id: string) => {
    setProspects(prev => prev.filter(p => p.id !== id));
  };

  // Monthly Payments
  const addMonthlyPayment = (payment: Omit<MonthlyPayment, 'id' | 'tenantId' | 'status'> & { status?: 'paid' | 'pending' | 'overdue'; paymentMethod?: 'credit_card' | 'bizum' | 'cash' | 'transfer'; lastPaidDate?: string }) => {
    const newPayment: MonthlyPayment = {
      ...payment,
      id: `pay-${Date.now()}`,
      tenantId: activeTenant.id,
      status: payment.status || 'pending'
    };
    setMonthlyPayments(prev => [...prev, newPayment]);
  };

  const updatePaymentStatus = (
    paymentId: string,
    status: 'paid' | 'pending' | 'overdue',
    method?: 'credit_card' | 'bizum' | 'cash' | 'transfer'
  ) => {
    setMonthlyPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status,
              paymentMethod: method,
              lastPaidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : p.lastPaidDate
            }
          : p
      )
    );

    const payment = monthlyPayments.find(p => p.id === paymentId);
    if (!payment) return;

    if (status === 'paid') {
      // Send receipt notification
      const newNotif: Notification = {
        id: `not-rcp-${Date.now()}`,
        tenantId: activeTenant.id,
        recipientName: payment.studentName,
        recipientContact: payment.studentEmail,
        title: '✅ Pago Recibido con Éxito',
        message: `¡Muchas gracias, ${payment.studentName}! Hemos registrado correctamente tu pago de ${payment.amount.toFixed(2)}€ para el plan "${payment.planName}" mediante ${method?.toUpperCase() || 'transferencia'}. Tu suscripción sigue activa sin interrupciones.`,
        date: new Date().toISOString(),
        type: 'success_payment',
        read: false,
        sent: true
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const deletePayment = (id: string) => {
    setMonthlyPayments(prev => prev.filter(p => p.id !== id));
  };

  const updateClientDetails = (oldEmailOrName: string, name: string, email: string, phone: string) => {
    const checkMatch = (stEmail: string, stName: string) => {
      const matchKey = oldEmailOrName.trim().toLowerCase();
      return (
        stEmail.trim().toLowerCase() === matchKey ||
        stName.trim().toLowerCase() === matchKey
      );
    };

    setMonthlyPayments(prev =>
      prev.map(p =>
        checkMatch(p.studentEmail, p.studentName)
          ? { ...p, studentName: name, studentEmail: email, studentPhone: phone }
          : p
      )
    );
    setReservations(prev =>
      prev.map(r =>
        checkMatch(r.studentEmail, r.studentName)
          ? { ...r, studentName: name, studentEmail: email, studentPhone: phone }
          : r
      )
    );
    setProspects(prev =>
      prev.map(pr =>
        checkMatch(pr.email, pr.name)
          ? { ...pr, name: name, email: email, phone: phone }
          : pr
      )
    );
  };

  const deleteClient = (emailOrName: string) => {
    const checkMatch = (stEmail: string, stName: string) => {
      const matchKey = emailOrName.trim().toLowerCase();
      return (
        stEmail.trim().toLowerCase() === matchKey ||
        stName.trim().toLowerCase() === matchKey
      );
    };

    setMonthlyPayments(prev => prev.filter(p => !checkMatch(p.studentEmail, p.studentName)));
    setReservations(prev => prev.filter(r => !checkMatch(r.studentEmail, r.studentName)));
    setProspects(prev => prev.filter(pr => !checkMatch(pr.email, pr.name)));
  };

  const sendLatePaymentNotice = (paymentId: string, channel: 'email' | 'whatsapp') => {
    const payment = monthlyPayments.find(p => p.id === paymentId);
    if (!payment) return;

    const messageText = `Hola ${payment.studentName}, te recordamos de forma amistosa que tienes un cargo pendiente de ${payment.amount.toFixed(2)}€ correspondiente a la cuota de "${payment.planName}" que venció el ${payment.dueDate}. Por favor, realiza el pago a la brevedad. ¡Muchas gracias!`;

    const newNotif: Notification = {
      id: `not-late-${Date.now()}`,
      tenantId: activeTenant.id,
      recipientName: payment.studentName,
      recipientContact: channel === 'email' ? payment.studentEmail : payment.studentPhone,
      title: '⚠️ Aviso de Pago Retrasado',
      message: messageText,
      date: new Date().toISOString(),
      type: 'payment_pending',
      read: false,
      sent: true
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Suggestions & Comments
  const addSuggestion = (name: string, email: string, content: string, type: 'comment' | 'suggestion' = 'suggestion', phone?: string) => {
    const newSuggestion: Suggestion = {
      id: `sug-${Date.now()}`,
      name,
      email,
      phone,
      content,
      date: new Date().toISOString(),
      type,
      status: type === 'comment' ? 'pending' : undefined
    };

    setTenants(prev =>
      prev.map(t =>
        t.id === activeTenant.id
          ? { ...t, suggestions: [newSuggestion, ...t.suggestions] }
          : t
      )
    );
    zumbAgregarSugerencia(activeTenant.id, newSuggestion);
  };

  const updateSuggestionStatus = (id: string, status: 'accepted' | 'denied') => {
    setTenants(prev =>
      prev.map(t =>
        t.id === activeTenant.id
          ? {
              ...t,
              suggestions: t.suggestions.map(s =>
                s.id === id ? { ...s, status } : s
              )
            }
          : t
      )
    );
  };

  const replyToSuggestion = (id: string, reply: string) => {
    setTenants(prev =>
      prev.map(t =>
        t.id === activeTenant.id
          ? {
              ...t,
              suggestions: t.suggestions.map(s =>
                s.id === id ? { ...s, reply, repliedAt: new Date().toISOString() } : s
              )
            }
          : t
      )
    );
  };

  // Notifications alerts
  const triggerAutoNotifications = () => {
    let triggeredCount = 0;
    const messages: string[] = [];
    const newNotifs: Notification[] = [];

    // 1. Check for Pending or Overdue payments & generate automatic reminder alerts
    monthlyPayments
      .filter(p => p.tenantId === activeTenant.id && p.status !== 'paid')
      .forEach(payment => {
        // Only generate one if there isn't an identical active unread notification
        const alreadyNotified = notifications.some(
          n => n.recipientContact === payment.studentEmail && n.type === 'payment_pending' && !n.read
        );

        if (!alreadyNotified) {
          triggeredCount++;
          const messageText = `Hola ${payment.studentName}, tienes un cargo pendiente de ${payment.amount.toFixed(2)}€ por la cuota de "${payment.planName}" que vence/venció el ${payment.dueDate}. Puedes regularizarlo desde la app. ¡Gracias!`;
          messages.push(`Enviada alerta de pago pendiente a ${payment.studentName}`);

          newNotifs.push({
            id: `not-auto-${Date.now()}-${triggeredCount}`,
            tenantId: activeTenant.id,
            recipientName: payment.studentName,
            recipientContact: payment.studentEmail,
            title: payment.status === 'overdue' ? '⚠️ Pago Urgente Pendiente' : '⏰ Recordatorio de Pago',
            message: messageText,
            date: new Date().toISOString(),
            type: 'payment_pending',
            read: false,
            sent: true
          });
        }
      });

    // 2. Check for classes happening tomorrow and send session reminders
    const activeClasses = classes.filter(c => c.tenantId === activeTenant.id);
    reservations
      .filter(r => r.tenantId === activeTenant.id && r.status === 'confirmed')
      .forEach(reservation => {
        const targetClass = activeClasses.find(c => c.id === reservation.classSessionId);
        if (targetClass) {
          const alreadyNotified = notifications.some(
            n => n.recipientContact === reservation.studentEmail && n.type === 'session_reminder' && n.title.includes(targetClass.name)
          );

          if (!alreadyNotified) {
            triggeredCount++;
            const messageText = `¡Hola ${reservation.studentName}! Recuerda tu reserva mañana para la clase "${targetClass.name}" con ${targetClass.instructor} a las ${targetClass.time} hs. ¡Prepárate para darlo todo! 💪`;
            messages.push(`Enviado recordatorio de clase "${targetClass.name}" a ${reservation.studentName}`);

            newNotifs.push({
              id: `not-auto-${Date.now()}-${triggeredCount}`,
              tenantId: activeTenant.id,
              recipientName: reservation.studentName,
              recipientContact: reservation.studentEmail,
              title: `⏰ Recordatorio Mañana: ${targetClass.name}`,
              message: messageText,
              date: new Date().toISOString(),
              type: 'session_reminder',
              read: false,
              sent: true
            });
          }
        }
      });

    if (newNotifs.length > 0) {
      setNotifications(prev => [...newNotifs, ...prev]);
    }

    return { count: triggeredCount, messages };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.filter(n => n.tenantId !== activeTenant.id));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Update Tenant Configuration (Ubicación, Phone, etc.)
  const updateTenantSettings = (settings: Partial<Tenant>) => {
    setTenants(prev =>
      prev.map(t => (t.id === activeTenant.id ? { ...t, ...settings } : t))
    );
  };

  const importBackup = (backup: any) => {
    if (backup.tenants) setTenants(backup.tenants);
    if (backup.classes) setClasses(backup.classes);
    if (backup.reservations) setReservations(backup.reservations);
    if (backup.monthlyPayments) setMonthlyPayments(backup.monthlyPayments);
    if (backup.prospects) setProspects(backup.prospects);
    if (backup.notifications) setNotifications(backup.notifications);
  };

  return (
    <AppContext.Provider
      value={{
        activeTenant,
        setActiveTenant,
        tenants,
        setTenants,
        classes,
        reservations,
        monthlyPayments,
        notifications,
        prospects,
        isAdminLoggedIn,
        bloqueada,
        publicCodigo,
        setIsAdminLoggedIn,
        adminLicenseVerified,
        setAdminLicenseVerified,
        iniciarSesionNube,
        cambiarClave,
        panelTheme,
        setPanelTheme,
        currentTheme,
        setCurrentTheme,
        addSession,
        updateSession,
        deleteSession,
        addReservation,
        cancelReservation,
        addProspect,
        convertProspectToStudent,
        deleteProspect,
        addMonthlyPayment,
        updatePaymentStatus,
        deletePayment,
        sendLatePaymentNotice,
        updateClientDetails,
        deleteClient,
        addSuggestion,
        updateSuggestionStatus,
        replyToSuggestion,
        triggerAutoNotifications,
        markNotificationAsRead,
        clearNotifications,
        deleteNotification,
        updateTenantSettings,
        importBackup
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
