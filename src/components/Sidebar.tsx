import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  Sparkles,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { ViewType } from '../types/classroom';
import { formatNumberWithNumPref } from '../utils/khmer';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { currentView, setCurrentView, t, useKhmerNums, classStats, settings } = useClassroom();

  const navItems: { id: ViewType; labelKh: string; labelEn: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      labelKh: 'ផ្ទាំងគ្រប់គ្រង',
      labelEn: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'students',
      labelKh: 'បញ្ជីឈ្មោះសិស្ស',
      labelEn: 'Students',
      icon: <Users className="w-5 h-5" />,
      badge: formatNumberWithNumPref(classStats.activeStudents, useKhmerNums),
    },
    {
      id: 'attendance',
      labelKh: 'កត់វត្តមានប្រចាំថ្ងៃ',
      labelEn: 'Attendance',
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      id: 'scores',
      labelKh: 'បញ្ចូលពិន្ទុ & និទ្ទេស',
      labelEn: 'Gradebook',
      icon: <FileSpreadsheet className="w-5 h-5" />,
    },
    {
      id: 'honors',
      labelKh: 'តារាងកិត្តិយស',
      labelEn: 'Honor Board',
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: 'library',
      labelKh: 'បណ្ណាល័យសៀវភៅ',
      labelEn: 'Library Loans',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'settings',
      labelKh: 'ការកំណត់ទូទៅ',
      labelEn: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & School Logo */}
      <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-indigo-200 dark:shadow-none">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <School className="w-5 h-5" />
            )}
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="font-moul text-xs text-slate-900 dark:text-white truncate leading-tight">
                {settings.schoolName || 'ClassroomOS'}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate flex items-center gap-1 mt-0.5">
                <span>{settings.teacherLevel} {settings.teacherRoom}</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="font-mono">{settings.academicYear}</span>
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={collapsed ? t(item.labelKh, item.labelEn) : undefined}
            >
              <span
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className={`truncate ${isActive ? 'font-bold' : ''}`}>
                    {t(item.labelKh, item.labelEn)}
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Summary Pill or Homeroom Teacher Card */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {!collapsed ? (
          <div
            onClick={() => setCurrentView('settings')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center text-xs font-bold font-moul shrink-0">
              {settings.teacherName.charAt(0) || 'គ'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-moul">
                {settings.teacherName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {t('គ្រូទទួលបន្ទុកថ្នាក់', 'Homeroom Teacher')}
              </p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          </div>
        ) : (
          <div
            onClick={() => setCurrentView('settings')}
            className="w-10 h-10 mx-auto rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-xs font-bold font-moul cursor-pointer hover:scale-105 transition-transform"
            title={settings.teacherName}
          >
            {settings.teacherName.charAt(0) || 'គ'}
          </div>
        )}
      </div>
    </aside>
  );
};
