/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RepositoryTable } from './components/RepositoryTable';
import { ApiConsole } from './components/ApiConsole';
import { ClusterNodesView } from './components/ClusterNodesView';
import { InspectorDrawer } from './components/InspectorDrawer';
import { CommandPalette } from './components/CommandPalette';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { NewItemModal } from './components/NewItemModal';
import { FleetDashboardModal } from './components/FleetDashboardModal';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { screen, toastMessage, language, fontFamily, isFleetModalOpen, closeFleetModal } = useApp();

  return (
    <div
      dir={language === 'fa' ? 'rtl' : 'ltr'}
      data-font={fontFamily}
      className={`min-h-screen bg-[#0A0F1D] text-[#dae2fd] flex flex-row overflow-x-hidden font-sans transition-all duration-150 ${
        fontFamily === 'kalameh'
          ? 'font-kalameh'
          : fontFamily === 'iransans'
          ? 'font-iransans'
          : fontFamily === 'iranyekan'
          ? 'font-iranyekan'
          : 'font-vazir'
      }`}
    >
      {/* Persistent Global Navigation Rail (280px desktop, collapsible to 72px) */}
      <Sidebar />

      {/* Primary Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A0F1D]">
        {/* Sticky Top Header */}
        <Header />

        {/* Workspace Body (Max 1680px canvas) */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1680px] w-full mx-auto">
          {(screen === 'archive' || (screen as string) === 'dashboard') && <DashboardView />}
          {screen === 'repository' && <RepositoryTable />}
          {(screen === 'specs' || (screen as string) === 'api-specs') && <ApiConsole />}
          {(screen === 'stats' || (screen as string) === 'analytics' || (screen as string) === 'settings') && <ClusterNodesView />}
        </main>

        {/* Global Footer */}
        <footer className="h-12 border-t border-white/[0.04] px-6 flex items-center justify-between text-slate-500 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">
              {language === 'fa' ? 'آرشیو اختصاصی پروژه‌های من' : 'Personal Project Archive'}
            </span>
            <span>·</span>
            <span>v2.4.0</span>
          </div>
          <div>
            {language === 'fa'
              ? 'مخزن متمرکز سورس‌کدها، اسکریپت‌ها، دیتاست‌ها و خروجی‌های محاسباتی'
              : 'Dedicated repository for personal codebases, analytics engines & datasets'}
          </div>
        </footer>
      </div>

      {/* Interactive Fleet Dashboard & Telemetry Modal for Project #1 */}
      <FleetDashboardModal isOpen={isFleetModalOpen} onClose={closeFleetModal} />

      {/* 360px Contextual Inspector Drawer docking opposite navigation rail */}
      <InspectorDrawer />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />

      {/* Document Detailed Preview Modal */}
      <DocumentPreviewModal />

      {/* Add New Service / Upload Document Modal */}
      <NewItemModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 end-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#1E293B] border border-[#4F46E5]/40 text-slate-100 px-4 py-2.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_0_1px_#4F46E5] flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
