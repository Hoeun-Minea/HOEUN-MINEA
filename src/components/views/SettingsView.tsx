import React, { useState } from 'react';
import {
  Save,
  Download,
  Upload,
  RotateCcw,
  Building,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { SchoolSettings } from '../../types/classroom';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportBackupJson,
    importBackupJson,
    resetToDefaults,
    t,
  } = useClassroom();

  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await importBackupJson(file);
    if (ok) {
      alert(t('បាននាំចូលទិន្នន័យបម្រុងដោយជោគជ័យ!', 'Backup successfully imported!'));
      window.location.reload();
    } else {
      alert(t('បរាជ័យក្នុងការអានឯកសារបម្រុង!', 'Failed to read backup file!'));
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        t(
          'តើអ្នកពិតជាចង់កំណត់ទិន្នន័យប្រព័ន្ធទៅលំនាំដើមមែនទេ? ទិន្នន័យបច្ចុប្បន្នទាំងអស់នឹងត្រូវជំនួស។',
          'Are you sure you want to reset all data to default? Current data will be replaced.'
        )
      )
    ) {
      resetToDefaults();
      alert(t('បានកំណត់ទិន្នន័យឡើងវិញជោគជ័យ!', 'System data reset successfully!'));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('បានរក្សាទុកការកំណត់ដោយជោគជ័យ!', 'Settings saved successfully!')}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: School Identity */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-indigo-500" />
            <h3 className="font-moul text-xs text-slate-900 dark:text-white">
              {t('១. ព័ត៌មានសាលារៀន (School Information)', '1. School Profile & Identity')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('ឈ្មោះសាលារៀន (ខ្មែរ) *', 'School Name (Khmer) *')}
              </label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-moul text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('ឈ្មោះសាលារៀន (English)', 'School Name (English)')}
              </label>
              <input
                type="text"
                value={formData.schoolNameEn}
                onChange={(e) => setFormData({ ...formData, schoolNameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('កម្រងសាលា', 'School Cluster')}
              </label>
              <input
                type="text"
                value={formData.cluster}
                onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('នាយក / នាយិកាសាលា *', 'Principal Name *')}
              </label>
              <input
                type="text"
                required
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-moul text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('ស្រុក / ខណ្ឌ', 'District')}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('ខេត្ត / រាជធានី', 'Province')}
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Homeroom Teacher & Academic Year */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-emerald-500" />
            <h3 className="font-moul text-xs text-slate-900 dark:text-white">
              {t('២. ព័ត៌មានគ្រូ និងឆ្នាំសិក្សា (Teacher & Classroom)', '2. Homeroom Teacher & Class')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('ឈ្មោះគ្រូបន្ទុកថ្នាក់ *', 'Homeroom Teacher Name *')}
              </label>
              <input
                type="text"
                required
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-moul text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('លេខទូរស័ព្ទគ្រូ', 'Teacher Phone Number')}
              </label>
              <input
                type="text"
                value={formData.teacherPhone}
                onChange={(e) => setFormData({ ...formData, teacherPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t('ថ្នាក់ទី', 'Grade Level')}
                </label>
                <input
                  type="text"
                  value={formData.teacherLevel}
                  onChange={(e) => setFormData({ ...formData, teacherLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {t('បន្ទប់', 'Room')}
                </label>
                <input
                  type="text"
                  value={formData.teacherRoom}
                  onChange={(e) => setFormData({ ...formData, teacherRoom: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('ឆ្នាំសិក្សា (Academic Year)', 'Academic Year')}
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Data Management & Backup */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-4 h-4 text-blue-500" />
            <h3 className="font-moul text-xs text-slate-900 dark:text-white">
              {t('៣. គ្រប់គ្រងទិន្នន័យ និងបម្រុងទុក (Data & Backup)', '3. Data Backup & System Recovery')}
            </h3>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed">
            {t(
              'ទិន្នន័យទាំងអស់ត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិក្នងកុំព្យូទ័ររបស់អ្នក (Offline-first Local Storage)។ លោកគ្រូ/អ្នកគ្រូអាចទាញយកឯកសារបម្រុងទុក (JSON) ដើម្បីផ្ទេរទៅឧបករណ៍ផ្សេង ឬរក្សាទុកប្រចាំសប្តាហ៍។',
              'All classroom data is persistently auto-saved in your local browser storage. You can export a full JSON backup to transfer to another computer or restore previous records.'
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={exportBackupJson}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-blue-500" />
              <span>{t('ទាញយកទិន្នន័យ (Backup JSON)', 'Export Backup (JSON)')}</span>
            </button>

            <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>{t('នាំចូលទិន្នន័យ (Restore)', 'Restore from JSON')}</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2 transition-colors ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('កំណត់ទិន្នន័យឡើងវិញ', 'Reset to Defaults')}</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Save className="w-4 h-4" />
            <span>{t('រក្សាទុកការកំណត់', 'Save Configuration')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
