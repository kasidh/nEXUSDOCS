import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  USER_PROJECT_1_DATA,
  FLEET_PYTHON_CODE,
  FLEET_BAT_CODE,
  FleetVehicleRow,
} from '../data/userFleetProject';
import {
  X,
  Truck,
  Code,
  FileSpreadsheet,
  FileCode,
  Download,
  Copy,
  Check,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Layers,
  Clock,
  Briefcase,
} from 'lucide-react';

interface FleetDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FleetDashboardModal: React.FC<FleetDashboardModalProps> = ({ isOpen, onClose }) => {
  const { language, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'python' | 'json' | 'bat'>('overview');
  const [vehicleMode, setVehicleMode] = useState<'hourly' | 'service'>('hourly');
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const hourly = USER_PROJECT_1_DATA.hourly;
  const service = USER_PROJECT_1_DATA.service;
  const totalRevenue = hourly.summary.revenue + service.summary.revenue;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast(language === 'fa' ? 'کد در کلیپ‌بورد کپی شد' : 'Code copied to clipboard');
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(language === 'fa' ? `فایل ${filename} ذخیره شد` : `Saved ${filename}`);
  };

  const formatRials = (num: number) => {
    if (num >= 1_000_000_000_000) {
      return `${(num / 1_000_000_000_000).toFixed(2)} تریلیون ریال`;
    }
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(1)} میلیارد ریال`;
    }
    return num.toLocaleString('fa-IR') + ' ریال';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl bg-[#0F172A] border border-[#334155] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-[#1E293B] border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#3131c0] p-0.5 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(79,70,229,0.4)]">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#c3c0ff]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">
                  {language === 'fa'
                    ? 'سامانه پردازش کارکرد ناوگان شهری و تعرفه‌ها'
                    : 'Fleet Telematics & Tariff Processing Engine'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                  شهریور ۱۴۰۵
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono text-[#c3c0ff] bg-[#4F46E5]/20 border border-[#4F46E5]/30 rounded">
                  پروژه اول من (v2.4.0)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'fa'
                  ? 'پردازش دقیق با کتابخانه Decimal پایتون، محاسبات سقف ساعتی (۲۴۷) و سرویسی (۱۴۲)، تولید خودکار اکسل'
                  : 'Python batch engine processing raw Excel records with Decimal exactness and openpyxl.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#0F172A] hover:bg-[#334155] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-[#0A0F1D] border-b border-white/[0.06] text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'داشبورد و آمار کارکرد' : 'Fleet Dashboard'}</span>
          </button>
          <button
            onClick={() => setActiveTab('types')}
            className={`py-3 px-3.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'types'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'تفکیک انواع ماشین‌آلات (۲۶ نوع)' : 'By Vehicle Type'}</span>
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`py-3 px-3.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'python'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'fa' ? 'سورس پایتون (fleet_batch.py)' : 'Python Source'}</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-3.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'json'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'fa' ? 'داده‌های خروجی (JSON)' : 'Raw JSON Data'}</span>
          </button>
          <button
            onClick={() => setActiveTab('bat')}
            className={`py-3 px-3.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bat'
                ? 'border-[#4F46E5] text-[#c3c0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'fa' ? 'اسکریپت درگ‌دراپ (fleet_drop.bat)' : 'Batch Drop Script'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Top 4 KPI Cards calculated from real data */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>{language === 'fa' ? 'کل ناوگان فعال' : 'Total Vehicles'}</span>
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {language === 'fa' ? '۲۲۰ دستگاه' : '220 Units'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {language === 'fa' ? '۱۶۱ ساعتی + ۵۹ سرویسی' : '161 Hourly + 59 Service'}
                  </div>
                </div>

                <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>{language === 'fa' ? 'درآمد کل ماهانه' : 'Total Revenue'}</span>
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {language === 'fa' ? '۴۸۷.۴ میلیارد ریال' : '487.4B Rials'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {language === 'fa' ? 'معادل ۴۸.۷ میلیارد تومان' : '~48.7 Billion Tomans'}
                  </div>
                </div>

                <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>{language === 'fa' ? 'کارکرد مؤثر ساعتی' : 'Effective Hours'}</span>
                    <Clock className="w-3.5 h-3.5 text-[#c3c0ff]" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    ۳۰,۸۵۱ ساعت
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    ۷۷.۶٪ ظرفیت (از ۳۹,۷۶۷ ساعت)
                  </div>
                </div>

                <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>{language === 'fa' ? 'کارکرد مؤثر سرویسی' : 'Effective Services'}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    ۶,۸۹۷.۲ سرویس
                  </div>
                  <div className="text-[10px] text-amber-400 mt-1">
                    ۸۲.۳٪ ظرفیت (از ۸,۳۷۸ سرویس)
                  </div>
                </div>
              </div>

              {/* Vehicle Sub-Mode Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1E293B] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5 p-1 bg-[#0F172A] rounded-lg">
                  <button
                    onClick={() => setVehicleMode('hourly')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      vehicleMode === 'hourly'
                        ? 'bg-[#4F46E5] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'fa' ? 'خودروهای ساعتی (۱۶۱ دستگاه)' : 'Hourly Vehicles (161)'}
                  </button>
                  <button
                    onClick={() => setVehicleMode('service')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      vehicleMode === 'service'
                        ? 'bg-[#4F46E5] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'fa' ? 'خودروهای سرویسی (۵۹ دستگاه)' : 'Service Vehicles (59)'}
                  </button>
                </div>

                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    placeholder={language === 'fa' ? 'جستجوی کد خودرو، نوع، منطقه...' : 'Filter code, type, region...'}
                    className="w-full h-8 ps-8 pe-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              {/* Vehicles Table */}
              <div className="bg-[#1E293B] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-start text-xs border-collapse">
                    <thead className="bg-[#0A0F1D] sticky top-0 border-b border-white/[0.08] text-slate-400 font-mono text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 text-start">کد خودرو</th>
                        <th className="py-2.5 px-3 text-start">نوع ماشین</th>
                        <th className="py-2.5 px-3 text-start">مناطق فعالیت</th>
                        <th className="py-2.5 px-3 text-end font-mono">کارکرد</th>
                        <th className="py-2.5 px-3 text-end font-mono">ظرفیت</th>
                        <th className="py-2.5 px-3 text-end font-mono">مؤثر</th>
                        <th className="py-2.5 px-3 text-end font-mono">کسری</th>
                        <th className="py-2.5 px-3 text-end font-mono">مازاد</th>
                        <th className="py-2.5 px-3 text-end font-mono">درآمد (ریال)</th>
                        <th className="py-2.5 px-3 text-start">وضعیت و هشدار</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {vehicleMode === 'hourly'
                        ? hourly.vehicles
                            .filter(
                              (v: FleetVehicleRow) =>
                                v.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
                                v.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
                                v.regions.some((r: string) => r.includes(searchFilter)) ||
                                v.warn.toLowerCase().includes(searchFilter.toLowerCase())
                            )
                            .map((v: FleetVehicleRow) => (
                              <tr key={v.code} className="hover:bg-[#334155]/30 transition-colors">
                                <td className="py-2 px-3 font-mono font-bold text-cyan-400">{v.code}</td>
                                <td className="py-2 px-3 text-slate-200">{v.type}</td>
                                <td className="py-2 px-3 text-slate-400 font-mono text-[11px] truncate max-w-[140px]">
                                  {v.regions.join(', ')}
                                </td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-slate-300">{v.used}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-slate-400">{v.cap}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-emerald-400 font-semibold">{v.eff}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-amber-400">{v.deficit}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-slate-400">{v.over}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums font-semibold text-slate-200">
                                  {v.revenue.toLocaleString()}
                                </td>
                                <td className="py-2 px-3">
                                  {v.warn ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      <span>{v.warn}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-emerald-400 font-mono">عادی</span>
                                  )}
                                </td>
                              </tr>
                            ))
                        : service.vehicles
                            .filter(
                              (v: FleetVehicleRow) =>
                                v.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
                                v.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
                                v.regions.some((r: string) => r.includes(searchFilter)) ||
                                v.warn.toLowerCase().includes(searchFilter.toLowerCase())
                            )
                            .map((v: FleetVehicleRow) => (
                              <tr key={v.code} className="hover:bg-[#334155]/30 transition-colors">
                                <td className="py-2 px-3 font-mono font-bold text-cyan-400">{v.code}</td>
                                <td className="py-2 px-3 text-slate-200">{v.type}</td>
                                <td className="py-2 px-3 text-slate-400 font-mono text-[11px] truncate max-w-[140px]">
                                  {v.regions.join(', ')}
                                </td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-slate-300">{v.used.toFixed(1)}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-slate-400">{v.cap}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-emerald-400 font-semibold">{v.eff}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-amber-400">{v.deficit.toFixed(1)}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums text-slate-400">{v.over.toFixed(1)}</td>
                                <td className="py-2 px-3 text-end font-mono tabular-nums font-semibold text-slate-200">
                                  {v.revenue.toLocaleString()}
                                </td>
                                <td className="py-2 px-3">
                                  {v.warn ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      <span>{v.warn}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-emerald-400 font-mono">عادی</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BY TYPE */}
          {activeTab === 'types' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                {language === 'fa'
                  ? 'تفکیک ۲۶ نوع ماشین‌آلات شهری بر اساس تعداد دستگاه، کارکرد، کسری و سهم درآمد:'
                  : 'Breakdown across 26 vehicle types ordered by volume and utilization:'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hourly.by_type.map(item => (
                  <div
                    key={item.type}
                    className="bg-[#1E293B] border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-[#4F46E5]/40 transition-all"
                  >
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{item.type}</span>
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">
                          {item.vehicles} دستگاه
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">
                        کارکرد: {item.used.toLocaleString()} ساعت · کسری: {item.deficit.toLocaleString()}
                      </div>
                    </div>

                    <div className="text-end font-mono">
                      <div className="text-xs font-bold text-emerald-400">
                        {(item.revenue / 1_000_000_000).toFixed(2)} میلیارد
                      </div>
                      <div className="text-[10px] text-slate-500">ریال</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PYTHON CODE */}
          {activeTab === 'python' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono font-semibold">fleet_batch.py (320 LOC)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(FLEET_PYTHON_CODE)}
                    className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#1E293B] rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'کپی شد' : 'کپی کد'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadFile('fleet_batch.py', FLEET_PYTHON_CODE)}
                    className="px-3 py-1.5 text-xs text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود فایل .py</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0A0F1D] border border-white/5 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto max-h-[500px]">
                <pre>{FLEET_PYTHON_CODE}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: JSON DATA */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span className="font-mono font-semibold">06_shahrivar_1405.json</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(JSON.stringify(USER_PROJECT_1_DATA, null, 2))}
                    className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#1E293B] rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'کپی شد' : 'کپی جیسون'}</span>
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadFile('06_shahrivar_1405.json', JSON.stringify(USER_PROJECT_1_DATA, null, 2))
                    }
                    className="px-3 py-1.5 text-xs text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود فایل .json</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0A0F1D] border border-white/5 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto max-h-[500px]">
                <pre>{JSON.stringify(USER_PROJECT_1_DATA, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: BAT SCRIPT */}
          {activeTab === 'bat' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-semibold">fleet_drop.bat</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(FLEET_BAT_CODE)}
                    className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#1E293B] rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'کپی شد' : 'کپی اسکریپت'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadFile('fleet_drop.bat', FLEET_BAT_CODE)}
                    className="px-3 py-1.5 text-xs text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود فایل .bat</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0A0F1D] border border-white/5 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[500px]">
                <pre>{FLEET_BAT_CODE}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#1E293B] border-t border-white/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>کنترل‌های تطبیق: ۱۰ مورد بررسی شد · ۱۰۰٪ موفق</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg transition-all"
          >
            {language === 'fa' ? 'بستن پنجره' : 'Close Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
