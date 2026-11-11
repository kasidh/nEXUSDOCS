import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Key, FileCheck, CheckCircle2 } from 'lucide-react';

export const SecurityPoliciesView: React.FC = () => {
  const { language, showToast } = useApp();

  const policies = [
    {
      id: 'pol-1',
      title: 'Mutual TLS (mTLS) Strict Pod Enforcement',
      titleFa: 'اجبار سخت‌گیرانه پروتکل mTLS میان پادها',
      status: 'ENFORCED',
      scope: 'Cluster-wide',
      algorithm: 'ECDSA P-384 / TLS 1.3',
    },
    {
      id: 'pol-2',
      title: 'SPIFFE/SPIRE Workload Identity Attestation',
      titleFa: 'تایید هویت بار کاری با استانداردهای SPIFFE',
      status: 'VERIFIED',
      scope: 'Ingress & Microservices',
      algorithm: 'X.509 SVID (1h TTL)',
    },
    {
      id: 'pol-3',
      title: 'Hardware Security Module (HSM) Root CA',
      titleFa: 'ماژول سخت‌افزاری HSM برای کلیدهای ریشه',
      status: 'ACTIVE',
      scope: 'Key Enclave Level 4',
      algorithm: 'FIPS 140-3 Validated',
    },
    {
      id: 'pol-4',
      title: 'Real-time eBPF Kernel Invariant Audit',
      titleFa: 'بازرسی بیدرنگ کرنل لینوکس با eBPF',
      status: 'MONITORING',
      scope: 'Node System Calls',
      algorithm: 'Ring-0 Event Trap',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-[#0F172A] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white mb-1">
            {language === 'fa' ? 'خط‌مشی‌های امنیت اعتماد صفر (Zero-Trust)' : 'Zero-Trust Architecture & Cryptographic Governance'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'fa'
              ? 'سیاست‌های تصدیق هویت سخت‌افزاری، رمزنگاری نقطه به نقطه و کنترل دسترسی‌های سطح سازمانی'
              : 'Strict cryptographically verified security posture complying with ISO/IEC 27001 standards.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-md flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'fa' ? 'منطبق با استاندارد اعتماد صفر' : 'Zero-Trust Compliant'}</span>
          </span>
        </div>
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {policies.map(pol => (
          <div
            key={pol.id}
            className="bg-[#1E293B] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 glow-subtle hover:border-[#4F46E5]/40 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-xs mb-1">
                  {language === 'fa' ? pol.titleFa : pol.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>{pol.scope}</span>
                  <span>·</span>
                  <span className="text-cyan-400">{pol.algorithm}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                {language === 'fa'
                  ? pol.status === 'ENFORCED'
                    ? 'اجرا شده'
                    : pol.status === 'VERIFIED'
                    ? 'تایید شده'
                    : pol.status === 'ACTIVE'
                    ? 'فعال'
                    : 'در حال مانیتورینگ'
                  : pol.status}
              </span>
              <button
                onClick={() =>
                  showToast(
                    language === 'fa'
                      ? 'گواهی‌نامه خط‌مشی تایید گردید'
                      : 'Cryptographic certificate verified'
                  )
                }
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#0F172A] hover:bg-[#334155] rounded-lg border border-white/5 transition-colors"
              >
                {language === 'fa' ? 'بررسی گواهی' : 'Verify'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
