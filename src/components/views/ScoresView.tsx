import React, { useState, useMemo, useRef } from 'react';
import {
  FileSpreadsheet,
  Calculator,
  Award,
  Download,
  Printer,
  ChevronDown,
  Sparkles,
  TrendingUp,
  X,
  Search,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { PRIMARY_SUBJECTS, formatNumberWithNumPref, KHMER_MONTHS } from '../../utils/khmer';
import { ScorePeriodType } from '../../types/classroom';

export const ScoresView: React.FC = () => {
  const {
    students,
    scores,
    updateStudentScore,
    recalculateScoresAndRanks,
    selectedMonth,
    setSelectedMonth,
    selectedPeriodType,
    setSelectedPeriodType,
    t,
    useKhmerNums,
    settings,
  } = useClassroom();

  const [activeStudentModal, setActiveStudentModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeStudents = useMemo(() => {
    return students
      .filter((s) => s.status === 'Active')
      .sort((a, b) => a.name.localeCompare(b.name, 'km'));
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return activeStudents;
    const q = searchTerm.toLowerCase();
    return activeStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    );
  }, [activeStudents, searchTerm]);

  // Handle cell keyboard navigation (Excel-like)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
      let targetRow = rowIndex;
      let targetCol = colIndex;

      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        targetRow = Math.min(filteredStudents.length - 1, rowIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        targetRow = Math.max(0, rowIndex - 1);
      } else if (e.key === 'ArrowRight') {
        targetCol = Math.min(PRIMARY_SUBJECTS.length - 1, colIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        targetCol = Math.max(0, colIndex - 1);
      }

      const nextInput = document.querySelector<HTMLInputElement>(
        `input[data-row="${targetRow}"][data-col="${targetCol}"]`
      );
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  };

  const exportScoresCsv = () => {
    const subjectHeaders = PRIMARY_SUBJECTS.map((s) => `"${s.nameKh} (${s.nameEn})"`).join(',');
    const headers = `ID,Name,Gender,${subjectHeaders},Total,Average,Rank,Grade`;
    const rows = filteredStudents.map((stu) => {
      const sc = scores[stu.id] || { scores: {}, totalScore: 0, average: 0, rank: 0, gradeLetter: '-' };
      const subVals = PRIMARY_SUBJECTS.map((s) => sc.scores[s.key] ?? '').join(',');
      return `"${stu.id}","${stu.name}","${stu.gender}",${subVals},"${sc.totalScore}","${sc.average}","${sc.rank}","${sc.gradeLetter}"`;
    });

    const content = [headers, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Classroom_Scores_${selectedMonth}_${settings.academicYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Period Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        {/* Period Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Type */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setSelectedPeriodType('monthly')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                selectedPeriodType === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('ប្រចាំខែ', 'Monthly')}
            </button>
            <button
              onClick={() => setSelectedPeriodType('semester')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                selectedPeriodType === 'semester'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('ប្រចាំឆមាស', 'Semester')}
            </button>
            <button
              onClick={() => setSelectedPeriodType('annual')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                selectedPeriodType === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t('ប្រចាំឆ្នាំ', 'Annual')}
            </button>
          </div>

          {/* Month Dropdown if monthly */}
          {selectedPeriodType === 'monthly' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-700 dark:text-indigo-300 outline-none"
            >
              {KHMER_MONTHS.map((m) => (
                <option key={m} value={m}>
                  {t(`ខែ ${m}`, `Month of ${m}`)}
                </option>
              ))}
            </select>
          )}

          {/* Search Box */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('ស្វែងរក...', 'Filter...')}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={recalculateScoresAndRanks}
            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            title="Recalculate ranks and grade averages"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('គណនាចំណាត់ថ្នាក់', 'Re-Rank All')}</span>
          </button>

          <button
            onClick={exportScoresCsv}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title={t('ទាញយក CSV', 'Export CSV')}
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title={t('បោះពុម្ពបញ្ជីពិន្ទុ', 'Print Gradebook')}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gradebook Matrix Table (Excel Keyboard Navigation) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200 dark:border-slate-700 sticky left-0 z-10 bg-slate-50 dark:bg-slate-800">
                  #
                </th>
                <th className="py-2.5 px-3 text-left w-44 border-r border-slate-200 dark:border-slate-700 sticky left-10 z-10 bg-slate-50 dark:bg-slate-800 font-moul">
                  {t('គោត្តនាម និងនាម', 'Student Name')}
                </th>
                <th className="py-2.5 px-2 w-10 text-center border-r border-slate-200 dark:border-slate-700">
                  {t('ភេទ', 'Sex')}
                </th>

                {/* Subject Headers */}
                {PRIMARY_SUBJECTS.map((sub, colIdx) => (
                  <th
                    key={sub.key}
                    className="py-2 px-1 text-center border-r border-slate-200 dark:border-slate-700 max-w-[80px]"
                    title={`${sub.groupKh} - ${sub.nameKh} (Max: ${sub.maxScore})`}
                  >
                    <div className="truncate text-[10px] text-slate-500 font-normal">
                      {sub.groupKh}
                    </div>
                    <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                      {sub.nameKh}
                    </div>
                  </th>
                ))}

                {/* Calculated Columns */}
                <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800 font-bold">
                  {t('ពិន្ទុសរុប', 'Total')}
                </th>
                <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold">
                  {t('មធ្យមភាគ', 'Average')}
                </th>
                <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold">
                  {t('ចំណាត់ថ្នាក់', 'Rank')}
                </th>
                <th className="py-2.5 px-3 text-center bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
                  {t('និទ្ទេស', 'Grade')}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredStudents.map((stu, rowIdx) => {
                const sc = scores[stu.id] || {
                  scores: {},
                  totalScore: 0,
                  average: 0,
                  rank: 0,
                  gradeLetter: '-',
                };

                return (
                  <tr
                    key={stu.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2 px-2 text-center text-slate-400 font-mono text-[11px] sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                      {formatNumberWithNumPref(rowIdx + 1, useKhmerNums)}
                    </td>
                    <td
                      onClick={() => setActiveStudentModal(stu.id)}
                      className="py-2 px-3 text-left font-bold text-slate-900 dark:text-white font-moul truncate max-w-[176px] sticky left-10 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 cursor-pointer hover:text-indigo-600"
                      title={t('ចុចដើម្បីបញ្ចូលតាមផ្ទាំងរហ័ស', 'Click for mobile touch modal')}
                    >
                      {stu.name}
                    </td>
                    <td className="py-2 px-2 text-center font-semibold text-slate-500 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                      {stu.gender === 'ស្រី' ? 'ស' : 'ប'}
                    </td>

                    {/* Subject Score Inputs */}
                    {PRIMARY_SUBJECTS.map((sub, colIdx) => {
                      const val = sc.scores[sub.key] ?? '';
                      const isFailing = typeof val === 'number' && val < sub.maxScore / 2;

                      return (
                        <td
                          key={sub.key}
                          className="p-0 border-r border-slate-200 dark:border-slate-800 text-center"
                        >
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={sub.maxScore}
                            data-row={rowIdx}
                            data-col={colIdx}
                            value={val}
                            onChange={(e) => {
                              const v = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              updateStudentScore(stu.id, sub.key, v);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                            className={`w-14 h-8 text-center text-xs font-mono font-bold outline-none transition-colors bg-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 rounded ${
                              isFailing
                                ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}
                          />
                        </td>
                      );
                    })}

                    {/* Calculated Results */}
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 tabular-nums">
                      {formatNumberWithNumPref(sc.totalScore.toFixed(1), useKhmerNums)}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-extrabold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-950/20 tabular-nums">
                      {formatNumberWithNumPref(sc.average.toFixed(2), useKhmerNums)}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-black text-rose-600 dark:text-rose-400 border-r border-slate-200 dark:border-slate-800 bg-rose-50/30 dark:bg-rose-950/20 tabular-nums">
                      {formatNumberWithNumPref(sc.rank || '-', useKhmerNums)}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      {sc.gradeLetter}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Keyboard Helper Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>{t('ប្រើសញ្ញាព្រួញ ⬆ ⬇ ⬅ ➡ ឬ Enter ដើម្បីប្តូរក្រឡាដូច Excel', 'Use Arrow keys or Enter to navigate cells')}</span>
            <span>·</span>
            <span className="text-rose-500 font-semibold">{t('ពិន្ទុក្រហម = ធ្លាក់កន្លះភាគ', 'Red = Below passing')}</span>
          </div>
          <div>
            <span>{settings.teacherLevel} {settings.teacherRoom}</span>
          </div>
        </div>
      </div>

      {/* Single-Student Touch Entry Modal */}
      {activeStudentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveStudentModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(() => {
              const stu = students.find((s) => s.id === activeStudentModal);
              const sc = scores[activeStudentModal] || {
                scores: {},
                totalScore: 0,
                average: 0,
                rank: 0,
                gradeLetter: '-',
              };
              return (
                <>
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-moul text-sm text-slate-900 dark:text-white">
                        {stu?.name} ({stu?.id})
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {t('មធ្យមភាគ', 'Average')}: <strong className="font-mono text-indigo-600">{sc.average}</strong> ·{' '}
                        {t('ចំណាត់ថ្នាក់', 'Rank')}: <strong className="font-mono text-rose-600">{sc.rank}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveStudentModal(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {PRIMARY_SUBJECTS.map((sub) => {
                      const val = sc.scores[sub.key] ?? '';
                      return (
                        <div
                          key={sub.key}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                          <div>
                            <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                              {sub.nameKh}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {sub.groupKh} (Max: {sub.maxScore})
                            </p>
                          </div>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={sub.maxScore}
                            value={val}
                            onChange={(e) => {
                              const v = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              updateStudentScore(activeStudentModal, sub.key, v);
                            }}
                            className="w-20 px-2 py-1.5 text-center text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                    <button
                      onClick={() => setActiveStudentModal(null)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                    >
                      {t('រួចរាល់', 'Done')}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
