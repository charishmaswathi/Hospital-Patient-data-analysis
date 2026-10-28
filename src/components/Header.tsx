import React from 'react';
import { Download, Menu, Plus, ShieldCheck } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onExportCsv,
}) => {
  const getTabLabel = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'records':
        return 'Patient Records Management';
      case 'add-record':
        return 'New Clinical Record';
      case 'analytics':
        return 'Data Analytics & Hygiene';
      case 'reports':
        return 'Audit Reports & Export';
      case 'about':
        return 'Project Documentation';
      case 'code-viewer':
        return 'Python Flask Backend Code';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      {/* Educational Banner Ribbon */}
      <div className="bg-sky-50 border-b border-sky-100 px-4 py-1.5 text-xs text-sky-800 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="truncate">
            <strong>Educational Demonstration:</strong> 2nd-Year B.Tech CSE (AI/ML) Project · Strictly synthetic records · No clinical advice
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-sky-700 tabular-nums shrink-0">
          <span>Python 3.10</span>
          <span>·</span>
          <span>Flask + SQLite3</span>
          <span>·</span>
          <span>Pandas EDA</span>
        </div>
      </div>

      {/* Main Top Bar: 3-Zone Contract */}
      <div className="flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Mobile Hamburger & Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Hospital Patient Data Analysis System
          </span>
        </div>

        {/* Zone 2: Contextual Navigation Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 whitespace-nowrap overflow-hidden">
          <span>MediPulse</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-semibold">{getTabLabel(currentTab)}</span>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onExportCsv}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onSelectTab('add-record')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        </div>
      </div>
    </header>
  );
};
