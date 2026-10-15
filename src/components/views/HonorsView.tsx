import React, { useState, useMemo } from 'react';
import {
  Award,
  Crown,
  Printer,
  Sparkles,
  Palette,
  Users,
  Medal,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { formatNumberWithNumPref, getKhmerLunarDate, getKhmerSolarDate } from '../../utils/khmer';

export const HonorsView: React.FC = () => {
  const { students, scores, t, useKhmerNums, settings, selectedMonth } = useClassroom();
  const [topCount, setTopCount] = useState<3 | 5>(5);
  const [theme, setTheme] = useState<'gold' | 'blue' | 'slate'>('gold');

  // Top ranked students
  const topPerformers = useMemo(() => {
    return Object.values(scores)
      .filter((s) => s.average > 0)
      .sort((a, b) => b.average - a.average)
      .slice(0, topCount)
      .map((sc) => {
        const student = students.find((st) => st.id === sc.studentId);
        return {
          ...sc,
          name: student ? student.name : sc.studentId,
          gender: student ? student.gender : 'ប្រុស',
          photoUrl: student?.photoUrl,
        };
      });
  }, [scores, students, topCount]);

  const todaySolar = new Date().toLocaleDateString('km-KH', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayLunar = getKhmerLunarDate();

  const themeStyles = {
    gold: {
      card: 'bg-radial from-amber-50/70 via-white to-amber-50/30 border-amber-300 dark:bg-slate-900 dark:border-amber-700/60',
      badge: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
      accent: 'text-amber-700 dark:text-amber-300',
      borderAccent: 'border-amber-400',
    },
    blue: {
      card: 'bg-radial from-blue-50/70 via-white to-indigo-50/30 border-blue-300 dark:bg-slate-900 dark:border-blue-700/60',
      badge: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
      accent: 'text-blue-700 dark:text-blue-300',
      borderAccent: 'border-blue-400',
    },
    slate: {
      card: 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800',
      badge: 'bg-slate-800 text-white dark:bg-slate-700',
      accent: 'text-slate-800 dark:text-slate-200',
      borderAccent: 'border-slate-400',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className="space-y-4">
      {/* Configuration Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-2xs no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Top 3 vs Top 5 Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setTopCount(3)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                topCount === 3
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Top 3 {t('សិស្សឆ្នើម', 'Honors')}
            </button>
            <button
              onClick={() => setTopCount(5)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                topCount === 5
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Top 5 {t('សិស្សឆ្នើម', 'Honors')}
            </button>
          </div>

          {/* Theme Palette Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <span className="text-slate-500 font-medium">{t('រចនាប័ទ្ម ៖', 'Theme:')}</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none"
            >
              <option value="gold">✨ ពណ៌មាសប្រណីត (Royal Gold)</option>
              <option value="blue">🏛️ ពណ៌ខៀវអប់រំ (Academic Blue)</option>
              <option value="slate">📄 សាមញ្ញទំនើប (Minimal Slate)</option>
            </select>
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
        >
          <Printer className="w-4 h-4" />
          <span>{t('បោះពុម្ពតារាងកិត្តិយស', 'Print Honor Board')}</span>
        </button>
      </div>

      {/* Printable Honor Board Canvas (A4 Portrait Container) */}
      <div className="flex justify-center">
        <div
          id="honor-board-print-area"
          className={`w-full max-w-[800px] p-8 md:p-12 rounded-2xl border-2 ${currentTheme.card} ${currentTheme.borderAccent} shadow-sm relative overflow-hidden transition-all`}
        >
          {/* Decorative Corner Emblems */}
          <div className="absolute top-4 left-4 text-amber-500/40 text-lg select-none">❖</div>
          <div className="absolute top-4 right-4 text-amber-500/40 text-lg select-none">❖</div>
          <div className="absolute bottom-4 left-4 text-amber-500/40 text-lg select-none">❖</div>
          <div className="absolute bottom-4 right-4 text-amber-500/40 text-lg select-none">❖</div>

          {/* National & School Header */}
          <div className="text-center space-y-1 mb-6">
            <h2 className="font-moul text-sm text-slate-900 dark:text-white">ព្រះរាជាណាចក្រកម្ពុជា</h2>
            <h3 className="font-moul text-xs text-slate-800 dark:text-slate-200">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
            <div className="text-amber-500 text-xs tracking-widest my-1 select-none">❖ ❖ ❖</div>
            <p className="font-moul text-xs text-indigo-900 dark:text-indigo-300 mt-2">
              {settings.schoolName}
            </p>
          </div>

          {/* Honor Board Main Title */}
          <div className="text-center my-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-moul text-base shadow-sm">
              <Crown className="w-5 h-5 text-amber-200" />
              <span>តារាងកិត្តិយសសិស្សឆ្នើម</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t(
                `លទ្ធផលសិក្សាឆ្នើមប្រចាំខែ ${selectedMonth} ថ្នាក់ទី ${settings.teacherLevel.replace('ថ្នាក់ទី ', '')} ${settings.teacherRoom} · ឆ្នាំសិក្សា ${settings.academicYear}`,
                `Outstanding Academic Honors for ${selectedMonth} · ${settings.teacherLevel} ${settings.teacherRoom}`
              )}
            </p>
          </div>

          {/* Podium / Student Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 items-end justify-center">
            {topPerformers.map((stu, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              const rankBadges = [
                { label: 'ជើងឯកលេខ ១', icon: '🥇', color: 'from-amber-400 to-yellow-600 border-amber-300' },
                { label: 'ចំណាត់ថ្នាក់លេខ ២', icon: '🥈', color: 'from-slate-300 to-slate-500 border-slate-300' },
                { label: 'ចំណាត់ថ្នាក់លេខ ៣', icon: '🥉', color: 'from-amber-600 to-orange-700 border-orange-400' },
                { label: 'ចំណាត់ថ្នាក់លេខ ៤', icon: '⭐', color: 'from-indigo-400 to-blue-600 border-indigo-300' },
                { label: 'ចំណាត់ថ្នាក់លេខ ៥', icon: '⭐', color: 'from-indigo-400 to-blue-600 border-indigo-300' },
              ];

              return (
                <div
                  key={stu.studentId}
                  className={`flex flex-col items-center p-4 rounded-xl border bg-white dark:bg-slate-800 shadow-sm relative ${
                    isFirst ? 'order-1 sm:order-2 border-amber-400 ring-2 ring-amber-200' : isSecond ? 'order-2 sm:order-1 border-slate-200' : 'order-3 border-slate-200'
                  }`}
                >
                  {/* Avatar / Portrait Frame */}
                  <div className="relative mb-3">
                    <div className="w-20 h-24 rounded-xl border-2 border-amber-400/80 overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-sm flex items-center justify-center">
                      {stu.photoUrl ? (
                        <img src={stu.photoUrl} alt={stu.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="font-moul text-xl text-indigo-700 dark:text-indigo-300 font-bold">
                          {stu.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="absolute -top-3 -right-3 text-2xl select-none">
                      {rankBadges[index]?.icon || '⭐'}
                    </span>
                  </div>

                  {/* Name and Average */}
                  <h4 className="font-moul text-xs text-slate-900 dark:text-white text-center truncate max-w-[150px]">
                    {stu.name}
                  </h4>
                  <div className="mt-1 text-center space-y-0.5">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {rankBadges[index]?.label}
                    </div>
                    <div className="text-sm font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                      {t('មធ្យមភាគ', 'Avg')}: {formatNumberWithNumPref(stu.average.toFixed(2), useKhmerNums)}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600">
                      {t('និទ្ទេស', 'Grade')}: {stu.gradeLetter}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Signatures & Footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-start justify-between text-xs text-slate-700 dark:text-slate-300">
            <div className="text-center w-40 space-y-1">
              <p className="font-semibold">{t('បានឃើញ និងឯកភាព', 'Approved by')}</p>
              <p className="font-moul text-slate-900 dark:text-white pt-1">{t('នាយកសាលា', 'Principal')}</p>
              <div className="h-16" />
              <p className="font-moul font-bold">{settings.principalName}</p>
            </div>

            <div className="text-center w-52 space-y-1">
              <p className="text-[11px] text-slate-500">{todayLunar}</p>
              <p className="text-[11px] font-semibold">{todaySolar}</p>
              <p className="font-moul text-slate-900 dark:text-white pt-1">{t('គ្រូបន្ទុកថ្នាក់', 'Homeroom Teacher')}</p>
              <div className="h-14" />
              <p className="font-moul font-bold">{settings.teacherName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
