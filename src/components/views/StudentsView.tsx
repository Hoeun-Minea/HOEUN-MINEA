import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Printer,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { Student } from '../../types/classroom';
import { StudentModal } from '../modals/StudentModal';
import { formatNumberWithNumPref, formatKhmerDate, calculateAge } from '../../utils/khmer';

export const StudentsView: React.FC = () => {
  const { students, deleteStudent, t, useKhmerNums, settings, setCurrentView } = useClassroom();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'ប្រុស' | 'ស្រី'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Dropped'>('all');
  const [filterSupport, setFilterSupport] = useState<'all' | 'poor' | 'scholarship'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Student | null>(null);

  // Filtered list
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchQuery =
        !searchQuery.trim() ||
        stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stu.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (stu.parentContact && stu.parentContact.includes(searchQuery));

      const matchGender = filterGender === 'all' || stu.gender === filterGender;
      const matchStatus = filterStatus === 'all' || stu.status === filterStatus;
      const matchSupport =
        filterSupport === 'all' ||
        (filterSupport === 'poor' && stu.poorId) ||
        (filterSupport === 'scholarship' && stu.scholarship);

      return matchQuery && matchGender && matchStatus && matchSupport;
    });
  }, [students, searchQuery, filterGender, filterStatus, filterSupport]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stu: Student) => {
    setEditingStudent(stu);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t(`តើអ្នកពិតជាចង់លុបសិស្ស ${name} មែនទេ?`, `Are you sure you want to delete ${name}?`))) {
      deleteStudent(id);
      if (viewingProfile?.id === id) setViewingProfile(null);
    }
  };

  const exportRosterCsv = () => {
    const headers = ['ID,Name,Gender,Date of Birth,Grade,Room,Contact,Status'];
    const rows = filteredStudents.map(
      (s) =>
        `"${s.id}","${s.name}","${s.gender}","${s.dob}","${s.grade}","${s.room}","${s.parentContact || ''}","${s.status}"`
    );
    const content = [headers, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Roster_${settings.academicYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Action & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ស្វែងរកតាមឈ្មោះ អត្តលេខ ឬលេខទូរស័ព្ទ...', 'Search by student name, ID, or phone...')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters and CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">{t('ភេទទាំងអស់', 'All Genders')}</option>
            <option value="ប្រុស">{t('ប្រុស (Male)', 'Male')}</option>
            <option value="ស្រី">{t('ស្រី (Female)', 'Female')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">{t('គ្រប់ស្ថានភាព', 'All Statuses')}</option>
            <option value="Active">{t('កំពុងសិក្សា (Active)', 'Active')}</option>
            <option value="Dropped">{t('បោះបង់ (Dropped)', 'Dropped')}</option>
          </select>

          {/* Welfare Filter */}
          <select
            value={filterSupport}
            onChange={(e) => setFilterSupport(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">{t('សិស្សទូទៅ', 'All Categories')}</option>
            <option value="scholarship">{t('អាហារូបករណ៍', 'Scholarships')}</option>
            <option value="poor">{t('ប័ណ្ណក្រីក្រ', 'ID Poor')}</option>
          </select>

          <button
            onClick={exportRosterCsv}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title={t('ទាញយកឯកសារ CSV', 'Export CSV')}
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-colors"
            title={t('បោះពុម្ពបញ្ជី', 'Print Roster')}
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('ចុះឈ្មោះថ្មី', 'Enroll Student')}</span>
          </button>
        </div>
      </div>

      {/* Roster Table (Zero Pill Discipline, High-Density Math) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-24">{t('អត្តលេខ', 'ID')}</th>
                <th className="py-3 px-4">{t('គោត្តនាម និងនាម', 'Full Name')}</th>
                <th className="py-3 px-4 w-20 text-center">{t('ភេទ', 'Gender')}</th>
                <th className="py-3 px-4 w-28 text-center">{t('ថ្ងៃកំណើត (អាយុ)', 'DOB / Age')}</th>
                <th className="py-3 px-4">{t('ទីលំនៅ (ភូមិ/ឃុំ)', 'Village / Commune')}</th>
                <th className="py-3 px-4">{t('លេខទូរស័ព្ទអាណាព្យាបាល', 'Parent Contact')}</th>
                <th className="py-3 px-4 text-center">{t('ស្ថានភាព', 'Status')}</th>
                <th className="py-3 px-4 text-right no-print">{t('សកម្មភាព', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    {t('រកមិនឃើញទិន្នន័យសិស្សតាមលក្ខខណ្ឌនេះទេ', 'No students match the current criteria')}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu, index) => {
                  const age = calculateAge(stu.dob);
                  return (
                    <tr
                      key={stu.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setViewingProfile(stu)}
                    >
                      <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {formatNumberWithNumPref(index + 1, useKhmerNums)}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {stu.id}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center font-moul text-xs shrink-0">
                            {stu.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white font-moul">
                              {stu.name}
                            </span>
                            {/* Quiet text metadata indicators */}
                            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              {stu.scholarship && (
                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                  {t('អាហារូបករណ៍', 'Scholarship')}
                                </span>
                              )}
                              {stu.scholarship && stu.poorId && <span>·</span>}
                              {stu.poorId && (
                                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                  {t('ប័ណ្ណក្រីក្រ', 'ID Poor')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`font-semibold ${
                            stu.gender === 'ស្រី' ? 'text-pink-600 dark:text-pink-400' : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {stu.gender}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        <span>{stu.dob || '-'}</span>
                        {age !== null && (
                          <span className="text-slate-400 ml-1">
                            ({formatNumberWithNumPref(age, useKhmerNums)} {t('ឆ្នាំ', 'y')})
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">
                        {stu.currVillage || stu.currCommune ? (
                          <span>
                            {stu.currVillage ? `${stu.currVillage}, ` : ''}
                            {stu.currCommune}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {stu.parentContact || '-'}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {stu.status === 'Active' ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t('កំពុងសិក្សា', 'Active')}</span>
                          </span>
                        ) : (
                          <span className="text-rose-500 font-semibold text-[11px] inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t('បោះបង់', 'Dropped')}</span>
                          </span>
                        )}
                      </td>
                      <td
                        className="py-2.5 px-4 text-right no-print"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingProfile(stu)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title={t('មើលប្រវត្តិរូប', 'View Profile')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(stu)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title={t('កែប្រែ', 'Edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(stu.id, stu.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title={t('លុប', 'Delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Strip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span>
              {t('បង្ហាញសិស្សចំនួន', 'Showing')}{' '}
              <strong className="font-mono text-slate-800 dark:text-slate-200">
                {formatNumberWithNumPref(filteredStudents.length, useKhmerNums)}
              </strong>{' '}
              {t('នាក់ នៃសរុប', 'of')}{' '}
              <strong className="font-mono text-slate-800 dark:text-slate-200">
                {formatNumberWithNumPref(students.length, useKhmerNums)}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>{settings.teacherLevel} {settings.teacherRoom}</span>
            <span>·</span>
            <span>{settings.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Student Profile Slide-Over Drawer */}
      {viewingProfile && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setViewingProfile(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-moul text-lg flex items-center justify-center shadow-sm">
                  {viewingProfile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-moul text-sm text-slate-900 dark:text-white">
                    {viewingProfile.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    {viewingProfile.id} · {viewingProfile.gender}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingProfile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-5 space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* Category Badges / Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {viewingProfile.grade} {viewingProfile.room}
                </span>
                {viewingProfile.scholarship && (
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{t('អាហារូបករណ៍', 'Scholarship')}</span>
                  </span>
                )}
                {viewingProfile.poorId && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{t('ប័ណ្ណក្រីក្រ', 'ID Poor')}</span>
                  </span>
                )}
              </div>

              {/* Bio Details */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t('ថ្ងៃខែឆ្នាំកំណើត', 'Birth Details')}</span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {formatKhmerDate(viewingProfile.dob, useKhmerNums)}
                </p>
              </div>

              {/* Location */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t('ទីលំនៅបច្ចុប្បន្ន', 'Current Address')}</span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {viewingProfile.currVillage || '-'}, {viewingProfile.currCommune || '-'},{' '}
                  {viewingProfile.currDistrict || '-'}, {viewingProfile.currProvince || '-'}
                </p>
              </div>

              {/* Family */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('ឪពុកម្តាយ & ទំនាក់ទំនង', 'Family & Contact')}</span>
                </div>
                <div className="space-y-1">
                  <p>
                    {t('ឪពុក', 'Father')}: <strong>{viewingProfile.fatherName || '-'}</strong>{' '}
                    <span className="text-slate-500">({viewingProfile.fatherJob || '-'})</span>
                  </p>
                  <p>
                    {t('ម្តាយ', 'Mother')}: <strong>{viewingProfile.motherName || '-'}</strong>{' '}
                    <span className="text-slate-500">({viewingProfile.motherJob || '-'})</span>
                  </p>
                  <p>
                    {t('លេខទូរស័ព្ទ', 'Phone')}:{' '}
                    <strong className="font-mono text-indigo-600 dark:text-indigo-400">
                      {viewingProfile.parentContact || '-'}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons in Drawer */}
              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(viewingProfile);
                    setViewingProfile(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors text-center"
                >
                  {t('កែប្រែព័ត៌មាន', 'Edit Profile')}
                </button>
                <button
                  onClick={() => {
                    setCurrentView('scores');
                    setViewingProfile(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 transition-colors"
                >
                  {t('មើលពិន្ទុ', 'View Grades')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Dialog */}
      <StudentModal
        isOpen={isModalOpen}
        student={editingStudent}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
