import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileFormat, Project, UploadedArchive } from '../types';
import { X, Upload, LoaderCircle } from 'lucide-react';

interface ProjectUploadResult {
  filesCount: number;
  uploadedArchive: UploadedArchive;
}

const projectCategories: Record<Project['category'], { en: string; fa: string }> = {
  'web-app': { en: 'Web App', fa: 'وب‌اپلیکیشن' },
  mobile: { en: 'Mobile', fa: 'موبایل' },
  'design-system': { en: 'Design System', fa: 'سیستم طراحی' },
  backend: { en: 'Backend', fa: 'بک‌اند' },
  'ai-tool': { en: 'AI Tool', fa: 'ابزار هوش مصنوعی' },
};

interface DocumentAnalysisResult {
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  category: string;
  categoryFa: string;
  uploadedFile: UploadedArchive;
}

export const NewItemModal: React.FC = () => {
  const {
    isNewModalOpen,
    newModalType,
    closeNewModal,
    addProject,
    addDocument,
    language,
  } = useApp();

  // Project form state
  const [projName, setProjName] = useState('');
  const [projNameFa, setProjNameFa] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projDescriptionFa, setProjDescriptionFa] = useState('');
  const [projCategory, setProjCategory] = useState<Project['category']>('backend');
  const [projTechStack, setProjTechStack] = useState('');
  const [projVersion, setProjVersion] = useState('v1.0.0');
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [isProjectUploading, setIsProjectUploading] = useState(false);
  const [projectUploadError, setProjectUploadError] = useState('');

  // Document form state
  const [docTitle, setDocTitle] = useState('');
  const [docTitleFa, setDocTitleFa] = useState('');
  const [docFormat, setDocFormat] = useState<FileFormat>('figma');
  const [docVersion, setDocVersion] = useState('v1.0.0');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isDocumentAnalyzing, setIsDocumentAnalyzing] = useState(false);
  const [documentAnalysisError, setDocumentAnalysisError] = useState('');

  if (!isNewModalOpen) return null;

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !projName.trim() ||
      !projNameFa.trim() ||
      !projDescription.trim() ||
      !projDescriptionFa.trim() ||
      !projVersion.trim() ||
      !projectFile
    ) {
      setProjectUploadError(
        language === 'fa'
          ? 'نام پروژه به دو زبان، توضیحات فارسی و انگلیسی، نسخه و فایل ZIP را وارد کنید.'
          : 'Enter the project name and descriptions in both languages, a version, and a ZIP archive.'
      );
      return;
    }

    if (projectFile.size > 30 * 1024 * 1024) {
      setProjectUploadError(language === 'fa' ? 'حجم فایل ZIP نباید بیشتر از ۳۰ مگابایت باشد.' : 'The ZIP archive must be 30 MB or smaller.');
      return;
    }

    setProjectUploadError('');
    setIsProjectUploading(true);
    try {
      const response = await fetch('/api/upload-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/zip',
          'X-File-Name': encodeURIComponent(projectFile.name),
        },
        body: projectFile,
      });
      const result = await response.json() as ProjectUploadResult & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Project upload failed.');

      addProject({
        name: projName.trim(),
        nameFa: projNameFa.trim(),
        description: projDescription.trim(),
        descriptionFa: projDescriptionFa.trim(),
        category: projCategory,
        categoryFa: projectCategories[projCategory].fa,
        status: 'active',
        version: projVersion.trim(),
        year: '۱۴۰۵',
        formats: ['tsx', 'openapi'],
        techStack: projTechStack.split(/[,\n،]/).map(item => item.trim()).filter(Boolean).slice(0, 10),
        metrics: {
          filesCount: result.filesCount,
          completion: 100,
          locOrSize: `${(projectFile.size / (1024 * 1024)).toFixed(2)} MB`,
          roleTitle: 'Sole Author',
          roleTitleFa: 'طراح و توسعه‌دهنده اختصاصی',
        },
        uploadedArchive: result.uploadedArchive,
      });
      closeNewModal();
    } catch (error) {
      setProjectUploadError(
        error instanceof Error
          ? error.message
          : language === 'fa'
          ? 'بارگذاری پروژه ناموفق بود.'
          : 'Project upload failed.'
      );
    } finally {
      setIsProjectUploading(false);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile) {
      setDocumentAnalysisError(language === 'fa' ? 'فایل موردنظر را انتخاب کنید.' : 'Choose a file to analyze.');
      return;
    }

    if (documentFile.size > 20 * 1024 * 1024) {
      setDocumentAnalysisError(language === 'fa' ? 'حجم فایل نباید بیشتر از ۲۰ مگابایت باشد.' : 'The file must be 20 MB or smaller.');
      return;
    }

    setDocumentAnalysisError('');
    setIsDocumentAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': documentFile.type || 'application/octet-stream',
          'X-File-Name': encodeURIComponent(documentFile.name),
        },
        body: documentFile,
      });
      const result = await response.json() as DocumentAnalysisResult & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Document analysis failed.');

      addDocument({
        title: docTitle.trim() || result.title,
        titleFa: docTitleFa.trim() || result.titleFa,
        category: result.category,
        categoryFa: result.categoryFa,
        format: docFormat,
        version: docVersion.trim(),
        size: `${(documentFile.size / 1024).toFixed(1)} KB`,
        status: 'active',
        projectName: 'سامانه پردازش ناوگان شهری',
        projectNameFa: 'سامانه پردازش ناوگان شهری',
        description: result.description,
        descriptionFa: result.descriptionFa,
        uploadedFile: result.uploadedFile,
      });
      closeNewModal();
    } catch (error) {
      setDocumentAnalysisError(
        error instanceof Error
          ? error.message
          : language === 'fa'
          ? 'تحلیل فایل ناموفق بود.'
          : 'Document analysis failed.'
      );
    } finally {
      setIsDocumentAnalyzing(false);
    }
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
              <Upload className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">
              {isProject
                ? language === 'fa'
                  ? 'بارگذاری پروژه از فایل'
                  : 'Upload Project from File'
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
          <form onSubmit={handleProjectSubmit} className="max-h-[calc(90vh-4rem)] space-y-4 overflow-y-auto p-5 text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-slate-300">
                  {language === 'fa' ? 'نام پروژه (انگلیسی)' : 'Project Name (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={e => setProjName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#334155] bg-[#0A0F1D] px-3 text-slate-200 placeholder-slate-500 focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-300">
                  {language === 'fa' ? 'نام پروژه (فارسی)' : 'Project Name (Persian)'}
                </label>
                <input
                  type="text"
                  required
                  value={projNameFa}
                  onChange={e => setProjNameFa(e.target.value)}
                  placeholder="مثال: سامانه مدیریت ناوگان"
                  className="h-10 w-full rounded-lg border border-[#334155] bg-[#0A0F1D] px-3 text-slate-200 placeholder-slate-500 focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-slate-300">
                  {language === 'fa' ? 'توضیحات پروژه (انگلیسی)' : 'Project Description (English)'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={projDescription}
                  onChange={e => setProjDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#334155] bg-[#0A0F1D] px-3 py-2 text-slate-200 focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-300">
                  {language === 'fa' ? 'توضیحات پروژه (فارسی)' : 'Project Description (Persian)'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={projDescriptionFa}
                  onChange={e => setProjDescriptionFa(e.target.value)}
                  className="w-full rounded-lg border border-[#334155] bg-[#0A0F1D] px-3 py-2 text-slate-200 focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-slate-300">
                  {language === 'fa' ? 'دسته‌بندی' : 'Category'}
                </label>
                <select
                  value={projCategory}
                  onChange={e => setProjCategory(e.target.value as Project['category'])}
                  className="h-10 w-full rounded-lg border border-[#334155] bg-[#0A0F1D] px-3 text-slate-200 focus:border-[#4F46E5] focus:outline-none"
                >
                  {Object.entries(projectCategories).map(([value, labels]) => (
                    <option key={value} value={value}>{language === 'fa' ? labels.fa : labels.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-300">
                  {language === 'fa' ? 'نسخه پروژه' : 'Project Version'}
                </label>
                <input
                  type="text"
                  required
                  value={projVersion}
                  onChange={e => setProjVersion(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#334155] bg-[#0A0F1D] px-3 font-mono text-slate-200 focus:border-[#4F46E5] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-medium text-slate-300">
                {language === 'fa' ? 'فناوری‌ها (با ویرگول جدا کنید)' : 'Tech Stack (comma-separated)'}
              </label>
              <textarea
                rows={2}
                value={projTechStack}
                onChange={e => setProjTechStack(e.target.value)}
                placeholder="React, TypeScript, Node.js"
                className="w-full rounded-lg border border-[#334155] bg-[#0A0F1D] px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-[#4F46E5] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-slate-300">
                {language === 'fa' ? 'فایل فشرده پروژه (ZIP)' : 'Project Archive (ZIP)'}
              </label>
              <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#475569] bg-[#0A0F1D] px-3 py-3 transition-colors hover:border-[#818CF8]">
                <Upload className="h-4 w-4 shrink-0 text-[#a5b4fc]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-slate-200">
                    {projectFile?.name || (language === 'fa' ? 'انتخاب فایل ZIP پروژه' : 'Choose project ZIP file')}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    {projectFile
                      ? `${(projectFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : language === 'fa'
                      ? 'حداکثر حجم ۳۰ مگابایت'
                      : 'Maximum size 30 MB'}
                  </span>
                </span>
                <input
                  type="file"
                  required
                  accept=".zip,application/zip,application/x-zip-compressed"
                  onChange={event => {
                    setProjectFile(event.target.files?.[0] || null);
                    setProjectUploadError('');
                  }}
                  className="sr-only"
                />
              </label>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-400">
              {language === 'fa'
                ? 'توضیحات را دستی وارد کنید؛ برای ثبت پروژه هیچ درخواست هوش مصنوعی ارسال نمی‌شود. فایل ZIP ذخیره می‌شود؛ پیش از بارگذاری، فایل‌های محرمانه را حذف کنید.'
                : 'Enter project details manually; no AI request is sent. The ZIP is stored as-is, so remove secrets before uploading.'}
            </p>
            {projectUploadError && (
              <p role="alert" className="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-rose-300">
                {projectUploadError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-white/[0.08] pt-2">
              <button
                type="button"
                onClick={closeNewModal}
                className="rounded-lg bg-[#0F172A] px-4 py-2 text-slate-300 transition-colors hover:text-white"
              >
                {language === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isProjectUploading}
                className="rounded-lg bg-[#4F46E5] px-4 py-2 font-semibold text-white shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-all hover:bg-[#6366F1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProjectUploading && <LoaderCircle className="me-1.5 inline h-3.5 w-3.5 animate-spin" />}
                {isProjectUploading
                  ? language === 'fa' ? 'در حال بارگذاری...' : 'Uploading...'
                  : language === 'fa' ? 'ثبت و بارگذاری پروژه' : 'Save Project & Upload ZIP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleDocumentSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'فایل برای تحلیل ابری' : 'File to Analyze in the Cloud'}
              </label>
              <label className="flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#475569] bg-[#0A0F1D] px-3 py-3 transition-colors hover:border-[#818CF8]">
                <Upload className="h-4 w-4 shrink-0 text-[#a5b4fc]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-slate-200">
                    {documentFile?.name || (language === 'fa' ? 'فایل PDF، متن، کد یا تصویر انتخاب کنید' : 'Choose a PDF, text, code, or image file')}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    {documentFile
                      ? `${(documentFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : language === 'fa'
                      ? 'حداکثر ۲۰ مگابایت'
                      : 'Maximum size 20 MB'}
                  </span>
                </span>
                <input
                  type="file"
                  required
                  accept=".pdf,.txt,.md,.csv,.json,.yaml,.yml,.docx,.png,.jpg,.jpeg,.webp,.ts,.tsx,.js,.jsx,.py,.go,.rs,.java,.html,.css"
                  onChange={event => {
                    setDocumentFile(event.target.files?.[0] || null);
                    setDocumentAnalysisError('');
                  }}
                  className="sr-only"
                />
              </label>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {language === 'fa' ? 'عنوان انگلیسی (اختیاری)' : 'English Title (Optional)'}
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                placeholder={language === 'fa' ? 'در صورت خالی‌بودن، هوش مصنوعی عنوان می‌سازد' : 'Leave blank to generate a title with AI'}
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

            <p className="text-[11px] leading-relaxed text-slate-400">
              {language === 'fa'
                ? 'محتوای فایل برای تولید عنوان و توضیحات به OpenAI ارسال و نسخه اصلی در فضای ذخیره‌سازی ابری نگهداری می‌شود.'
                : 'The file is sent to OpenAI for a title and summary; the original is stored in cloud storage.'}
            </p>
            {documentAnalysisError && (
              <p role="alert" className="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-rose-300">
                {documentAnalysisError}
              </p>
            )}

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
                disabled={isDocumentAnalyzing}
                className="px-4 py-2 font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-all"
              >
                {isDocumentAnalyzing && <LoaderCircle className="me-1.5 inline h-3.5 w-3.5 animate-spin" />}
                {isDocumentAnalyzing
                  ? language === 'fa' ? 'در حال تحلیل فایل...' : 'Analyzing file...'
                  : language === 'fa' ? 'تحلیل و ثبت فایل' : 'Analyze & Register'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
