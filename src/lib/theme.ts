/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeClasses {
  bg: string;
  cardBg: string;
  text: string;
  textMuted: string;
  accent: string; // Tailind class like bg-pink-500, text-pink-500 etc.
  accentColor: string; // e.g. "pink"
  border: string;
  badge: string;
  button: string;
  fontHeading: string;
  fontBody: string;
  shadow: string;
  input: string;
  overlay: string;
}

export const THEMES: Record<'neon-energy' | 'zen-calm' | 'coral-athletics', ThemeClasses> = {
  'neon-energy': {
    bg: 'bg-[#1C1C19] min-h-screen text-[#F5F2ED] selection:bg-[#5A5A40]/40',
    cardBg: 'bg-[#252522] border border-[#33332D] shadow-2xl rounded-3xl hover:shadow-[#D48166]/10 hover:border-[#D48166]/50 transition-all duration-300',
    text: 'text-[#F5F2ED]',
    textMuted: 'text-[#DCD7D0]/70',
    accent: 'text-[#D48166] hover:text-[#D48166]/80',
    accentColor: 'orange',
    border: 'border-[#33332D]',
    badge: 'bg-[#5A5A40]/20 text-[#DCD7D0] border border-[#5A5A40]/40 font-bold uppercase tracking-wider text-[10px]',
    button: 'bg-[#D48166] hover:bg-[#D48166]/90 text-white font-bold rounded-full active:scale-95 transition-all cursor-pointer px-6 py-2.5 shadow-lg shadow-[#D48166]/20',
    fontHeading: 'font-serif italic font-bold tracking-tight text-[#F5F2ED]',
    fontBody: 'font-mono text-xs tracking-tight',
    shadow: 'shadow-2xl shadow-[#D48166]/5',
    input: 'bg-[#252522] border-[#33332D] focus:border-[#D48166] focus:ring-1 focus:ring-[#D48166] text-[#F5F2ED] rounded-xl',
    overlay: 'bg-black/90 backdrop-blur-sm'
  },
  'zen-calm': {
    bg: 'bg-[#F5F2ED] min-h-screen text-[#33332D] selection:bg-[#EAE5DF]',
    cardBg: 'bg-white border border-[#DCD7D0] shadow-xl rounded-3xl hover:shadow-2xl hover:border-[#5A5A40]/40 transition-all duration-300',
    text: 'text-[#33332D]',
    textMuted: 'text-[#5A5A40]/75',
    accent: 'text-[#5A5A40] hover:text-[#5A5A40]/80',
    accentColor: 'emerald',
    border: 'border-[#DCD7D0]',
    badge: 'bg-[#D48166]/10 text-[#D48166] border border-[#D48166]/20 font-bold uppercase tracking-wider text-[10px]',
    button: 'bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white font-bold rounded-full active:scale-95 transition-all cursor-pointer px-6 py-2.5 shadow-lg shadow-[#5A5A40]/10',
    fontHeading: 'font-serif italic font-bold tracking-tight text-[#1A1A1A]',
    fontBody: 'font-sans text-stone-800 tracking-normal',
    shadow: 'shadow-2xl shadow-[#5A5A40]/5',
    input: 'bg-[#EAE5DF] border-[#DCD7D0] focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] text-[#33332D] rounded-xl',
    overlay: 'bg-[#33332D]/90 backdrop-blur-sm'
  },
  'coral-athletics': {
    bg: 'bg-[#EAE5DF] min-h-screen text-[#33332D] selection:bg-[#D48166]/25',
    cardBg: 'bg-white border-b-4 border-b-[#5A5A40] rounded-none border border-[#DCD7D0] hover:translate-y-[-2px] transition-all duration-300',
    text: 'text-[#33332D]',
    textMuted: 'text-[#5A5A40]/80',
    accent: 'text-[#D48166] hover:text-[#D48166]/80',
    accentColor: 'orange',
    border: 'border-[#DCD7D0]',
    badge: 'bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/20 font-bold uppercase tracking-wider text-[10px]',
    button: 'bg-[#D48166] hover:bg-[#D48166]/90 text-white font-black uppercase tracking-wider rounded-none active:scale-95 transition-all cursor-pointer px-6 py-2.5 shadow-md',
    fontHeading: 'font-heading font-black tracking-tighter uppercase text-[#1A1A1A]',
    fontBody: 'font-sans text-stone-800 tracking-wide',
    shadow: 'shadow-xl shadow-stone-400/20',
    input: 'bg-white border-[#DCD7D0] focus:border-[#D48166] focus:ring-1 focus:ring-[#D48166] text-stone-900 rounded-none',
    overlay: 'bg-[#33332D]/95 backdrop-blur-sm'
  }
};
