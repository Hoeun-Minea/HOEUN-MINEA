import React, { useState } from 'react';
import { X, Activity, CalendarCheck, FileSpreadsheet, User, BookOpen, Layers } from 'lucide-react';
import { useClassroom } from '../context/ClassroomContext';
import { ActivityEvent } from '../types/classroom';

export const ActivityDrawer: React.FC = () => {
  const { isActivityDrawerOpen, setIsActivityDrawerOpen, activities, t, language } = useClassroom();
  const [filterType, setFilterType] = useState<string>('all');

  if (!isActivityDrawerOpen) return null;

  const filteredEvents = filterType === 'all'
    ? activities
    : activities.filter((a) => a.type === filterType);

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'attendance':
        return <CalendarCheck className="w-4 h-4 text-emerald-500" />;
      case 'score':
        return <FileSpreadsheet className="w-4 h-4 text-blue-500" />;
      case 'student':
        return <User className="w-4 h-4 text-indigo-500" />;
      case 'library':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-moul text-xs text-slate-900 dark:text-white">
                {t('កំណត់ត្រាសកម្មភាពផ្ទាល់', 'Real-Time Activity Stream')}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {activities.length} {t('សកម្មភាពថ្មីៗ', 'recent system events')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsActivityDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Segmented Control */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-1 overflow-x-auto">
          {[
            { id: 'all', labelKh: 'ទាំងអស់', labelEn: 'All' },
            { id: 'attendance', labelKh: 'វត្តមាន', labelEn: 'Attendance' },
            { id: 'score', labelKh: 'ពិន្ទុ', labelEn: 'Scores' },
            { id: 'student', labelKh: 'សិស្ស', labelEn: 'Students' },
            { id: 'library', labelKh: 'សៀវភៅ', labelEn: 'Loans' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {t(f.labelKh, f.labelEn)}
            </button>
          ))}
        </div>

        {/* Timeline Events List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              {t('មិនទាន់មានសកម្មភាពថ្មីនៅឡើយទេ', 'No recent activities found')}
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 text-xs group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(evt.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {language === 'km' ? evt.messageKh : evt.messageEn}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {evt.timestamp}
                    </span>
                  </div>
                  {evt.badge && (
                    <span className="inline-block mt-1 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {evt.badge}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
