import React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Database,
  FileSpreadsheet,
  FileText,
  Hospital,
  LayoutDashboard,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'records'
  | 'add-record'
  | 'analytics'
  | 'reports'
  | 'about'
  | 'code-viewer';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onResetData: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onResetData,
  isOpen,
  onClose,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'records',
      label: 'Patient Records',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'add-record',
      label: 'Add Record',
      icon: <PlusCircle className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'analytics',
      label: 'Data Analytics',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'about',
      label: 'About Project',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'code-viewer',
      label: 'Flask Python Code',
      icon: <Database className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Hospital className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                  MediPulse Analytics
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">Hospital Patient System</p>
              </div>
            </div>
          </div>

          {/* Academic Indicator */}
          <div className="px-4 py-2.5 mx-3 mt-3 bg-sky-50/70 border border-sky-100 rounded-lg">
            <div className="flex items-center gap-2 text-sky-800 text-[11px] font-semibold">
              <Activity className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>2nd-Yr B.Tech CSE (AI/ML)</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Academic Project Demonstration</p>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-sky-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Reset database with fresh fictional demonstration patient records?'
                )
              ) {
                onResetData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Records</span>
          </button>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-mono">SQLite3 · Pandas · Chart.js</span>
          </div>
        </div>
      </aside>
    </>
  );
};
