import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  FontFamily,
  ScreenType,
  Project,
  DocumentItem,
  MetricWidget,
  ApiEndpoint,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_DOCUMENTS,
  INITIAL_METRICS,
  INITIAL_API_ENDPOINTS,
} from '../data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedInspectorItem: Project | DocumentItem | ApiEndpoint | null;
  inspectorType: 'project' | 'document' | 'api' | null;
  isInspectorOpen: boolean;
  openInspector: (item: Project | DocumentItem | ApiEndpoint, type: 'project' | 'document' | 'api') => void;
  closeInspector: () => void;
  projects: Project[];
  documents: DocumentItem[];
  metrics: MetricWidget[];
  apiEndpoints: ApiEndpoint[];
  addProject: (p: Omit<Project, 'id' | 'updatedAt' | 'updatedAtFa'>) => void;
  deleteProject: (id: string) => void;
  toggleArchiveProject: (id: string) => void;
  addDocument: (d: Omit<DocumentItem, 'id' | 'updatedAt' | 'updatedAtFa' | 'downloads'>) => void;
  deleteDocument: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  previewDocument: DocumentItem | null;
  setPreviewDocument: (doc: DocumentItem | null) => void;
  isNewModalOpen: boolean;
  newModalType: 'project' | 'document';
  openNewModal: (type: 'project' | 'document') => void;
  closeNewModal: () => void;
  isFleetModalOpen: boolean;
  setIsFleetModalOpen: (open: boolean) => void;
  openFleetModal: () => void;
  closeFleetModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sovereign_lang');
      if (saved === 'en' || saved === 'fa') return saved;
    }
    return 'fa'; // Default to Persian as requested
  });
  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sovereign_font') as FontFamily;
      if (saved === 'kalameh' || saved === 'iransans' || saved === 'iranyekan' || saved === 'vazir') {
        return saved;
      }
    }
    return 'kalameh'; // Default font requested
  });

  const [screen, setScreen] = useState<ScreenType>('archive');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize html attributes on mount or language/font change
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('sovereign_lang', language);
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.font = fontFamily;
    document.body.dataset.font = fontFamily;
    localStorage.setItem('sovereign_font', fontFamily);
  }, [fontFamily]);

  const setFontFamily = (font: FontFamily) => {
    setFontFamilyState(font);
    document.documentElement.dataset.font = font;
    document.body.dataset.font = font;
    localStorage.setItem('sovereign_font', font);
    const fontNames: Record<FontFamily, string> = {
      kalameh: 'کلمه (Kalameh)',
      iransans: 'ایران سنس (IRANSans)',
      iranyekan: 'ایران یکان (IRANYekan)',
      vazir: 'وزیرمتن (Vazirmatn)',
    };
    showToast(language === 'fa' ? `قلم سامانه به «${fontNames[font]}» تغییر یافت` : `Font switched to ${fontNames[font]}`);
  };

  const [selectedInspectorItem, setSelectedInspectorItem] = useState<Project | DocumentItem | ApiEndpoint | null>(null);
  const [inspectorType, setInspectorType] = useState<'project' | 'document' | 'api' | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [metrics] = useState<MetricWidget[]>(INITIAL_METRICS);
  const [apiEndpoints] = useState<ApiEndpoint[]>(INITIAL_API_ENDPOINTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newModalType, setNewModalType] = useState<'project' | 'document'>('project');
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openFleetModal = () => setIsFleetModalOpen(true);
  const closeFleetModal = () => setIsFleetModalOpen(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('sovereign_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'fa' : 'en';
    setLanguage(next);
    showToast(next === 'fa' ? 'زبان با موفقیت به فارسی تغییر یافت' : 'Language switched to English (LTR)');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const openInspector = (item: Project | DocumentItem | ApiEndpoint, type: 'project' | 'document' | 'api') => {
    setSelectedInspectorItem(item);
    setInspectorType(type);
    setIsInspectorOpen(true);
  };

  const closeInspector = () => {
    setIsInspectorOpen(false);
    setSelectedInspectorItem(null);
    setInspectorType(null);
  };

  const openNewModal = (type: 'project' | 'document') => {
    setNewModalType(type);
    setIsNewModalOpen(true);
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  const addProject = (p: Omit<Project, 'id' | 'updatedAt' | 'updatedAtFa'>) => {
    const newProj: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      updatedAt: 'Just now',
      updatedAtFa: 'لحظاتی پیش',
    };
    setProjects(prev => [newProj, ...prev]);
    showToast(language === 'fa' ? 'پروژه جدید با موفقیت به آرشیو افزوده شد' : 'Project added to archive');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedInspectorItem && 'id' in selectedInspectorItem && selectedInspectorItem.id === id) {
      closeInspector();
    }
    showToast(language === 'fa' ? 'پروژه از آرشیو حذف گردید' : 'Project removed from archive');
  };

  const toggleArchiveProject = (id: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const nextStatus = p.status === 'archived' ? 'active' : 'archived';
        return {
          ...p,
          status: nextStatus,
          updatedAt: 'Just now',
          updatedAtFa: 'لحظاتی پیش',
        };
      })
    );
    const target = projects.find(p => p.id === id);
    const willBeArchived = target?.status !== 'archived';
    showToast(
      language === 'fa'
        ? willBeArchived
          ? 'پروژه به وضعیت «آرشیو شده» منتقل گردید'
          : 'پروژه از آرشیو خارج و فعال گردید'
        : willBeArchived
        ? 'Project moved to Archived state'
        : 'Project restored to Active state'
    );
  };

  const addDocument = (d: Omit<DocumentItem, 'id' | 'updatedAt' | 'updatedAtFa' | 'downloads'>) => {
    const newDoc: DocumentItem = {
      ...d,
      id: `doc-${Date.now()}`,
      updatedAt: 'Just now',
      updatedAtFa: 'لحظاتی پیش',
      downloads: 0,
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast(language === 'fa' ? 'سند و دارایی جدید به پروژه اضافه شد' : 'Document attached to project');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedInspectorItem && 'id' in selectedInspectorItem && selectedInspectorItem.id === id) {
      closeInspector();
    }
    showToast(language === 'fa' ? 'فایل سند از مخزن حذف گردید' : 'Asset removed from repository');
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        if (isInspectorOpen) closeInspector();
        if (previewDocument) setPreviewDocument(null);
        if (isNewModalOpen) setIsNewModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, isInspectorOpen, previewDocument, isNewModalOpen]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        fontFamily,
        setFontFamily,
        screen,
        setScreen,
        isSidebarCollapsed,
        toggleSidebar,
        selectedInspectorItem,
        inspectorType,
        isInspectorOpen,
        openInspector,
        closeInspector,
        projects,
        documents,
        metrics,
        apiEndpoints,
        addProject,
        deleteProject,
        toggleArchiveProject,
        addDocument,
        deleteDocument,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        previewDocument,
        setPreviewDocument,
        isNewModalOpen,
        newModalType,
        openNewModal,
        closeNewModal,
        isFleetModalOpen,
        setIsFleetModalOpen,
        openFleetModal,
        closeFleetModal,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
