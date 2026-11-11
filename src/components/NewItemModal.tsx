import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileFormat, ProjectStatus } from '../types';
import { X, Plus, Upload, Check } from 'lucide-react';

export const NewItemModal: React.FC = () => {
  const {
    isNewModalOpen,
    newModalType,
    closeNewModal,
    addProject,
    addDocument,
    language,
    showToast,
  } = useApp();

  // Project form state
  const [projName, setProjName] = useState('');
  const [projNameFa, setProjNameFa] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState<'core' | 'gateway' | 'identity' | 'design-system' | 'data'>('core');
  const [projStatus, setProjStatus] = useState<ProjectStatus>('active');
  const [projVersion, setProjVersion] = useState('v1.0.0');

  // Document form state
  const [docTitle, setDocTitle] = useState('');
  const [docTitleFa, setDocTitleFa] = useState('');
  const [docCategory, setDocCategory] = useState('Architecture');
  const [docFormat, setDocFormat] = useState<FileFormat>('figma');
  const [docVersion, setDocVersion] = useState('v1.0.0');
  const [docDesc, setDocDesc] = useState('');

  if (!isNewModalOpen) return null;

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) {
      showToast(language === 'fa' ? 'لطفاً نام پروژه را وارد نمایید' : 'Please provide project title');
      return;
    }

    addProject({
      name: projName,
      nameFa: projNameFa || projName,
      description: projDesc || 'Personal engineering and architecture project.',
      descriptionFa: projDesc || 'پروژه و اسکریپت توسعه‌یافته اختصاصی در آرشیو.',
      category: 'backend',
      categoryFa: 'مهندسی داده و اسکریپت',
      status: projStatus,
      version: projVersion,
      year: '۱۴۰۵',
      formats: ['tsx', 'openapi'],
      techStack: ['Python', 'TypeScript', 'Data Pipeline'],
      metrics: {
        filesCount: 1,
        completion: 100,
        locOrSize: '1 فایل',
        roleTitle: 'Sole Author',
        roleTitleFa: 'طراح و توسعه‌دهنده اختصاصی',
      },
    });

    closeNewModal();
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      showToast(language === 'fa' ? 'لطفاً عنوان سند را وارد کنید' : 'Please provide document title');
      return;
    }

    addDocument({
      title: docTitle,
      titleFa: docTitleFa || docTitle,
      category: docCategory,
      categoryFa: docCategory,
      format: docFormat,
      version: docVersion,
      size: '15.4 KB',
      status: 'active',
      projectName: 'سامانه پردازش ناوگان شهری',
      projectNameFa: 'سامانه پردازش ناوگان شهری',
      description: docDesc || 'Project source artifact and architectural script.',
      descriptionFa: docDesc || 'فایل سورس و دارایی محاسباتی پروژه.',
      codeSnippet: `// Committed Script / Document (${docVersion})\nexport const ArtifactConfig = {\n  format: '${docFormat}',\n  status: 'active'\n};`,
    });

    closeNewModal();
  };

  const isProject = newModalType === 'project';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-[#1E293B] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-[#0F172A] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 border border-[#4F46E5]/30 flex items-center justify-center text-[#c3c0ff]">
              {isProject ? <Plus className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            </div>
            <h3 className="font-semibold text-white text-sm">
              {isProject
                ? language === 'fa'
                  ? 'ثبت سرویس معماری جدید'
                  : 'Register Architecture Service'
                : language === 'fa'
                ? 'بارگذاری سند و مشخصات فنی'
                : 'Upload Asset or Specification'}
            </h3>
          </div>

          <button
            onClick={closeNewModal}
            className="w-7 h-7 rounded-md bg-[#1E293B] hover:bg-[#334155] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {isProject ? (
          <form onSubmit={handleProjectSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'نام سرویس (انگلیسی)' : 'Service Name (English)'}
              </label>
              <input
                type="text"
                required
                value={projName}
                onChange={e => setProjName(e.target.value)}
                placeholder="e.g. Soroush Telemetry Gateway"
                className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'نام سرویس (فارسی)' : 'Service Name (Persian / Optional)'}
              </label>
              <input
                type="text"
                value={projNameFa}
                onChange={e => setProjNameFa(e.target.value)}
                placeholder="مثال: درگاه تله‌متری سروش"
                className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'fa' ? 'دسته‌بندی' : 'Category'}
                </label>
                <select
                  value={projCategory}
                  onChange={e => setProjCategory(e.target.value as any)}
                  className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 focus:outline-none focus:border-[#4F46E5]"
                >
                  <option value="core">{language === 'fa' ? 'زیرساخت هسته (Core Platform)' : 'Core Platform'}</option>
                  <option value="gateway">{language === 'fa' ? 'درگاه و تسویه مبادلات (Gateway)' : 'Gateway & Settlement'}</option>
                  <option value="identity">{language === 'fa' ? 'امنیت و هویت اعتماد صفر (Zero-Trust)' : 'Zero-Trust Identity'}</option>
                  <option value="design-system">{language === 'fa' ? 'سیستم طراحی و توکن‌ها (Design System)' : 'Design System'}</option>
                  <option value="data">{language === 'fa' ? 'داده و نقشه مکانی (Data & GIS)' : 'Data & GIS'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'fa' ? 'نسخه اولیه' : 'Initial Version'}
                </label>
                <input
                  type="text"
                  value={projVersion}
                  onChange={e => setProjVersion(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 font-mono focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'شرح و کاربرد' : 'Description'}
              </label>
              <textarea
                rows={3}
                value={projDesc}
                onChange={e => setProjDesc(e.target.value)}
                placeholder="High-concurrency microservice details..."
                className="w-full p-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={closeNewModal}
                className="px-4 py-2 text-slate-300 hover:text-white bg-[#0F172A] rounded-lg transition-colors"
              >
                {language === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-all"
              >
                {language === 'fa' ? 'ذخیره و ثبت' : 'Save & Register'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleDocumentSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'عنوان سند (انگلیسی)' : 'Document Title (English)'}
              </label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                placeholder="e.g. Identity Architecture Spec RFC-202"
                className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'عنوان سند (فارسی)' : 'Document Title (Persian / Optional)'}
              </label>
              <input
                type="text"
                value={docTitleFa}
                onChange={e => setDocTitleFa(e.target.value)}
                placeholder="مثال: مستندات معماری احراز هویت"
                className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'fa' ? 'قالب فایل' : 'File Format'}
                </label>
                <select
                  value={docFormat}
                  onChange={e => setDocFormat(e.target.value as FileFormat)}
                  className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 focus:outline-none focus:border-[#4F46E5]"
                >
                  <option value="figma">Figma Blueprint</option>
                  <option value="tsx">React / TSX Code</option>
                  <option value="openapi">OpenAPI Spec</option>
                  <option value="pdf">PDF Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'fa' ? 'نسخه' : 'Version'}
                </label>
                <input
                  type="text"
                  value={docVersion}
                  onChange={e => setDocVersion(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 font-mono focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'شرح و هدف سند' : 'Specification Summary'}
              </label>
              <textarea
                rows={3}
                value={docDesc}
                onChange={e => setDocDesc(e.target.value)}
                placeholder="Architectural summary and integration contracts..."
                className="w-full p-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={closeNewModal}
                className="px-4 py-2 text-slate-300 hover:text-white bg-[#0F172A] rounded-lg transition-colors"
              >
                {language === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-all"
              >
                {language === 'fa' ? 'بارگذاری و تایید' : 'Commit to Repo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
