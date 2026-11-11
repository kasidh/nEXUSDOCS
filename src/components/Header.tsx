import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Globe,
  Bell,
  Plus,
  Command,
  ChevronRight,
  ShieldCheck,
  Zap,
  Type,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    screen,
    language,
    toggleLanguage,
    fontFamily,
    setFontFamily,
    setIsCommandPaletteOpen,
    openNewModal,
  } = useApp();

  const getBreadcrumbs = () => {
    switch (screen) {
      case 'archive':
      case 'dashboard' as any:
        return {
          parent: language === 'fa' ? 'آرشیو شخصی' : 'Personal Archive',
          current: language === 'fa' ? 'پروژه‌های ثبت‌شده من' : 'My Registered Projects',
        };
      case 'repository':
        return {
          parent: language === 'fa' ? 'مخزن دارایی‌ها' : 'Asset Vault',
          current: language === 'fa' ? 'سورس‌کدها، اسکریپت‌ها و فایل‌های پیوست' : 'Scripts, Datasets & Reports',
        };
      case 'specs':
      case 'api-specs' as any:
        return {
          parent: language === 'fa' ? 'تله‌متری و تحلیل' : 'Telematics & Engine',
          current: language === 'fa' ? 'مشخصات موتور محاسباتی و API' : 'Batch Engine Specs & Telemetry API',
        };
      case 'stats':
      case 'analytics' as any:
      default:
        return {
          parent: language === 'fa' ? 'آمار و کارکرد' : 'Analytics & Nodes',
          current: language === 'fa' ? 'تحلیل کارکرد ناوگان و وضعیت نودها' : 'Fleet Analytics & Node Status',
        };
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 px-6 bg-[#0F172A] border-b border-white/[0.06] flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Zone 1: Contextual Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs min-w-0">
        <span className="text-slate-400 font-medium truncate hidden sm:inline">
          {breadcrumbs.parent}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:inline" />
        <span className="text-slate-100 font-semibold truncate">
          {breadcrumbs.current}
        </span>
      </div>

      {/* Zone 2: Command Bar Search & Quick Triggers */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger (40px standard control) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-3 h-10 px-3.5 bg-[#0A0F1D] hover:bg-[#1E293B] border border-[#334155] rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all glow-subtle group"
          title="Open Command Palette (⌘K / Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <span className="text-slate-400 group-hover:text-slate-300">
            {language === 'fa' ? 'جستجو در پروژه‌ها، اسناد و فرامین...' : 'Search architecture manifests...'}
          </span>
          <div className="flex items-center gap-0.5 ms-4 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#1E293B] border border-white/10 rounded">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>

        {/* Mobile search trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden w-9 h-9 rounded-lg bg-[#0A0F1D] border border-[#334155] text-slate-400 flex items-center justify-center"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Persian Typography Font Selector */}
        <div className="hidden md:flex items-center p-0.5 bg-[#0A0F1D] border border-[#334155] rounded-lg">
          <span className="ps-2 pe-1 text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">{language === 'fa' ? 'قلم:' : 'Font:'}</span>
          </span>
          <button
            onClick={() => setFontFamily('kalameh')}
            className={`px-2.5 py-1 text-xs rounded transition-all font-kalameh ${
              fontFamily === 'kalameh'
                ? 'bg-[#4F46E5] text-white shadow-[0_2px_8px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="فونت کلمه (Kalameh)"
          >
            کلمه
          </button>
          <button
            onClick={() => setFontFamily('iransans')}
            className={`px-2.5 py-1 text-xs rounded transition-all font-iransans ${
              fontFamily === 'iransans'
                ? 'bg-[#4F46E5] text-white shadow-[0_2px_8px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="فونت ایران سنس (IRANSans)"
          >
            ایران‌سنس
          </button>
          <button
            onClick={() => setFontFamily('iranyekan')}
            className={`px-2.5 py-1 text-xs rounded transition-all font-iranyekan ${
              fontFamily === 'iranyekan'
                ? 'bg-[#4F46E5] text-white shadow-[0_2px_8px_rgba(79,70,229,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="فونت ایران یکان (IRANYekan)"
          >
            ایران‌یکان
          </button>
        </div>

        {/* Mobile Font Dropdown */}
        <div className="md:hidden flex items-center">
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value as any)}
            className="h-9 px-2 bg-[#0A0F1D] border border-[#334155] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#4F46E5]"
            title="انتخاب فونت"
          >
            <option value="kalameh">کلمه</option>
            <option value="iransans">ایران‌سنس</option>
            <option value="iranyekan">ایران‌یکان</option>
          </select>
        </div>

        {/* Bilingual Language Switcher (Segmented Control) */}
        <div className="flex items-center p-0.5 bg-[#0A0F1D] border border-[#334155] rounded-lg">
          <button
            onClick={() => language !== 'fa' && toggleLanguage()}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
              language === 'fa'
                ? 'bg-[#4F46E5] text-white shadow-[0_2px_8px_rgba(79,70,229,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="نمایش به زبان فارسی"
          >
            <span>فارسی</span>
          </button>
          <button
            onClick={() => language !== 'en' && toggleLanguage()}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all flex items-center gap-1.5 ${
              language === 'en'
                ? 'bg-[#4F46E5] text-white shadow-[0_2px_8px_rgba(79,70,229,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to English"
          >
            <span>English</span>
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => openNewModal(screen === 'repository' ? 'document' : 'project')}
          className="h-10 px-4 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] active:scale-95 rounded-lg transition-all flex items-center gap-1.5 shadow-[0_4px_12px_rgba(79,70,229,0.35)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {screen === 'repository'
              ? language === 'fa'
                ? 'بارگذاری سورس / فایل'
                : 'Upload Artifact'
              : language === 'fa'
              ? 'افزودن پروژه جدید'
              : 'Add Project'}
          </span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 ps-2 border-s border-white/[0.08]">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="Architect User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#4F46E5]/40"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0F172A]" />
          </div>
        </div>
      </div>
    </header>
  );
};
