import React from 'react';
import { Project } from '../types';
import { useApp } from '../context/AppContext';
import { StatusBadge, FileFormatBadge } from './Badges';
import {
  FileCode2,
  CheckCircle2,
  Archive,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Truck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    language,
    openInspector,
    toggleArchiveProject,
    deleteProject,
    openFleetModal,
  } = useApp();

  const isFleet = project.id === 'proj-fleet-batch';

  return (
    <div className="bg-[#1E293B] border border-white/5 border-t-white/10 rounded-xl p-5 hover:border-[#4F46E5]/60 hover:shadow-[0_0_0_1px_#4F46E5,0_8px_24px_-4px_rgba(79,70,229,0.28)] transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Banner if Fleet project */}
      {isFleet && (
        <div className="absolute top-0 end-0 bg-gradient-to-l from-[#4F46E5] to-[#3131c0] text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-bl-lg shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#acedff]" />
          <span>{language === 'fa' ? 'پروژه اول من (شاخص)' : 'My First Project'}</span>
        </div>
      )}

      {/* Top row: Category/Version & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 font-medium tracking-wide">
              {language === 'fa' ? project.categoryFa : project.category}
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-[11px] font-mono text-slate-400">
              {project.version}
            </span>
            <span className="text-white/20 text-xs">·</span>
            <span className="text-[11px] font-mono text-slate-400">
              {project.year}
            </span>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[#F8FAFC] tracking-tight mb-2 group-hover:text-[#c3c0ff] transition-colors leading-snug">
          {language === 'fa' ? project.nameFa : project.name}
        </h3>

        {/* Tagline / Description */}
        <p className="text-xs text-[#c7c4d8]/80 leading-relaxed mb-3 line-clamp-3">
          {language === 'fa' ? project.descriptionFa : project.description}
        </p>

        {/* Highlights if present */}
        {project.highlightsFa && (
          <div className="mb-3 space-y-1">
            {(language === 'fa' ? project.highlightsFa : project.highlights)?.slice(0, 2).map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {project.formats.map(fmt => (
            <FileFormatBadge key={fmt} format={fmt} size="sm" />
          ))}
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono text-slate-300 bg-[#0F172A] px-2 py-0.5 rounded border border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="pt-3 border-t border-white/[0.06]">
        <div className="grid grid-cols-3 gap-2 mb-3.5 text-center bg-[#0F172A]/70 p-2.5 rounded-lg border border-white/5 text-xs font-mono">
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">
              {language === 'fa' ? 'حجم و کد' : 'Volume'}
            </div>
            <div className="font-semibold text-slate-200 truncate">
              {project.metrics.locOrSize}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">
              {language === 'fa' ? 'پیشرفت' : 'Completion'}
            </div>
            <div className="font-semibold text-emerald-400">
              {project.metrics.completion}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 mb-0.5">
              {language === 'fa' ? 'فایل‌های پیوست' : 'Artifacts'}
            </div>
            <div className="font-semibold text-cyan-400">
              {project.metrics.filesCount} فایل
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          {isFleet && (
            <button
              onClick={openFleetModal}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#3131c0] hover:from-[#6366F1] hover:to-[#4F46E5] rounded-lg shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-all flex items-center justify-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-[#acedff]" />
              <span>{language === 'fa' ? 'مشاهده داشبورد، سورس پایتون و داده‌های ناوگان' : 'Open Fleet Telematics & Python Script'}</span>
            </button>
          )}

          <div className="flex items-center justify-between gap-1.5 pt-1">
            <button
              onClick={() => openInspector(project, 'project')}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#0F172A] hover:bg-[#334155] border border-white/5 rounded-lg transition-colors flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{language === 'fa' ? 'جزئیات سند' : 'Inspect'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => toggleArchiveProject(project.id)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#0F172A] hover:bg-[#334155] border border-white/5 rounded-lg transition-colors flex items-center gap-1"
                title={project.status === 'archived' ? 'خروج از آرشیو' : 'انتقال به آرشیو'}
              >
                {project.status === 'archived' ? (
                  <>
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>{language === 'fa' ? 'فعال‌سازی' : 'Restore'}</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-3 h-3 text-amber-400" />
                    <span>{language === 'fa' ? 'بایگانی' : 'Archive'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => deleteProject(project.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="حذف از آرشیو"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
