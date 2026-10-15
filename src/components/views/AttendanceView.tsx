import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Coffee,
  X,
  AlertCircle,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { AttendanceStatus } from '../../types/classroom';
import {
  KHMER_MONTHS,
  KHMER_DAYS_SHORT,
  formatNumberWithNumPref,
} from '../../utils/khmer';

export const AttendanceView: React.FC = () => {
  const {
    students,
    attendance,
    updateAttendance,
    markAllAttendanceForDay,
    selectedMonth,
    setSelectedMonth,
    t,
    useKhmerNums,
    settings,
  } = useClassroom();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeDayModal, setActiveDayModal] = useState<number | null>(null);

  const activeStudents = useMemo(() => {
    return students
      .filter((s) => s.status === 'Active')
      .sort((a, b) => a.name.localeCompare(b.name, 'km'));
  }, [students]);

  const currentYear = 2026;
  const monthIndex = Math.max(0, KHMER_MONTHS.indexOf(selectedMonth));
  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

  // Cycle status on cell click
  const handleCellClick = (studentId: string, day: number, currentVal: AttendanceStatus) => {
    const sequence: AttendanceStatus[] = ['', 'P', 'ច្ប', 'អច្ប', 'ឈ', '៖'];
    const nextIdx = (sequence.indexOf(currentVal) + 1) % sequence.length;
    updateAttendance(studentId, day, sequence[nextIdx]);
  };

  // Day columns metadata (identifying Sundays)
  const dayColumns = useMemo(() => {
    const list = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, monthIndex, d);
      const dayOfWeek = date.getDay(); // 0 is Sunday
      list.push({
        day: d,
        isSunday: dayOfWeek === 0,
        dayShort: KHMER_DAYS_SHORT[dayOfWeek],
      });
    }
    return list;
  }, [daysInMonth, monthIndex, currentYear]);

  // Real-time MoEYS Summary Calculations
  const summary = useMemo(() => {
    let totalPerm = 0;
    let totalUnex = 0;
    let totalSick = 0;
    let totalHolidayDays = 0;

    // Count holidays and Sundays
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, monthIndex, d);
      if (date.getDay() === 0) {
        totalHolidayDays++;
      }
    }

    const actualSchoolDays = Math.max(1, daysInMonth - totalHolidayDays);
    const totalEnrollment = activeStudents.length;
    const femaleEnrollment = activeStudents.filter((s) => s.gender === 'ស្រី').length;
    const totalRequiredSessions = actualSchoolDays * totalEnrollment;

    activeStudents.forEach((stu) => {
      const rec = attendance[stu.id] || {};
      for (let d = 1; d <= daysInMonth; d++) {
        const status = rec[d];
        if (status === 'ច្ប') totalPerm++;
        else if (status === 'អច្ប') totalUnex++;
        else if (status === 'ឈ') totalSick++;
      }
    });

    const totalAbsentSessions = totalPerm + totalUnex + totalSick;
    const actualAttendedSessions = Math.max(0, totalRequiredSessions - totalAbsentSessions);
    const attendancePercentage = totalRequiredSessions > 0
      ? Number(((actualAttendedSessions / totalRequiredSessions) * 100).toFixed(2))
      : 100;

    return {
      totalEnrollment,
      femaleEnrollment,
      actualSchoolDays,
      totalHolidayDays,
      totalRequiredSessions,
      actualAttendedSessions,
      totalAbsentSessions,
      totalPerm,
      totalUnex,
      totalSick,
      attendancePercentage,
    };
  }, [activeStudents, attendance, daysInMonth, monthIndex]);

  // Filtered students by search
  const displayedStudents = useMemo(() => {
    if (!searchFilter.trim()) return activeStudents;
    const q = searchFilter.toLowerCase();
    return activeStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [activeStudents, searchFilter]);

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'ច្ប':
        return <span className="font-bold text-blue-600 text-[11px]">ច្ប</span>;
      case 'អច្ប':
        return <span className="font-bold text-rose-600 text-[11px]">អច្ប</span>;
      case 'ឈ':
        return <span className="font-bold text-purple-600 text-[11px]">ឈ</span>;
      case '៖':
        return <span className="font-bold text-amber-600 text-[11px]">៖</span>;
      case 'P':
        return <span className="font-semibold text-emerald-600 text-[11px]">P</span>;
      default:
        return <span className="text-slate-300 dark:text-slate-700 text-[10px]">·</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Month Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        {/* Month Picker Segmented Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {KHMER_MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedMonth === m
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Legend & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Legend (Zero-Pill Discipline) */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <strong className="text-emerald-600">P</strong> = {t('វត្តមាន', 'Present')}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <strong className="text-blue-600">ច្ប</strong> = {t('ច្បាប់', 'Excused')}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <strong className="text-rose-600">អច្ប</strong> = {t('អត់ច្បាប់', 'Unexcused')}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <strong className="text-purple-600">ឈ</strong> = {t('ឈឺ', 'Sick')}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <strong className="text-amber-600">៖</strong> = {t('សម្រាក', 'Holiday')}
            </span>
          </div>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 hidden lg:block" />

          {/* Quick Mark Today */}
          <button
            onClick={() => setActiveDayModal(new Date().getDate())}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{t('កត់រហ័សប្រចាំថ្ងៃ', 'Quick Day Entry')}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title={t('បោះពុម្ពបញ្ជីវត្តមាន', 'Print Roll Sheet')}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MoEYS Official Quantitative KPI Strip (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('សិស្សសរុប', 'Total Students')}
          </div>
          <div className="text-lg font-mono font-bold text-slate-800 dark:text-white tabular-nums">
            {formatNumberWithNumPref(summary.totalEnrollment, useKhmerNums)}{' '}
            <span className="text-[10px] font-normal text-slate-400">
              ({t('ស្រី', 'F')} {formatNumberWithNumPref(summary.femaleEnrollment, useKhmerNums)})
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('ថ្ងៃរៀនជាក់ស្តែង', 'School Days')}
          </div>
          <div className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {formatNumberWithNumPref(summary.actualSchoolDays, useKhmerNums)}{' '}
            <span className="text-[10px] font-normal text-slate-400">
              ({t('សម្រាក', 'Off')} {formatNumberWithNumPref(summary.totalHolidayDays, useKhmerNums)})
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('ពេលត្រូវមករៀន', 'Required Sessions')}
          </div>
          <div className="text-lg font-mono font-bold text-slate-800 dark:text-white tabular-nums">
            {formatNumberWithNumPref(summary.totalRequiredSessions, useKhmerNums)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('អវត្តមានសរុប', 'Total Absences')}
          </div>
          <div className="text-lg font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            {formatNumberWithNumPref(summary.totalAbsentSessions, useKhmerNums)}{' '}
            <span className="text-[10px] font-normal text-slate-400">
              ({t('ឈឺ', 'Sick')} {formatNumberWithNumPref(summary.totalSick, useKhmerNums)})
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('វត្តមានជាក់ស្តែង', 'Actual Attended')}
          </div>
          <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatNumberWithNumPref(summary.actualAttendedSessions, useKhmerNums)}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3.5 rounded-xl text-white">
          <div className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider mb-1">
            {t('អត្រាវត្តមាន', 'Attendance Rate')}
          </div>
          <div className="text-xl font-mono font-black tabular-nums">
            {formatNumberWithNumPref(summary.attendancePercentage, useKhmerNums)}%
          </div>
        </div>
      </div>

      {/* Main 31-Day Attendance Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 font-moul">
            <CalendarCheck className="w-4 h-4 text-indigo-500" />
            <span>
              {t(`បញ្ជីវត្តមានប្រចាំខែ ${selectedMonth} ឆ្នាំ ${currentYear}`, `Attendance Sheet for ${selectedMonth} ${currentYear}`)}
            </span>
          </div>
          <div className="relative w-56">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t('ស្វែងរកក្នុងតារាង...', 'Filter matrix...')}
              className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-xs whitespace-nowrap">
            <thead>
              {/* Header Row 1: Khmer Days of week */}
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500">
                <th rowSpan={2} className="py-2 px-2 w-10 border-r border-slate-200 dark:border-slate-700 sticky left-0 z-10 bg-slate-50 dark:bg-slate-800">
                  #
                </th>
                <th rowSpan={2} className="py-2 px-3 text-left w-44 border-r border-slate-200 dark:border-slate-700 sticky left-10 z-10 bg-slate-50 dark:bg-slate-800 font-moul">
                  {t('គោត្តនាម និងនាម', 'Student Name')}
                </th>
                <th rowSpan={2} className="py-2 px-1 w-10 border-r border-slate-200 dark:border-slate-700">
                  {t('ភេទ', 'Sex')}
                </th>

                {/* Days 1 to 31 */}
                {dayColumns.map(({ day, isSunday, dayShort }) => (
                  <th
                    key={day}
                    onClick={() => setActiveDayModal(day)}
                    className={`py-1 px-0.5 w-7 border-r border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors ${
                      isSunday ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : ''
                    }`}
                    title={t(`ថ្ងៃទី ${day} (${dayShort}) - ចុចដើម្បីកត់រហ័ស`, `Day ${day} - Quick Entry`)}
                  >
                    <span>{dayShort}</span>
                  </th>
                ))}

                {/* Absence Summary columns */}
                <th colSpan={4} className="py-1 px-2 border-r border-slate-200 dark:border-slate-700 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] font-bold">
                  {t('ចំនួនអវត្តមាន', 'Absences')}
                </th>
              </tr>

              {/* Header Row 2: Day numbers */}
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                {dayColumns.map(({ day, isSunday }) => (
                  <th
                    key={day}
                    onClick={() => setActiveDayModal(day)}
                    className={`py-1 px-0.5 border-r border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors ${
                      isSunday ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-extrabold' : ''
                    }`}
                  >
                    {formatNumberWithNumPref(day, useKhmerNums)}
                  </th>
                ))}

                <th className="py-1 px-1 w-7 border-r border-slate-200 dark:border-slate-700 text-blue-600 font-bold" title="ច្បាប់ (Permission)">
                  ច្ប
                </th>
                <th className="py-1 px-1 w-7 border-r border-slate-200 dark:border-slate-700 text-rose-600 font-bold" title="អត់ច្បាប់ (Unexcused)">
                  អច្ប
                </th>
                <th className="py-1 px-1 w-7 border-r border-slate-200 dark:border-slate-700 text-purple-600 font-bold" title="ឈឺ (Sick)">
                  ឈ
                </th>
                <th className="py-1 px-1 w-8 border-r border-slate-200 dark:border-slate-700 text-amber-600 font-extrabold" title="សរុប (Total)">
                  សរុប
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayedStudents.map((stu, sIdx) => {
                const stuRec = attendance[stu.id] || {};
                let pCount = 0;
                let uCount = 0;
                let sCount = 0;

                for (let d = 1; d <= daysInMonth; d++) {
                  const val = stuRec[d];
                  if (val === 'ច្ប') pCount++;
                  else if (val === 'អច្ប') uCount++;
                  else if (val === 'ឈ') sCount++;
                }

                const totalAbs = pCount + uCount + sCount;

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-2 text-center text-slate-400 font-mono text-[11px] sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                      {formatNumberWithNumPref(sIdx + 1, useKhmerNums)}
                    </td>
                    <td className="py-2 px-3 text-left font-bold text-slate-900 dark:text-white font-moul truncate max-w-[176px] sticky left-10 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                      {stu.name}
                    </td>
                    <td className="py-2 px-1 text-center font-semibold text-slate-500 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                      {stu.gender === 'ស្រី' ? 'ស' : 'ប'}
                    </td>

                    {/* Day Cells */}
                    {dayColumns.map(({ day, isSunday }) => {
                      const val = (stuRec[day] || '') as AttendanceStatus;
                      return (
                        <td
                          key={day}
                          onClick={() => handleCellClick(stu.id, day, val)}
                          className={`py-1 px-0.5 border-r border-slate-200 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                            isSunday ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                          }`}
                        >
                          {getStatusBadge(val)}
                        </td>
                      );
                    })}

                    {/* Totals */}
                    <td className="py-2 px-1 font-mono font-bold text-blue-600 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                      {formatNumberWithNumPref(pCount, useKhmerNums)}
                    </td>
                    <td className="py-2 px-1 font-mono font-bold text-rose-600 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                      {formatNumberWithNumPref(uCount, useKhmerNums)}
                    </td>
                    <td className="py-2 px-1 font-mono font-bold text-purple-600 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                      {formatNumberWithNumPref(sCount, useKhmerNums)}
                    </td>
                    <td className="py-2 px-1 font-mono font-extrabold text-amber-700 bg-amber-50/50 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                      {formatNumberWithNumPref(totalAbs, useKhmerNums)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Day Entry Modal (Mobile & Fast Touch Workflow) */}
      {activeDayModal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveDayModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-moul text-sm text-slate-900 dark:text-white">
                  {t(`កត់វត្តមានថ្ងៃទី ${formatNumberWithNumPref(activeDayModal, useKhmerNums)} ខែ${selectedMonth}`, `Attendance for Day ${activeDayModal} (${selectedMonth})`)}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {t('ជ្រើសរើសវត្តមានសិស្សម្នាក់ៗ ឬកំណត់ស្មើគ្នាទាំងអស់', 'Mark individuals or batch update')}
                </p>
              </div>
              <button
                onClick={() => setActiveDayModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Batch Action Toolbar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                {t('កំណត់ព្រមគ្នា ៖', 'Batch action :')}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => markAllAttendanceForDay(activeDayModal, 'P')}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded-lg transition-colors"
                >
                  P វត្តមានទាំងអស់
                </button>
                <button
                  onClick={() => markAllAttendanceForDay(activeDayModal, '៖')}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Coffee className="w-3 h-3" />
                  <span>៖ សម្រាកទាំងអស់</span>
                </button>
              </div>
            </div>

            {/* Students List in Modal */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeStudents.map((stu) => {
                const currentStatus = (attendance[stu.id]?.[activeDayModal] || '') as AttendanceStatus;
                return (
                  <div
                    key={stu.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="truncate">
                      <p className="font-bold text-slate-800 dark:text-slate-100 font-moul text-xs">
                        {stu.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {stu.id} · {stu.gender}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {(['P', 'ច្ប', 'អច្ប', 'ឈ', '៖'] as AttendanceStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateAttendance(stu.id, activeDayModal, currentStatus === st ? '' : st)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            currentStatus === st
                              ? st === 'P'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : st === 'ច្ប'
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : st === 'អច្ប'
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : st === 'ឈ'
                                ? 'bg-purple-600 text-white shadow-2xs'
                                : 'bg-amber-500 text-white shadow-2xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setActiveDayModal(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
              >
                {t('រួចរាល់', 'Done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
