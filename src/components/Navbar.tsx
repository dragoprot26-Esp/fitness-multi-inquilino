/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { validarLicencia, asegurarCuentaSeguraDueno } from '../lib/cloud';
import { THEMES } from '../lib/theme';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Fingerprint,
  RefreshCw,
  Sparkles,
  LogOut,
  ChevronDown,
  Lock,
  CheckCircle,
  AlertTriangle,
  Flame,
  Activity,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTenant,
    setActiveTenant,
    tenants,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    adminLicenseVerified,
    setAdminLicenseVerified,
    iniciarSesionNube,
    currentTheme,
    setCurrentTheme
  } = useApp();

  const theme = THEMES[currentTheme];

  // UI state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminStep, setAdminStep] = useState<'license' | 'credentials' | 'biometric'>('license');
  
  // Form state
  const [licenseKey, setLicenseKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [codigoValidado, setCodigoValidado] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Biometrics simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = licenseKey.trim().toUpperCase();
    if (!code) { setError('Ingresá tu clave de licencia.'); return; }
    setError(''); setVerificando(true);
    const lic = await validarLicencia(code);
    setVerificando(false);
    if (lic) {
      setCodigoValidado(code);
      setAdminLicenseVerified(true);
      setAdminStep('credentials');
    } else {
      setError('Licencia no válida o vencida. Verificá la clave con tu proveedor CyC.');
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) { setError('Ingresá tu usuario y una contraseña de 6+ caracteres.'); return; }
    setError(''); setVerificando(true);
    const r = await asegurarCuentaSeguraDueno(username.trim(), password, codigoValidado);
    setVerificando(false);
    if (!r.ok) { setError(r.msg || 'No se pudo iniciar sesión.'); return; }
    iniciarSesionNube(codigoValidado);
    setSuccess('¡Acceso verificado!');
    setTimeout(() => { setSuccess(''); setAdminStep('biometric'); }, 900);
  };

  const handleBiometricLogin = () => {
    setIsScanning(true);
    setError('');
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setSuccess('Huella digital / FaceID verificada de forma segura');
      setTimeout(() => {
        setIsAdminLoggedIn(true);
        setShowAdminModal(false);
        setSuccess('');
        setScanComplete(false);
        // Reset steps for next time
        setAdminStep('license');
        setLicenseKey('');
        setUsername('');
        setPassword('');
      }, 1200);
    }, 2000);
  };

  const handleDirectLogin = () => {
    setIsAdminLoggedIn(true);
    setShowAdminModal(false);
    setAdminStep('license');
    setLicenseKey('');
    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminLicenseVerified(false);
    setAdminStep('license');
  };

  const getThemeDisplayName = (key: string) => {
    switch (key) {
      case 'neon-energy': return 'Tono Carbón';
      case 'zen-calm': return 'Tono Natural';
      case 'coral-athletics': return 'Tono Arcilla';
      default: return key;
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md ${theme.border} ${currentTheme === 'neon-energy' ? 'bg-[#1C1C19]/85 text-[#F5F2ED]' : 'bg-[#F5F2ED]/85 text-[#33332D]'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl" id="app-logo">{activeTenant.logo}</span>
            <div>
              <h1 className={`text-lg md:text-xl font-bold leading-tight ${theme.fontHeading}`}>
                {activeTenant.name}
              </h1>
              <p className="hidden md:block text-[10px] text-stone-500 uppercase tracking-widest font-mono">
                Fitness Multi-Inquilino
              </p>
            </div>
          </div>

          {/* Middle Section: Tenant & Theme switchers (visible only to Admin for configuration) */}
          {isAdminLoggedIn && (
            <div className="flex items-center space-x-2 md:space-x-4">
              
              {/* Tenant Selector Dropdown */}
              <div className="relative group">
                <div className="flex items-center space-x-1 bg-[#EAE5DF] text-[#33332D] px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border border-[#DCD7D0] hover:bg-[#DCD7D0] transition">
                  <Compass className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Gimnasio</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5A5A40]" />
                </div>
                
                {/* Dropdown Options */}
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-[#DCD7D0] rounded-xl shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <p className="px-3 py-1 text-[10px] font-bold text-[#5A5A40]/70 uppercase tracking-wider">
                    Seleccionar Sede
                  </p>
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTenant(t)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F2ED] transition ${
                        t.id === activeTenant.id ? 'font-bold text-[#5A5A40] bg-[#F5F2ED]' : 'text-[#33332D]'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{t.logo}</span>
                        <span>{t.name}</span>
                      </span>
                      {t.id === activeTenant.id && <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Theme Toggle */}
              <div className="relative group">
                <button className="flex items-center space-x-1 bg-[#5A5A40]/10 text-[#5A5A40] px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border border-[#5A5A40]/20 hover:bg-[#5A5A40]/20 transition-all">
                  <Sparkles className="w-3.5 h-3.5 text-[#D48166] animate-pulse" />
                  <span className="hidden sm:inline">Estilo:</span>
                  <span>{getThemeDisplayName(currentTheme)}</span>
                </button>
                
                {/* Styles Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#DCD7D0] rounded-xl shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <p className="px-3 py-1 text-[10px] font-bold text-[#5A5A40]/70 uppercase tracking-wider">
                    Visualización
                  </p>
                  
                  <button
                    onClick={() => setCurrentTheme('neon-energy')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 hover:bg-[#1C1C19] hover:text-[#F5F2ED] transition ${
                      currentTheme === 'neon-energy' ? 'font-bold text-[#D48166]' : 'text-[#33332D]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-[#D48166]" />
                    <span>Tono Carbón</span>
                  </button>

                  <button
                    onClick={() => setCurrentTheme('zen-calm')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 hover:bg-[#F5F2ED] hover:text-[#33332D] transition ${
                      currentTheme === 'zen-calm' ? 'font-bold text-[#5A5A40]' : 'text-[#33332D]'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Tono Natural</span>
                  </button>

                  <button
                    onClick={() => setCurrentTheme('coral-athletics')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2 hover:bg-[#EAE5DF] hover:text-[#33332D] transition ${
                      currentTheme === 'coral-athletics' ? 'font-bold text-[#D48166]' : 'text-[#33332D]'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#D48166]" />
                    <span>Tono Arcilla</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Right Section: Escudito de Administrador (Admin lock) */}
          <div>
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                  Admin Activo
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 p-2 rounded-lg text-xs font-semibold cursor-pointer transition"
                  title="Cerrar sesión de Administrador"
                  id="logout-btn"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAdminModal(true);
                  setAdminStep('license');
                  setError('');
                }}
                className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-stone-800 to-black text-white hover:from-stone-900 hover:to-stone-950 rounded-lg text-xs font-bold border border-stone-700 shadow-md cursor-pointer active:scale-95 transition-all"
                id="admin-login-btn"
                title="Ingreso de Administrador"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Admin Verification Modal (Escudito) */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-stone-900 border border-stone-800 text-white rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
              id="admin-verification-modal"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-tr from-transparent to-pink-500/20 rounded-full blur-xl" />

              {/* Title Header */}
              <div className="flex items-center space-x-3 border-b border-stone-800 pb-4 mb-5">
                <div className="bg-amber-400/10 p-2 rounded-xl border border-amber-400/20">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-wide uppercase font-sans">
                    Verificación de Licencia
                  </h3>
                  <p className="text-[10px] text-stone-500 font-mono">
                    Acceso de Control del Sistema
                  </p>
                </div>
              </div>

              {/* Step 1: License Verification */}
              {adminStep === 'license' && (
                <form onSubmit={handleLicenseSubmit} className="space-y-4">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-stone-800/50 mb-2">
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Este software de gimnasio requiere una licencia autorizada por inquilino. Ingrese su clave para continuar.
                    </p>
                    <p className="text-[10px] text-amber-400/80 mt-2 font-mono flex items-center space-x-1 bg-amber-500/5 p-1 rounded border border-amber-500/10">
                      <Lock className="w-3 h-3 flex-shrink-0" />
                      <span>Licencia para pruebas: <strong className="underline">SUMBA2026</strong></span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-2">
                      Código de Licencia
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="w-full bg-zinc-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition text-center uppercase font-mono tracking-widest text-amber-300"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 font-bold flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{error}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold uppercase py-3 rounded-xl shadow-lg transition cursor-pointer"
                  >
                    Verificar Licencia
                  </button>
                </form>
              )}

              {/* Step 2: Username & Password Credentials */}
              {adminStep === 'credentials' && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="bg-emerald-500/10 text-emerald-400 text-xs p-3 rounded-lg border border-emerald-500/20 mb-2 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Licencia Verificada. Ingrese sus credenciales de Administrador.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-1">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-zinc-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition text-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-400 mb-1">
                      Contraseña de Acceso
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition text-stone-200"
                    />
                  </div>

                  <p className="text-[10px] text-stone-500 font-mono">
                    * Use <strong className="text-stone-300">admin</strong> / <strong className="text-stone-300">admin</strong> para el inicio de sesión.
                  </p>

                  {error && (
                    <p className="text-xs text-red-400 font-bold flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{error}</span>
                    </p>
                  )}

                  {success && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 animate-bounce" />
                      <span>{success}</span>
                    </p>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setAdminStep('license')}
                      className="w-1/3 border border-stone-800 hover:bg-stone-800/50 text-stone-400 text-xs font-semibold uppercase py-3 rounded-xl transition cursor-pointer"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-white hover:bg-stone-100 text-black font-extrabold uppercase py-3 rounded-xl transition cursor-pointer"
                    >
                      Verificar Acceso
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Biometric Credentials Selection */}
              {adminStep === 'biometric' && (
                <div className="space-y-5 text-center py-4">
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-stone-300 mb-1">
                      Acceso Seguro Biométrico
                    </h4>
                    <p className="text-xs text-stone-500">
                      ¿Deseas ingresar usando Face ID o lector de Huella Digital simulado?
                    </p>
                  </div>

                  {/* Visual fingerprint animation area */}
                  <div className="flex justify-center my-6">
                    <button
                      onClick={handleBiometricLogin}
                      disabled={isScanning}
                      className={`relative flex items-center justify-center w-28 h-28 rounded-full border-2 border-stone-800 bg-zinc-950 focus:outline-none transition group cursor-pointer ${
                        isScanning ? 'border-cyan-500 shadow-2xl shadow-cyan-500/25' : 'hover:border-pink-500'
                      }`}
                    >
                      {isScanning ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 rounded-full bg-cyan-500/10 border-4 border-cyan-500/40"
                          />
                          {/* Laser scanning bar */}
                          <motion.div
                            animate={{ y: [-30, 30, -30] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute left-4 right-4 h-0.5 bg-cyan-400 blur-sm shadow shadow-cyan-400"
                          />
                        </>
                      ) : null}

                      <Fingerprint
                        className={`w-14 h-14 transition ${
                          isScanning
                            ? 'text-cyan-400 scale-110'
                            : scanComplete
                            ? 'text-emerald-400'
                            : 'text-stone-600 group-hover:text-pink-500'
                        }`}
                      />
                    </button>
                  </div>

                  {isScanning && (
                    <p className="text-xs text-cyan-400 font-mono animate-pulse">
                      Escaneando rasgos biométricos...
                    </p>
                  )}

                  {success && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center justify-center space-x-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>{success}</span>
                    </p>
                  )}

                  <div className="pt-2 border-t border-stone-800 flex flex-col space-y-2">
                    <button
                      onClick={handleDirectLogin}
                      className="w-full text-stone-400 hover:text-white text-xs font-semibold py-2 transition"
                    >
                      Omitir Biometría e Ingresar Directamente
                    </button>
                    <button
                      onClick={() => setAdminStep('credentials')}
                      className="w-full text-stone-600 hover:text-stone-400 text-[10px] uppercase tracking-wider transition"
                    >
                      Volver a Credenciales
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
