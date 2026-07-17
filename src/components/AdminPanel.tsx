/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClassSession, MonthlyPayment, Prospect, MusicTrack, Tenant } from '../types';
import { THEMES } from '../lib/theme';
import { comprimirImagen } from '../lib/img';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  UserPlus,
  Plus,
  Trash,
  Check,
  Calendar,
  Layers,
  Settings,
  Mail,
  Smartphone,
  MapPin,
  Bell,
  MessageSquare,
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  Gift,
  CheckCheck,
  LayoutDashboard,
  Image,
  Palette,
  Upload,
  Edit2,
  Trash2,
  ArrowUpDown,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Star,
  Link
} from 'lucide-react';

const DEFAULT_PREDEFINED_TRACKS: MusicTrack[] = [
  { id: 'def-1', name: 'Ritmo Latino ⚡', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', isPredefined: true },
  { id: 'def-2', name: 'Meditación Zen 🌸', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', isPredefined: true },
  { id: 'def-3', name: 'Electro Cardio 🏃‍♀️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', isPredefined: true },
  { id: 'def-4', name: 'Yoga Suave 🧘', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', isPredefined: true },
  { id: 'def-5', name: 'Spinning Power 🔥', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', isPredefined: true }
];

export default function AdminPanel() {
  const {
    activeTenant,
    classes,
    reservations,
    monthlyPayments,
    notifications,
    prospects,
    addSession,
    deleteSession,
    updateSession,
    updatePaymentStatus,
    addMonthlyPayment,
    convertProspectToStudent,
    deleteProspect,
    deletePayment,
    sendLatePaymentNotice,
    updateClientDetails,
    deleteClient,
    triggerAutoNotifications,
    updateTenantSettings,
    currentTheme,
    importBackup,
    tenants,
    deleteNotification,
    clearNotifications,
    updateSuggestionStatus,
    replyToSuggestion,
    panelTheme,
    setPanelTheme
  } = useApp();

  const theme = THEMES[currentTheme];

  const currentPlans = useMemo(() => {
    return activeTenant.customPlans || [
      'Pase Mensual Zumba',
      'Socio VIP Ilimitado',
      'Bono 10 Sesiones',
      'Plan Atlético HIIT',
      'Clase de Prueba Gratis'
    ];
  }, [activeTenant.customPlans]);

  // Tab controls
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'classes' | 'prospects' | 'suggestions' | 'notifs' | 'config' | 'clients' | 'gallery' | 'theme' | 'music'>('dashboard');

  // Custom visual theme customizer states
  const [editHeroImage, setEditHeroImage] = useState(activeTenant.customHeroImage || '');
  const [editFontHeading, setEditFontHeading] = useState(activeTenant.customFontHeading || 'Space Grotesk');
  const [editFontBody, setEditFontBody] = useState(activeTenant.customFontBody || 'Inter');
  const [editHeroTextColor, setEditHeroTextColor] = useState(activeTenant.customHeroTextColor || '');
  const [editHeroSloganColor, setEditHeroSloganColor] = useState(activeTenant.customHeroSloganColor || '');
  const [editServiceTitleColor, setEditServiceTitleColor] = useState(activeTenant.customServiceTitleColor || '');
  const [editClassTitleColor, setEditClassTitleColor] = useState(activeTenant.customClassTitleColor || '');
  const [editCardTextColor, setEditCardTextColor] = useState(activeTenant.customCardTextColor || '');
  const [editCardBgColor, setEditCardBgColor] = useState(activeTenant.customCardBgColor || '');
  const [editScheduleBadgeBgColor, setEditScheduleBadgeBgColor] = useState(activeTenant.customScheduleBadgeBgColor || '');
  const [editScheduleBadgeTextColor, setEditScheduleBadgeTextColor] = useState(activeTenant.customScheduleBadgeTextColor || '');
  const [editNeonGlow, setEditNeonGlow] = useState(activeTenant.customNeonGlow || false);
  const [themeSuccess, setThemeSuccess] = useState('');

  // Gallery custom slots editing states
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editSlotTitleText, setEditSlotTitleText] = useState('');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  // Suggestion & comments sub-tabs & actions state
  const [sugSubTab, setSugSubTab] = useState<'comments' | 'suggestions'>('comments');
  const [replyingSugId, setReplyingSugId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showLatePaymentNoticeModal, setShowLatePaymentNoticeModal] = useState<MonthlyPayment | null>(null);

  // Search/Filter state
  const [payFilter, setPayFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [paySearch, setPaySearch] = useState('');

  // New class form state
  const [newClassName, setNewClassName] = useState('');
  const [newClassInstructor, setNewClassInstructor] = useState('');
  const [newClassDay, setNewClassDay] = useState('Lunes');
  const [newClassTime, setNewClassTime] = useState('19:00');
  const [newClassCapacity, setNewClassCapacity] = useState(20);
  const [newClassPrice, setNewClassPrice] = useState(8);
  const [newClassDuration, setNewClassDuration] = useState('50 min');
  const [newClassImage, setNewClassImage] = useState('https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600');
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  // New monthly charge form state
  const [newChargeName, setNewChargeName] = useState('');
  const [newChargeEmail, setNewChargeEmail] = useState('');
  const [newChargePhone, setNewChargePhone] = useState('');
  const [newChargePlan, setNewChargePlan] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState(40);
  const [newChargeDueDate, setNewChargeDueDate] = useState('');
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);

  // Auto conversion details state
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [conversionPlan, setConversionPlan] = useState('');
  const [conversionAmount, setConversionAmount] = useState(55);

  // Client Management States
  const [editingClient, setEditingClient] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientEmail, setEditClientEmail] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [clientFilter, setClientFilter] = useState<'all' | 'up_to_date' | 'with_debts'>('all');
  const [clientSortOrder, setClientSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Add Client Form States
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientPlan, setNewClientPlan] = useState('');
  const [newClientAmount, setNewClientAmount] = useState(40);
  const [newClientDueDate, setNewClientDueDate] = useState('');
  const [newClientStatus, setNewClientStatus] = useState<'paid' | 'pending'>('pending');

  // Inline Plan Creator/Deleter states
  const [showAddPlanInput, setShowAddPlanInput] = useState(false);
  const [newCustomPlanName, setNewCustomPlanName] = useState('');
  const [showDeletePlanConfirm, setShowDeletePlanConfirm] = useState(false);

  // Configuration edit state
  const [editAddress, setEditAddress] = useState(activeTenant.address);
  const [editMapsUrl, setEditMapsUrl] = useState(activeTenant.mapsUrl);
  const [editPhone, setEditPhone] = useState(activeTenant.phone);
  const [editPhonePrefix, setEditPhonePrefix] = useState(activeTenant.phonePrefix || '+549');
  const [editLanguage, setEditLanguage] = useState<'es' | 'en'>(activeTenant.language || 'es');
  const [editCurrencySymbol, setEditCurrencySymbol] = useState(activeTenant.currencySymbol || '€');
  const [editEnableOnlinePayments, setEditEnableOnlinePayments] = useState<boolean>(
    activeTenant.enableOnlinePayments !== false
  );
  const [editBgMusicUrl, setEditBgMusicUrl] = useState(activeTenant.customBgMusicUrl || '');
  
  // Music tab specific states and ref
  const [adminPlayingTrackId, setAdminPlayingTrackId] = useState<string | null>(null);
  const [musicCustomUrl, setMusicCustomUrl] = useState('');
  const [musicCustomName, setMusicCustomName] = useState('');
  const adminAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const [configSuccess, setConfigSuccess] = useState('');
  const [backupSuccess, setBackupSuccess] = useState('');

  // Sync selected plans when customPlans updates
  useEffect(() => {
    if (currentPlans && currentPlans.length > 0) {
      if (!newClientPlan || !currentPlans.includes(newClientPlan)) {
        setNewClientPlan(currentPlans[0]);
      }
      if (!newChargePlan || !currentPlans.includes(newChargePlan)) {
        setNewChargePlan(currentPlans[0]);
      }
      if (!conversionPlan || !currentPlans.includes(conversionPlan)) {
        setConversionPlan(currentPlans[0]);
      }
    }
  }, [currentPlans, newClientPlan, newChargePlan, conversionPlan]);
  const [backupError, setBackupError] = useState('');

  // Sync edits when active tenant changes
  useEffect(() => {
    setEditAddress(activeTenant.address);
    setEditMapsUrl(activeTenant.mapsUrl);
    setEditPhone(activeTenant.phone);
    setEditPhonePrefix(activeTenant.phonePrefix || '+549');
    setEditLanguage(activeTenant.language || 'es');
    setEditCurrencySymbol(activeTenant.currencySymbol || '€');
    setEditEnableOnlinePayments(activeTenant.enableOnlinePayments !== false);
    setEditHeroImage(activeTenant.customHeroImage || '');
    setEditFontHeading(activeTenant.customFontHeading || 'Space Grotesk');
    setEditFontBody(activeTenant.customFontBody || 'Inter');
    setEditHeroTextColor(activeTenant.customHeroTextColor || '');
    setEditHeroSloganColor(activeTenant.customHeroSloganColor || '');
    setEditServiceTitleColor(activeTenant.customServiceTitleColor || '');
    setEditClassTitleColor(activeTenant.customClassTitleColor || '');
    setEditCardTextColor(activeTenant.customCardTextColor || '');
    setEditCardBgColor(activeTenant.customCardBgColor || '');
    setEditScheduleBadgeBgColor(activeTenant.customScheduleBadgeBgColor || '');
    setEditScheduleBadgeTextColor(activeTenant.customScheduleBadgeTextColor || '');
    setEditNeonGlow(activeTenant.customNeonGlow || false);
    setEditBgMusicUrl(activeTenant.customBgMusicUrl || '');
  }, [activeTenant]);

  // Effect to handle admin panel music preview
  useEffect(() => {
    if (adminAudioRef.current) {
      adminAudioRef.current.pause();
      if (adminPlayingTrackId) {
        const playlist = activeTenant.customBgMusicPlaylist || DEFAULT_PREDEFINED_TRACKS;
        const track = playlist.find(t => t.id === adminPlayingTrackId);
        if (track) {
          adminAudioRef.current.src = track.url;
          adminAudioRef.current.load();
          adminAudioRef.current.play().catch(err => {
            console.log("Admin playback blocked/failed:", err);
            setAdminPlayingTrackId(null);
          });
        }
      }
    }
  }, [adminPlayingTrackId, activeTenant.customBgMusicPlaylist]);

  // Turn off preview when leaving the music tab
  useEffect(() => {
    if (activeTab !== 'music') {
      setAdminPlayingTrackId(null);
    }
  }, [activeTab]);

  // Auto-notification simulation feedback
  const [notifTriggerResults, setNotifTriggerResults] = useState<{ count: number; messages: string[] } | null>(null);

  // Filter lists by current active tenant
  const tenantPayments = monthlyPayments.filter((p) => p.tenantId === activeTenant.id);
  const tenantClasses = classes.filter((c) => c.tenantId === activeTenant.id);
  const tenantReservations = reservations.filter((r) => r.tenantId === activeTenant.id);
  const tenantProspects = prospects.filter((p) => p.tenantId === activeTenant.id);
  const tenantNotifs = notifications.filter((n) => n.tenantId === activeTenant.id);

  const clients = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; payments: MonthlyPayment[]; reservationsCount: number }>();
    
    tenantPayments.forEach(p => {
      const key = p.studentEmail.trim().toLowerCase() || p.studentName.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: p.studentName,
          email: p.studentEmail,
          phone: p.studentPhone,
          payments: [],
          reservationsCount: 0
        });
      }
      map.get(key)!.payments.push(p);
    });

    tenantReservations.forEach(r => {
      const key = r.studentEmail.trim().toLowerCase() || r.studentName.trim().toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.reservationsCount++;
      } else {
        map.set(key, {
          name: r.studentName,
          email: r.studentEmail,
          phone: r.studentPhone,
          payments: [],
          reservationsCount: 1
        });
      }
    });

    return Array.from(map.values());
  }, [tenantPayments, tenantReservations]);

  // Analytics
  const totalPaid = tenantPayments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = tenantPayments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = tenantPayments.filter(p => p.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);
  const totalSubscribers = new Set(tenantPayments.map(p => p.studentEmail)).size;

  const formatPrice = (amount: number) => {
    const sym = activeTenant.currencySymbol || '€';
    if (sym === '€') {
      return `${amount.toFixed(2)}€`;
    }
    return `${sym}${amount.toFixed(2)}`;
  };

  // Search / filter payment results
  const filteredPayments = tenantPayments.filter((pay) => {
    const matchesSearch = pay.studentName.toLowerCase().includes(paySearch.toLowerCase()) || 
                          pay.studentEmail.toLowerCase().includes(paySearch.toLowerCase()) || 
                          pay.planName.toLowerCase().includes(paySearch.toLowerCase());
    
    if (payFilter === 'all') return matchesSearch;
    return pay.status === payFilter && matchesSearch;
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName || !newClassInstructor) return;
    
    addSession({
      name: newClassName,
      instructor: newClassInstructor,
      dayOfWeek: newClassDay,
      time: newClassTime,
      maxCapacity: Number(newClassCapacity),
      price: Number(newClassPrice),
      duration: newClassDuration,
      image: newClassImage
    });

    // Reset Form
    setNewClassName('');
    setNewClassInstructor('');
    setShowAddClassModal(false);
  };

  const handleCreateCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChargeName || !newChargeEmail) return;

    addMonthlyPayment({
      studentName: newChargeName,
      studentEmail: newChargeEmail,
      studentPhone: newChargePhone,
      planName: newChargePlan,
      amount: Number(newChargeAmount),
      dueDate: newChargeDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    // Reset Form
    setNewChargeName('');
    setNewChargeEmail('');
    setNewChargePhone('');
    setNewChargeDueDate('');
    setShowAddChargeModal(false);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) return;

    addMonthlyPayment({
      studentName: newClientName,
      studentEmail: newClientEmail,
      studentPhone: newClientPhone,
      planName: newClientPlan,
      amount: Number(newClientAmount),
      dueDate: newClientDueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: newClientStatus,
      paymentMethod: newClientStatus === 'paid' ? 'cash' : undefined,
      lastPaidDate: newClientStatus === 'paid' ? new Date().toISOString().split('T')[0] : undefined
    });

    // Reset Form
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientPlan(currentPlans[0] || '');
    setNewClientAmount(40);
    setNewClientDueDate('');
    setNewClientStatus('pending');
    setShowAddPlanInput(false);
    setNewCustomPlanName('');
    setShowDeletePlanConfirm(false);
    setShowAddClientModal(false);
    alert('🎉 ¡Cliente agregado con éxito y su plan/cuota inicial ha sido registrado!');
  };

  const handleConvertProspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProspect) return;

    convertProspectToStudent(selectedProspect.id, conversionPlan, conversionAmount);
    setSelectedProspect(null);
    alert('🎉 ¡Registro automático completado con éxito! El alumno ha sido activado y matriculado en el plan seleccionado.');
  };

  const handleTriggerNotifsSim = () => {
    const results = triggerAutoNotifications();
    setNotifTriggerResults(results);
    setTimeout(() => {
      setNotifTriggerResults(null);
    }, 6000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantSettings({
      address: editAddress,
      mapsUrl: editMapsUrl,
      phone: editPhone,
      phonePrefix: editPhonePrefix,
      language: editLanguage,
      currencySymbol: editCurrencySymbol,
      enableOnlinePayments: editEnableOnlinePayments,
      customBgMusicUrl: editBgMusicUrl
    });
    setConfigSuccess('¡Configuración de Sede guardada correctamente!');
    setTimeout(() => setConfigSuccess(''), 3000);
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo "${file.name}" pesa demasiado para guardarlo dentro de la app (máx ~5MB, y aun así puede fallar la sincronización). Mejor pegá un enlace directo .mp3 o un link de YouTube en el campo de URL de arriba.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        
        const newTrack: MusicTrack = {
          id: 'local-' + Date.now() + '-' + Math.round(Math.random() * 1000),
          name: file.name.replace(/\.[^/.]+$/, ""), // quitar extensión
          url: base64Url,
          isPredefined: false
        };

        const currentPlaylist = activeTenant.customBgMusicPlaylist || [...DEFAULT_PREDEFINED_TRACKS];
        const updatedPlaylist = [...currentPlaylist, newTrack];
        updateTenantSettings({
          customBgMusicPlaylist: updatedPlaylist
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddTrackByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicCustomUrl.trim()) return;
    
    let trackName = musicCustomName.trim();
    if (!trackName) {
      try {
        const urlObj = new URL(musicCustomUrl);
        trackName = urlObj.pathname.split('/').pop() || 'Tema Enlace';
        trackName = decodeURIComponent(trackName).replace(/\.[^/.]+$/, "");
      } catch (err) {
        trackName = 'Tema Web Personalizado';
      }
    }

    const newTrack: MusicTrack = {
      id: 'url-' + Date.now() + '-' + Math.round(Math.random() * 1000),
      name: trackName,
      url: musicCustomUrl.trim(),
      isPredefined: false
    };

    const currentPlaylist = activeTenant.customBgMusicPlaylist || [...DEFAULT_PREDEFINED_TRACKS];
    updateTenantSettings({
      customBgMusicPlaylist: [...currentPlaylist, newTrack]
    });
    
    setMusicCustomUrl('');
    setMusicCustomName('');
    alert('🎉 ¡Canción agregada por enlace con éxito!');
  };

  const handleDeleteTrack = (idToDelete: string) => {
    const currentPlaylist = activeTenant.customBgMusicPlaylist || [...DEFAULT_PREDEFINED_TRACKS];
    const trackToDelete = currentPlaylist.find(t => t.id === idToDelete);
    const updatedPlaylist = currentPlaylist.filter(t => t.id !== idToDelete);
    
    const nextSettings: Partial<Tenant> = { customBgMusicPlaylist: updatedPlaylist };
    if (trackToDelete && activeTenant.customBgMusicUrl === trackToDelete.url) {
      nextSettings.customBgMusicUrl = '';
      setEditBgMusicUrl('');
    }
    
    updateTenantSettings(nextSettings);
    
    if (adminPlayingTrackId === idToDelete) {
      setAdminPlayingTrackId(null);
    }
  };

  const handleResetPlaylist = () => {
    if (confirm('¿Estás seguro de que deseas restablecer la lista de reproducción a los temas predeterminados? Se borrarán tus canciones cargadas.')) {
      updateTenantSettings({
        customBgMusicPlaylist: [...DEFAULT_PREDEFINED_TRACKS],
        customBgMusicUrl: ''
      });
      setEditBgMusicUrl('');
      setAdminPlayingTrackId(null);
      alert('♻️ Lista restablecida a las canciones predeterminadas.');
    }
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        tenants,
        classes,
        reservations,
        monthlyPayments,
        prospects,
        notifications
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupData, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `copia_seguridad_completa_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setBackupSuccess('Copia de seguridad exportada con éxito ✅');
      setTimeout(() => setBackupSuccess(''), 4000);
    } catch (err) {
      setBackupError('Error al exportar copia de seguridad');
      setTimeout(() => setBackupError(''), 4000);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.tenants || !parsed.classes) {
          throw new Error('Formato inválido: Falta información esencial');
        }
        importBackup(parsed);
        setBackupSuccess('Copia de seguridad restaurada correctamente 🎉');
        setTimeout(() => setBackupSuccess(''), 4000);
      } catch (err) {
        setBackupError('Error al importar: Asegúrate de que el archivo JSON sea una copia de seguridad válida.');
        setTimeout(() => setBackupError(''), 5000);
      }
    };
    fileReader.readAsText(file);
  };

  // Dynamic fallback for custom gallery slots
  const slots = useMemo(() => {
    if (activeTenant.gallerySlots && activeTenant.gallerySlots.length > 0) {
      return activeTenant.gallerySlots;
    }
    const fallbackImages = activeTenant.gallery || [];
    return [
      { id: 'slot-1', title: 'Sala de Baile / Zumba', images: fallbackImages[0] ? [fallbackImages[0]] : [] },
      { id: 'slot-2', title: 'Entrenamiento Funcional', images: fallbackImages[1] ? [fallbackImages[1]] : [] },
      { id: 'slot-3', title: 'Instalaciones & Equipamiento', images: fallbackImages[2] ? [fallbackImages[2]] : [] },
      { id: 'slot-4', title: 'Nuestra Comunidad', images: fallbackImages[3] ? [fallbackImages[3]] : [] },
    ];
  }, [activeTenant.gallery, activeTenant.gallerySlots]);

  const handleUpdateGallerySlots = (updatedSlots: any[]) => {
    updateTenantSettings({
      gallerySlots: updatedSlots
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await comprimirImagen(file, 1200, 0.72);
    if (!base64) { alert('No se pudo procesar esta imagen (formato no soportado o muy grande).'); return; }
    const updated = slots.map(s => {
      if (s.id === slotId) {
        if (s.images.length >= 5) { alert('Máximo de 5 imágenes permitido por cuadradito.'); return s; }
        return { ...s, images: [...s.images, base64] };
      }
      return s;
    });
    handleUpdateGallerySlots(updated);
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenantSettings({
      customHeroImage: editHeroImage,
      customFontHeading: editFontHeading,
      customFontBody: editFontBody,
      customHeroTextColor: editHeroTextColor,
      customHeroSloganColor: editHeroSloganColor,
      customServiceTitleColor: editServiceTitleColor,
      customClassTitleColor: editClassTitleColor,
      customCardTextColor: editCardTextColor,
      customCardBgColor: editCardBgColor,
      customScheduleBadgeBgColor: editScheduleBadgeBgColor,
      customScheduleBadgeTextColor: editScheduleBadgeTextColor,
      customNeonGlow: editNeonGlow
    });
    setThemeSuccess('¡Tema y personalización visual aplicados con éxito! El diseño se ha actualizado.');
    setTimeout(() => setThemeSuccess(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Admin Title Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-200 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-stone-900 dark:text-zinc-100 flex items-center space-x-2">
            <span>⚙️ Panel de Control Administrativo</span>
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-1">
            Gimnasio activo: <strong className="text-stone-800 dark:text-zinc-200">{activeTenant.name}</strong> • Licencia de Software Verificada
          </p>
        </div>
        <div className="flex items-center gap-1 mt-3 md:mt-0 bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-full p-1 self-start">
          {(['claro', 'medio', 'oscuro'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPanelTheme(t)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition cursor-pointer ${panelTheme === t ? 'bg-amber-500 text-black' : 'text-stone-500 dark:text-zinc-400 hover:bg-stone-200 dark:hover:bg-zinc-800'}`}
            >
              {t === 'claro' ? '☀️ Claro' : t === 'medio' ? '🌗 Medio' : '🌙 Oscuro'}
            </button>
          ))}
        </div>
      </div>

      {/* Auto notification notification popup feedback */}
      <AnimatePresence>
        {notifTriggerResults && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-zinc-950 border border-amber-500/30 rounded-2xl text-stone-100"
          >
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div className="flex-grow">
                <h4 className="text-sm font-bold text-amber-400 font-mono">
                  🤖 Automatización de Recordatorios Ejecutada ({notifTriggerResults.count} Alertas Generadas)
                </h4>
                {notifTriggerResults.count === 0 ? (
                  <p className="text-xs text-stone-400 mt-1">
                    No hay nuevos pagos vencidos o reservas de mañana que no hayan sido ya notificadas en el sistema.
                  </p>
                ) : (
                  <ul className="text-xs text-stone-300 space-y-1 mt-2 list-disc pl-4 font-mono max-h-40 overflow-y-auto">
                    {notifTriggerResults.messages.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento Box Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Recaudación Cobrada</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-stone-900 dark:text-zinc-100 font-mono">
              {formatPrice(totalPaid)}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +100% Correcto
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pendiente (Mes Activo)</span>
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-stone-900 dark:text-zinc-100 font-mono">
              {formatPrice(totalPending)}
            </h3>
            <span className="text-[10px] text-amber-600 font-bold font-mono">
              En plazo de pago
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Deuda Vencida ⚠️</span>
            <div className="p-2 bg-red-500/10 text-red-600 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">
              {formatPrice(totalOverdue)}
            </h3>
            <span className="text-[10px] text-red-500 font-bold font-mono">
              Requiere aviso inmediato
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Alumnos con Plan</span>
            <div className="p-2 bg-pink-500/10 text-pink-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-stone-900 dark:text-zinc-100 font-mono">
              {totalSubscribers}
            </h3>
            <span className="text-[10px] text-pink-600 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded">
              Suscripción Activa
            </span>
          </div>
        </div>

      </section>

      {/* Dual-pane Layout: Sidebar + Selected Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Column */}
        <div className="lg:col-span-3 bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-4 rounded-3xl space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-zinc-500 px-3 pb-2 border-b border-stone-200/50 dark:border-zinc-800/80 mb-2 font-mono">
            Navegación Admin
          </p>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>📊 Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>💳 Encargos & Pagos</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="flex-grow flex items-center justify-between">
              <span>👥 Clientes</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'clients' ? 'bg-black/20 text-black font-extrabold' : 'bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'}`}>{clients.length}</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('prospects')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'prospects'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span className="flex-grow flex items-center justify-between">
              <span>🎁 Clases Gratis</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'prospects' ? 'bg-black/20 text-black font-extrabold' : 'bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'}`}>{tenantProspects.length}</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'suggestions'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="flex-grow flex items-center justify-between">
              <span>💬 Buzón</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'suggestions' ? 'bg-black/20 text-black font-extrabold' : 'bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'}`}>{activeTenant.suggestions.length}</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>🖼️ Servicios y Galería</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'theme'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>🎨 Tema y Fuentes</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'music'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>🎵 Música de Fondo</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'config'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>📍 Ajustes Sede</span>
          </button>

          <button
            onClick={() => setActiveTab('notifs')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-3 cursor-pointer ${
              activeTab === 'notifs'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>📢 Historial Alertas</span>
          </button>
        </div>

        {/* Content Pane Column */}
        <div className="lg:col-span-9 bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-800 p-6 rounded-3xl min-h-[500px]">
          
          {/* Dashboard Tab Content */}
          {activeTab === 'dashboard' && (() => {
            // Get popularity list (reservations of each classSessionId, ordered by amount descending)
            const classPopularity = tenantClasses.map(c => {
              const classRes = tenantReservations.filter(r => r.classSessionId === c.id);
              const bookingsCount = classRes.length;
              const occupancyPct = c.maxCapacity > 0 ? (bookingsCount / c.maxCapacity) * 100 : 0;
              const revenueEst = bookingsCount * (c.price || 0);
              return {
                ...c,
                bookingsCount,
                occupancyPct,
                revenueEst
              };
            });
            
            // Sort by count descending
            classPopularity.sort((a, b) => b.bookingsCount - a.bookingsCount);

            // Plan statistics
            const planRevenue: { [key: string]: { count: number; total: number } } = {};
            tenantPayments.forEach(p => {
              if (!planRevenue[p.planName]) {
                planRevenue[p.planName] = { count: 0, total: 0 };
              }
              planRevenue[p.planName].count++;
              if (p.status === 'paid') {
                planRevenue[p.planName].total += p.amount;
              }
            });

            return (
              <div className="space-y-8">
                {/* Dashboard Title */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-100 dark:border-zinc-800/80 pb-4">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-stone-900 dark:text-white flex items-center space-x-2">
                      <span>📊 Cuadro de Mando Directivo</span>
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Rendimiento de facturación general y ranking de popularidad de actividades.
                    </p>
                  </div>
                  <span className="mt-2 md:mt-0 px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-mono font-bold rounded-full border border-amber-500/10">
                    Sincronizado • Tiempo Real
                  </span>
                </div>

                {/* Dashboard Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl">
                    <div className="flex items-center justify-between text-emerald-600">
                      <span className="text-[10px] font-black uppercase tracking-wider">Eficiencia de Cobro</span>
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-2xl font-black text-stone-900 dark:text-white font-mono">
                        {((totalPaid / (totalPaid + totalPending + totalOverdue || 1)) * 100).toFixed(1)}%
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-1">
                        De un total facturado de <strong>{formatPrice(totalPaid + totalPending + totalOverdue)}</strong>.
                      </p>
                      {/* Progress bar */}
                      <div className="w-full bg-stone-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${(totalPaid / (totalPaid + totalPending + totalOverdue || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl">
                    <div className="flex items-center justify-between text-amber-600">
                      <span className="text-[10px] font-black uppercase tracking-wider">Pendientes de Pago</span>
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-2xl font-black text-amber-600 font-mono">
                        {formatPrice(totalPending)}
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Socio cuota corriente. En plazo de vencimiento.
                      </p>
                      <div className="w-full bg-stone-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full rounded-full" 
                          style={{ width: `${(totalPending / (totalPaid + totalPending + totalOverdue || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl">
                    <div className="flex items-center justify-between text-red-600">
                      <span className="text-[10px] font-black uppercase tracking-wider">Deuda Vencida (Alerta)</span>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-2xl font-black text-red-500 font-mono">
                        {formatPrice(totalOverdue)}
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Requiere recordatorio vía WhatsApp/Email.
                      </p>
                      <div className="w-full bg-stone-200 dark:bg-zinc-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className="bg-red-500 h-full rounded-full" 
                          style={{ width: `${(totalOverdue / (totalPaid + totalPending + totalOverdue || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Services Table: de mayor a menor */}
                <div className="border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-stone-50/20 dark:bg-zinc-900/10">
                  <div className="bg-stone-100/50 dark:bg-zinc-900/50 px-5 py-4 border-b border-stone-200 dark:border-zinc-800">
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200 flex items-center space-x-1.5">
                      <span>👑 Clases Más Elegidas (Ranking de Mayor a Menor)</span>
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      Ordenadas por volumen de reservas confirmadas en la plataforma de mayor a menor con detalle de aforo y facturación.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-zinc-800 text-[10px] uppercase tracking-wider text-stone-400 font-mono bg-stone-50/50 dark:bg-zinc-900/20">
                          <th className="py-3 px-4">Puesto</th>
                          <th className="py-3 px-4">Clase / Actividad</th>
                          <th className="py-3 px-4">Instructor</th>
                          <th className="py-3 px-4">Horario</th>
                          <th className="py-3 px-4 text-center">Reservas / Aforo</th>
                          <th className="py-3 px-4 text-right">Recaudación Estimada</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200/50 dark:divide-zinc-800/80">
                        {classPopularity.map((item, index) => {
                          let rankLabel = `${index + 1}º`;
                          if (index === 0) rankLabel = '🥇 1º';
                          else if (index === 1) rankLabel = '🥈 2º';
                          else if (index === 2) rankLabel = '🥉 3º';

                          return (
                            <tr key={item.id} className="hover:bg-stone-50/40 dark:hover:bg-zinc-800/10">
                              <td className="py-3.5 px-4 font-black text-stone-800 dark:text-zinc-200 font-mono">
                                {rankLabel}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-2">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-7 h-7 rounded-lg object-cover border border-stone-200/50 dark:border-zinc-800"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="font-extrabold text-stone-900 dark:text-white">{item.name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-stone-600 dark:text-zinc-300 font-medium">
                                {item.instructor}
                              </td>
                              <td className="py-3.5 px-4 text-stone-500 font-mono text-[10px]">
                                {item.dayOfWeek} • {item.time} hs
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex flex-col items-center justify-center space-y-1">
                                  <span className="font-bold text-stone-800 dark:text-zinc-200 font-mono">{item.bookingsCount} / {item.maxCapacity}</span>
                                  <div className="w-20 bg-stone-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${item.occupancyPct >= 80 ? 'bg-rose-500' : 'bg-amber-500'}`}
                                      style={{ width: `${Math.min(item.occupancyPct, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-right font-bold text-emerald-600 font-mono">
                                {formatPrice(item.revenueEst)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Plans distribution detail cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-2xl">
                    <h4 className="text-xs font-black uppercase text-stone-800 dark:text-zinc-200 mb-3">
                      📦 Distribución de Planes
                    </h4>
                    <div className="space-y-3">
                      {Object.keys(planRevenue).map(plan => (
                        <div key={plan} className="text-xs flex items-center justify-between">
                          <span className="font-semibold text-stone-600 dark:text-zinc-400">{plan}</span>
                          <span className="font-mono bg-stone-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-bold">
                            {planRevenue[plan].count} Alumnos
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-2xl">
                    <h4 className="text-xs font-black uppercase text-stone-800 dark:text-zinc-200 mb-3">
                      📈 Facturación Real por Plan
                    </h4>
                    <div className="space-y-3">
                      {Object.keys(planRevenue).map(plan => (
                        <div key={plan} className="text-xs flex items-center justify-between">
                          <span className="font-semibold text-stone-600 dark:text-zinc-400">{plan}</span>
                          <span className="font-mono text-emerald-600 font-extrabold">
                            {formatPrice(planRevenue[plan].total)} Cobrados
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Gallery Tab Content (Servicios y Galería CRUD) */}
          {activeTab === 'gallery' && (() => {
            const currentSlots = slots;

            const handleCreateService = (e: React.FormEvent) => {
              e.preventDefault();
              if (!newServiceName.trim()) return;
              const newService = {
                id: `slot-${Date.now()}`,
                title: newServiceName.trim(),
                images: []
              };
              const updated = [...currentSlots, newService];
              handleUpdateGallerySlots(updated);
              setNewServiceName('');
              setShowAddServiceModal(false);
            };

            const handleDeleteService = (id: string, title: string) => {
              if (window.confirm(`¿Estás seguro de que deseas eliminar el servicio "${title}" por completo?`)) {
                const updated = currentSlots.filter(s => s.id !== id);
                handleUpdateGallerySlots(updated);
              }
            };

            return (
              <div className="space-y-8">
                {/* Header with New Service Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 dark:border-zinc-800 pb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-stone-900 dark:text-white flex items-center space-x-2">
                      <span>🖼️ Servicios y Galería de Fotos</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Administra los servicios destacados de tu sede. Añade, edita títulos, elimina servicios o sube hasta 5 fotos reales de cada uno.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNewServiceName('');
                      setShowAddServiceModal(true);
                    }}
                    className="flex items-center justify-center space-x-1.5 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 dark:from-zinc-100 dark:to-zinc-200 dark:hover:from-white dark:hover:to-zinc-100 dark:text-black text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Servicio</span>
                  </button>
                </div>

                {/* Grid of Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSlots.length === 0 ? (
                    <div className="md:col-span-2 text-center py-12 bg-stone-50 dark:bg-zinc-950 rounded-3xl border border-dashed border-stone-300 dark:border-zinc-800">
                      <Image className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-stone-500">No hay servicios creados aún.</p>
                      <p className="text-xs text-stone-400 mt-1">Pulsa en "Nuevo Servicio" para empezar a construir tu catálogo.</p>
                    </div>
                  ) : (
                    currentSlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="bg-stone-50 dark:bg-zinc-950 p-5 rounded-3xl border border-stone-200/60 dark:border-zinc-800/80 space-y-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          {editingSlotId === slot.id ? (
                            <div className="flex items-center space-x-2 flex-grow">
                              <input 
                                type="text"
                                value={editSlotTitleText}
                                onChange={(e) => setEditSlotTitleText(e.target.value)}
                                className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none flex-grow text-stone-900 dark:text-white font-extrabold"
                                required
                              />
                              <button 
                                onClick={() => {
                                  if (!editSlotTitleText.trim()) return;
                                  const updated = currentSlots.map(s => s.id === slot.id ? { ...s, title: editSlotTitleText.trim() } : s);
                                  handleUpdateGallerySlots(updated);
                                  setEditingSlotId(null);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                              >
                                Guardar
                              </button>
                              <button 
                                onClick={() => setEditingSlotId(null)}
                                className="text-stone-400 hover:text-stone-600 text-xs px-2 cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-xs font-black text-stone-800 dark:text-zinc-200 font-sans uppercase tracking-wider">
                                  {slot.title}
                                </h4>
                                <button 
                                  onClick={() => {
                                    setEditingSlotId(slot.id);
                                    setEditSlotTitleText(slot.title);
                                  }}
                                  className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg"
                                  title="Editar título"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleDeleteService(slot.id, slot.title)}
                                className="text-stone-400 hover:text-red-500 cursor-pointer p-1 rounded-lg transition-colors"
                                title="Eliminar servicio"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Images Info */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                          <span>Galería de fotos</span>
                          <span className="font-bold bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 px-2 py-0.5 rounded-full">
                            {slot.images.length} / 5 fotos
                          </span>
                        </div>

                        {/* Images Grid */}
                        <div className="grid grid-cols-5 gap-2">
                          {slot.images.map((imgUrl, imgIndex) => (
                            <div key={imgIndex} className="relative aspect-square rounded-xl overflow-hidden group border border-stone-200 dark:border-zinc-800 bg-stone-100">
                              <img 
                                src={imgUrl} 
                                alt={`Slot image ${imgIndex + 1}`} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <button 
                                onClick={() => {
                                  const updatedImages = slot.images.filter((_, idx) => idx !== imgIndex);
                                  const updated = currentSlots.map(s => s.id === slot.id ? { ...s, images: updatedImages } : s);
                                  handleUpdateGallerySlots(updated);
                                }}
                                className="absolute inset-0 bg-red-600/80 hover:bg-red-700/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                title="Eliminar foto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          {/* File Upload Button placeholder if less than 5 */}
                          {slot.images.length < 5 && (
                            <label className="relative aspect-square rounded-xl border border-dashed border-stone-300 dark:border-zinc-700 hover:border-amber-500 hover:bg-stone-100 dark:hover:bg-zinc-800 flex flex-col items-center justify-center cursor-pointer transition">
                              <Upload className="w-4 h-4 text-stone-400" />
                              <span className="text-[8px] font-mono text-stone-400 mt-1 uppercase text-center font-bold">Subir</span>
                              <input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, slot.id)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* MODAL inline for adding service */}
                <AnimatePresence>
                  {showAddServiceModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddServiceModal(false)}
                        className="absolute inset-0 bg-black/75 backdrop-blur-md"
                      />

                      <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl z-10 text-stone-800 dark:text-white border border-stone-200 dark:border-zinc-800"
                      >
                        <form onSubmit={handleCreateService} className="space-y-4">
                          <div className="border-b border-stone-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
                            <h3 className="text-base font-black uppercase font-sans text-stone-900 dark:text-white flex items-center space-x-1.5">
                              <span>✨ Crear Nuevo Servicio</span>
                            </h3>
                            <button 
                              type="button" 
                              onClick={() => setShowAddServiceModal(false)} 
                              className="text-stone-400 hover:text-stone-600"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block font-bold mb-1 text-stone-700 dark:text-zinc-300">Nombre del Servicio</label>
                              <input
                                type="text"
                                required
                                placeholder="Ej. Zumba Fitness, Spinning, Yoga..."
                                value={newServiceName}
                                onChange={(e) => setNewServiceName(e.target.value)}
                                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2.5 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100 font-medium"
                              />
                            </div>
                          </div>

                          <div className="pt-2 flex space-x-3 text-xs">
                            <button
                              type="button"
                              onClick={() => setShowAddServiceModal(false)}
                              className="w-1/2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold uppercase py-3 rounded-xl cursor-pointer text-center"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="w-1/2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase py-3 rounded-xl cursor-pointer text-center shadow-md"
                            >
                              Crear Servicio
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })()}

          {/* Theme / Styles Customize Tab Content */}
          {activeTab === 'theme' && (() => {
            return (
              <form onSubmit={handleSaveTheme} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-stone-900 dark:text-white">
                    🎨 Personalización Visual y Estilo (Tema)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Modifica la identidad del centro: sube imágenes de cabecera y configura las fuentes tipográficas globales.
                  </p>
                </div>

                {/* Hero Banner Image Customize Section */}
                <div className="bg-stone-50 dark:bg-zinc-950 p-5 rounded-3xl border border-stone-200/60 dark:border-zinc-800/80 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200">
                    🖼️ Imagen de Cabecera (Hero Banner)
                  </h4>
                  
                  {editHeroImage ? (
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-100">
                      <img 
                        src={editHeroImage} 
                        alt="Cabecera Personalizada" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        type="button"
                        onClick={() => setEditHeroImage('')}
                        className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg cursor-pointer"
                        title="Quitar imagen personalizada"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-40 rounded-2xl border border-dashed border-stone-300 dark:border-zinc-800 flex flex-col items-center justify-center p-4 text-center">
                      <Image className="w-8 h-8 text-stone-300 mb-2" />
                      <p className="text-xs text-stone-500 font-bold">No hay imagen de cabecera personalizada activa.</p>
                      <p className="text-[10px] text-stone-400 mt-1">Se utilizará el estilo decorativo por defecto.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* PC/Mobile File Input */}
                    <div>
                      <label className="w-full flex items-center justify-center space-x-2 bg-stone-900 dark:bg-zinc-100 dark:text-black hover:bg-stone-950 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer text-center">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir desde PC/Móvil</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const base64 = await comprimirImagen(file, 1400, 0.72);
                            if (base64) setEditHeroImage(base64);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* URL Input */}
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text"
                        placeholder="O pega URL de Imagen de Unsplash..."
                        value={editHeroImage.startsWith('data:') ? '' : editHeroImage}
                        onChange={(e) => setEditHeroImage(e.target.value)}
                        className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Fonts customization */}
                <div className="bg-stone-50 dark:bg-zinc-950 p-5 rounded-3xl border border-stone-200/60 dark:border-zinc-800/80 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200">
                    ✍️ Tipografía Global (Tipos de letra)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Fuentes de Título (Headings)</label>
                      <select
                        value={editFontHeading}
                        onChange={(e) => setEditFontHeading(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white"
                      >
                        <option value="Space Grotesk">Space Grotesk (Moderna / Tecnológica)</option>
                        <option value="Outfit">Outfit (Geométrica / Limpia)</option>
                        <option value="Playfair Display">Playfair Display (Serif / Elegante)</option>
                        <option value="Inter">Inter (Sencilla / Altamente Legible)</option>
                        <option value="Montserrat">Montserrat (Llamativa / Audaz)</option>
                        <option value="Cinzel">Cinzel (Clásica / Distinguida)</option>
                        <option value="Unbounded">Unbounded (Brutalista / Ancha)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Fuente de Texto (Body)</label>
                      <select
                        value={editFontBody}
                        onChange={(e) => setEditFontBody(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white"
                      >
                        <option value="Inter">Inter (Limpia y neutral)</option>
                        <option value="Roboto">Roboto (Sencilla y moderna)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Letra de consola)</option>
                        <option value="Georgia">Georgia (Estilo revista / serif)</option>
                        <option value="Open Sans">Open Sans (Suave / humanista)</option>
                      </select>
                    </div>
                  </div>

                  {/* Fonts visual preview box */}
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-stone-200/50 dark:border-zinc-800 text-center">
                    <p className="text-[9px] font-mono text-stone-400 mb-2 uppercase">Vista previa de tipografía combinada</p>
                    <h5 
                      className="text-xl font-black text-stone-900 dark:text-white"
                      style={{ fontFamily: `'${editFontHeading}', sans-serif` }}
                    >
                      {activeTenant.name}
                    </h5>
                    <p 
                      className="text-xs text-stone-500 mt-1"
                      style={{ fontFamily: `'${editFontBody}', sans-serif` }}
                    >
                      {activeTenant.slogan || '¡Ven a entrenar con nosotros y transforma tu cuerpo y mente hoy mismo!'}
                    </p>
                  </div>
                </div>

                {/* Custom Colors and Neon Glow Customization */}
                <div className="bg-stone-50 dark:bg-zinc-950 p-5 rounded-3xl border border-stone-200/60 dark:border-zinc-800/80 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200 flex items-center space-x-1.5">
                    <span>🎨 Colores de Letras & Estilo Neón (Carteles y Servicios)</span>
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Personaliza los colores de los textos de la página pública para asegurar que sean completamente legibles. Activa el efecto Neón para darle un estilo brillante y moderno a tu sede.
                  </p>

                  {/* Neon Glow Toggle Switch */}
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-stone-200/50 dark:border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-white uppercase">⚡ Efecto Brillo Neón Activo</h5>
                      <p className="text-[10px] text-stone-500 mt-0.5">Aplica un sombreado fluorescente (glow) al título principal y servicios.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditNeonGlow(!editNeonGlow)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                        editNeonGlow ? 'bg-amber-500 justify-end' : 'bg-stone-300 dark:bg-zinc-800 justify-start'
                      }`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md transition-all duration-200" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Hero Title Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color de Título Principal (Cabecera)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editHeroTextColor || '#ffffff'}
                          onChange={(e) => setEditHeroTextColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editHeroTextColor}
                          onChange={(e) => setEditHeroTextColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Cian', '#00FFFF'],
                          ['Fucsia', '#FF00FF'],
                          ['Lima', '#39FF14'],
                          ['Naranja', '#FF5F1F'],
                          ['Blanco', '#FFFFFF']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditHeroTextColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditHeroTextColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Hero Slogan Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color de Subtítulo / Eslogan</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editHeroSloganColor || '#dcd7d0'}
                          onChange={(e) => setEditHeroSloganColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editHeroSloganColor}
                          onChange={(e) => setEditHeroSloganColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Gris', '#DCD7D0'],
                          ['Amarillo', '#FFF01F'],
                          ['Cian', '#00FFFF'],
                          ['Fucsia', '#FF00FF'],
                          ['Rosa', '#FFC0CB']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditHeroSloganColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditHeroSloganColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Service Card Title Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color Título de Servicios (Galería)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editServiceTitleColor || '#ffffff'}
                          onChange={(e) => setEditServiceTitleColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editServiceTitleColor}
                          onChange={(e) => setEditServiceTitleColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Blanco', '#FFFFFF'],
                          ['Amarillo', '#FFF01F'],
                          ['Lima', '#39FF14'],
                          ['Cian', '#00FFFF'],
                          ['Fucsia', '#FF00FF']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditServiceTitleColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditServiceTitleColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Class Session Card Title Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color Título de Clases (Horarios)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editClassTitleColor || '#1c1c19'}
                          onChange={(e) => setEditClassTitleColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editClassTitleColor}
                          onChange={(e) => setEditClassTitleColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Oscuro', '#1C1C19'],
                          ['Blanco', '#FFFFFF'],
                          ['Naranja', '#FF5F1F'],
                          ['Fucsia', '#FF00FF'],
                          ['Cian', '#00FFFF']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditClassTitleColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditClassTitleColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Card Text Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color de Texto de Cajitas (Detalles / Duración / Aforo)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editCardTextColor || '#78716c'}
                          onChange={(e) => setEditCardTextColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editCardTextColor}
                          onChange={(e) => setEditCardTextColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Gris Oscuro', '#44403C'],
                          ['Gris Claro', '#A8A29E'],
                          ['Blanco', '#FFFFFF'],
                          ['Amarillo', '#FFF01F'],
                          ['Cian', '#00FFFF']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditCardTextColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditCardTextColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Card Background Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color de Fondo de Cajitas (Tarjetas)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editCardBgColor || '#ffffff'}
                          onChange={(e) => setEditCardBgColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editCardBgColor}
                          onChange={(e) => setEditCardBgColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Blanco', '#FFFFFF'],
                          ['Gris Arena', '#F5F5F4'],
                          ['Gris Oscuro', '#1C1C19'],
                          ['Negro Puro', '#000000'],
                          ['Azul Noche', '#0F172A']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditCardBgColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditCardBgColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Schedule Badge Background Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color de Fondo de Etiquetas (Días/Horas de clases)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editScheduleBadgeBgColor || '#f5f5f4'}
                          onChange={(e) => setEditScheduleBadgeBgColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editScheduleBadgeBgColor}
                          onChange={(e) => setEditScheduleBadgeBgColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Cian', '#06B6D4'],
                          ['Naranja', '#F97316'],
                          ['Rojo', '#EF4444'],
                          ['Negro', '#000000'],
                          ['Gris Neutro', '#78716C']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditScheduleBadgeBgColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditScheduleBadgeBgColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Schedule Badge Text Color */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-650 dark:text-zinc-400">Color de Texto de Etiquetas (Días/Horas de clases)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={editScheduleBadgeTextColor || '#1c1917'}
                          onChange={(e) => setEditScheduleBadgeTextColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 dark:border-zinc-700 bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={editScheduleBadgeTextColor}
                          onChange={(e) => setEditScheduleBadgeTextColor(e.target.value)}
                          placeholder="Predeterminado"
                          className="flex-grow bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-white font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {[
                          ['Negro', '#000000'],
                          ['Blanco', '#FFFFFF'],
                          ['Amarillo', '#FACC15'],
                          ['Rojo Claro', '#FCA5A5']
                        ].map(([lbl, hex]) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => setEditScheduleBadgeTextColor(hex)}
                            className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition font-mono bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-300"
                          >
                            {lbl}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditScheduleBadgeTextColor('')}
                          className="text-[9px] px-1.5 py-0.5 rounded border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition bg-white dark:bg-zinc-900 text-red-500"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {themeSuccess && (
                  <p className="text-xs text-emerald-600 font-bold flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4" />
                    <span>{themeSuccess}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer shadow-lg shadow-amber-500/15 transition"
                >
                  Guardar y Aplicar Cambios Visuales
                </button>
              </form>
            );
          })()}

      {/* Tab 1: PAYMENTS SECTION */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search and filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar alumno, plan..."
                  value={paySearch}
                  onChange={(e) => setPaySearch(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex rounded-lg border border-stone-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                <button
                  onClick={() => setPayFilter('all')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold ${
                    payFilter === 'all' ? 'bg-stone-900 dark:bg-white text-white dark:text-black' : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setPayFilter('paid')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold ${
                    payFilter === 'paid' ? 'bg-emerald-600 text-white font-extrabold' : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  Cobrado
                </button>
                <button
                  onClick={() => setPayFilter('pending')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold ${
                    payFilter === 'pending' ? 'bg-amber-500 text-black font-extrabold' : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  Pendiente
                </button>
                <button
                  onClick={() => setPayFilter('overdue')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold ${
                    payFilter === 'overdue' ? 'bg-red-500 text-white font-extrabold' : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  Vencido
                </button>
              </div>
            </div>

            {/* Create Monthly charge button */}
            <button
              onClick={() => setShowAddChargeModal(true)}
              className="flex items-center space-x-1.5 bg-stone-900 dark:bg-zinc-100 dark:text-black text-white hover:bg-stone-950 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Cargo Mensual</span>
            </button>
          </div>

          {/* Payments Table */}
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 font-mono text-stone-400">
                    <th className="p-4 font-bold uppercase">Alumno / Contacto</th>
                    <th className="p-4 font-bold uppercase">Plan Mensual</th>
                    <th className="p-4 font-bold uppercase">Monto</th>
                    <th className="p-4 font-bold uppercase">Fecha de Vencimiento</th>
                    <th className="p-4 font-bold uppercase">Estado de Pago</th>
                    <th className="p-4 font-bold uppercase text-right">Acciones de Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/50">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400">
                        Ningún pago coincide con los filtros aplicados en este inquilino.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-zinc-800/30 transition">
                        <td className="p-4">
                          <div className="font-bold text-stone-900 dark:text-zinc-100">{p.studentName}</div>
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">{p.studentEmail} • {p.studentPhone}</div>
                        </td>
                        <td className="p-4 font-medium text-stone-600 dark:text-zinc-300">
                          {p.planName}
                        </td>
                        <td className="p-4 font-mono font-bold text-stone-800 dark:text-zinc-100">
                          {formatPrice(p.amount)}
                        </td>
                        <td className="p-4 font-mono text-stone-500">
                          {p.dueDate}
                        </td>
                        <td className="p-4">
                          {p.status === 'paid' ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                              <Check className="w-3 h-3" />
                              <span>Pagado ({p.paymentMethod?.toUpperCase()})</span>
                            </span>
                          ) : p.status === 'overdue' ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold font-mono">
                              <span>⚠️ VENCIDO</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold font-mono">
                              <span>Pendiente</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {p.status !== 'paid' && (
                              <>
                                <button
                                  onClick={() => updatePaymentStatus(p.id, 'paid', 'bizum')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                                  title="Marcar como cobrado vía Bizum"
                                >
                                  Cobrar Bizum
                                </button>
                                <button
                                  onClick={() => updatePaymentStatus(p.id, 'paid', 'cash')}
                                  className="bg-stone-900 hover:bg-black dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                                  title="Marcar como cobrado en Efectivo"
                                >
                                  Efectivo
                                </button>
                                <button
                                  onClick={() => setShowLatePaymentNoticeModal(p)}
                                  className="bg-amber-500 hover:bg-amber-600 text-black px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase cursor-pointer flex items-center space-x-1"
                                  title="Enviar aviso de pago retrasado"
                                >
                                  <Bell className="w-3 h-3" />
                                  <span>Aviso Retraso</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deletePayment(p.id)}
                              className="text-stone-400 hover:text-red-500 p-1.5 rounded"
                              title="Borrar cargo"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: CLIENTS DIRECTORY */}
      {activeTab === 'clients' && (() => {
        const filteredClients = clients.filter(c => {
          const matchesSearch = 
            c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
            c.phone.toLowerCase().includes(clientSearch.toLowerCase());
            
          if (!matchesSearch) return false;
          
          const hasDebts = c.payments.some(p => p.status === 'pending' || p.status === 'overdue');
          
          if (clientFilter === 'up_to_date') {
            return !hasDebts;
          } else if (clientFilter === 'with_debts') {
            return hasDebts;
          }
          return true;
        });

        const sortedClients = [...filteredClients].sort((a, b) => {
          const indexA = clients.indexOf(a);
          const indexB = clients.indexOf(b);
          return clientSortOrder === 'newest' ? indexB - indexA : indexA - indexB;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-base font-black uppercase text-stone-800 dark:text-zinc-200">
                  Directorio de Clientes
                </h3>
                <p className="text-xs text-stone-500">
                  Visualiza la lista de alumnos, consulta el estado de sus mensualidades y edita o elimina sus registros.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewClientName('');
                  setNewClientEmail('');
                  setNewClientPhone('');
                  setNewClientPlan(currentPlans[0] || '');
                  setNewClientAmount(40);
                  setNewClientDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                  setNewClientStatus('pending');
                  setShowAddPlanInput(false);
                  setNewCustomPlanName('');
                  setShowDeletePlanConfirm(false);
                  setShowAddClientModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold px-4 py-2.5 rounded-2xl text-[11px] uppercase flex items-center justify-center space-x-1.5 cursor-pointer shadow-md transition self-start md:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>Agregar Nuevo Cliente</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none text-stone-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex rounded-lg border border-stone-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                <button
                  onClick={() => setClientFilter('all')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold transition cursor-pointer ${
                    clientFilter === 'all' ? 'bg-stone-900 dark:bg-white text-white dark:text-black' : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  Todos ({clients.length})
                </button>
                <button
                  onClick={() => setClientFilter('up_to_date')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold transition cursor-pointer ${
                    clientFilter === 'up_to_date' ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                  }`}
                >
                  Al Día ({clients.filter(c => !c.payments.some(p => p.status === 'pending' || p.status === 'overdue')).length})
                </button>
                <button
                  onClick={() => setClientFilter('with_debts')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold transition cursor-pointer ${
                    clientFilter === 'with_debts' ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                  }`}
                >
                  Con Deudas ({clients.filter(c => c.payments.some(p => p.status === 'pending' || p.status === 'overdue')).length})
                </button>
              </div>

              {/* Sort Order Button */}
              <button
                onClick={() => setClientSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center space-x-1.5 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-[10px] uppercase font-bold text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-900 transition cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <span>Orden: {clientSortOrder === 'newest' ? 'Nuevos Arriba' : 'Viejos Arriba'}</span>
              </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-zinc-950 border-b border-stone-200 dark:border-zinc-800 text-stone-400 uppercase font-bold text-[10px] tracking-wider">
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Planes Contratados</th>
                      <th className="p-4">Total Cuotas</th>
                      <th className="p-4">Estado General</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/60">
                    {sortedClients.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-stone-400 italic">
                          No se encontraron clientes que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      sortedClients.map((c, idx) => {
                        const hasDebts = c.payments.some(p => p.status === 'pending' || p.status === 'overdue');
                        const totalAmount = c.payments.reduce((acc, curr) => acc + curr.amount, 0);
                        const plansList = c.payments.length > 0 
                          ? Array.from(new Set(c.payments.map(p => p.planName))).join(', ')
                          : 'Sin planes cargados';

                        return (
                          <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-zinc-800/30 transition">
                            <td className="p-4">
                              <div className="font-bold text-stone-900 dark:text-zinc-100">{c.name}</div>
                              <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                                📧 {c.email || 'Sin correo'} <span className="mx-1">•</span> 📞 {c.phone || 'Sin teléfono'}
                              </div>
                            </td>
                            <td className="p-4 font-medium text-stone-600 dark:text-zinc-300">
                              {plansList}
                            </td>
                            <td className="p-4 font-mono font-bold text-stone-800 dark:text-zinc-100">
                              {totalAmount > 0 ? formatPrice(totalAmount) : formatPrice(0)}
                            </td>
                            <td className="p-4">
                              {c.payments.length === 0 ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-500 font-bold font-mono">
                                  <span>Sin cargos</span>
                                </span>
                              ) : hasDebts ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 font-bold font-mono animate-pulse">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Impagos / Deuda</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Al Día</span>
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingClient(c);
                                    setEditClientName(c.name);
                                    setEditClientEmail(c.email);
                                    setEditClientPhone(c.phone);
                                  }}
                                  className="bg-stone-100 dark:bg-zinc-850 hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-350 px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition flex items-center space-x-1"
                                >
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`¿Estás seguro de que deseas eliminar al cliente "${c.name}"? Esto borrará todas sus cuotas, reservas y datos asociados de forma permanente.`)) {
                                      deleteClient(c.email || c.name);
                                      alert(`Cliente "${c.name}" eliminado correctamente.`);
                                    }
                                  }}
                                  className="text-stone-400 hover:text-red-500 p-1.5 rounded cursor-pointer transition"
                                  title="Eliminar Cliente"
                                >
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tab 3: PROSPECTS & FREE TRIAL MANAGEMENT */}
      {activeTab === 'prospects' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-black uppercase text-stone-800 dark:text-zinc-200">
              Alumnos Potenciales de Clase Gratis (Prospectos)
            </h3>
            <p className="text-xs text-stone-500">
              Registros del botón "Clase Gratis" de la web pública. Agenda los datos automáticamente para matriculación directa de socios.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-100 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950 font-mono text-stone-400">
                  <th className="p-4 font-bold uppercase">Alumno Registrado</th>
                  <th className="p-4 font-bold uppercase">Clase Solicitada</th>
                  <th className="p-4 font-bold uppercase">Contacto</th>
                  <th className="p-4 font-bold uppercase">Fecha Solicitud</th>
                  <th className="p-4 font-bold uppercase">Estado de Alta</th>
                  <th className="p-4 font-bold uppercase text-right">Auto-Registro Automático</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/50">
                {tenantProspects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">
                      No hay ningún alumno potencial agendado por clase gratis de momento.
                    </td>
                  </tr>
                ) : (
                  tenantProspects.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-zinc-800/30 transition">
                      <td className="p-4 font-bold text-stone-900 dark:text-zinc-100">
                        {p.name}
                      </td>
                      <td className="p-4">
                        <span className="font-medium bg-stone-100 dark:bg-zinc-800 px-2 py-1 rounded text-stone-700 dark:text-zinc-300">
                          {p.className}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-stone-500">
                        📧 {p.email}<br />
                        📞 {p.phone}
                      </td>
                      <td className="p-4 font-mono text-stone-400">
                        {p.registeredAt.split('T')[0]}
                      </td>
                      <td className="p-4">
                        {p.converted ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold font-mono">
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>ALUMNO ALTA</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 font-bold font-mono animate-pulse">
                            <span>🎁 Esperando Alta</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {!p.converted && (
                            <button
                              onClick={() => {
                                setSelectedProspect(p);
                                setConversionPlan('Plan Mensual Zumba');
                                setConversionAmount(45);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-2 rounded-xl text-[10px] uppercase flex items-center space-x-1 cursor-pointer shadow-md"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Registrar Alumno</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteProspect(p.id)}
                            className="text-stone-400 hover:text-red-500 p-1.5 rounded"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: SUGGESTIONS LIST */}
      {activeTab === 'suggestions' && (() => {
        const comments = activeTenant.suggestions?.filter((s) => s.type === 'comment' || !s.type) || [];
        const suggestions = activeTenant.suggestions?.filter((s) => s.type === 'suggestion') || [];

        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black uppercase text-stone-800 dark:text-zinc-200">
                Buzón de Comentarios & Sugerencias de Usuarios
              </h3>
              <p className="text-xs text-stone-500">
                Administra los comentarios de alumnos para la web pública, y responde a sugerencias privadas enviadas por tus clientes.
              </p>
            </div>

            {/* Subtab Selector */}
            <div className="flex space-x-1 bg-stone-100 dark:bg-zinc-950 p-1 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setSugSubTab('comments')}
                className={`px-4 py-2.5 text-xs font-bold uppercase rounded-xl transition cursor-pointer ${
                  sugSubTab === 'comments'
                    ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                💬 Comentarios ({comments.length})
              </button>
              <button
                type="button"
                onClick={() => setSugSubTab('suggestions')}
                className={`px-4 py-2.5 text-xs font-bold uppercase rounded-xl transition cursor-pointer ${
                  sugSubTab === 'suggestions'
                    ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                💡 Sugerencias ({suggestions.length})
              </button>
            </div>

            {/* Subtab 1: PUBLIC COMMENTS */}
            {sugSubTab === 'comments' && (
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12 bg-stone-100 dark:bg-zinc-900 rounded-3xl p-6">
                    <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500 font-semibold">No hay comentarios de alumnos recibidos aún.</p>
                  </div>
                ) : (
                  comments.map((sug) => (
                    <div key={sug.id} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-100 dark:border-zinc-800 pb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-extrabold text-stone-900 dark:text-white">{sug.name}</h4>
                            {sug.phone && <span className="text-[10px] font-mono text-stone-400">({sug.phone})</span>}
                          </div>
                          <p className="text-[10px] text-stone-400 font-mono">{sug.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-stone-400 font-mono">
                            {sug.date.split('T')[0]}
                          </span>
                          {sug.status === 'accepted' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Visible en Web
                            </span>
                          ) : sug.status === 'denied' ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                              Rechazado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              Pendiente
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed italic">
                        "{sug.content}"
                      </p>

                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100 dark:border-zinc-800/60">
                        {sug.status !== 'accepted' && (
                          <button
                            type="button"
                            onClick={() => updateSuggestionStatus(sug.id, 'accepted')}
                            className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aceptar para la Web</span>
                          </button>
                        )}
                        {sug.status !== 'denied' && (
                          <button
                            type="button"
                            onClick={() => updateSuggestionStatus(sug.id, 'denied')}
                            className="flex items-center space-x-1 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-white font-bold py-1 px-3 rounded-lg text-[10px] uppercase cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rechazar / Negar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Subtab 2: PRIVATE SUGGESTIONS */}
            {sugSubTab === 'suggestions' && (
              <div className="space-y-4">
                {suggestions.length === 0 ? (
                  <div className="text-center py-12 bg-stone-100 dark:bg-zinc-900 rounded-3xl p-6">
                    <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500 font-semibold">No hay sugerencias privadas recibidas aún.</p>
                  </div>
                ) : (
                  suggestions.map((sug) => (
                    <div key={sug.id} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-5 rounded-3xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-100 dark:border-zinc-800 pb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-extrabold text-stone-900 dark:text-white">{sug.name}</h4>
                            {sug.phone && <span className="text-[10px] font-mono text-stone-400">({sug.phone})</span>}
                          </div>
                          <p className="text-[10px] text-stone-400 font-mono">{sug.email}</p>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {sug.date.split('T')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed italic">
                        "{sug.content}"
                      </p>

                      {/* Reply display if present */}
                      {sug.reply && (
                        <div className="bg-stone-50 dark:bg-zinc-950 p-3 rounded-2xl border border-stone-200/50 dark:border-zinc-800/80 text-xs text-stone-600 dark:text-zinc-300 space-y-1">
                          <p className="text-[10px] font-extrabold text-amber-600 uppercase flex items-center space-x-1">
                            <span>💬 Respuesta de la Sede:</span>
                          </p>
                          <p className="italic">"{sug.reply}"</p>
                        </div>
                      )}

                      {/* Reply Input Form */}
                      {replyingSugId === sug.id ? (
                        <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200 dark:border-zinc-800/80 space-y-3">
                          <label className="block text-[10px] font-bold uppercase text-stone-500">Responder Sugerencia:</label>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            className="w-full text-xs bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none"
                            placeholder="Escribe un mensaje de respuesta para enviar al alumno..."
                          />
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                replyToSuggestion(sug.id, replyText);
                                setReplyingSugId(null);
                                setReplyText('');
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer"
                            >
                              Guardar Respuesta
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingSugId(null);
                                setReplyText('');
                              }}
                              className="bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingSugId(sug.id);
                              setReplyText(sug.reply || '');
                            }}
                            className="text-[11px] font-extrabold text-amber-600 hover:text-amber-700 uppercase cursor-pointer"
                          >
                            <span>💬 {sug.reply ? 'Editar Respuesta' : 'Responder Sugerencia'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Tab 5: NOTIFICATIONS AUDIT LOG */}
      {activeTab === 'notifs' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-black uppercase text-stone-800 dark:text-zinc-200">
              Notificaciones Automáticas & Alertas Enviadas
            </h3>
            <p className="text-xs text-stone-500">
              Historial de notificaciones de sesiones y pagos enviadas automáticamente por nuestro cron engine.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-mono text-stone-500">Historial de alertas de este inquilino</span>
              {tenantNotifs.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas vaciar por completo el historial de alertas?')) {
                      clearNotifications();
                    }
                  }}
                  className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-xl shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar Historial</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-stone-100 dark:divide-zinc-800/40">
              {tenantNotifs.length === 0 ? (
                <div className="p-8 text-center text-stone-400">
                  Ninguna notificación ha sido disparada todavía. Pulsa el botón superior para simular alertas.
                </div>
              ) : (
                tenantNotifs.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-stone-50/50 dark:hover:bg-zinc-800/20 transition flex items-start space-x-3 text-xs">
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      n.type === 'payment_pending' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-stone-900 dark:text-zinc-100">{n.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-stone-400 font-mono">{n.date.split('T')[0]}</span>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="text-stone-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
                            title="Eliminar notificación"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-stone-500 dark:text-zinc-400 leading-relaxed mt-1">{n.message}</p>
                      <div className="mt-2 text-[10px] font-mono text-stone-400">
                        Destinatario: <strong className="text-stone-600 dark:text-zinc-300">{n.recipientName}</strong> ({n.recipientContact}) • Estado: <span className="text-emerald-500">Enviado SMS/WhatsApp API ✅</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: MUSIC MANAGEMENT */}
      {activeTab === 'music' && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <h3 className="text-base font-black uppercase text-stone-800 dark:text-zinc-200 flex items-center space-x-2">
              <Music className="w-5 h-5 text-amber-500 animate-bounce" />
              <span>Ambientación y Música de Fondo</span>
            </h3>
            <p className="text-xs text-stone-500">
              Personaliza la experiencia de tus alumnos ambientando la página pública con música de fondo. Los visitantes podrán reproducir, pausar o silenciar la música.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Playlist management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Player Card */}
              <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-zinc-900 dark:from-black dark:via-zinc-950 dark:to-zinc-900 border border-stone-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Music className="w-40 h-40" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">
                      Estado en Web Pública
                    </span>
                    <h4 className="text-lg font-black tracking-tight">
                      {activeTenant.customBgMusicUrl ? (
                        (() => {
                          const playlist = activeTenant.customBgMusicPlaylist || DEFAULT_PREDEFINED_TRACKS;
                          const activeTrack = playlist.find(t => t.url === activeTenant.customBgMusicUrl);
                          return activeTrack ? activeTrack.name : 'Tema Personalizado Activo';
                        })()
                      ) : (
                        'Música Desactivada 🔇'
                      )}
                    </h4>
                    <p className="text-xs text-stone-400 max-w-md font-mono truncate">
                      {activeTenant.customBgMusicUrl || 'Los visitantes de la página pública no escucharán música de fondo.'}
                    </p>
                  </div>

                  {activeTenant.customBgMusicUrl && (
                    <button
                      onClick={() => {
                        updateTenantSettings({ customBgMusicUrl: '' });
                        setEditBgMusicUrl('');
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Desactivar Música
                    </button>
                  )}
                </div>
              </div>

              {/* Playlist Tracks List */}
              <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-300">
                      📋 Lista de Reproducción ({ (activeTenant.customBgMusicPlaylist || DEFAULT_PREDEFINED_TRACKS).length } temas)
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      Haz clic en la estrella ⭐ para activarla en la web pública, o dale a reproducir ▶️ para escucharla aquí.
                    </p>
                  </div>
                  <button
                    onClick={handleResetPlaylist}
                    className="text-[9px] text-amber-600 dark:text-amber-500 font-bold hover:underline cursor-pointer"
                  >
                    Restablecer lista
                  </button>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-zinc-800/50 space-y-1.5">
                  {(activeTenant.customBgMusicPlaylist || DEFAULT_PREDEFINED_TRACKS).map((track, idx) => {
                    const isWebActive = activeTenant.customBgMusicUrl === track.url;
                    const isPreviewPlaying = adminPlayingTrackId === track.id;
                    
                    return (
                      <div
                        key={track.id}
                        className={`flex items-center justify-between p-3 rounded-xl transition ${
                          isWebActive
                            ? 'bg-amber-500/10 border border-amber-500/30'
                            : 'hover:bg-stone-50 dark:hover:bg-zinc-800/30 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <button
                            onClick={() => setAdminPlayingTrackId(isPreviewPlaying ? null : track.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                              isPreviewPlaying
                                ? 'bg-amber-500 text-black animate-pulse'
                                : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:bg-amber-500 hover:text-black'
                            }`}
                            title={isPreviewPlaying ? "Pausar previsualización" : "Reproducir previsualización"}
                          >
                            {isPreviewPlaying ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 ml-0.5" />
                            )}
                          </button>

                          <div className="truncate">
                            <p className="text-xs font-bold text-stone-800 dark:text-zinc-200 flex items-center space-x-1.5">
                              <span className="text-stone-400 font-mono text-[10px]">#{idx + 1}</span>
                              <span className="truncate">{track.name}</span>
                            </p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                track.isPredefined
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : track.url.startsWith('data:')
                                    ? 'bg-purple-500/10 text-purple-500'
                                    : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                {track.isPredefined ? 'Predeterminada' : track.url.startsWith('data:') ? 'Archivo Local' : 'Enlace Web'}
                              </span>
                              {isWebActive && (
                                <span className="text-[8px] font-black uppercase text-amber-600 dark:text-amber-500 animate-pulse">
                                  ● ACTIVA EN WEB
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              updateTenantSettings({ customBgMusicUrl: track.url });
                              setEditBgMusicUrl(track.url);
                            }}
                            className={`p-2 rounded-xl transition cursor-pointer ${
                              isWebActive
                                ? 'bg-amber-500 text-black'
                                : 'bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800'
                            }`}
                            title="Establecer como música de la página pública"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>

                          {!track.isPredefined && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de que deseas eliminar la canción "${track.name}"?`)) {
                                  handleDeleteTrack(track.id);
                                }
                              }}
                              className="p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-stone-400 hover:text-red-500 dark:hover:text-red-500 hover:border-red-200 dark:hover:border-red-950 transition cursor-pointer"
                              title="Eliminar de la lista"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Upload music & URL entry */}
            <div className="space-y-6">
              {/* Load/Upload from Device */}
              <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-300">
                    📂 Cargar Canciones
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    Sube archivos de audio directo de tu dispositivo móvil, tablet o PC para agregarlos de forma permanente.
                  </p>
                </div>

                <div className="border-2 border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:border-amber-500 transition duration-200 bg-stone-50/50 dark:bg-zinc-950/20 relative group">
                  <input
                    type="file"
                    id="audio-upload-panel"
                    accept="audio/*"
                    multiple
                    onChange={handleAudioFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-stone-400 group-hover:text-amber-500 transition mb-2" />
                    <p className="text-xs font-bold text-stone-700 dark:text-zinc-300">
                      Seleccionar Archivo(s)
                    </p>
                    <p className="text-[9px] text-stone-400 mt-1">
                      Formatos: .mp3, .wav, .m4a, .ogg (Max 15MB recomendado)
                    </p>
                  </div>
                </div>
              </div>

              {/* Add by link URL */}
              <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-700 dark:text-zinc-300">
                    🔗 Enlace de Audio Directo
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    ¿Tienes un enlace de audio directo de Dropbox, Google Drive o tu propio servidor? Ingrésalo aquí.
                  </p>
                </div>

                <form onSubmit={handleAddTrackByUrl} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                      Nombre de la canción (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Ritmos Dinámicos de Zumba"
                      value={musicCustomName}
                      onChange={(e) => setMusicCustomName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                      URL del archivo de audio (.mp3)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="Ej. https://miservidor.com/audio.mp3"
                      value={musicCustomUrl}
                      onChange={(e) => setMusicCustomUrl(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-black font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar por Enlace</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Hidden Preview Audio Element */}
          <audio ref={adminAudioRef} loop />
        </div>
      )}

      {/* Tab 6: CONFIGURATION ADJUSTMENTS */}
      {activeTab === 'config' && (
        <div className="space-y-6 max-w-xl">
          <div>
            <h3 className="text-base font-black uppercase text-stone-800 dark:text-zinc-200">
              Ajustes de Sede & Canales del Inquilino
            </h3>
            <p className="text-xs text-stone-500">
              Modifica la ubicación del botón de llegada, WhatsApp oficial y datos del gimnasio.
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                Dirección Física Completa
              </label>
              <input
                type="text"
                required
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                Enlace de Google Maps (Ubicación GPS)
              </label>
              <input
                type="url"
                required
                value={editMapsUrl}
                onChange={(e) => setEditMapsUrl(e.target.value)}
                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-mono text-stone-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Prefijo Tel.
                </label>
                <input
                  type="text"
                  required
                  placeholder="+549"
                  value={editPhonePrefix}
                  onChange={(e) => setEditPhonePrefix(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                Idioma de la Sede
              </label>
              <select
                value={editLanguage}
                onChange={(e) => setEditLanguage(e.target.value as 'es' | 'en')}
                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-semibold text-stone-700 dark:text-zinc-300"
              >
                <option value="es">Español Castellano (Predeterminado)</option>
                <option value="en">Inglés (English)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">
                Símbolo de Precio / Moneda
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { label: 'Euros (€)', val: '€' },
                  { label: 'Pesos ($)', val: '$' },
                  { label: 'ARS ($)', val: 'ARS' },
                  { label: 'U$D', val: 'U$D' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setEditCurrencySymbol(opt.val)}
                    className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                      editCurrencySymbol === opt.val
                        ? 'bg-amber-500 border-amber-500 text-black font-extrabold'
                        : 'bg-stone-50 dark:bg-zinc-950 border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-350 hover:bg-stone-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    {opt.val}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-stone-400 whitespace-nowrap font-bold">Personalizado:</span>
                <input
                  type="text"
                  placeholder="Ej: ARS, USD, etc."
                  value={editCurrencySymbol}
                  onChange={(e) => setEditCurrencySymbol(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-1.5 text-xs rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Habilitar / Desactivar pagos online */}
            <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200/80 dark:border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-800 dark:text-zinc-200">
                    💳 Pasarela de Pago Online
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    Habilita o deshabilita que los alumnos paguen online al reservar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditEnableOnlinePayments(!editEnableOnlinePayments)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    editEnableOnlinePayments ? 'bg-amber-500' : 'bg-stone-300 dark:bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      editEnableOnlinePayments ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[10px] text-stone-400 italic">
                {editEnableOnlinePayments
                  ? '🟢 Los alumnos pagarán online mediante Tarjeta o Bizum al confirmar su plaza.'
                  : '🔴 Los alumnos verán un resumen de reserva, "Pagar en caja / efectivo" y confirmarán directamente.'}
              </p>
            </div>

            {configSuccess && (
              <p className="text-xs text-emerald-600 font-bold flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{configSuccess}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-950 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 text-white font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer transition"
            >
              Guardar Ajustes de Sede
            </button>

          </form>

          {/* QR de la pagina publica del inquilino */}
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div>
              <h4 className="text-sm font-black uppercase text-stone-800 dark:text-zinc-200 flex items-center space-x-1.5">
                <span>📱 QR de tu Página Pública</span>
              </h4>
              <p className="text-xs text-stone-500">Colgá este QR en el local. Al escanearlo, el cliente entra directo a la página de tu sede.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-md shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/?codigo=${activeTenant.id}`)}`}
                  alt="QR de la pagina publica"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <div className="flex-grow w-full space-y-3">
                <div className="text-[11px] font-mono break-all bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-stone-600 dark:text-zinc-400">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/?codigo={activeTenant.id}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/?codigo=${activeTenant.id}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold cursor-pointer hover:scale-105 transition"
                  >⬇ Descargar QR</a>
                  <button
                    type="button"
                    onClick={() => { const u = `${window.location.origin}/?codigo=${activeTenant.id}`; navigator.clipboard.writeText(u); alert('Link copiado: ' + u); }}
                    className="px-4 py-2 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-zinc-800 transition"
                  >🔗 Copiar link</button>
                </div>
              </div>
            </div>
          </div>

          {/* Backup Options */}
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div>
              <h4 className="text-sm font-black uppercase text-stone-800 dark:text-zinc-200 flex items-center space-x-1.5">
                <span>💾 Copia de Seguridad</span>
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Exporta o restaura toda la información (alumnos, reservas, clases, alertas y configuraciones de sedes) de la página pública y del panel administrativo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-800 dark:text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  <span>Exportar JSON</span>
                </button>
              </div>

              <div className="relative">
                <label className="w-full flex items-center justify-center bg-stone-900 hover:bg-stone-950 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer text-center">
                  <span>Importar JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {backupSuccess && (
              <p className="text-xs text-emerald-600 font-bold flex items-center space-x-1.5 mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>{backupSuccess}</span>
              </p>
            )}

            {backupError && (
              <p className="text-xs text-red-600 font-bold flex items-center space-x-1.5 mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{backupError}</span>
              </p>
            )}
          </div>

        </div>
      )}

        </div>
      </div>

      {/* MODAL: ADD CLASS */}
      <AnimatePresence>
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddClassModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl z-10 text-stone-800 dark:text-white border border-stone-200 dark:border-zinc-800"
            >
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="border-b border-stone-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
                  <h3 className="text-base font-black uppercase font-sans text-stone-900 dark:text-white">Añadir Nueva Sesión</h3>
                  <button type="button" onClick={() => setShowAddClassModal(false)} className="text-stone-400 hover:text-stone-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Nombre de la Clase</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Zumba Power Latino"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Instructor</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Yanis M."
                        value={newClassInstructor}
                        onChange={(e) => setNewClassInstructor(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Día de la Semana</label>
                      <select
                        value={newClassDay}
                        onChange={(e) => setNewClassDay(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      >
                        <option>Lunes</option>
                        <option>Martes</option>
                        <option>Miércoles</option>
                        <option>Jueves</option>
                        <option>Viernes</option>
                        <option>Sábado</option>
                        <option>Domingo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Hora inicio</label>
                      <input
                        type="text"
                        required
                        value={newClassTime}
                        onChange={(e) => setNewClassTime(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Aforo Máx.</label>
                      <input
                        type="number"
                        required
                        value={newClassCapacity}
                        onChange={(e) => setNewClassCapacity(Number(e.target.value))}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Precio ({activeTenant.currencySymbol || '€'})</label>
                      <input
                        type="number"
                        required
                        value={newClassPrice}
                        onChange={(e) => setNewClassPrice(Number(e.target.value))}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Duración (min)</label>
                      <input
                        type="text"
                        required
                        value={newClassDuration}
                        onChange={(e) => setNewClassDuration(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">URL Imagen</label>
                      <input
                        type="text"
                        required
                        value={newClassImage}
                        onChange={(e) => setNewClassImage(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100 font-mono text-[9px]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 dark:bg-zinc-100 dark:text-black text-white font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer"
                >
                  Agregar Clase al Horario
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD MONTHLY CHARGE */}
      <AnimatePresence>
        {showAddChargeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddChargeModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl z-10 text-stone-800 dark:text-white border border-stone-200 dark:border-zinc-800"
            >
              <form onSubmit={handleCreateCharge} className="space-y-4">
                <div className="border-b border-stone-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
                  <h3 className="text-base font-black uppercase font-sans text-stone-900 dark:text-white">Generar Cobro Mensual</h3>
                  <button type="button" onClick={() => setShowAddChargeModal(false)} className="text-stone-400 hover:text-stone-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Nombre Alumno</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Roberto Soler"
                      value={newChargeName}
                      onChange={(e) => setNewChargeName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="rober@mail.com"
                        value={newChargeEmail}
                        onChange={(e) => setNewChargeEmail(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Teléfono</label>
                      <input
                        type="text"
                        required
                        placeholder="+34 600 111 222"
                        value={newChargePhone}
                        onChange={(e) => setNewChargePhone(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Tipo de Plan</label>
                      <select
                        value={newChargePlan}
                        onChange={(e) => setNewChargePlan(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      >
                        {currentPlans.map(plan => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Importe Mensual ({activeTenant.currencySymbol || '€'})</label>
                      <input
                        type="number"
                        required
                        value={newChargeAmount}
                        onChange={(e) => setNewChargeAmount(Number(e.target.value))}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Fecha de Vencimiento</label>
                    <input
                      type="date"
                      required
                      value={newChargeDueDate}
                      onChange={(e) => setNewChargeDueDate(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 dark:bg-zinc-100 dark:text-black text-white font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer"
                >
                  Registrar Cobro
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: PROSPECT CONVERSION / REGISTER TO STUDENT */}
      <AnimatePresence>
        {selectedProspect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProspect(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl z-10 text-stone-800 dark:text-white border border-stone-200 dark:border-zinc-800"
            >
              <form onSubmit={handleConvertProspectSubmit} className="space-y-4">
                <div className="border-b border-stone-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
                  <h3 className="text-base font-black uppercase font-sans text-stone-900 dark:text-white">Auto-Alta de Alumno de Prueba</h3>
                  <button type="button" onClick={() => setSelectedProspect(null)} className="text-stone-400 hover:text-stone-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-xl space-y-1.5 text-xs">
                  <p><strong>Candidato:</strong> {selectedProspect.name}</p>
                  <p><strong>Contacto:</strong> {selectedProspect.phone} • {selectedProspect.email}</p>
                  <p><strong>Clase de Origen:</strong> {selectedProspect.className}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Asignar Plan Mensual</label>
                    <select
                      value={conversionPlan}
                      onChange={(e) => setConversionPlan(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    >
                      {currentPlans.map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Importe del Plan (€)</label>
                    <input
                      type="number"
                      required
                      value={conversionAmount}
                      onChange={(e) => setConversionAmount(Number(e.target.value))}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  Confirmar Alta Automática
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: AVISO DE PAGO RETRASADO */}
      <AnimatePresence>
        {showLatePaymentNoticeModal && (() => {
          const p = showLatePaymentNoticeModal;
          const msg = `Hola ${p.studentName}, te recordamos de forma amistosa que tienes un cargo pendiente de ${p.amount.toFixed(2)}€ correspondiente a la cuota de "${p.planName}" que venció el ${p.dueDate}. Por favor, realiza el pago a la brevedad. ¡Muchas gracias!`;
          const waLink = `https://wa.me/${p.studentPhone.replace(/[+\s]+/g, '')}?text=${encodeURIComponent(msg)}`;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLatePaymentNoticeModal(null)}
                className="absolute inset-0 bg-black/75 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl z-10 text-stone-800 dark:text-white border border-stone-200 dark:border-zinc-800"
              >
                <div className="space-y-4">
                  <div className="border-b border-stone-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
                    <h3 className="text-base font-black uppercase text-stone-900 dark:text-white flex items-center space-x-1.5">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <span>Enviar Aviso de Pago</span>
                    </h3>
                    <button type="button" onClick={() => setShowLatePaymentNoticeModal(null)} className="text-stone-400 hover:text-stone-600">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200/60 dark:border-zinc-800/80 space-y-2 text-xs">
                    <p className="font-bold text-stone-900 dark:text-white">Detalles del Cargo:</p>
                    <div className="grid grid-cols-2 gap-2 text-stone-600 dark:text-zinc-400">
                      <div><strong>Alumno:</strong> {p.studentName}</div>
                      <div><strong>Plan:</strong> {p.planName}</div>
                      <div><strong>Monto:</strong> {p.amount.toFixed(2)}€</div>
                      <div><strong>Vencimiento:</strong> {p.dueDate}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="block font-bold text-stone-500">Vista Previa del Mensaje:</label>
                    <div className="bg-stone-100 dark:bg-zinc-950 p-3 rounded-xl border border-stone-200/50 dark:border-zinc-800 italic text-stone-500 leading-relaxed font-sans">
                      "{msg}"
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        sendLatePaymentNotice(p.id, 'whatsapp');
                        setShowLatePaymentNoticeModal(null);
                        alert("Redirigiendo a WhatsApp... El aviso ha sido registrado en el historial de alertas.");
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase py-3 rounded-xl transition cursor-pointer text-center"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Por WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        sendLatePaymentNotice(p.id, 'email');
                        setShowLatePaymentNoticeModal(null);
                        alert(`¡Aviso de correo electrónico enviado a ${p.studentEmail}! Registrado en el historial de alertas.`);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-stone-900 dark:bg-zinc-100 dark:text-black hover:bg-stone-950 dark:hover:bg-zinc-200 text-white font-extrabold uppercase py-3 rounded-xl transition cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Por Email</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL: EDIT CLIENT DETAILS */}
      <AnimatePresence>
        {editingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingClient(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl z-10 text-stone-800 dark:text-white border border-stone-200 dark:border-zinc-800"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateClientDetails(editingClient.email || editingClient.name, editClientName, editClientEmail, editClientPhone);
                  setEditingClient(null);
                  alert("Los datos del alumno se han actualizado correctamente en todos los planes y registros.");
                }}
                className="space-y-4"
              >
                <div className="border-b border-stone-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
                  <h3 className="text-base font-black uppercase text-stone-900 dark:text-white flex items-center space-x-1.5">
                    <span>✏️ Editar Alumno</span>
                  </h3>
                  <button type="button" onClick={() => setEditingClient(null)} className="text-stone-400 hover:text-stone-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={editClientName}
                      onChange={(e) => setEditClientName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={editClientEmail}
                      onChange={(e) => setEditClientEmail(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={editClientPhone}
                      onChange={(e) => setEditClientPhone(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 dark:bg-zinc-100 dark:text-black text-white font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD CLIENT */}
      <AnimatePresence>
        {showAddClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddClientModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl z-10 text-stone-800 dark:text-white border border-stone-200 dark:border-zinc-800"
            >
              <form onSubmit={handleCreateClient} className="space-y-4">
                <div className="border-b border-stone-100 dark:border-zinc-800 pb-2 flex items-center justify-between">
                  <h3 className="text-base font-black uppercase font-sans text-stone-900 dark:text-white flex items-center space-x-1.5">
                    <UserPlus className="w-5 h-5 text-amber-500" />
                    <span>Agregar Nuevo Cliente</span>
                  </h3>
                  <button type="button" onClick={() => setShowAddClientModal(false)} className="text-stone-400 hover:text-stone-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María González"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="text"
                        required
                        placeholder="+34600112233"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold">Asignar Plan</label>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddPlanInput(!showAddPlanInput);
                              setShowDeletePlanConfirm(false);
                            }}
                            className="text-[10px] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-1.5 py-0.5 rounded transition cursor-pointer font-semibold"
                            title="Agregar Plan"
                          >
                            {showAddPlanInput ? 'Cancelar' : '+ Nuevo'}
                          </button>
                          {currentPlans.length > 1 && !showAddPlanInput && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowDeletePlanConfirm(!showDeletePlanConfirm);
                              }}
                              className="text-[10px] bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-1.5 py-0.5 rounded transition cursor-pointer font-semibold"
                              title="Eliminar Plan"
                            >
                              {showDeletePlanConfirm ? 'Cancelar' : 'Eliminar'}
                            </button>
                          )}
                        </div>
                      </div>

                      {showAddPlanInput ? (
                        <div className="space-y-1.5 bg-stone-50 dark:bg-zinc-950 p-2 rounded-xl border border-stone-200 dark:border-zinc-800">
                          <input
                            type="text"
                            placeholder="Nombre del nuevo plan"
                            value={newCustomPlanName}
                            onChange={(e) => setNewCustomPlanName(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-2 py-1 rounded-lg text-[11px] focus:outline-none text-stone-900 dark:text-zinc-100 font-medium"
                          />
                          <div className="flex justify-end space-x-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddPlanInput(false);
                                setNewCustomPlanName('');
                              }}
                              className="px-2 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 font-bold cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (newCustomPlanName && newCustomPlanName.trim()) {
                                  const trimName = newCustomPlanName.trim();
                                  if (currentPlans.includes(trimName)) {
                                    alert('Este plan ya existe.');
                                    return;
                                  }
                                  const updatedPlans = [...currentPlans, trimName];
                                  updateTenantSettings({ customPlans: updatedPlans });
                                  setNewClientPlan(trimName);
                                  setNewCustomPlanName('');
                                  setShowAddPlanInput(false);
                                }
                              }}
                              className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold cursor-pointer hover:bg-emerald-600"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : showDeletePlanConfirm ? (
                        <div className="space-y-1.5 bg-rose-500/5 p-2 rounded-xl border border-rose-500/20">
                          <p className="text-[10px] text-rose-500 font-semibold leading-tight">
                            ¿Seguro de eliminar "{newClientPlan}"?
                          </p>
                          <div className="flex justify-end space-x-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setShowDeletePlanConfirm(false)}
                              className="px-2 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-stone-300 font-bold cursor-pointer"
                            >
                              No
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedPlans = currentPlans.filter(p => p !== newClientPlan);
                                updateTenantSettings({ customPlans: updatedPlans });
                                setNewClientPlan(updatedPlans[0] || '');
                                setShowDeletePlanConfirm(false);
                              }}
                              className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold cursor-pointer hover:bg-rose-600"
                            >
                              Sí, Eliminar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <select
                          value={newClientPlan}
                          onChange={(e) => setNewClientPlan(e.target.value)}
                          className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                        >
                          {currentPlans.map(plan => (
                            <option key={plan} value={plan}>{plan}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Monto de Cuota ({activeTenant.currencySymbol || '€'})</label>
                      <input
                        type="number"
                        required
                        value={newClientAmount}
                        onChange={(e) => setNewClientAmount(Number(e.target.value))}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">Primer Vencimiento</label>
                      <input
                        type="date"
                        required
                        value={newClientDueDate}
                        onChange={(e) => setNewClientDueDate(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Estado del Pago</label>
                      <select
                        value={newClientStatus}
                        onChange={(e) => setNewClientStatus(e.target.value as 'paid' | 'pending')}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 px-3 py-2 rounded-xl focus:outline-none text-stone-900 dark:text-zinc-100 font-bold"
                      >
                        <option value="pending">⚠️ Pendiente de Cobro</option>
                        <option value="paid">✅ Pagado (Efectivo/Caja)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 dark:bg-zinc-100 dark:text-black text-white font-extrabold uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer transition hover:opacity-90"
                >
                  Agregar Cliente y Plan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
