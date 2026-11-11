import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import {
  LayoutDashboard,
  FolderGit2,
  Terminal,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Server,
  Shield,
  Sliders,
  Database,
  ExternalLink,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    screen,
    setScreen,
    language,
    isSidebarCollapsed,
    toggleSidebar,
    projects,
    documents,
    apiEndpoints,
  } = useApp();

  const navItems = [
    {
      group: language === 'fa' ? 'آرشیو و مخزن پروژه‌ها' : 'PROJECTS & REPOSITORY',
      items: [
        {
          id: 'archive' as ScreenType,
          label: 'Personal Projects',
          labelFa: 'آرشیو پروژه‌های من',
          icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
          badge: `${projects.length} پروژه`,
        },
        {
          id: 'repository' as ScreenType,
          label: 'Code & Artifact Vault',
          labelFa: 'مخزن سورس و فایل‌ها',
          icon: <FolderGit2 className="w-5 h-5 shrink-0" />,
          badge: `${documents.length} فایل`,
        },
      ],
    },
    {
      group: language === 'fa' ? 'تله‌متری و تحلیل محاسبات' : 'TELEMETRY & SPECS',
      items: [
        {
          id: 'specs' as ScreenType,
          label: 'Engine Specs & CLI',
          labelFa: 'مشخصات موتور و API',
          icon: <Terminal className="w-5 h-5 shrink-0" />,
          badge: `${apiEndpoints.length} مسیر`,
        },
        {
          id: 'stats' as ScreenType,
          label: 'Fleet & Node Telemetry',
          labelFa: 'تحلیل نودها و کارکرد',
          icon: <Server className="w-5 h-5 shrink-0" />,
          badge: 'شهریور ۱۴۰۵',
        },
      ],
    },
  ];

  const isRtl = language === 'fa';

  return (
    <aside
      className={`relative z-30 shrink-0 bg-[#0F172A] border-${
        isRtl ? 'l' : 'r'
      } border-white/[0.06] transition-all duration-300 flex flex-col justify-between ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Architectural Geometric Icon */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#3131c0] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(79,70,229,0.35)]">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[6px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-[#c3c0ff]" />
              </div>
            </div>

            {!isSidebarCollapsed && (
              <div className="truncate">
                <div className="font-bold tracking-tight text-white text-sm font-sans flex items-center gap-1.5">
                  <span>{language === 'fa' ? 'آرشیو پروژه‌های اختصاصی' : 'Personal Project Vault'}</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 font-medium">
                  {language === 'fa' ? 'مخزن سورس، داده‌ها و تله‌متری' : 'CODE, SPECS & TELEMETRY'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="p-3 space-y-6">
          {navItems.map((group, groupIdx) => (
            <div key={groupIdx}>
              {!isSidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                  {group.group}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map(item => {
                  const isActive = screen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setScreen(item.id)}
                      title={isSidebarCollapsed ? (language === 'fa' ? item.labelFa : item.label) : undefined}
                      className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-[#4F46E5]/15 text-[#dad7ff]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/60'
                      }`}
                    >
                      {/* Active indicator pill (3px wide) hugging inside edge */}
                      {isActive && (
                        <span
                          className={`absolute inset-y-1.5 ${
                            isRtl ? 'left-0 rounded-r' : 'right-0 rounded-l'
                          } w-1 bg-[#4F46E5] shadow-[0_0_8px_#4F46E5]`}
                        />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`transition-colors ${
                            isActive
                              ? 'text-[#c3c0ff]'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!isSidebarCollapsed && (
                          <span className="truncate">
                            {language === 'fa' ? item.labelFa : item.label}
                          </span>
                        )}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            isActive
                              ? 'text-[#c3c0ff] bg-[#4F46E5]/20 border-[#4F46E5]/40'
                              : 'text-slate-500 bg-[#0A0F1D] border-white/5'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer: Cluster Node Status & Rail Collapse */}
      <div className="p-3 border-t border-white/[0.06] bg-[#0A0F1D]/40 space-y-2">
        {!isSidebarCollapsed && (
          <div className="px-3 py-2 rounded-lg bg-[#0F172A] border border-white/5 text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">{language === 'fa' ? 'کلاستر تولید' : 'Prod Cluster'}</span>
              </span>
              <span className="font-mono text-emerald-400 text-[10px]">99.98%</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              {language === 'fa' ? 'منطقه: تهران / ۸ گره فعال' : 'Zone: Central-1 · 8 Nodes OK'}
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors border border-transparent hover:border-white/5"
          title={isSidebarCollapsed ? 'Expand sidebar (280px)' : 'Collapse sidebar (72px)'}
        >
          {isRtl ? (
            isSidebarCollapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4" />
                <span className="text-[11px]">{language === 'fa' ? 'بستن منو (۷۲px)' : 'Collapse (72px)'}</span>
              </div>
            )
          ) : isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px]">Collapse Rail (72px)</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
