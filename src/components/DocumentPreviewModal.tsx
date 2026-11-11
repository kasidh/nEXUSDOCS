import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileFormatBadge, StatusBadge } from './Badges';
import { X, Copy, Check, Download, ExternalLink, ShieldCheck, FileText, Code2 } from 'lucide-react';

export const DocumentPreviewModal: React.FC = () => {
  const { previewDocument, setPreviewDocument, language, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!previewDocument) return null;

  const handleCopy = () => {
    if (previewDocument.codeSnippet) {
      navigator.clipboard.writeText(previewDocument.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast(language === 'fa' ? 'کد در کلیپ‌بورد کپی شد' : 'Snippet copied to clipboard');
    }
  };

  const handleDownload = () => {
    showToast(
      language === 'fa'
        ? `دانلود فایل ${previewDocument.titleFa} شروع شد`
        : `Downloading ${previewDocument.title}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#1E293B] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 bg-[#0F172A] border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileFormatBadge format={previewDocument.format} size="md" />
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">
                {language === 'fa' ? previewDocument.titleFa : previewDocument.title}
              </h3>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>{previewDocument.version}</span>
                <span>·</span>
                <span>{previewDocument.size}</span>
                <span>·</span>
                <StatusBadge status={previewDocument.status} />
              </div>
            </div>
          </div>

          <button
            onClick={() => setPreviewDocument(null)}
            className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Description */}
          <div className="bg-[#0F172A] p-3.5 rounded-xl border border-white/5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide mb-1">
              {language === 'fa' ? 'شرح و کاربرد سند' : 'Specification Summary'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {language === 'fa'
                ? previewDocument.descriptionFa
                : previewDocument.description}
            </p>
          </div>

          {/* Code or Schema Preview */}
          {previewDocument.codeSnippet && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'fa' ? 'پیش‌نمایش محتوا' : 'Manifest & Schema Code'}</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (language === 'fa' ? 'کپی شد' : 'Copied') : (language === 'fa' ? 'کپی کد' : 'Copy')}</span>
                </button>
              </div>

              <div className="bg-[#0A0F1D] border border-white/5 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto max-h-64">
                <pre>{previewDocument.codeSnippet}</pre>
              </div>
            </div>
          )}

          {/* Audit / Schema details if PDF or Spec */}
          {previewDocument.schemaDetails && (
            <div className="bg-[#0F172A] rounded-xl border border-white/5 p-4 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'fa' ? 'اطلاعات بازرسی و اعتبارسنجی' : 'Compliance & Attestation'}</span>
              </div>
              {Object.entries(previewDocument.schemaDetails).map(([key, val]) => {
                const getLabel = (k: string) => {
                  if (language !== 'fa') return k.replace(/([A-Z])/g, ' $1');
                  switch (k) {
                    case 'auditAgency': return 'مرجع بازرسی و استاندارد';
                    case 'cryptographicGrade': return 'درجه رمزنگاری سخت‌افزاری';
                    case 'findingsResolved': return 'وضعیت رفع توصیه‌ها';
                    case 'validUntil': return 'اعتبار گواهی‌نامه';
                    default: return k;
                  }
                };
                return (
                  <div key={key} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
                    <span className="text-slate-400 capitalize">{getLabel(key)}</span>
                    <span className="font-mono text-slate-200">{val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Project & Updated info */}
          <div className="flex items-center justify-between pt-2 text-slate-400 text-xs border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-slate-500">{language === 'fa' ? 'پروژه مرتبط:' : 'Project:'}</span>
              <span className="text-slate-200">{language === 'fa' ? previewDocument.projectNameFa || 'سامانه پردازش ناوگان شهری' : previewDocument.projectName || 'Fleet Project'}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">{language === 'fa' ? previewDocument.updatedAtFa : previewDocument.updatedAt}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0F172A] border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            {language === 'fa' ? 'رمزنگاری SHA-256 تایید شد' : 'Integrity Verified: SHA-256'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg transition-all flex items-center gap-1.5 shadow-[0_2px_8px_rgba(79,70,229,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'fa' ? 'دانلود فایل اصلی' : 'Download Spec'}</span>
            </button>
            <button
              onClick={() => setPreviewDocument(null)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1E293B] hover:bg-[#334155] rounded-lg transition-colors"
            >
              {language === 'fa' ? 'بستن' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
