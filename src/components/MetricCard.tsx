import React from 'react';
import { MetricWidget } from '../types';
import { useApp } from '../context/AppContext';
import { Server, Activity, ShieldCheck, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  metric: MetricWidget;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const { language } = useApp();

  const getIcon = () => {
    switch (metric.categoryIcon) {
      case 'Server':
        return <Server className="w-4 h-4 text-[#c3c0ff]" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-[#4cd7f6]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-[#10B981]" />;
      case 'Users':
      default:
        return <Users className="w-4 h-4 text-[#c0c1ff]" />;
    }
  };

  // Generate SVG mini sparkline path
  const minVal = Math.min(...metric.sparkline);
  const maxVal = Math.max(...metric.sparkline);
  const range = maxVal - minVal || 1;
  const width = 80;
  const height = 24;
  const points = metric.sparkline
    .map((val, idx) => {
      const x = (idx / (metric.sparkline.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-[#1E293B] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all glow-subtle group">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#c7c4d8]/80 tracking-wide">
          {language === 'fa' ? metric.labelFa : metric.label}
        </span>
        <div className="w-7 h-7 rounded-md bg-[#0F172A] border border-white/5 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      {/* Central Value & Sparkline */}
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <div className="text-2xl font-bold tracking-tight text-[#F8FAFC] font-mono tabular-nums">
          {language === 'fa' ? metric.valueFa : metric.value}
        </div>
        <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={metric.isPositive ? '#10B981' : '#F59E0B'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Trend & Comparison */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04] text-xs">
        <span
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono font-medium text-[11px] ${
            metric.isPositive
              ? 'text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20'
              : 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20'
          }`}
        >
          {metric.isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{language === 'fa' ? metric.changeFa : metric.change}</span>
        </span>
        <span className="text-[11px] text-slate-400 truncate">
          {language === 'fa' ? metric.periodFa : metric.period}
        </span>
      </div>
    </div>
  );
};
