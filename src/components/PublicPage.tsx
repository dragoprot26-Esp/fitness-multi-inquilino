/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THEMES } from '../lib/theme';
import { ClassSession } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  User,
  Users,
  MapPin,
  Share2,
  MessageSquare,
  Gift,
  CreditCard,
  Phone,
  Mail,
  Check,
  Send,
  X,
  Sparkles,
  Info,
  Copy,
  ChevronRight,
  ShieldCheck,
  Facebook,
  Twitter,
  Volume2,
  VolumeX
} from 'lucide-react';

const TRANSLATIONS = {
  es: {
    heroTag: "Plataforma Activa de Sede Multitenant",
    howToGet: "Cómo llegar (Ubicación)",
    shareStudio: "Compartir Estudio",
    sendSuggestions: "Enviar Sugerencias",
    activeGallery: "Galería Activa",
    galleryDesc: "Fotos de las últimas sesiones grupales y eventos del centro",
    photosCount: "fotos dinámicas",
    viewActivity: "Ver actividad",
    scheduleTitle: "Horario & Clases Disponibles",
    scheduleDesc: "Selecciona una sesión de Zumba, Step o Pilates para reservar tu plaza o probar una clase GRATIS.",
    noClasses: "No hay sesiones programadas en este gimnasio de momento.",
    noClassesDesc: "Prueba cambiando de inquilino/gimnasio en el menú superior.",
    availableSpots: "plazas libres",
    lastSpots: "¡Últimas plazas!",
    sessionFull: "Completo",
    duration: "Duración",
    instructor: "Profesor",
    reservePlace: "Reservar plaza",
    freeTrial: "Clase de Prueba gratis",
    suggestionsTitle: "Buzón de Sugerencias",
    suggestionsDesc: "Queremos mejorar tu experiencia. Deja tus comentarios o propuestas de forma directa.",
    nameLabel: "Nombre Completo",
    emailLabel: "Correo Electrónico",
    phoneLabel: "Teléfono Móvil",
    messageLabel: "Sugerencia / Comentario",
    sendSuggestion: "Enviar Comentario",
    shareTitle: "Compartir este Gimnasio",
    shareDesc: "¡Ayúdanos a crecer compartiendo nuestro centro de Zumba & Step con tus amigos y familiares!",
    copySuccess: "¡Copiado al portapapeles! Listo para enviar.",
    shareWA: "Compartir en WhatsApp",
    back: "Atrás",
    continuePayment: "Continuar al Pago",
    secureGateway: "Pasarela de Pago Segura",
    totalToPay: "Total a pagar",
    selectPayment: "Selecciona Método de Pago",
    card: "Tarjeta",
    mobile: "Móvil",
    transfer: "Transferencia",
    payAndEnroll: "Pagar e Inscribirme",
    successReg: "¡Inscripción Registrada!",
    successRes: "¡Reserva Completada!",
    successDescTrial: "¡Excelente decisión! Tus datos han sido guardados en el registro automático. Te esperamos en la clase.",
    successDescRegular: "¡Estupendo! Hemos registrado tu pago. Tu plaza está asegurada.",
    class: "Clase",
    teacher: "Profesor",
    time: "Horario",
    method: "Método",
    returnSchedule: "Volver al Horario"
  },
  en: {
    heroTag: "Active Multi-Tenant Studio Platform",
    howToGet: "Get Directions (Location)",
    shareStudio: "Share Studio",
    sendSuggestions: "Send Suggestions",
    activeGallery: "Active Gallery",
    galleryDesc: "Photos from recent group sessions and events at the center",
    photosCount: "dynamic photos",
    viewActivity: "View activity",
    scheduleTitle: "Schedule & Available Classes",
    scheduleDesc: "Select a Zumba, Step, or Pilates session to reserve your spot or try a class for FREE.",
    noClasses: "No classes are scheduled at this gym at the moment.",
    noClassesDesc: "Try changing the tenant/gym from the top menu.",
    availableSpots: "spots available",
    lastSpots: "Last spots!",
    sessionFull: "Full",
    duration: "Duration",
    instructor: "Instructor",
    reservePlace: "Reserve spot",
    freeTrial: "Free Trial Class",
    suggestionsTitle: "Suggestion Box",
    suggestionsDesc: "We want to improve your experience. Leave your comments or proposals directly.",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Mobile Phone",
    messageLabel: "Suggestion / Comment",
    sendSuggestion: "Send Comment",
    shareTitle: "Share this Gym",
    shareDesc: "Help us grow by sharing our Zumba & Step center with your friends and family!",
    copySuccess: "Copied to clipboard! Ready to send.",
    shareWA: "Share on WhatsApp",
    back: "Back",
    continuePayment: "Continue to Payment",
    secureGateway: "Secure Payment Gateway",
    totalToPay: "Total to pay",
    selectPayment: "Select Payment Method",
    card: "Card",
    mobile: "Mobile",
    transfer: "Transfer",
    payAndEnroll: "Pay & Enroll",
    successReg: "Registration Registered!",
    successRes: "Booking Completed!",
    successDescTrial: "Great decision! Your details have been saved in the automatic registry. We look forward to seeing you in class.",
    successDescRegular: "Great! We have registered your payment. Your spot is guaranteed.",
    class: "Class",
    teacher: "Instructor",
    time: "Schedule",
    method: "Method",
    returnSchedule: "Back to Schedule"
  }
};

export default function PublicPage() {
  const {
    activeTenant,
    classes,
    addReservation,
    addProspect,
    addSuggestion,
    currentTheme
  } = useApp();

  const theme = THEMES[currentTheme];
  const lang = activeTenant.language || 'es';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const formatPrice = (amount: number) => {
    const sym = activeTenant.currencySymbol || '€';
    if (sym === '€') {
      return `${amount.toFixed(2)}€`;
    }
    return `${sym}${amount.toFixed(2)}`;
  };

  // Component Modals state
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [bookingType, setBookingType] = useState<'free_trial' | 'regular' | null>(null);
  
  // Registration Forms state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bizum' | 'transfer' | 'cash'>('credit_card');
  const [paymentStep, setPaymentStep] = useState<'details' | 'checkout' | 'summary' | 'success'>('details');
  const [message, setMessage] = useState(''); // for suggestion form
  const [suggestionType, setSuggestionType] = useState<'comment' | 'suggestion'>('comment');
  const [suggestionPhone, setSuggestionPhone] = useState('');

  // Floating menus state
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Background music player states and ref
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Sync background music when tenant changes or customBgMusicUrl changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isMusicPlaying && activeTenant.customBgMusicUrl) {
        audioRef.current.play().catch((err) => {
          console.log('Autoplay blocked on tenant change:', err);
          setIsMusicPlaying(false);
        });
      }
    }
  }, [activeTenant.customBgMusicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((err) => {
        console.error('Error playing audio:', err);
        alert(lang === 'en' ? 'Click anywhere on the page first, then try playing the music.' : 'Haz clic en cualquier parte de la página primero, luego intenta reproducir la música.');
      });
    }
  };

  // Gallery slot active image indices
  const [slotImageIndexes, setSlotImageIndexes] = useState<Record<string, number>>({});

  const handlePrevImage = (slotId: string, maxImages: number) => {
    setSlotImageIndexes(prev => ({
      ...prev,
      [slotId]: (prev[slotId] || 0) === 0 ? maxImages - 1 : (prev[slotId] || 0) - 1
    }));
  };

  const handleNextImage = (slotId: string, maxImages: number) => {
    setSlotImageIndexes(prev => ({
      ...prev,
      [slotId]: ((prev[slotId] || 0) + 1) % maxImages
    }));
  };

  // Filter sessions by current tenant
  const tenantClasses = classes.filter((c) => c.tenantId === activeTenant.id);

  // Share link handler
  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Submit suggestion form
  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    addSuggestion(name, email || 'No especificado', message, suggestionType, suggestionPhone || 'No especificado');
    setName('');
    setEmail('');
    setSuggestionPhone('');
    setMessage('');
    setShowSuggestionModal(false);
    if (suggestionType === 'comment') {
      alert(lang === 'en' ? 'Comment sent! It will be reviewed by the admin team for public display.' : '¡Comentario enviado! El equipo lo revisará antes de publicarlo en la web.');
    } else {
      alert(lang === 'en' ? 'Suggestion sent! Thank you for helping us improve.' : '¡Sugerencia enviada! El equipo de administración la revisará de inmediato. ¡Gracias!');
    }
  };

  // Booking submit handler (trial or paid)
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !selectedClass) return;

    if (bookingType === 'free_trial') {
      // Free trial saves prospect info
      addProspect({
        name,
        email,
        phone,
        classSessionId: selectedClass.id,
        className: selectedClass.name
      });
      setPaymentStep('success');
    } else if (activeTenant.enableOnlinePayments !== false) {
      // Regular booking initiates mock payment gateways if online payments are enabled
      setPaymentStep('checkout');
    } else {
      // Regular booking goes to reservation summary if online payments are disabled
      setPaymentStep('summary');
    }
  };

  const handleConfirmPayment = (isCashRegister = false) => {
    if (!selectedClass) return;

    // Call state action to reserve
    const res = addReservation({
      classSessionId: selectedClass.id,
      className: selectedClass.name,
      studentName: name,
      studentEmail: email,
      studentPhone: phone,
      isFreeTrial: false,
      paid: !isCashRegister,
      paymentMethod: isCashRegister ? 'cash' : paymentMethod
    });

    if (res.success) {
      if (isCashRegister) {
        setPaymentMethod('cash');
      }
      setPaymentStep('success');
    } else {
      alert(res.message);
    }
  };

  const handleCloseBooking = () => {
    setSelectedClass(null);
    setBookingType(null);
    setName('');
    setEmail('');
    setPhone('');
    setPaymentStep('details');
  };

  const customHeadingFont = activeTenant.customFontHeading || '';
  const customBodyFont = activeTenant.customFontBody || '';

  const headingFontEncoded = customHeadingFont.replace(/ /g, '+');
  const bodyFontEncoded = customBodyFont.replace(/ /g, '+');
  const googleFontsUrl = (customHeadingFont || customBodyFont)
    ? `https://fonts.googleapis.com/css2?${customHeadingFont ? `family=${headingFontEncoded}:wght@400;700;900` : ''}${customHeadingFont && customBodyFont ? '&' : ''}${customBodyFont ? `family=${bodyFontEncoded}:wght@400;500;700` : ''}&display=swap`
    : '';

  return (
    <div className={`public-page ${theme.bg} transition-colors duration-300 pb-20 ${theme.fontBody}`}>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}
      <style>{`
        ${customHeadingFont ? `
          .public-page h2, .public-page h3, .public-page h4, .public-page h5, .public-page .custom-heading {
            font-family: '${customHeadingFont}', sans-serif !important;
          }
        ` : ''}
        ${customBodyFont ? `
          .public-page, .public-page p, .public-page span, .public-page button, .public-page input, .public-page textarea, .public-page select, .public-page .custom-body {
            font-family: '${customBodyFont}', sans-serif !important;
          }
        ` : ''}
        ${activeTenant.customNeonGlow ? `
          .neon-glow-title {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.9), 0 0 15px ${activeTenant.customHeroTextColor || '#FF00FF'}, 0 0 30px ${activeTenant.customHeroTextColor || '#FF00FF'} !important;
          }
          .neon-glow-service {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.9), 0 0 12px ${activeTenant.customServiceTitleColor || '#00FFFF'}, 0 0 24px ${activeTenant.customServiceTitleColor || '#00FFFF'} !important;
          }
          .neon-glow-class {
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.9), 0 0 10px ${activeTenant.customClassTitleColor || '#D48166'}, 0 0 20px ${activeTenant.customClassTitleColor || '#D48166'} !important;
          }
        ` : ''}
      `}</style>
      
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#DCD7D0] bg-cover bg-center transition-all duration-500"
        style={activeTenant.customHeroImage ? { backgroundImage: `url(${activeTenant.customHeroImage})` } : {}}
      >
        <div className="absolute inset-0 z-0 opacity-15">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#5A5A40] to-[#D48166] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#D48166] to-[#EAE5DF] blur-3xl" />
        </div>

        {activeTenant.customHeroImage && (
          <div className="absolute inset-0 bg-stone-100/90 dark:bg-zinc-950/90 backdrop-blur-xs z-0" />
        )}

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">

          <h2 
            className={`text-4xl md:text-6xl font-black leading-tight ${theme.fontHeading} ${activeTenant.customNeonGlow ? 'neon-glow-title animate-pulse' : ''}`}
            style={activeTenant.customHeroTextColor ? { color: activeTenant.customHeroTextColor } : {}}
          >
            {activeTenant.name}
          </h2>

          <p 
            className="text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed text-[#33332D]/80 dark:text-zinc-300"
            style={activeTenant.customHeroSloganColor ? { color: activeTenant.customHeroSloganColor } : {}}
          >
            {activeTenant.slogan}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href={activeTenant.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white font-bold px-5 py-3 rounded-full text-xs shadow-lg shadow-[#5A5A40]/10 cursor-pointer active:scale-95 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>{t.howToGet}</span>
            </a>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 bg-[#EAE5DF] hover:bg-[#DCD7D0] text-[#33332D] font-bold px-5 py-3 rounded-full text-xs border border-[#DCD7D0] cursor-pointer active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.shareStudio}</span>
            </button>

            <button
              onClick={() => setShowSuggestionModal(true)}
              className="flex items-center space-x-1.5 bg-[#D48166]/10 hover:bg-[#D48166]/20 text-[#D48166] font-bold px-5 py-3 rounded-full text-xs border border-[#D48166]/20 cursor-pointer active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.sendSuggestions}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className={`text-2xl font-black uppercase tracking-tight ${theme.fontHeading}`}>
              {t.activeGallery}
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              {t.galleryDesc}
            </p>
          </div>
          <span className="hidden md:block text-xs font-mono text-stone-400 bg-stone-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-stone-200/50 dark:border-zinc-700/50">
            {activeTenant.gallerySlots && activeTenant.gallerySlots.length > 0
              ? `${activeTenant.gallerySlots.length} secciones`
              : `${activeTenant.gallery.length} ${t.photosCount}`
            }
          </span>
        </div>

        {activeTenant.gallerySlots && activeTenant.gallerySlots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeTenant.gallerySlots.map((slot) => {
              const currentImgIdx = slotImageIndexes[slot.id] || 0;
              const images = slot.images || [];
              const activeImage = images[currentImgIdx] || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80';
              
              return (
                <motion.div
                  key={slot.id}
                  whileHover={{ y: -4 }}
                  className="relative group h-64 md:h-72 rounded-3xl overflow-hidden shadow-md border border-stone-200/60 dark:border-zinc-800/80 bg-stone-100 dark:bg-zinc-950 flex flex-col justify-between"
                >
                  {/* Image background with transition */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={activeImage}
                      alt={slot.title}
                      className="w-full h-full object-cover transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  </div>

                  {/* Top overlay count */}
                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono uppercase bg-white/95 dark:bg-zinc-900/95 text-stone-800 dark:text-zinc-200 px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs">
                      {images.length} {images.length === 1 ? 'Foto' : 'Fotos'}
                    </span>
                  </div>

                  {/* Left/Right Buttons */}
                  {images.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage(slot.id, images.length);
                        }}
                        className="w-8 h-8 rounded-full bg-white/95 dark:bg-zinc-900/95 text-stone-850 dark:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-md cursor-pointer"
                      >
                        <span className="text-sm font-extrabold">←</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage(slot.id, images.length);
                        }}
                        className="w-8 h-8 rounded-full bg-white/95 dark:bg-zinc-900/95 text-stone-850 dark:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-md cursor-pointer"
                      >
                        <span className="text-sm font-extrabold">→</span>
                      </button>
                    </div>
                  )}

                  {/* Bottom title & index indicator */}
                  <div className="relative z-10 p-4 space-y-1.5">
                    <h4 
                      className={`text-xs font-black uppercase tracking-wide drop-shadow-md ${activeTenant.customNeonGlow ? 'neon-glow-service' : ''}`}
                      style={activeTenant.customServiceTitleColor ? { color: activeTenant.customServiceTitleColor } : { color: 'white' }}
                    >
                      {slot.title}
                    </h4>
                    {images.length > 1 && (
                      <div className="flex space-x-1">
                        {images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              idx === currentImgIdx ? 'w-4 bg-amber-500' : 'w-1 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeTenant.gallery.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="relative group h-48 md:h-60 rounded-2xl overflow-hidden shadow border border-stone-200/40 dark:border-zinc-800/80 bg-stone-200 dark:bg-zinc-900"
              >
                <img
                  src={img}
                  alt="Actividades"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <p className="text-[11px] font-mono font-bold text-white tracking-widest uppercase flex items-center space-x-1">
                    <span>✨ Ver actividad</span>
                    <ChevronRight className="w-3.5 h-3.5 text-pink-500" />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Active Class Sessions Calendar Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-8 border-b border-stone-200/60 dark:border-zinc-800/60 pb-4">
          <h3 className={`text-2xl font-black uppercase tracking-tight ${theme.fontHeading}`}>
            {t.scheduleTitle}
          </h3>
          <p className="text-xs text-stone-500 font-mono">
            {t.scheduleDesc}
          </p>
        </div>

        {tenantClasses.length === 0 ? (
          <div className="text-center py-12 bg-stone-100 dark:bg-zinc-900 rounded-3xl p-6">
            <Info className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-600 dark:text-zinc-400">
              {t.noClasses}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {t.noClassesDesc}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenantClasses.map((item) => {
              const availableSpots = item.maxCapacity - item.currentBookings;
              const isFull = availableSpots <= 0;

              return (
                <div
                  key={item.id}
                  id={`class-${item.id}`}
                  className={`${theme.cardBg} rounded-3xl overflow-hidden flex flex-col justify-between`}
                  style={activeTenant.customCardBgColor ? { backgroundColor: activeTenant.customCardBgColor } : {}}
                >
                  {/* Class Header Image */}
                  <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-zinc-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      <span 
                        className={`px-2.5 py-1 ${theme.badge} text-[10px] rounded-full font-bold uppercase`}
                        style={{
                          ...(activeTenant.customScheduleBadgeBgColor ? { backgroundColor: activeTenant.customScheduleBadgeBgColor } : {}),
                          ...(activeTenant.customScheduleBadgeTextColor ? { color: activeTenant.customScheduleBadgeTextColor } : {})
                        }}
                      >
                        {item.dayOfWeek} • {item.time} hs
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-black/80 backdrop-blur text-white text-xs font-black px-2.5 py-1 rounded-lg">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Class Description */}
                  <div className="p-5 flex-grow space-y-4">
                    <div>
                      <h4 
                        className={`text-lg font-black leading-tight tracking-tight text-stone-900 dark:text-white ${currentTheme === 'zen-calm' ? 'font-serif' : 'font-sans'} ${activeTenant.customNeonGlow ? 'neon-glow-class' : ''}`}
                        style={activeTenant.customClassTitleColor ? { color: activeTenant.customClassTitleColor } : {}}
                      >
                        {item.name}
                      </h4>
                      <div 
                        className="flex items-center space-x-2 mt-2 text-xs text-stone-500 dark:text-zinc-400 font-mono"
                        style={activeTenant.customCardTextColor ? { color: activeTenant.customCardTextColor } : {}}
                      >
                        <User className="w-3.5 h-3.5 opacity-80" />
                        <span>{t.instructor}: {item.instructor}</span>
                      </div>
                    </div>

                    <div 
                      className="grid grid-cols-2 gap-2 border-t border-b border-stone-100 dark:border-zinc-800 py-3 text-[11px] font-mono text-stone-500 dark:text-zinc-400"
                      style={activeTenant.customCardTextColor ? { color: activeTenant.customCardTextColor, borderColor: `${activeTenant.customCardTextColor}20` } : {}}
                    >
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 opacity-80" />
                        <span>{t.duration}: {item.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 opacity-80" />
                        <span>Aforo: {item.currentBookings}/{item.maxCapacity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {isFull ? (
                        <span className="text-[11px] text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded border border-red-500/20 font-mono uppercase tracking-wider">
                          🚫 {t.sessionFull}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 font-mono">
                          ⚡ {availableSpots} {t.availableSpots}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking buttons */}
                  <div className="p-5 pt-0 border-t border-stone-50/50 dark:border-zinc-800/40 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedClass(item);
                        setBookingType('free_trial');
                        setPaymentStep('details');
                      }}
                      className="flex items-center justify-center space-x-1 bg-[#D48166] hover:bg-[#D48166]/90 text-white font-extrabold text-[10px] uppercase py-2.5 rounded-full transition cursor-pointer shadow-sm"
                      title={t.freeTrial}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{t.freeTrial}</span>
                    </button>
                    
                    <button
                      disabled={isFull}
                      onClick={() => {
                        setSelectedClass(item);
                        setBookingType('regular');
                        setPaymentStep('details');
                      }}
                      className={`flex items-center justify-center space-x-1 py-2.5 text-[10px] font-bold ${
                        isFull
                          ? 'bg-stone-200 dark:bg-zinc-800 text-stone-400 cursor-not-allowed rounded-xl border border-stone-300/40'
                          : theme.button
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.reservePlace}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Testimonials / Comentarios Aprobados Section */}
      {activeTenant.suggestions?.filter(s => s.type === 'comment' && s.status === 'accepted').length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="mb-6">
            <h3 className={`text-2xl font-black uppercase tracking-tight ${theme.fontHeading}`}>
              {lang === 'en' ? '💬 Student Comments' : '💬 Qué opinan nuestros Alumnos'}
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              {lang === 'en' ? 'Real opinions from students who train daily in our studios' : 'Opiniones reales de los alumnos que entrenan a diario en nuestras salas'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTenant.suggestions
              ?.filter(s => s.type === 'comment' && s.status === 'accepted')
              .map((com) => (
                <motion.div
                  key={com.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800/60 p-5 rounded-3xl shadow-sm relative flex flex-col justify-between"
                >
                  <div className="absolute top-4 right-5 text-amber-400 text-sm flex space-x-0.5">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <p className="text-sm italic text-stone-600 dark:text-zinc-300">
                      "{com.content}"
                    </p>
                    
                    <div className="flex items-center space-x-3 pt-3 border-t border-stone-100 dark:border-zinc-800">
                      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-stone-700 dark:text-zinc-300 text-xs">
                        {com.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-stone-900 dark:text-white">{com.name}</h5>
                        <p className="text-[10px] text-stone-400 font-mono">
                          {new Date(com.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>
      )}

      {/* Booking Form Overlay Modal */}
      <AnimatePresence>
        {selectedClass && bookingType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseBooking}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-100 rounded-3xl p-6 shadow-2xl z-10 border border-stone-200 dark:border-zinc-800"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseBooking}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Step 1: Input user details */}
              {paymentStep === 'details' && (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-stone-100 dark:border-zinc-800 pb-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                      {bookingType === 'free_trial' ? <Gift className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`text-lg font-black uppercase ${theme.fontHeading}`}>
                        {bookingType === 'free_trial' ? t.freeTrial : t.reservePlace}
                      </h3>
                      <p className="text-[10px] text-stone-400 font-mono">
                        {t.class}: {selectedClass.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 mb-1">
                        {t.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. María Teresa Gómez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 mb-1">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ej. maria@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 mb-1">
                        {t.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={`Ej. ${activeTenant.phonePrefix || '+549'} 600 123 456`}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {bookingType === 'free_trial' && (
                    <div className="bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] p-3 rounded-xl border border-amber-500/20 leading-relaxed">
                      💡 <strong>{lang === 'en' ? 'How does it work?' : '¿Cómo funciona?'}</strong> {lang === 'en' ? 'Your details will be saved as a Potential Student (Prospect). In the control panel, the administrator can activate your account and register you. You will receive a reminder email!' : 'Tus datos se guardarán como Alumno Potencial (Prospecto). En el panel de control, el administrador podrá darte de alta y activar tu usuario automáticamente. ¡Te llegará un correo de recordatorio!'}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-950 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 text-white font-extrabold uppercase py-3 rounded-xl transition cursor-pointer"
                  >
                    {bookingType === 'free_trial' 
                      ? t.freeTrial 
                      : (activeTenant.enableOnlinePayments !== false 
                          ? t.continuePayment 
                          : (lang === 'en' ? 'Continue Booking' : 'Continuar reserva'))}
                  </button>
                </form>
              )}

              {/* Step 2: Gateway checkout simulator (For paid bookings only) */}
              {paymentStep === 'checkout' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-100 dark:border-zinc-800 pb-3">
                    <h3 className={`text-lg font-black uppercase ${theme.fontHeading}`}>
                      {t.secureGateway}
                    </h3>
                    <p className="text-xs text-stone-400">
                      {t.totalToPay}: <strong className="text-stone-900 dark:text-white">{formatPrice(selectedClass.price)}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-stone-500">{t.selectPayment}</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                          paymentMethod === 'credit_card'
                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold'
                            : 'border-stone-200 dark:border-zinc-800 text-stone-500 hover:bg-stone-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-[10px]">{t.card}</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('bizum')}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                          paymentMethod === 'bizum'
                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold'
                            : 'border-stone-200 dark:border-zinc-800 text-stone-500 hover:bg-stone-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="text-sm font-extrabold">Bizum</span>
                        <span className="text-[10px]">{t.mobile}</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                          paymentMethod === 'transfer'
                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold'
                            : 'border-stone-200 dark:border-zinc-800 text-stone-500 hover:bg-stone-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="text-xs font-bold">{t.transfer}</span>
                        <span className="text-[10px]">{lang === 'en' ? 'Bank' : 'Bancaria'}</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-3 bg-stone-50 dark:bg-zinc-950 p-4 rounded-xl border border-stone-200 dark:border-zinc-800">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">{lang === 'en' ? 'Card Number' : 'Número de Tarjeta'}</label>
                        <input
                          type="text"
                          defaultValue="4500 1200 8900 3412"
                          className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-lg font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">{lang === 'en' ? 'Expires' : 'Vence'}</label>
                          <input
                            type="text"
                            defaultValue="12/29"
                            className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-stone-400 mb-1">CVC</label>
                          <input
                            type="text"
                            defaultValue="123"
                            className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 px-3 py-2 text-xs rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bizum' && (
                    <div className="space-y-2 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 text-center">
                      <p className="text-xs text-stone-600 dark:text-zinc-300">
                        {lang === 'en' ? `An immediate charge of ${formatPrice(selectedClass.price)} will be sent to your phone number:` : `Se enviará un cargo inmediato de ${formatPrice(selectedClass.price)} a tu número de teléfono:`}
                      </p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">{phone}</p>
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="bg-stone-50 dark:bg-zinc-950 p-4 rounded-xl border border-stone-200 dark:border-zinc-800 text-xs text-stone-500 leading-relaxed font-mono">
                      🏦 <strong>IBAN Destino:</strong> ES21 1492 8881 3322 0001<br />
                      <strong>{lang === 'en' ? 'Reference:' : 'Concepto:'}</strong> {selectedClass.name} - {name}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => setPaymentStep('details')}
                      className="w-1/3 border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-bold uppercase py-3 rounded-xl transition cursor-pointer"
                    >
                      {t.back}
                    </button>
                    
                    <button
                      onClick={() => handleConfirmPayment(false)}
                      className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase py-3 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-600/15"
                    >
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>{t.payAndEnroll}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Reservation Summary (For when online payments are disabled) */}
              {paymentStep === 'summary' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-100 dark:border-zinc-800 pb-3">
                    <h3 className={`text-lg font-black uppercase ${theme.fontHeading}`}>
                      {lang === 'en' ? 'Booking Summary' : 'Resumen de la Reserva'}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      {lang === 'en' ? 'Please review your booking details before completing.' : 'Por favor, revisa los detalles de tu reserva antes de finalizar.'}
                    </p>
                  </div>

                  <div className="bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 p-4 rounded-xl text-left space-y-2 text-xs font-mono text-stone-600 dark:text-zinc-350">
                    <p><strong className="text-stone-400">{t.class}:</strong> {selectedClass.name}</p>
                    <p><strong className="text-stone-400">{t.instructor}:</strong> {selectedClass.instructor}</p>
                    <p><strong className="text-stone-400">{t.time}:</strong> {selectedClass.dayOfWeek} • {selectedClass.time} hs</p>
                    <p><strong className="text-stone-400">{lang === 'en' ? 'Price:' : 'Precio:'}</strong> <span className="font-extrabold text-stone-900 dark:text-white">{formatPrice(selectedClass.price)}</span></p>
                    <p><strong className="text-stone-400">{lang === 'en' ? 'Student:' : 'Alumno/a:'}</strong> {name}</p>
                    <p><strong className="text-stone-400">{lang === 'en' ? 'Contact:' : 'Contacto:'}</strong> {email} • {phone}</p>
                  </div>

                  <div className="space-y-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 text-center">
                    <h4 className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400 flex items-center justify-center space-x-1.5">
                      <span>💵 {lang === 'en' ? 'Pay at Desk / Cash register' : 'Pagar en caja / efectivo'}</span>
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-relaxed">
                      {lang === 'en' 
                        ? `Online payments are currently disabled for this studio. You will pay the total amount of ${formatPrice(selectedClass.price)} directly at the front desk when you attend the class.` 
                        : `Los pagos online están deshabilitados para esta sede. Deberás abonar el importe total de ${formatPrice(selectedClass.price)} directamente en la caja de recepción cuando asistas a la clase.`}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={handleCloseBooking}
                      className="w-1/2 border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-bold uppercase py-3 rounded-xl transition cursor-pointer"
                    >
                      {lang === 'en' ? 'Cancel' : 'Cancelar'}
                    </button>
                    
                    <button
                      onClick={() => handleConfirmPayment(true)}
                      className="w-1/2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase py-3 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-amber-500/15"
                    >
                      <Check className="w-4.5 h-4.5" />
                      <span>{lang === 'en' ? 'Confirm Booking' : 'Reservar'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success Confirmation Screen */}
              {paymentStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black uppercase text-stone-900 dark:text-white font-sans">
                      {bookingType === 'free_trial' ? t.successReg : t.successRes}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed mt-1">
                      {bookingType === 'free_trial'
                        ? t.successDescTrial
                        : (paymentMethod === 'cash' 
                            ? (lang === 'en' 
                                ? 'Your booking has been confirmed! Remember to make the payment at the front desk upon arrival.' 
                                : '¡Tu reserva ha sido confirmada! Recuerda abonar el importe en recepción al llegar.')
                            : t.successDescRegular)}
                    </p>
                  </div>

                  <div className="bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 p-4 rounded-xl text-left space-y-2 text-xs font-mono text-stone-600 dark:text-zinc-300">
                    <p><strong>{t.class}:</strong> {selectedClass.name}</p>
                    <p><strong>{t.instructor}:</strong> {selectedClass.instructor}</p>
                    <p><strong>{t.time}:</strong> {selectedClass.dayOfWeek} • {selectedClass.time} hs</p>
                    <p><strong>{lang === 'en' ? 'Method:' : 'Método:'}</strong> {bookingType === 'free_trial' ? (lang === 'en' ? '🎁 Free Trial Pass' : '🎁 Pase de Prueba Gratis') : (paymentMethod === 'cash' ? (lang === 'en' ? '💵 Pay at Desk / Cash register' : '💵 Pagar en caja / efectivo') : `✅ ${lang === 'en' ? 'Secured Gateway' : 'Pasarela'} (${paymentMethod.toUpperCase()})`)}</p>
                  </div>

                  <button
                    onClick={handleCloseBooking}
                    className="w-full bg-stone-900 hover:bg-stone-950 dark:bg-zinc-100 dark:text-black text-white font-bold py-3 rounded-xl uppercase tracking-wider text-xs cursor-pointer"
                  >
                    {t.returnSchedule}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Suggestions Form Dialog */}
      <AnimatePresence>
        {showSuggestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuggestionModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-100 rounded-3xl p-6 shadow-2xl z-10 border border-stone-200 dark:border-zinc-800"
            >
              <button
                onClick={() => setShowSuggestionModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>

              <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                <div className="border-b border-stone-100 dark:border-zinc-800 pb-3">
                  <h3 className={`text-lg font-black uppercase ${theme.fontHeading}`}>
                    {lang === 'en' ? 'Feedback Box' : 'Buzón de Comentarios & Sugerencias'}
                  </h3>
                  <p className="text-xs text-stone-400 leading-normal">
                    {lang === 'en' ? 'Leave a public review for our website or a private suggestion for our administration team.' : 'Deja un comentario público para la web o una sugerencia privada para el equipo administrativo.'}
                  </p>
                </div>

                {/* Selector de Tipo */}
                <div className="grid grid-cols-2 gap-2 bg-stone-100 dark:bg-zinc-950 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setSuggestionType('comment')}
                    className={`py-2 text-[11px] font-bold uppercase rounded-xl transition cursor-pointer ${
                      suggestionType === 'comment'
                        ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    💬 {lang === 'en' ? 'Public Review' : 'Comentario Público'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuggestionType('suggestion')}
                    className={`py-2 text-[11px] font-bold uppercase rounded-xl transition cursor-pointer ${
                      suggestionType === 'suggestion'
                        ? 'bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    💡 {lang === 'en' ? 'Private Suggestion' : 'Sugerencia Privada'}
                  </button>
                </div>

                <p className="text-[10px] text-stone-400 leading-relaxed italic bg-stone-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-100 dark:border-zinc-800/80">
                  {suggestionType === 'comment'
                    ? (lang === 'en' ? '💬 Review will be shown publicly once approved by administrators.' : '💬 Los comentarios se mostrarán en la web tras ser aprobados por el administrador.')
                    : (lang === 'en' ? '💡 Suggestions are private for gym staff and can receive direct responses.' : '💡 Las sugerencias son privadas para el personal del gimnasio y pueden recibir respuesta.')}
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 mb-1">{lang === 'en' ? 'Name' : 'Nombre'}</label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'en' ? 'Your name' : 'Tu nombre'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 mb-1">{lang === 'en' ? 'Email (Optional)' : 'Email (Opcional)'}</label>
                      <input
                        type="email"
                        placeholder={lang === 'en' ? 'Your email (optional)' : 'Tu email (opcional)'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 mb-1">{lang === 'en' ? 'Phone (Optional)' : 'Teléfono (Opcional)'}</label>
                      <input
                        type="tel"
                        placeholder="Ej. +34 600 123 456"
                        value={suggestionPhone}
                        onChange={(e) => setSuggestionPhone(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 mb-1">
                      {suggestionType === 'comment'
                        ? (lang === 'en' ? 'Your Review / Comment' : 'Tu Opinión / Comentario')
                        : (lang === 'en' ? 'Suggestion / Idea' : 'Tu Sugerencia / Propuesta')}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder={
                        suggestionType === 'comment'
                          ? (lang === 'en' ? 'Write your review here. E.g. Best Zumba instructors ever!' : 'Escribe aquí tu opinión sobre las clases, ambiente, etc.')
                          : (lang === 'en' ? 'Write your suggestion here for classes, music, room improvements...' : 'Escribe aquí tu sugerencia de clases, música, mejoras de salas...')
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase py-3 rounded-xl shadow-lg cursor-pointer transition active:scale-95 text-xs tracking-wider"
                >
                  {suggestionType === 'comment'
                    ? (lang === 'en' ? 'Send Review' : 'Enviar Comentario')
                    : (lang === 'en' ? 'Send Suggestion' : 'Enviar Sugerencia')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-100 rounded-3xl p-6 shadow-2xl z-10 border border-stone-200 dark:border-zinc-800"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-850"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 w-12 h-12 flex items-center justify-center mx-auto">
                  <Share2 className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-lg font-black uppercase text-stone-900 dark:text-white font-sans">
                    {t.shareTitle}
                  </h4>
                  <p className="text-xs text-stone-400 leading-normal mt-1">
                    {t.shareDesc}
                  </p>
                </div>

                <div className="flex items-center space-x-2 bg-stone-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="bg-transparent flex-grow text-[11px] text-stone-500 font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-300 hover:bg-stone-100 border border-stone-200 dark:border-zinc-800 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {copiedLink && (
                  <p className="text-[10px] text-emerald-500 font-bold font-mono">
                    {t.copySuccess}
                  </p>
                )}

                {/* Grid de Redes Sociales */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      lang === 'en'
                        ? `Hello! I recommend you join Zumba and Step classes at ${activeTenant.name}. Reserve your class here: ${window.location.href}`
                        : `¡Hola! Te recomiendo apuntarte a las clases de Zumba y Step en ${activeTenant.name}. Reserva tu clase aquí: ${window.location.href}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <Phone className="w-5 h-5 mb-1.5 text-emerald-500 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">WhatsApp</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer group"
                  >
                    <Facebook className="w-5 h-5 mb-1.5 text-blue-500 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Facebook</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
                      lang === 'en'
                        ? `Check out ${activeTenant.name}! Reserve Zumba & Step group classes online.`
                        : `¡Mira las clases de Zumba y Step en ${activeTenant.name}! Reserva tu plaza online.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-900/10 hover:bg-stone-900/20 dark:bg-zinc-100/10 dark:hover:bg-zinc-100/20 text-stone-950 dark:text-zinc-100 border border-stone-900/10 dark:border-zinc-100/20 hover:border-stone-900/30 dark:hover:border-zinc-100/30 transition-all cursor-pointer group"
                  >
                    <Twitter className="w-5 h-5 mb-1.5 text-stone-850 dark:text-white transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider font-sans">Twitter / X</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
                      lang === 'en'
                        ? `I recommend you classes at ${activeTenant.name}!`
                        : `¡Te recomiendo apuntarte a las clases en ${activeTenant.name}!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/10 hover:border-sky-500/30 transition-all cursor-pointer group"
                  >
                    <Send className="w-5 h-5 mb-1.5 text-sky-500 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Telegram</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(activeTenant.name)}&body=${encodeURIComponent(
                      (lang === 'en'
                        ? `Hi! Check out this studio: ${activeTenant.name}. Here is the link to reserve your spot: `
                        : `¡Hola! Te recomiendo este centro: ${activeTenant.name}. Aquí puedes ver los horarios y reservar tu plaza: `) + window.location.href
                    )}`}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/10 hover:border-red-500/30 transition-all cursor-pointer group col-span-2"
                  >
                    <Mail className="w-5 h-5 mb-1.5 text-red-500 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Email / Gmail</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Background Music Control */}
      {activeTenant.customBgMusicUrl && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2">
          {isMusicPlaying && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[10px] font-black uppercase text-stone-800 dark:text-zinc-100 px-3 py-1.5 rounded-full shadow-md border border-stone-200/50 dark:border-zinc-800/50 pointer-events-none"
            >
              🎵 {lang === 'en' ? 'Music Playing' : 'Sonando música'}
            </motion.div>
          )}
          <button
            onClick={toggleMusic}
            className="flex items-center justify-center w-12 h-12 rounded-full shadow-xl cursor-pointer text-white transition-all bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:scale-110 active:scale-95 border-2 border-white dark:border-zinc-900"
            title={isMusicPlaying ? (lang === 'en' ? 'Mute Music' : 'Silenciar Música') : (lang === 'en' ? 'Play Music' : 'Reproducir Música')}
          >
            {isMusicPlaying ? (
              <Volume2 className="w-5 h-5 animate-bounce" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {activeTenant.customBgMusicUrl && (
        <audio
          ref={audioRef}
          src={activeTenant.customBgMusicUrl}
          loop
          preload="auto"
        />
      )}

    </div>
  );
}
