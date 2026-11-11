import React from 'react';
import { ProjectStatus, FileFormat } from '../types';
import { useApp } from '../context/AppContext';
import { Figma, FileCode2, FileText, Network } from 'lucide-react';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const { language } = useApp();

  if (status === 'active') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 h-6 px-2 text-[11px] font-mono font-medium rounded tracking-wide border transition-all ${className}`}
        style={{
          color: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        {language === 'fa' ? 'فعال' : 'Active'}
      </span>
    );
  }

  if (status === 'in_progress') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 h-6 px-2 text-[11px] font-mono font-medium rounded tracking-wide border transition-all ${className}`}
        style={{
          color: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          borderColor: 'rgba(245, 158, 11, 0.25)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
        {language === 'fa' ? 'در حال توسعه' : 'In Progress'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2 text-[11px] font-mono font-medium rounded tracking-wide border transition-all ${className}`}
      style={{
        color: '#94A3B8',
        backgroundColor: 'rgba(148, 163, 184, 0.10)',
        borderColor: 'rgba(148, 163, 184, 0.20)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
      {language === 'fa' ? 'آرشیو شده' : 'Archived'}
    </span>
  );
};

interface FileFormatBadgeProps {
  format: FileFormat;
  size?: 'sm' | 'md';
}

export const FileFormatBadge: React.FC<FileFormatBadgeProps> = ({ format, size = 'md' }) => {
  const getFormatDetails = () => {
    switch (format) {
      case 'figma':
        return {
          label: 'FIGMA',
          color: '#F24E1E',
          bgColor: 'rgba(242, 78, 30, 0.14)',
          borderColor: 'rgba(242, 78, 30, 0.3)',
          icon: <Figma className={size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} />,
        };
      case 'tsx':
        return {
          label: 'TSX',
          color: '#38BDF8',
          bgColor: 'rgba(56, 189, 248, 0.14)',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          icon: <FileCode2 className={size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} />,
        };
      case 'openapi':
        return {
          label: 'API',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.14)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          icon: <Network className={size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} />,
        };
      case 'pdf':
      default:
        return {
          label: 'PDF',
          color: '#EF4444',
          bgColor: 'rgba(239, 68, 68, 0.14)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          icon: <FileText className={size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} />,
        };
    }
  };

  const details = getFormatDetails();

  if (size === 'sm') {
    return (
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border"
        style={{
          color: details.color,
          backgroundColor: details.bgColor,
          borderColor: details.borderColor,
        }}
      >
        {details.icon}
        <span>{details.label}</span>
      </span>
    );
  }

  return (
    <div
      className="w-9 h-9 shrink-0 rounded-md border flex items-center justify-center transition-transform hover:scale-105"
      style={{
        color: details.color,
        backgroundColor: details.bgColor,
        borderColor: details.borderColor,
      }}
      title={details.label}
    >
      {details.icon}
    </div>
  );
};
