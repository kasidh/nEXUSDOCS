import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApiEndpoint } from '../types';
import { Play, Copy, Check, Terminal, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const ApiConsole: React.FC = () => {
  const { apiEndpoints, language, showToast } = useApp();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiEndpoints[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleExecute = () => {
    setIsRunning(true);
    setExecutionResult(null);
    setResponseLatency(null);

    const jitter = Math.floor(Math.random() * 8) - 4;
    const finalLatency = Math.max(4, selectedEndpoint.latencyMs + jitter);

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult(selectedEndpoint.sampleResponse);
      setResponseLatency(finalLatency);
      showToast(
        language === 'fa'
          ? `درخواست با کد وضعیت ۲۰۰ در ${finalLatency} میلی‌ثانیه پاسخ داده شد`
          : `HTTP 200 OK received in ${finalLatency}ms`
      );
    }, 450);
  };

  const handleCopy = () => {
    const textToCopy = executionResult || selectedEndpoint.sampleResponse;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    showToast(language === 'fa' ? 'پاسخ در کلیپ‌بورد کپی شد' : 'Payload copied to clipboard');
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      case 'POST':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'PUT':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'DELETE':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#0F172A] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/10 border border-[#4F46E5]/30 flex items-center justify-center text-[#c3c0ff]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              {language === 'fa' ? 'کنسول کاوشگر API و مشخصات معماری' : 'API Telemetry Explorer & Endpoint Sandbox'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'fa'
                ? 'اجرای زنده درخواست‌های معماری، سنجش تأخیر و اعتبارسنجی قراردادهای OpenAPI'
                : 'Direct runtime simulation of high-density microservice routes with OpenAPI 3.1 contracts.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OpenAPI 3.1 Spec</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Endpoint List (left/right) + Workspace Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Endpoint Selector Rail (4 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-1">
            {language === 'fa' ? 'مسیرهای در دسترس' : 'Configured Endpoints'} ({apiEndpoints.length})
          </div>

          <div className="space-y-1.5">
            {apiEndpoints.map(ep => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                    setExecutionResult(null);
                    setResponseLatency(null);
                  }}
                  className={`w-full text-start p-3 rounded-lg border transition-all text-xs flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#1E293B] border-[#4F46E5] shadow-[0_0_0_1px_#4F46E5,0_4px_16px_rgba(79,70,229,0.2)]'
                      : 'bg-[#0F172A] border-white/5 hover:border-white/10 hover:bg-[#1E293B]/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-mono font-semibold text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${getMethodBadgeClass(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-slate-200 truncate text-[11px]">
                      {ep.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>~{ep.latencyMs}ms</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Execution & Response Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#1E293B] border border-white/5 rounded-xl p-5 flex flex-col justify-between glow-subtle">
          <div>
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span
                  className={`font-mono font-bold text-xs px-2 py-1 rounded border ${getMethodBadgeClass(
                    selectedEndpoint.method
                  )}`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  {selectedEndpoint.path}
                </span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isRunning}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] active:scale-95 disabled:opacity-50 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(79,70,229,0.35)] shrink-0"
              >
                <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
                <span>
                  {isRunning
                    ? language === 'fa'
                      ? 'در حال پردازش...'
                      : 'Executing...'
                    : language === 'fa'
                    ? 'اجرای درخواست'
                    : 'Execute Request'}
                </span>
              </button>
            </div>

            {/* Endpoint Summary */}
            <div className="py-3 text-xs text-slate-300">
              {language === 'fa' ? selectedEndpoint.summaryFa : selectedEndpoint.summary}
            </div>

            {/* Request Sample if present */}
            {selectedEndpoint.sampleRequest && (
              <div className="mb-4">
                <div className="text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wide">
                  {language === 'fa' ? 'بدنه ارسالی (Request Payload)' : 'Request Payload (JSON)'}
                </div>
                <div className="bg-[#0A0F1D] border border-white/5 rounded-lg p-3 font-mono text-xs text-cyan-300 overflow-x-auto max-h-40">
                  <pre>{selectedEndpoint.sampleRequest}</pre>
                </div>
              </div>
            )}

            {/* Response Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                    {language === 'fa' ? 'پاسخ دریافتی' : 'Response Payload'}
                  </span>
                  {responseLatency && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      HTTP 200 · {responseLatency}ms
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{isCopied ? (language === 'fa' ? 'کپی شد' : 'Copied') : (language === 'fa' ? 'کپی' : 'Copy')}</span>
                </button>
              </div>

              <div className="bg-[#0A0F1D] border border-white/5 rounded-lg p-3.5 font-mono text-xs text-slate-200 overflow-x-auto max-h-72">
                <pre>{executionResult || selectedEndpoint.sampleResponse}</pre>
              </div>
            </div>
          </div>

          {/* Footer Security Stamp */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'fa' ? 'پروتکل امنیتی: TLS 1.3 / mTLS اجباری' : 'TLS 1.3 / mTLS Enforced'}</span>
            </div>
            <span>{language === 'fa' ? 'اعتبارسنجی: Bearer JWT' : 'Auth: Bearer JWT'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
