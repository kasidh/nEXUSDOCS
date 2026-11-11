import React from 'react';
import { useApp } from '../context/AppContext';
import { USER_PROJECT_1_DATA } from '../data/userFleetProject';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Layers,
  Clock,
  Briefcase,
  AlertTriangle,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

export const ClusterNodesView: React.FC = () => {
  const { language, openFleetModal, showToast } = useApp();

  const hSummary = USER_PROJECT_1_DATA.hourly.summary;
  const sSummary = USER_PROJECT_1_DATA.service.summary;
  const totalRev = hSummary.revenue + sSummary.revenue;
  const totalVehicles = hSummary.vehicles + sSummary.vehicles;

  const invariants = [
    { nameFa: 'سقف ساعت ماهانه (۲۴۷ ساعت)', nameEn: 'Hourly Cap (247h)', status: 'PASSED', target: 'حداکثر ۲۴۷ ساعت کارکرد موثر' },
    { nameFa: 'سقف سرویس ماهانه (۱۴۲ سرویس)', nameEn: 'Service Cap (142 Services)', status: 'PASSED', target: 'حداکثر ۱۴۲ سرویس محاسبه شده' },
    { nameFa: 'دقت اعشاری Decimal Math', nameEn: 'Decimal Arithmetic Precision', status: 'PASSED', target: 'تطابق ۱۰۰٪ درآمد بدون خطای Float' },
    { nameFa: 'فرمول تبدیل ساعت به سرویس (cs/ch)', nameEn: 'Hour-to-Service Ratio (cs/ch)', status: 'PASSED', target: 'نرخ معادل بر اساس نوع خودرو' },
    { nameFa: 'تعرفه میانگین موزون چندنرخی', nameEn: 'Weighted Average Rate', status: 'PASSED', target: 'تطابق مجموع تعرفه‌های ساعتی و شیفت' },
    { nameFa: 'کنترل کسری کارکرد (کسری ساعت/سرویس)', nameEn: 'Deficit Invariant Integrity', status: 'PASSED', target: 'محاسبه مابه‌التفاوت سقف و کارکرد' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              {language === 'fa' ? 'تله‌متری پروژه اول' : 'PROJECT #1 TELEMETRY'}
            </span>
            <span className="text-xs text-slate-400 font-mono">شهریور ۱۴۰۵ / September 2026</span>
          </div>
          <h2 className="text-base font-semibold text-white">
            {language === 'fa' ? 'تحلیل کارکرد و ممیزی محاسبات ناوگان شهری' : 'Fleet Operations & Invariant Audit Analytics'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'fa'
              ? 'گزارش تجمیعی تله‌متری ۲۲۰ دستگاه خودروی استیجاری، محاسبات سقف‌های کاری، ممیزی مغایرت‌ها و درآمد'
              : 'Consolidated performance metrics for 220 municipal vehicles across hourly and service contracts.'}
          </p>
        </div>

        <button
          onClick={openFleetModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#3131c0] hover:from-[#6366F1] hover:to-[#4F46E5] rounded-lg shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-all flex items-center gap-2 shrink-0"
        >
          <Truck className="w-4 h-4 text-[#acedff]" />
          <span>{language === 'fa' ? 'داشبورد کامل ناوگان و سورس پایتون' : 'Open Complete Fleet Modal'}</span>
        </button>
      </div>

      {/* KPI 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">{language === 'fa' ? 'کل ناوگان تحت پوشش' : 'Total Vehicles'}</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mb-1">
            {totalVehicles} {language === 'fa' ? 'دستگاه' : 'Vehicles'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {hSummary.vehicles} {language === 'fa' ? 'ساعتی' : 'Hourly'} · {sSummary.vehicles} {language === 'fa' ? 'سرویسی' : 'Service'}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">{language === 'fa' ? 'درآمد کل ماهانه' : 'Total Monthly Revenue'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mb-1">
            {(totalRev / 1_000_000_000).toFixed(1)} {language === 'fa' ? 'میلیارد ریال' : 'B Rials'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            ~{(totalRev / 10_000_000_000).toFixed(1)} {language === 'fa' ? 'میلیارد تومان' : 'B Tomans'}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">{language === 'fa' ? 'کارکرد موثر ساعتی' : 'Effective Hours'}</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mb-1">
            {hSummary.worked_effective.toLocaleString('fa-IR')} {language === 'fa' ? 'ساعت' : 'Hours'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {language === 'fa' ? 'از ۳۹,۷۶۷ ساعت ظرفیت اسمی' : 'from 39,767 nominal cap'}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">{language === 'fa' ? 'کل سرویس‌های موثر' : 'Effective Services'}</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mb-1">
            {sSummary.worked_effective.toLocaleString('fa-IR')} {language === 'fa' ? 'سرویس' : 'Services'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {language === 'fa' ? 'از ۸,۳۷۸ سرویس ظرفیت اسمی' : 'from 8,378 nominal cap'}
          </div>
        </div>
      </div>

      {/* Mathematical Invariant Checks Table */}
      <div className="bg-[#1E293B] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {language === 'fa' ? 'کنترل‌های صحت ریاضی و ممیزی فرمول‌ها (Mathematical Invariants)' : 'Mathematical Invariant Checks'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'fa'
                ? 'تمام ۶ تست جامع ریاضی اسکریپت fleet_batch.py با موفقیت ۱۰۰٪ پاس شده‌اند.'
                : 'All 6 math audits in fleet_batch.py verified with zero discrepancies.'}
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>۱۰۰٪ تطابق ریاضی</span>
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {invariants.map((inv, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#0F172A]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 text-xs font-mono">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    {language === 'fa' ? inv.nameFa : inv.nameEn}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {inv.target}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{inv.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Machine Types Preview */}
      <div className="bg-[#1E293B] border border-white/5 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {language === 'fa' ? 'دسته‌بندی ناوگان بر اساس نوع خودرو و ماشین‌آلات' : 'Fleet Vehicle Type Classification'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'fa'
                ? 'نمونه‌ای از انواع ماشین‌آلات خدمات شهری تحت پوشش سامانه'
                : 'Sample breakdown of municipal vehicle categories in this dataset'}
            </p>
          </div>
          <button
            onClick={openFleetModal}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>{language === 'fa' ? 'مشاهده تمام ۲۶ نوع' : 'View all 26 types'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {USER_PROJECT_1_DATA.hourly.by_type.slice(0, 6).map((item, idx) => (
            <div key={idx} className="bg-[#0F172A] border border-white/5 rounded-lg p-3 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between text-xs font-medium text-slate-200 mb-1.5">
                <span className="truncate">{item.type}</span>
                <span className="text-[11px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                  {item.vehicles} دستگاه
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{item.eff.toLocaleString('fa-IR')} ساعت کارکرد</span>
                <span className="text-emerald-400 font-semibold">{(item.revenue / 1_000_000_000).toFixed(1)}B ریال</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
