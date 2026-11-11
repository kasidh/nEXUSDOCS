import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, DocumentItem, ApiEndpoint } from '../types';
import { StatusBadge, FileFormatBadge } from './Badges';
import {
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  Shield,
  Activity,
  Layers,
  FileText,
  Code,
  Calendar,
  User,
  Cpu,
} from 'lucide-react';

export const InspectorDrawer: React.FC = () => {
  const {
    isInspectorOpen,
    closeInspector,
    selectedInspectorItem,
    inspectorType,
    language,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'audit'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isInspectorOpen || !selectedInspectorItem) {
    return null;
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast(language === 'fa' ? 'شناسه در کلیپ‌بورد کپی شد' : 'Identifier copied');
  };

  const isProject = inspectorType === 'project';
  const isDocument = inspectorType === 'document';
  const isApi = inspectorType === 'api';

  const project = isProject ? (selectedInspectorItem as Project) : null;
  const doc = isDocument ? (selectedInspectorItem as DocumentItem) : null;
  const api = isApi ? (selectedInspectorItem as ApiEndpoint) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={closeInspector}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity pointer-events-auto"
      />

      {/* 360px Contextual Panel */}
      <div
        className={`fixed inset-y-0 ${
          language === 'fa' ? 'left-0' : 'right-0'
        } w-full max-w-[380px] bg-[#1E293B] border-${
          language === 'fa' ? 'r' : 'l'
        } border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-[#0F172A] border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              {language === 'fa' ? 'پنل مشخصات فنی' : 'Contextual Inspector'}
            </span>
          </div>

          <button
            onClick={closeInspector}
            className="w-7 h-7 rounded-md bg-[#1E293B] hover:bg-[#334155] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs inside Drawer */}
        <div className="flex items-center border-b border-white/[0.08] px-4 bg-[#0F172A]/50 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fa' ? 'مشخصات کلی' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fa' ? 'ساختار و کد' : 'Schema & Code'}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fa' ? 'تاریخچه و لاگ' : 'Audit Trail'}
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Main Title & Status */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-[11px] text-slate-400">
                {project ? project.version : doc ? doc.version : api?.method}
              </span>
              {project && <StatusBadge status={project.status} />}
              {doc && <StatusBadge status={doc.status} />}
            </div>

            <h3 className="text-base font-bold text-white mb-2 leading-snug">
              {project
                ? language === 'fa'
                  ? project.nameFa
                  : project.name
                : doc
                ? language === 'fa'
                  ? doc.titleFa
                  : doc.title
                : api?.path}
            </h3>

            <p className="text-slate-300 text-xs leading-relaxed">
              {project
                ? language === 'fa'
                  ? project.descriptionFa
                  : project.description
                : doc
                ? language === 'fa'
                  ? doc.descriptionFa
                  : doc.description
                : language === 'fa'
                ? api?.summaryFa
                : api?.summary}
            </p>
          </div>

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Format / Type specifics */}
              {doc && (
                <div className="bg-[#0F172A] p-3 rounded-lg border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileFormatBadge format={doc.format} size="md" />
                    <div>
                      <div className="font-semibold text-white uppercase font-mono text-[11px]">
                        {language === 'fa' ? `نقشه معماری ${doc.format.toUpperCase()}` : `${doc.format} Blueprint`}
                      </div>
                      <div className="text-[11px] text-slate-400">{doc.size}</div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      showToast(
                        language === 'fa'
                          ? 'دریافت نسخه اصلی فایل آغاز شد'
                          : 'Asset download stream established'
                      )
                    }
                    className="p-2 text-cyan-400 hover:bg-white/5 rounded transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Project Telemetry Metrics */}
              {project && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                    {language === 'fa' ? 'شاخص‌های پروژه' : 'Project Metrics'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0F172A] p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        {language === 'fa' ? 'حجم و کد' : 'Volume / LOC'}
                      </div>
                      <div className="text-xs font-mono font-bold text-white truncate">
                        {project.metrics.locOrSize}
                      </div>
                    </div>
                    <div className="bg-[#0F172A] p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        {language === 'fa' ? 'درصد تکمیل' : 'Completion'}
                      </div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {project.metrics.completion}%
                      </div>
                    </div>
                    <div className="bg-[#0F172A] p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        {language === 'fa' ? 'فایل‌های پیوست' : 'Artifacts'}
                      </div>
                      <div className="text-sm font-mono font-bold text-cyan-400">
                        {project.metrics.filesCount} {language === 'fa' ? 'فایل' : 'files'}
                      </div>
                    </div>
                    <div className="bg-[#0F172A] p-3 rounded-lg border border-white/5">
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        {language === 'fa' ? 'نقش توسعه' : 'Role'}
                      </div>
                      <div className="text-xs font-mono font-bold text-white truncate">
                        {language === 'fa' ? project.metrics.roleTitleFa : project.metrics.roleTitle}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Architecture Metadata Fields */}
              <div className="bg-[#0F172A] rounded-lg border border-white/5 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'fa' ? 'مالک و ایجادکننده' : 'Project Author'}</span>
                  </span>
                  <span className="font-medium text-slate-200">
                    {project ? (language === 'fa' ? 'توسعه‌دهنده شخصی (من)' : 'Sole Author (Me)') : doc ? (language === 'fa' ? doc.projectNameFa || 'پروژه ناوگان' : doc.projectName || 'Fleet Project') : 'System'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'fa' ? 'آخرین ثبت' : 'Last Checkin'}</span>
                  </span>
                  <span className="font-mono text-slate-300">
                    {project
                      ? language === 'fa'
                        ? project.updatedAtFa
                        : project.updatedAt
                      : doc
                      ? language === 'fa'
                        ? doc.updatedAtFa
                        : doc.updatedAt
                      : 'Real-time telemetry'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'fa' ? 'امنیت دسترسی' : 'Security Clearance'}</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {language === 'fa' ? 'سطح ۱ اعتماد صفر' : 'Zero-Trust Tier 1'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SCHEMA & CODE */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {language === 'fa' ? 'کد منبع و مشخصات' : 'Source Manifest / Code'}
                </span>
                <button
                  onClick={() =>
                    handleCopyId(
                      doc?.codeSnippet ||
                        api?.sampleResponse ||
                        JSON.stringify(project?.techStack, null, 2)
                    )
                  }
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? (language === 'fa' ? 'کپی شد' : 'Copied') : (language === 'fa' ? 'کپی کد' : 'Copy')}</span>
                </button>
              </div>

              <div className="bg-[#0A0F1D] border border-white/5 rounded-lg p-3 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-96">
                <pre>
                  {doc?.codeSnippet ||
                    api?.sampleResponse ||
                    `// Project Tech Stack Manifest
export const ArchitectureStack = ${JSON.stringify(project?.techStack, null, 2)};`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
                {language === 'fa' ? 'رویدادهای ثبت‌شده اخیر' : 'Verified Security Commits'}
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-[#0F172A] rounded border border-white/5">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-200">
                      {language === 'fa' ? 'به‌روزرسانی امضای دیجیتال' : 'Cryptographic Signature Update'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">12:40</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {language === 'fa'
                      ? 'تایید اعتبار در برابر اتاق امن HSM ریشه · موفق'
                      : 'Validated against root CA HSM enclave · Pass'}
                  </p>
                </div>

                <div className="p-2.5 bg-[#0F172A] rounded border border-white/5">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-200">
                      {language === 'fa' ? 'استقرار نسخه قناری' : 'Canary Sync Triggered'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">09:15</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {language === 'fa'
                      ? 'آغاز انتشار تدریجی ترافیک به میزان ۱۰ درصد'
                      : 'Gradual traffic rollout initiated to 10%'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 bg-[#0F172A] border-t border-white/[0.08] flex items-center justify-between gap-2">
          <button
            onClick={() =>
              handleCopyId(
                project?.id || doc?.id || api?.id || 'sovereign-manifest-id'
              )
            }
            className="px-3 py-2 text-xs font-mono text-slate-300 hover:text-white bg-[#1E293B] hover:bg-[#334155] border border-white/5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{language === 'fa' ? 'کپی شناسه' : 'Copy UUID'}</span>
          </button>

          <button
            onClick={() => {
              showToast(language === 'fa' ? 'تغییرات ذخیره شد' : 'Manifest synced');
              closeInspector();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg transition-all shadow-[0_2px_8px_rgba(79,70,229,0.3)]"
          >
            {language === 'fa' ? 'بستن پنل' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
