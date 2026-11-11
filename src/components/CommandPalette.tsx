import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  LayoutDashboard,
  FolderGit2,
  Terminal,
  Globe,
  Plus,
  ArrowRight,
  FileText,
  Boxes,
  Type,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    language,
    toggleLanguage,
    setFontFamily,
    setScreen,
    projects,
    documents,
    openInspector,
    openNewModal,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Static navigation actions
  const actions = [
    {
      id: 'nav-archive',
      label: 'Personal Projects Archive',
      labelFa: 'آرشیو پروژه‌های اختصاصی من',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-[#c3c0ff]" />,
      action: () => setScreen('archive'),
    },
    {
      id: 'nav-repository',
      label: 'Code & Artifact Repository',
      labelFa: 'مخزن سورس‌کد و فایل‌ها',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-[#4cd7f6]" />,
      action: () => setScreen('repository'),
    },
    {
      id: 'nav-specs',
      label: 'Engine Specs & API Console',
      labelFa: 'مشخصات موتور پردازش و API',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => setScreen('specs'),
    },
    {
      id: 'nav-stats',
      label: 'Fleet & Runtime Analytics',
      labelFa: 'تحلیل و آمار کارکرد ناوگان',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      action: () => setScreen('stats'),
    },
    {
      id: 'act-lang',
      label: language === 'fa' ? 'Switch to English (LTR)' : 'تغییر به زبان فارسی (RTL)',
      labelFa: language === 'fa' ? 'Switch to English (LTR)' : 'تغییر به زبان فارسی (RTL)',
      category: 'System',
      icon: <Globe className="w-4 h-4 text-amber-400" />,
      action: () => toggleLanguage(),
    },
    {
      id: 'act-font-kalameh',
      label: 'Change Font to Kalameh (کلمه)',
      labelFa: 'تغییر قلم سامانه به کلمه (Kalameh)',
      category: 'Typography',
      icon: <Type className="w-4 h-4 text-cyan-400" />,
      action: () => setFontFamily('kalameh'),
    },
    {
      id: 'act-font-iransans',
      label: 'Change Font to IRANSans (ایران سنس)',
      labelFa: 'تغییر قلم سامانه به ایران‌سنس (IRANSans)',
      category: 'Typography',
      icon: <Type className="w-4 h-4 text-indigo-400" />,
      action: () => setFontFamily('iransans'),
    },
    {
      id: 'act-font-iranyekan',
      label: 'Change Font to IRANYekan (ایران یکان)',
      labelFa: 'تغییر قلم سامانه به ایران‌یکان (IRANYekan)',
      category: 'Typography',
      icon: <Type className="w-4 h-4 text-emerald-400" />,
      action: () => setFontFamily('iranyekan'),
    },
    {
      id: 'act-new-proj',
      label: 'Register New Architecture Project',
      labelFa: 'ایجاد پروژه معماری جدید',
      category: 'Actions',
      icon: <Plus className="w-4 h-4 text-indigo-400" />,
      action: () => openNewModal('project'),
    },
    {
      id: 'act-new-doc',
      label: 'Upload New Blueprint or API Spec',
      labelFa: 'بارگذاری نقشه یا سند مشخصات جدید',
      category: 'Actions',
      icon: <Plus className="w-4 h-4 text-cyan-400" />,
      action: () => openNewModal('document'),
    },
  ];

  // Dynamic projects & docs search results
  const q = query.toLowerCase();
  const matchedProjects = projects
    .filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.nameFa.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
    .map(p => ({
      id: p.id,
      label: `${p.name} (${p.version})`,
      labelFa: `${p.nameFa} (${p.version})`,
      category: 'Projects',
      icon: <Boxes className="w-4 h-4 text-indigo-400" />,
      action: () => {
        setScreen('archive');
        openInspector(p, 'project');
      },
    }));

  const matchedDocs = documents
    .filter(
      d =>
        d.title.toLowerCase().includes(q) ||
        d.titleFa.toLowerCase().includes(q) ||
        d.format.toLowerCase().includes(q)
    )
    .map(d => ({
      id: d.id,
      label: `${d.title} [${d.format.toUpperCase()}]`,
      labelFa: `${d.titleFa} [${d.format.toUpperCase()}]`,
      category: 'Documents',
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setScreen('repository');
        openInspector(d, 'document');
      },
    }));

  const filteredActions = actions.filter(
    a =>
      a.label.toLowerCase().includes(q) ||
      a.labelFa.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );

  const allItems = [...filteredActions, ...matchedProjects, ...matchedDocs];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0F172A] border border-[#334155] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(79,70,229,0.3)] overflow-hidden"
      >
        {/* Search Input Standard 48px command palette */}
        <div className="flex items-center px-4 border-b border-white/[0.08] bg-[#0A0F1D]/80">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'fa'
                ? 'جستجوی دستور، پروژه، سند یا کلیدواژه...'
                : 'Type a command, project, document or endpoint...'
            }
            className="w-full h-12 px-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-[#1E293B] border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-mono text-xs">
              {language === 'fa' ? 'هیچ موردی با این عبارت یافت نشد' : 'No matching results found.'}
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-start px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#1E293B] text-white shadow-[0_0_0_1px_#4F46E5]'
                      : 'text-slate-300 hover:bg-[#1E293B]/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1 rounded bg-[#0A0F1D] border border-white/5">
                      {item.icon}
                    </div>
                    <div className="truncate font-medium">
                      {language === 'fa' ? item.labelFa : item.label}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#c3c0ff]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0A0F1D] border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{language === 'fa' ? 'جهت‌ها برای حرکت · Enter برای انتخاب' : 'Navigate ↑↓ · Select Enter · Close ESC'}</span>
          <span className="text-[#4cd7f6]">Sovereign Slate Command Core</span>
        </div>
      </div>
    </div>
  );
};
