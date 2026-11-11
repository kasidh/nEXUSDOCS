import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from './MetricCard';
import { ProjectCard } from './ProjectCard';
import { ProjectStatus } from '../types';
import { Search, Filter, Plus, SlidersHorizontal, Sparkles } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { metrics, projects, language, openNewModal } = useApp();
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(proj => {
    const matchesStatus = statusFilter === 'all' || proj.status === statusFilter;
    const matchesCat = categoryFilter === 'all' || proj.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      proj.name.toLowerCase().includes(q) ||
      proj.nameFa.toLowerCase().includes(q) ||
      proj.description.toLowerCase().includes(q) ||
      proj.descriptionFa.toLowerCase().includes(q) ||
      proj.techStack.some(t => t.toLowerCase().includes(q));

    return matchesStatus && matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* 4 Metric KPI Widgets across (3 cols each on desktop = 12 cols total) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Projects Matrix Header & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0F172A] p-3.5 rounded-xl border border-white/5">
          {/* Status Filter Segmented Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
              }`}
            >
              {language === 'fa' ? 'همه پروژه‌ها' : 'All Services'} ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              {language === 'fa' ? 'فعال' : 'Active'}
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                statusFilter === 'in_progress'
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              {language === 'fa' ? 'در حال توسعه' : 'In Dev'}
            </button>
            <button
              onClick={() => setStatusFilter('archived')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                statusFilter === 'archived'
                  ? 'bg-[#94A3B8]/20 text-slate-200 border border-slate-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
              {language === 'fa' ? 'آرشیو شده' : 'Archived'}
            </button>
          </div>

          {/* Search bar & Category filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'fa'
                    ? 'جستجو در نام، شرح یا پشته...'
                    : 'Search microservices & stacks...'
                }
                className="w-full h-9 ps-9 pe-3 bg-[#0A0F1D] border border-[#334155] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            <button
              onClick={() => openNewModal('project')}
              className="h-9 px-3.5 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#6366F1] rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-[0_2px_8px_rgba(79,70,229,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'fa' ? 'پروژه جدید' : 'New Project'}</span>
            </button>
          </div>
        </div>

        {/* Informational banner: Personal Archive Waiting for subsequent projects */}
        <div className="bg-gradient-to-r from-[#1E293B] via-[#1E293B] to-[#4F46E5]/15 border border-[#4F46E5]/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start md:items-center gap-3">
            <div className="p-2 rounded-lg bg-[#4F46E5]/20 border border-[#4F46E5]/40 text-[#c3c0ff] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {language === 'fa'
                  ? 'سایت کاملاً پاکسازی شد و آماده دریافت پروژه‌های بعدی شماست'
                  : 'Archive cleared of placeholders — ready for your next project'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {language === 'fa'
                  ? 'تمام پروژه‌های ماک حذف شدند. پروژه اول شما (پردازش ناوگان و اسکریپت‌های پایتون/بتچ) در زیر قرار دارد. می‌توانید کدهای بعدی‌تان را ارسال کنید تا دونه دونه به این آرشیو اضافه شوند.'
                  : 'All demo data removed. Your first real project (Fleet batch analytics) is registered below. Send your next projects anytime.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => openNewModal('project')}
            className="px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-colors shrink-0 self-start md:self-center flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            <span>{language === 'fa' ? 'ثبت مشخصات دستی' : 'Manual Entry'}</span>
          </button>
        </div>

        {/* 12-column sub-grid for Project Cards (3 cols each on desktop = 4 cards per row, or 4 cols each = 3 cards per row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-[#1E293B] border border-white/5 rounded-xl">
              <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-200">
                {language === 'fa' ? 'پروژه‌ای با این مشخصات یافت نشد' : 'No personal projects found'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'fa' ? 'فیلتر وضعیت یا کلمات جستجو را تغییر دهید.' : 'Clear search query or select another status tag.'}
              </p>
            </div>
          ) : (
            filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
