import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Users,
  LayoutDashboard,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  BookOpen,
  Settings,
  UserPlus,
  CheckCircle,
  Download,
  Moon,
  Sun,
  X,
  ArrowRight,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { ViewType } from '../types/classroom';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentView,
    students,
    t,
    markAllAttendanceForDay,
    exportBackupJson,
    isDarkMode,
    setIsDarkMode,
  } = useClassroom();

  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    if (isCommandPaletteOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Reset query when opening
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  const viewActions: { id: ViewType; labelKh: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', labelKh: 'ទៅកាន់ ផ្ទាំងគ្រប់គ្រង', labelEn: 'Go to Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', labelKh: 'ទៅកាន់ បញ្ជីឈ្មោះសិស្ស', labelEn: 'Go to Students Roster', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', labelKh: 'ទៅកាន់ កត់វត្តមានប្រចាំថ្ងៃ', labelEn: 'Go to Attendance Matrix', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'scores', labelKh: 'ទៅកាន់ បញ្ចូលពិន្ទុ & និទ្ទេស', labelEn: 'Go to Gradebook & Scores', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'honors', labelKh: 'ទៅកាន់ តារាងកិត្តិយស', labelEn: 'Go to Honor Board', icon: <Award className="w-4 h-4" /> },
    { id: 'library', labelKh: 'ទៅកាន់ បណ្ណាល័យសៀវភៅ', labelEn: 'Go to Library Loans', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', labelKh: 'ទៅកាន់ ការកំណត់ប្រព័ន្ធ', labelEn: 'Go to Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const quickActions = [
    {
      id: 'act-mark-present',
      labelKh: 'កត់វត្តមានសិស្សទាំងអស់សម្រាប់ថ្ងៃនេះ (P)',
      labelEn: 'Mark all students present today',
      icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      perform: () => {
        const todayDay = new Date().getDate();
        markAllAttendanceForDay(todayDay, 'P');
        setCurrentView('attendance');
      },
    },
    {
      id: 'act-export-backup',
      labelKh: 'ទាញយកទិន្នន័យបម្រុង (Backup JSON)',
      labelEn: 'Export database backup file',
      icon: <Download className="w-4 h-4 text-blue-500" />,
      perform: () => {
        exportBackupJson();
      },
    },
    {
      id: 'act-toggle-theme',
      labelKh: isDarkMode ? 'ប្តូរទៅ Dark Mode បិទ (Light)' : 'ប្តូរទៅ Dark Mode បើក (Dark)',
      labelEn: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />,
      perform: () => {
        setIsDarkMode((prev) => !prev);
      },
    },
  ];

  // Filtered views
  const filteredViews = useMemo(() => {
    if (!query.trim()) return viewActions;
    const q = query.toLowerCase();
    return viewActions.filter(
      (v) => v.labelKh.toLowerCase().includes(q) || v.labelEn.toLowerCase().includes(q)
    );
  }, [query]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return students
      .filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, students]);

  // Filtered quick actions
  const filteredQuickActions = useMemo(() => {
    if (!query.trim()) return quickActions;
    const q = query.toLowerCase();
    return quickActions.filter(
      (a) => a.labelKh.toLowerCase().includes(q) || a.labelEn.toLowerCase().includes(q)
    );
  }, [query, isDarkMode]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('វាយឈ្មោះសិស្ស ទំព័រ ឬពាក្យបញ្ជា...', 'Search students, navigation, or commands...')}
            autoFocus
            className="w-full h-14 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Matched Students */}
          {filteredStudents.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('សិស្សានុសិស្ស', 'Students')}
              </p>
              <div className="space-y-1 mt-1">
                {filteredStudents.map((stu) => (
                  <button
                    key={stu.id}
                    onClick={() => {
                      setCurrentView('students');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center font-moul text-[11px]">
                        {stu.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 font-moul">{stu.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {stu.id} · {stu.gender} · {stu.grade} {stu.room}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Views */}
          {filteredViews.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('ទំព័រការងារ', 'Navigation')}
              </p>
              <div className="space-y-1 mt-1">
                {filteredViews.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.icon}
                      </span>
                      <span className="font-semibold">{t(item.labelKh, item.labelEn)}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {filteredQuickActions.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('សកម្មភាពរហ័ស', 'Quick Actions')}
              </p>
              <div className="space-y-1 mt-1">
                {filteredQuickActions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      act.perform();
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      {act.icon}
                      <span className="font-semibold">{t(act.labelKh, act.labelEn)}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredViews.length === 0 && filteredStudents.length === 0 && filteredQuickActions.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              {t('រកមិនឃើញលទ្ធផលដែលត្រូវគ្នាទេ', 'No matching results found')}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>{t('ប្រើ ⌘K ឬ ចុច Escape ដើម្បីបិទ', 'Press ⌘K or Escape to exit')}</span>
          <span className="font-mono">ClassroomOS v2.4</span>
        </div>
      </div>
    </div>
  );
};
