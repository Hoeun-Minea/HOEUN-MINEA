import React from 'react';
import {
  Users,
  CheckCircle,
  TrendingUp,
  Award,
  BookOpen,
  CalendarCheck,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { formatNumberWithNumPref, getKhmerLunarDate } from '../../utils/khmer';

export const DashboardView: React.FC = () => {
  const {
    students,
    scores,
    classStats,
    setCurrentView,
    t,
    useKhmerNums,
    settings,
    markAllAttendanceForDay,
    activities,
    setIsActivityDrawerOpen,
  } = useClassroom();

  const activeStudents = students.filter((s) => s.status === 'Active');

  // Sorted top 3 students
  const topStudents = Object.values(scores)
    .filter((s) => s.average > 0)
    .sort((a, b) => b.average - a.average)
    .slice(0, 3)
    .map((sc) => {
      const student = students.find((st) => st.id === sc.studentId);
      return {
        ...sc,
        name: student ? student.name : sc.studentId,
        gender: student ? student.gender : 'ប្រុស',
      };
    });

  const todayDay = new Date().getDate();
  const todayLunar = getKhmerLunarDate();
  const todaySolar = new Date().toLocaleDateString('km-KH', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-indigo-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{settings.schoolName}</span>
              <span>·</span>
              <span>{settings.teacherLevel} {settings.teacherRoom}</span>
            </div>
            <h1 className="font-moul text-xl md:text-2xl text-white tracking-wide">
              {t('សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀន', 'Welcome to ClassroomOS Management Suite')}
            </h1>
            <p className="text-xs md:text-sm text-indigo-100/90 font-medium leading-relaxed">
              {t(
                `លោកគ្រូ/អ្នកគ្រូ ${settings.teacherName} · កំពុងគ្រប់គ្រងសិស្សចំនួន ${formatNumberWithNumPref(
                  classStats.activeStudents,
                  useKhmerNums
                )} នាក់ សម្រាប់ឆ្នាំសិក្សា ${settings.academicYear}`,
                `Homeroom Teacher: ${settings.teacherName} · Managing ${formatNumberWithNumPref(
                  classStats.activeStudents,
                  useKhmerNums
                )} enrolled students for academic year ${settings.academicYear}`
              )}
            </p>
          </div>

          {/* Today's Lunar & Solar Calendar Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-xs space-y-1.5 shrink-0 min-w-[240px]">
            <div className="text-[11px] text-indigo-200 font-semibold uppercase tracking-wider">
              {t('កាលបរិច្ឆេទថ្ងៃនេះ', "Today's Date")}
            </div>
            <div className="font-bold text-white text-sm">{todaySolar}</div>
            <div className="text-[11px] text-amber-200 font-semibold">{todayLunar}</div>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics (No Candy Pills, Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Enrolled */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('សិស្សសរុប', 'Enrolled Students')}
            </span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {formatNumberWithNumPref(classStats.activeStudents, useKhmerNums)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t('នាក់', 'students')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>{t('ស្រី', 'Female')}: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatNumberWithNumPref(classStats.femaleCount, useKhmerNums)}</strong></span>
            <span>·</span>
            <span>{t('ប្រុស', 'Male')}: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatNumberWithNumPref(classStats.maleCount, useKhmerNums)}</strong></span>
          </div>
        </div>

        {/* Metric 2: Attendance Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('អត្រាវត្តមានខែនេះ', 'Monthly Attendance')}
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {formatNumberWithNumPref(classStats.attendanceRate, useKhmerNums)}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {t('ផ្អែកលើការស្រង់វត្តមានប្រចាំថ្ងៃ', 'Calculated across active school days')}
          </div>
        </div>

        {/* Metric 3: Class Average GPA */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('មធ្យមភាគថ្នាក់', 'Class Average')}
            </span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              {formatNumberWithNumPref(classStats.classAverage, useKhmerNums)}
            </span>
            <span className="text-xs text-slate-500">/ 10</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>{t('ជាប់', 'Passing')}: <strong className="font-mono text-emerald-600">{formatNumberWithNumPref(classStats.passingCount, useKhmerNums)}</strong></span>
            <span>·</span>
            <span>{t('ខ្សោយ', 'Needs Help')}: <strong className="font-mono text-rose-500">{formatNumberWithNumPref(classStats.failingCount, useKhmerNums)}</strong></span>
          </div>
        </div>

        {/* Metric 4: Equity & Scholarships */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('អាហារូបករណ៍ & ក្រីក្រ', 'Equity & Support')}
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {formatNumberWithNumPref(classStats.scholarshipCount + classStats.poorCount, useKhmerNums)}
            </span>
            <span className="text-xs text-slate-500">
              {t('នាក់', 'beneficiaries')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>{t('អាហារូបករណ៍', 'Scholarship')}: <strong className="font-mono">{formatNumberWithNumPref(classStats.scholarshipCount, useKhmerNums)}</strong></span>
            <span>·</span>
            <span>{t('ប័ណ្ណក្រីក្រ', 'ID Poor')}: <strong className="font-mono">{formatNumberWithNumPref(classStats.poorCount, useKhmerNums)}</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Strip */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {t('សកម្មភាពរហ័សប្រចាំថ្ងៃ ៖', 'Daily Quick Actions :')}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              markAllAttendanceForDay(todayDay, 'P');
              setCurrentView('attendance');
            }}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{t(`កត់វត្តមានថ្ងៃទី ${formatNumberWithNumPref(todayDay, useKhmerNums)} ទាំងអស់`, `Mark Day ${todayDay} All Present`)}</span>
          </button>

          <button
            onClick={() => setCurrentView('attendance')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('បើកតារាងវត្តមានខែនេះ', 'Open Monthly Attendance')}</span>
          </button>

          <button
            onClick={() => setCurrentView('scores')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>{t('បញ្ចូលពិន្ទុខែនេះ', 'Gradebook Entry')}</span>
          </button>

          <button
            onClick={() => setCurrentView('students')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('ចុះឈ្មោះសិស្សថ្មី', 'Enroll Student')}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Top Students Honor Preview & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Honor Students */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="font-moul text-xs text-slate-900 dark:text-white">
                  {t('សិស្សឆ្នើមប្រចាំថ្នាក់ (Top 3)', 'Top Class Performers')}
                </h3>
              </div>
              <button
                onClick={() => setCurrentView('honors')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>{t('មើលតារាងកិត្តិយស', 'View Honor Board')}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {topStudents.map((st, idx) => {
                const medalColors = [
                  'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300',
                  'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
                  'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300',
                ];
                return (
                  <div
                    key={st.studentId}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg font-mono font-bold flex items-center justify-center text-xs border ${
                          medalColors[idx] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {formatNumberWithNumPref(st.rank, useKhmerNums)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 font-moul text-xs">
                          {st.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {st.studentId} · {st.gender}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                        {formatNumberWithNumPref(st.average.toFixed(2), useKhmerNums)}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">
                        {t('និទ្ទេស', 'Grade')} {st.gradeLetter}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
            <span>{t('គណនាស្វ័យប្រវត្តិតាមពិន្ទុខែ', 'Auto-ranked by monthly scores')}</span>
            <span>{settings.teacherLevel} {settings.teacherRoom}</span>
          </div>
        </div>

        {/* Right: Real-time Live Activity Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-moul text-xs text-slate-900 dark:text-white">
                  {t('សកម្មភាពក្នុងប្រព័ន្ធចុងក្រោយ', 'Recent System Activity')}
                </h3>
              </div>
              <button
                onClick={() => setIsActivityDrawerOpen(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t('មើលទាំងអស់', 'View All')}
              </button>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 4).map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {evt.messageKh}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {evt.timestamp}
                    </p>
                  </div>
                  {evt.badge && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                      {evt.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{t('បានកត់ត្រា និងរក្សាទុកក្នុងកុំព្យូទ័រ', 'Locally synchronized & auto-saved')}</span>
            <span className="font-mono">Offline-ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
