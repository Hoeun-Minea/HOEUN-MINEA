import React from 'react';
import {
  Menu,
  Search,
  Activity,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  Languages,
  Calendar,
} from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { getKhmerLunarDate, getKhmerSolarDate } from '../utils/khmer';

interface TopHeaderProps {
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    currentView,
    settings,
    t,
    language,
    setLanguage,
    useKhmerNums,
    setUseKhmerNums,
    isDarkMode,
    setIsDarkMode,
    isSyncing,
    lastSaved,
    setIsCommandPaletteOpen,
    setIsActivityDrawerOpen,
    activities,
  } = useClassroom();

  const viewTitles: Record<string, { kh: string; en: string }> = {
    dashboard: { kh: 'ផ្ទាំងគ្រប់គ្រងទូទៅ', en: 'Dashboard Overview' },
    students: { kh: 'បញ្ជីរាយនាមសិស្ស', en: 'Student Roster' },
    attendance: { kh: 'កត់ត្រាវត្តមានប្រចាំថ្ងៃ', en: 'Daily Attendance Matrix' },
    scores: { kh: 'បញ្ចូលពិន្ទុ និងនិទ្ទេស', en: 'Academic Gradebook' },
    honors: { kh: 'តារាងកិត្តិយស និងប័ណ្ណសរសើរ', en: 'Honor Board & Awards' },
    library: { kh: 'បណ្ណាល័យសៀវភៅគោល', en: 'Textbook Loans & Library' },
    settings: { kh: 'ការកំណត់ទូទៅនៃប្រព័ន្ធ', en: 'System Settings' },
  };

  const todaySolar = new Date().toLocaleDateString('km-KH', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayLunar = getKhmerLunarDate();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-10 transition-colors">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 hidden sm:inline">
            {settings.teacherLevel} {settings.teacherRoom}
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <h2 className="font-moul text-xs md:text-sm text-slate-800 dark:text-slate-100 truncate">
            {t(viewTitles[currentView]?.kh || '', viewTitles[currentView]?.en || '')}
          </h2>
        </div>
      </div>

      {/* Center/Right: Date Pill & Quick Controls */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Calendar chip (Khmer solar & lunar) */}
        <div
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300"
          title={`${todaySolar} · ${todayLunar}`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="font-semibold truncate max-w-[200px]">{todaySolar}</span>
        </div>

        {/* Command Palette Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
          title="Open Command Palette (Cmd + K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">{t('ស្វែងរក...', 'Search...')}</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Real-time Activity Pulse & Drawer Trigger */}
        <button
          onClick={() => setIsActivityDrawerOpen(true)}
          className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
          title={t('សកម្មភាពក្នុងប្រព័ន្ធ', 'Live Activity Feed')}
        >
          <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          {isSyncing ? (
            <RefreshCw className="w-3 h-3 text-indigo-500 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          )}
          <span className="hidden lg:inline text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {isSyncing ? t('កំពុងរក្សាទុក...', 'Saving...') : lastSaved}
          </span>
          {activities.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Khmer Numeral Toggle */}
        <button
          onClick={() => setUseKhmerNums((prev) => !prev)}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors border ${
            useKhmerNums
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300 font-moul'
              : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 font-mono'
          }`}
          title={useKhmerNums ? 'Khmer Numerals (១២៣) active' : 'Arabic Numerals (123) active'}
        >
          {useKhmerNums ? '១២៣' : '123'}
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'km' ? 'en' : 'km')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Language"
        >
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'km' ? 'ខ្មែរ' : 'EN'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
