import React, { useState } from 'react';
import { DocumentItem, FileFormat } from '../types';
import { useApp } from '../context/AppContext';
import { StatusBadge, FileFormatBadge } from './Badges';
import {
  Search,
  Eye,
  SlidersHorizontal,
  Download,
  Trash2,
  Plus,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

export const RepositoryTable: React.FC = () => {
  const {
    documents,
    language,
    openInspector,
    setPreviewDocument,
    deleteDocument,
    openNewModal,
    showToast,
  } = useApp();

  const [activeFormat, setActiveFormat] = useState<FileFormat | 'all'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'updatedAt' | 'size'>('updatedAt');

  const filteredDocs = documents.filter(doc => {
    const matchesFormat = activeFormat === 'all' || doc.format === activeFormat;
    const q = localSearch.toLowerCase();
    const matchesQuery =
      doc.title.toLowerCase().includes(q) ||
      doc.titleFa.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.version.toLowerCase().includes(q);
    return matchesFormat && matchesQuery;
  });

  const handleDownload = (doc: DocumentItem) => {
    showToast(
      language === 'fa'
        ? `دانلود فایل ${doc.titleFa} آماده شد`
        : `Download started for ${doc.title}`
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Filter Pills & Search & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0F172A] p-3 rounded-xl border border-white/5">
        {/* Format Selector segmented tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFormat('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeFormat === 'all'
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
            }`}
          >
            {language === 'fa' ? 'تمام اسناد' : 'All Formats'} ({documents.length})
          </button>
          <button
            onClick={() => setActiveFormat('figma')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFormat === 'figma'
                ? 'bg-[#F24E1E]/20 text-[#F24E1E] border border-[#F24E1E]/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F24E1E]" />
            Figma
          </button>
          <button
            onClick={() => setActiveFormat('tsx')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFormat === 'tsx'
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            React / TSX
          </button>
          <button
            onClick={() => setActiveFormat('openapi')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFormat === 'openapi'
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            OpenAPI
          </button>
          <button
            onClick={() => setActiveFormat('pdf')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeFormat === 'pdf'
                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            PDF
          </button>
        </div>

        {/* Search & New Document Trigger */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder={language === 'fa' ? 'جستجوی سند یا نسخه...' : 'Search blueprints & specs...'}
              className="w-full h-9 ps-9 pe-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
            />
          </div>

          <button
            onClick={() => openNewModal('document')}
            className="h-9 px-3.5 text-xs font-medium text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-[0_2px_10px_rgba(79,70,229,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'افزودن سند' : 'Upload Asset'}</span>
          </button>
        </div>
      </div>

      {/* High-density Enterprise Table */}
      <div className="bg-[#1E293B] border border-white/5 rounded-xl overflow-hidden glow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="bg-[#0F172A] border-b border-white/[0.08] text-slate-400 font-mono tracking-wider text-[11px]">
                <th className="py-3 px-4 text-start font-medium">{language === 'fa' ? 'قالب' : 'Type'}</th>
                <th className="py-3 px-4 text-start font-medium min-w-[280px]">
                  {language === 'fa' ? 'عنوان و دسته سند' : 'Document Specification'}
                </th>
                <th className="py-3 px-4 text-start font-medium">{language === 'fa' ? 'نسخه' : 'Version'}</th>
                <th className="py-3 px-4 text-start font-medium">{language === 'fa' ? 'وضعیت' : 'Status'}</th>
                <th className="py-3 px-4 text-start font-medium">{language === 'fa' ? 'پروژه مرتبط' : 'Project'}</th>
                <th className="py-3 px-4 text-start font-medium">{language === 'fa' ? 'حجم' : 'Size'}</th>
                <th className="py-3 px-4 text-start font-medium">{language === 'fa' ? 'به‌روزرسانی' : 'Updated'}</th>
                <th className="py-3 px-4 text-end font-medium pe-6">{language === 'fa' ? 'عملیات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-medium text-sm">
                      {language === 'fa' ? 'هیچ سندی مطابق با فیلتر یافت نشد' : 'No documents match current filters'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'fa' ? 'عبارت جستجو یا قالب انتخابی را تغییر دهید.' : 'Try adjusting your search criteria or format tag.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr
                    key={doc.id}
                    className="hover:bg-[#334155]/30 transition-colors group"
                  >
                    {/* Format 36x36 container */}
                    <td className="py-3 px-4">
                      <FileFormatBadge format={doc.format} size="md" />
                    </td>

                    {/* Title & Category */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-[#c3c0ff] transition-colors">
                        {language === 'fa' ? doc.titleFa : doc.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {language === 'fa' ? doc.categoryFa : doc.category}
                      </div>
                    </td>

                    {/* Version */}
                    <td className="py-3 px-4 font-mono text-[11px] text-cyan-400 font-medium">
                      {doc.version}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <StatusBadge status={doc.status} />
                    </td>

                    {/* Associated Project */}
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium truncate max-w-[140px] block">
                        {language === 'fa' ? doc.projectNameFa || 'پروژه ناوگان' : doc.projectName || 'Fleet Engine'}
                      </span>
                    </td>

                    {/* File Size (Monospace tabular) */}
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-400">
                      {doc.size}
                    </td>

                    {/* Updated At */}
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {language === 'fa' ? doc.updatedAtFa : doc.updatedAt}
                    </td>

                    {/* Instant Actions */}
                    <td className="py-3 px-4 text-end pe-6">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => setPreviewDocument(doc)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-[#0F172A] rounded transition-colors"
                          title={language === 'fa' ? 'پیش‌نمایش سریع' : 'Quick Preview'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openInspector(doc, 'document')}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-[#0F172A] rounded transition-colors"
                          title={language === 'fa' ? 'مشاهده در پنل مشخصات' : 'Inspect Details'}
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-[#0F172A] rounded transition-colors"
                          title={language === 'fa' ? 'دانلود فایل' : 'Download File'}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title={language === 'fa' ? 'حذف از مخزن' : 'Delete Document'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
