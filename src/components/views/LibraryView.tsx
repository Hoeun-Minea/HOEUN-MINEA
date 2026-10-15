import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Download,
  Trash2,
  Bookmark,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { LibraryLoan } from '../../types/classroom';
import { formatNumberWithNumPref } from '../../utils/khmer';

export const LibraryView: React.FC = () => {
  const { loans, addLoan, updateLoan, deleteLoan, students, t, useKhmerNums } = useClassroom();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'borrowed' | 'returned' | 'lost'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '',
    bookTitle: '',
    borrowDate: new Date().toISOString().split('T')[0],
    condition: 'good' as LibraryLoan['condition'],
    notes: '',
  });

  const filteredLoans = loans.filter((l) => {
    const matchSearch =
      !searchTerm.trim() ||
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.bookTitle) return;

    const student = students.find((s) => s.id === formData.studentId);
    addLoan({
      studentId: formData.studentId,
      studentName: student ? student.name : formData.studentId,
      bookTitle: formData.bookTitle,
      borrowDate: formData.borrowDate,
      status: 'borrowed',
      condition: formData.condition,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
    setFormData({
      studentId: '',
      bookTitle: '',
      borrowDate: new Date().toISOString().split('T')[0],
      condition: 'good',
      notes: '',
    });
  };

  const handleReturn = (loan: LibraryLoan) => {
    updateLoan({
      ...loan,
      status: 'returned',
      returnDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleMarkLost = (loan: LibraryLoan) => {
    updateLoan({
      ...loan,
      status: 'lost',
    });
  };

  const totalBorrowed = loans.filter((l) => l.status === 'borrowed').length;
  const totalReturned = loans.filter((l) => l.status === 'returned').length;
  const totalLost = loans.filter((l) => l.status === 'lost').length;

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('សៀវភៅសរុបដែលបានកត់ត្រា', 'Total Loan Records')}
          </div>
          <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white tabular-nums">
            {formatNumberWithNumPref(loans.length, useKhmerNums)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('កំពុងខ្ចីប្រើប្រាស់', 'Currently Borrowed')}
          </div>
          <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            {formatNumberWithNumPref(totalBorrowed, useKhmerNums)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('បានប្រគល់សងវិញ', 'Returned')}
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatNumberWithNumPref(totalReturned, useKhmerNums)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            {t('បាត់បង់ / ខូចខាត', 'Lost or Damaged')}
          </div>
          <div className="text-2xl font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            {formatNumberWithNumPref(totalLost, useKhmerNums)}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('ស្វែងរកឈ្មោះសិស្ស ឬចំណងជើងសៀវភៅ...', 'Search by student or title...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold outline-none"
          >
            <option value="all">{t('គ្រប់ស្ថានភាព', 'All Statuses')}</option>
            <option value="borrowed">{t('កំពុងខ្ចី', 'Borrowed')}</option>
            <option value="returned">{t('បានសង', 'Returned')}</option>
            <option value="lost">{t('បាត់បង់', 'Lost')}</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('កត់ត្រាការខ្ចីថ្មី', 'New Loan Record')}</span>
          </button>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">{t('ឈ្មោះសិស្ស', 'Student Name')}</th>
                <th className="py-3 px-4">{t('ចំណងជើងសៀវភៅគោល', 'Book Title')}</th>
                <th className="py-3 px-4 text-center">{t('ថ្ងៃខ្ចី', 'Borrowed')}</th>
                <th className="py-3 px-4 text-center">{t('ថ្ងៃសង', 'Returned')}</th>
                <th className="py-3 px-4 text-center">{t('ស្ថានភាពសៀវភៅ', 'Condition')}</th>
                <th className="py-3 px-4 text-center">{t('ស្ថានភាព', 'Status')}</th>
                <th className="py-3 px-4 text-right">{t('សកម្មភាព', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    {t('មិនទាន់មានកំណត់ត្រាខ្ចីសៀវភៅទេ', 'No loan records found')}
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan, index) => (
                  <tr key={loan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {formatNumberWithNumPref(index + 1, useKhmerNums)}
                    </td>
                    <td className="py-2.5 px-4 font-bold font-moul text-slate-900 dark:text-white">
                      {loan.studentName}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{loan.bookTitle}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      {loan.borrowDate}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      {loan.returnDate || '-'}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {loan.condition === 'new' ? t('ថ្មី', 'New') : loan.condition === 'good' ? t('ល្អ', 'Good') : loan.condition === 'fair' ? t('មធ្យម', 'Fair') : t('ចាស់/ខូច', 'Damaged')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {loan.status === 'borrowed' ? (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                          {t('កំពុងខ្ចី', 'Borrowed')}
                        </span>
                      ) : loan.status === 'returned' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          {t('បានសង', 'Returned')}
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                          {t('បាត់បង់', 'Lost')}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {loan.status === 'borrowed' && (
                          <button
                            onClick={() => handleReturn(loan)}
                            className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold transition-colors"
                          >
                            {t('ទទួលសង', 'Return')}
                          </button>
                        )}
                        <button
                          onClick={() => deleteLoan(loan.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Loan Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-moul text-sm text-slate-900 dark:text-white">
                {t('កត់ត្រាការខ្ចីសៀវភៅ', 'Record Textbook Loan')}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t('ជ្រើសរើសសិស្ស *', 'Student *')}
                </label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="">-- {t('ជ្រើសរើសសិស្ស', 'Select student')} --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t('ចំណងជើងសៀវភៅ *', 'Book Title *')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.bookTitle}
                  onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                  placeholder="ឧ. ភាសាខ្មែរ ថ្នាក់ទី ២"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {t('ថ្ងៃខ្ចី', 'Borrow Date')}
                  </label>
                  <input
                    type="date"
                    value={formData.borrowDate}
                    onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {t('ស្ថានភាពសៀវភៅ', 'Condition')}
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  >
                    <option value="new">ថ្មី (New)</option>
                    <option value="good">ល្អ (Good)</option>
                    <option value="fair">មធ្យម (Fair)</option>
                    <option value="damaged">ខូចខាត (Damaged)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t('កំណត់ចំណាំផ្សេងៗ', 'Notes')}
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="ឧ. សៀវភៅលេខកូដ BK-04"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  {t('បោះបង់', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {t('រក្សាទុក', 'Save Loan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
