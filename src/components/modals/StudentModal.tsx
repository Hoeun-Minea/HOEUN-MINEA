import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, Camera } from 'lucide-react';
import { Student } from '../../types/classroom';
import { useClassroom } from '../../context/ClassroomContext';

interface StudentModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ isOpen, student, onClose }) => {
  const { addStudent, updateStudent, selectedGrade, selectedRoom, t } = useClassroom();

  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    gender: 'ប្រុស',
    dob: '2018-01-01',
    grade: selectedGrade,
    room: selectedRoom,
    status: 'Active',
    pobVillage: '',
    pobCommune: '',
    pobDistrict: 'កៀនស្វាយ',
    pobProvince: 'កណ្តាល',
    currVillage: '',
    currCommune: '',
    currDistrict: 'កៀនស្វាយ',
    currProvince: 'កណ្តាល',
    fatherName: '',
    fatherJob: '',
    motherName: '',
    motherJob: '',
    parentContact: '',
    poorId: false,
    scholarship: false,
    disability: false,
    photoUrl: '',
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        name: '',
        gender: 'ប្រុស',
        dob: '2018-05-15',
        grade: selectedGrade,
        room: selectedRoom,
        status: 'Active',
        pobVillage: '',
        pobCommune: '',
        pobDistrict: 'កៀនស្វាយ',
        pobProvince: 'កណ្តាល',
        currVillage: '',
        currCommune: '',
        currDistrict: 'កៀនស្វាយ',
        currProvince: 'កណ្តាល',
        fatherName: '',
        fatherJob: '',
        motherName: '',
        motherJob: '',
        parentContact: '',
        poorId: false,
        scholarship: false,
        disability: false,
        photoUrl: '',
      });
    }
  }, [student, selectedGrade, selectedRoom, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (student) {
      updateStudent({ ...(formData as Student), id: student.id });
    } else {
      addStudent(formData as Omit<Student, 'id'>);
    }
    onClose();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, photoUrl: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-moul text-sm md:text-base text-slate-800 dark:text-white">
                {student ? t('កែប្រែព័ត៌មានសិស្ស', 'Edit Student Information') : t('ចុះឈ្មោះសិស្សថ្មី', 'Enroll New Student')}
              </h3>
              <p className="text-xs text-slate-500">
                {student ? student.id : t('ប្រព័ន្ធនឹងបង្កើតអត្តលេខស្វ័យប្រវត្តិ', 'System will generate student ID')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Identity Section */}
          <div className="space-y-4">
            <h4 className="font-moul text-xs text-indigo-950 dark:text-indigo-300 border-b border-slate-100 dark:border-slate-800 pb-2">
              ១. ព័ត៌មានផ្ទាល់ខ្លួន (Personal Info)
            </h4>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Photo uploader */}
              <div className="relative group shrink-0">
                <div className="w-20 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <Camera className="w-6 h-6 mx-auto mb-1 opacity-60" />
                      <span className="text-[10px]">{t('រូបថត', 'Photo')}</span>
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-[10px] font-bold">
                  {t('ជ្រើសរើស', 'Upload')}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Name, Gender, DOB */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t('គោត្តនាម និងនាម *', 'Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ឧ. ចាន់ សុខា"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-moul text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t('ភេទ *', 'Gender *')}
                  </label>
                  <select
                    value={formData.gender || 'ប្រុស'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'ប្រុស' | 'ស្រី' })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none"
                  >
                    <option value="ប្រុស">ប្រុស (Male)</option>
                    <option value="ស្រី">ស្រី (Female)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t('ថ្ងៃខែឆ្នាំកំណើត', 'Date of Birth')}
                  </label>
                  <input
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t('ថ្នាក់ទី', 'Grade Level')}
                  </label>
                  <input
                    type="text"
                    value={formData.grade || selectedGrade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {t('បន្ទប់', 'Room / Section')}
                  </label>
                  <input
                    type="text"
                    value={formData.room || selectedRoom}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Residence & Location */}
          <div className="space-y-3">
            <h4 className="font-moul text-xs text-indigo-950 dark:text-indigo-300 border-b border-slate-100 dark:border-slate-800 pb-2">
              ២. ទីលំនៅបច្ចុប្បន្ន (Current Address)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ភូមិ', 'Village')}</label>
                <input
                  type="text"
                  value={formData.currVillage || ''}
                  onChange={(e) => setFormData({ ...formData, currVillage: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ឃុំ/សង្កាត់', 'Commune')}</label>
                <input
                  type="text"
                  value={formData.currCommune || ''}
                  onChange={(e) => setFormData({ ...formData, currCommune: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ស្រុក/ខណ្ឌ', 'District')}</label>
                <input
                  type="text"
                  value={formData.currDistrict || ''}
                  onChange={(e) => setFormData({ ...formData, currDistrict: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ខេត្ត/ក្រុង', 'Province')}</label>
                <input
                  type="text"
                  value={formData.currProvince || ''}
                  onChange={(e) => setFormData({ ...formData, currProvince: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Parents & Guardians */}
          <div className="space-y-3">
            <h4 className="font-moul text-xs text-indigo-950 dark:text-indigo-300 border-b border-slate-100 dark:border-slate-800 pb-2">
              ៣. ព័ត៌មានអាណាព្យាបាល (Parents & Contact)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ឈ្មោះឪពុក', "Father's Name")}</label>
                <input
                  type="text"
                  value={formData.fatherName || ''}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('មុខរបរឪពុក', "Father's Job")}</label>
                <input
                  type="text"
                  value={formData.fatherJob || ''}
                  onChange={(e) => setFormData({ ...formData, fatherJob: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('ឈ្មោះម្ដាយ', "Mother's Name")}</label>
                <input
                  type="text"
                  value={formData.motherName || ''}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('មុខរបរម្ដាយ', "Mother's Job")}</label>
                <input
                  type="text"
                  value={formData.motherJob || ''}
                  onChange={(e) => setFormData({ ...formData, motherJob: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">{t('លេខទូរស័ព្ទទំនាក់ទំនង', 'Contact Number')}</label>
                <input
                  type="text"
                  value={formData.parentContact || ''}
                  onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                  placeholder="012 345 678"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>

          {/* Special Welfare / Status */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.scholarship || false}
                onChange={(e) => setFormData({ ...formData, scholarship: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <span>{t('អាហារូបករណ៍', 'Scholarship Student')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.poorId || false}
                onChange={(e) => setFormData({ ...formData, poorId: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <span>{t('ប័ណ្ណក្រីក្រ (ID Poor)', 'ID Poor Cardholder')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.disability || false}
                onChange={(e) => setFormData({ ...formData, disability: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <span>{t('ពិការភាព', 'Disability Support')}</span>
            </label>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">{t('ស្ថានភាព៖', 'Status:')}</span>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Dropped' })}
                className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                <option value="Active">កំពុងសិក្សា (Active)</option>
                <option value="Dropped">បោះបង់ (Dropped)</option>
              </select>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t('បោះបង់', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{t('រក្សាទុក', 'Save Student')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
