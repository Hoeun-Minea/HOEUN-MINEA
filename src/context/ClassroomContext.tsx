import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Student,
  SchoolSettings,
  ScoreItem,
  AttendanceRecordMap,
  AttendanceStatus,
  LibraryLoan,
  ActivityEvent,
  ViewType,
  ScorePeriodType,
} from '../types/classroom';
import {
  INITIAL_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_SCORES,
  INITIAL_LOANS,
  INITIAL_ACTIVITIES,
} from '../data/initialData';
import { PRIMARY_SUBJECTS, getMoEYSGrade } from '../utils/khmer';

interface ClassroomContextType {
  // State
  students: Student[];
  attendance: AttendanceRecordMap;
  scores: Record<string, ScoreItem>;
  loans: LibraryLoan[];
  settings: SchoolSettings;
  activities: ActivityEvent[];
  currentView: ViewType;
  selectedMonth: string;
  selectedPeriodType: ScorePeriodType;
  selectedGrade: string;
  selectedRoom: string;
  language: 'km' | 'en';
  useKhmerNums: boolean;
  isDarkMode: boolean;
  isSyncing: boolean;
  lastSaved: string;
  isCommandPaletteOpen: boolean;
  isActivityDrawerOpen: boolean;

  // View & UI controls
  setCurrentView: (view: ViewType) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedPeriodType: (type: ScorePeriodType) => void;
  setSelectedGrade: (grade: string) => void;
  setSelectedRoom: (room: string) => void;
  setLanguage: (lang: 'km' | 'en') => void;
  setUseKhmerNums: (use: boolean | ((prev: boolean) => boolean)) => void;
  setIsDarkMode: (dark: boolean | ((prev: boolean) => boolean)) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsActivityDrawerOpen: (open: boolean) => void;
  t: (khmer: string, english: string) => string;

  // Student actions
  addStudent: (student: Omit<Student, 'id'> & { id?: string }) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  // Attendance actions
  updateAttendance: (studentId: string, day: number, status: AttendanceStatus) => void;
  markAllAttendanceForDay: (day: number, status: AttendanceStatus) => void;

  // Score actions
  updateStudentScore: (studentId: string, subjectKey: string, score: number) => void;
  recalculateScoresAndRanks: () => void;

  // Library actions
  addLoan: (loan: Omit<LibraryLoan, 'id'>) => void;
  updateLoan: (loan: LibraryLoan) => void;
  deleteLoan: (id: string) => void;

  // Settings & Storage actions
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  logActivity: (type: ActivityEvent['type'], messageKh: string, messageEn: string, badge?: string) => void;
  resetToDefaults: () => void;
  exportBackupJson: () => void;
  importBackupJson: (file: File) => Promise<boolean>;

  // Computed metrics
  classStats: {
    totalStudents: number;
    activeStudents: number;
    femaleCount: number;
    maleCount: number;
    scholarshipCount: number;
    poorCount: number;
    classAverage: number;
    attendanceRate: number;
    passingCount: number;
    failingCount: number;
  };
}

const ClassroomContext = createContext<ClassroomContextType | null>(null);

const STORAGE_KEYS = {
  STUDENTS: 'c_os_students_v2',
  ATTENDANCE: 'c_os_attendance_v2',
  SCORES: 'c_os_scores_v2',
  LOANS: 'c_os_loans_v2',
  SETTINGS: 'c_os_settings_v2',
  ACTIVITIES: 'c_os_activities_v2',
  LANG: 'c_os_language',
  NUMS: 'c_os_use_khmer_nums',
  THEME: 'c_os_theme',
};

export const ClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from Storage
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecordMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [scores, setScores] = useState<Record<string, ScoreItem>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCORES);
      return saved ? JSON.parse(saved) : INITIAL_SCORES;
    } catch {
      return INITIAL_SCORES;
    }
  });

  const [loans, setLoans] = useState<LibraryLoan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
      return saved ? JSON.parse(saved) : INITIAL_LOANS;
    } catch {
      return INITIAL_LOANS;
    }
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // UI States
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>('តុលា');
  const [selectedPeriodType, setSelectedPeriodType] = useState<ScorePeriodType>('monthly');
  const [selectedGrade, setSelectedGrade] = useState<string>('ថ្នាក់ទី ២');
  const [selectedRoom, setSelectedRoom] = useState<string>('«ខ»');

  const [language, setLanguage] = useState<'km' | 'en'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as 'km' | 'en') || 'km';
  });

  const [useKhmerNums, setUseKhmerNums] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NUMS);
    return saved !== null ? saved === 'true' : true;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'dark';
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string>('Auto-saved');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState<boolean>(false);

  // Sync to HTML element for Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Persist Preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NUMS, String(useKhmerNums));
  }, [useKhmerNums]);

  // Auto-Save Effect with debounced indication
  useEffect(() => {
    setIsSyncing(true);
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      } finally {
        setIsSyncing(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [students, attendance, scores, loans, settings, activities]);

  // Keyboard shortcut listener for Command Palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Bilingual translation helper
  const t = useCallback(
    (khmer: string, english: string) => {
      return language === 'km' ? khmer : english;
    },
    [language]
  );

  // Activity logger
  const logActivity = useCallback(
    (type: ActivityEvent['type'], messageKh: string, messageEn: string, badge?: string) => {
      const newEvent: ActivityEvent = {
        id: 'ACT-' + Date.now(),
        timestamp: 'Just now',
        type,
        messageKh,
        messageEn,
        badge,
      };
      setActivities((prev) => [newEvent, ...prev.slice(0, 49)]);
    },
    []
  );

  // Student Actions
  const addStudent = useCallback(
    (newStuData: Omit<Student, 'id'> & { id?: string }) => {
      const nextId = newStuData.id?.trim() || `STU-${100 + students.length + 1}`;
      const newStudent: Student = {
        ...newStuData,
        id: nextId,
        grade: newStuData.grade || selectedGrade,
        room: newStuData.room || selectedRoom,
        status: newStuData.status || 'Active',
      };

      setStudents((prev) => [newStudent, ...prev]);
      logActivity(
        'student',
        `បានចុះឈ្មោះសិស្សថ្មី៖ ${newStudent.name} (${newStudent.id})`,
        `Enrolled new student: ${newStudent.name} (${newStudent.id})`,
        'សិស្សថ្មី'
      );
    },
    [students.length, selectedGrade, selectedRoom, logActivity]
  );

  const updateStudent = useCallback(
    (updated: Student) => {
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      logActivity(
        'student',
        `បានកែប្រែទិន្នន័យសិស្ស៖ ${updated.name}`,
        `Updated profile for student: ${updated.name}`,
        'កែប្រែ'
      );
    },
    [logActivity]
  );

  const deleteStudent = useCallback(
    (id: string) => {
      const target = students.find((s) => s.id === id);
      const studentName = target ? target.name : id;
      setStudents((prev) => prev.filter((s) => s.id !== id));
      logActivity(
        'student',
        `បានលុបសិស្ស៖ ${studentName} ចេញពីបញ្ជី`,
        `Removed student: ${studentName} from roster`,
        'លុបសិស្ស'
      );
    },
    [students, logActivity]
  );

  // Attendance Actions
  const updateAttendance = useCallback(
    (studentId: string, day: number, status: AttendanceStatus) => {
      setAttendance((prev) => {
        const studentDays = { ...(prev[studentId] || {}) };
        if (!status) {
          delete studentDays[day];
        } else {
          studentDays[day] = status;
        }
        return {
          ...prev,
          [studentId]: studentDays,
        };
      });

      const student = students.find((s) => s.id === studentId);
      const sName = student ? student.name : studentId;
      logActivity(
        'attendance',
        `កត់វត្តមានសិស្ស ${sName} ថ្ងៃទី ${day} (${status || 'លុប'})`,
        `Updated attendance for ${sName} on day ${day} (${status || 'None'})`,
        'វត្តមាន'
      );
    },
    [students, logActivity]
  );

  const markAllAttendanceForDay = useCallback(
    (day: number, status: AttendanceStatus) => {
      setAttendance((prev) => {
        const updated = { ...prev };
        students.forEach((s) => {
          if (s.status === 'Active') {
            updated[s.id] = {
              ...(updated[s.id] || {}),
              [day]: status,
            };
          }
        });
        return updated;
      });

      const statusLabel = status === 'P' ? 'វត្តមានទាំងអស់' : status === '៖' ? 'ឈប់សម្រាក' : status;
      logActivity(
        'attendance',
        `បានកំណត់ថ្ងៃទី ${day} ជា ${statusLabel}`,
        `Batch marked day ${day} as ${statusLabel}`,
        'ស្រង់វត្តមាន'
      );
    },
    [students, logActivity]
  );

  // Score Actions & Instant Live Ranking Recalculation
  const recalculateScoresAndRanks = useCallback(() => {
    setScores((prev) => {
      const updated: Record<string, ScoreItem> = {};
      const activeStudents = students.filter((s) => s.status === 'Active');

      // 1. Calculate totals and averages
      const items: { studentId: string; totalScore: number; average: number }[] = [];

      activeStudents.forEach((stu) => {
        const existing = prev[stu.id] || {
          studentId: stu.id,
          scores: {},
          totalScore: 0,
          average: 0,
          rank: 0,
          gradeLetter: '-',
        };

        const subjectScores = existing.scores || {};
        let total = 0;
        let count = 0;

        PRIMARY_SUBJECTS.forEach((sub) => {
          const val = subjectScores[sub.key];
          if (val !== undefined && val !== null && !isNaN(val)) {
            total += val;
            count++;
          }
        });

        const avg = count > 0 ? total / count : 0;
        items.push({ studentId: stu.id, totalScore: total, average: avg });
      });

      // 2. Sort by average descending
      items.sort((a, b) => b.average - a.average);

      // 3. Assign ranks with tie handling
      let currentRank = 1;
      items.forEach((item, index) => {
        if (index > 0 && item.average === items[index - 1].average) {
          // Tie rank
          const prevItem = items[index - 1];
          const rank = updated[prevItem.studentId].rank;
          const { letter } = getMoEYSGrade(item.average);
          updated[item.studentId] = {
            ...(prev[item.studentId] || { studentId: item.studentId, scores: {} }),
            totalScore: Number(item.totalScore.toFixed(2)),
            average: Number(item.average.toFixed(2)),
            rank,
            gradeLetter: letter,
          };
        } else {
          currentRank = index + 1;
          const { letter } = getMoEYSGrade(item.average);
          updated[item.studentId] = {
            ...(prev[item.studentId] || { studentId: item.studentId, scores: {} }),
            totalScore: Number(item.totalScore.toFixed(2)),
            average: Number(item.average.toFixed(2)),
            rank: currentRank,
            gradeLetter: letter,
          };
        }
      });

      return updated;
    });
  }, [students]);

  const updateStudentScore = useCallback(
    (studentId: string, subjectKey: string, scoreVal: number) => {
      setScores((prev) => {
        const currentItem = prev[studentId] || {
          studentId,
          scores: {},
          totalScore: 0,
          average: 0,
          rank: 0,
          gradeLetter: '-',
        };

        const newScores = { ...currentItem.scores, [subjectKey]: scoreVal };
        let total = 0;
        let count = 0;

        PRIMARY_SUBJECTS.forEach((sub) => {
          const val = newScores[sub.key];
          if (val !== undefined && val !== null && !isNaN(val)) {
            total += val;
            count++;
          }
        });

        const avg = count > 0 ? total / count : 0;
        const { letter } = getMoEYSGrade(avg);

        const updatedScoreItem: ScoreItem = {
          ...currentItem,
          scores: newScores,
          totalScore: Number(total.toFixed(2)),
          average: Number(avg.toFixed(2)),
          gradeLetter: letter,
        };

        const nextScores = {
          ...prev,
          [studentId]: updatedScoreItem,
        };

        // Instant re-rank
        const activeIds = Object.keys(nextScores);
        const sorted = activeIds
          .map((id) => nextScores[id])
          .sort((a, b) => b.average - a.average);

        let rank = 1;
        sorted.forEach((item, idx) => {
          if (idx > 0 && item.average === sorted[idx - 1].average) {
            item.rank = sorted[idx - 1].rank;
          } else {
            item.rank = rank;
          }
          rank++;
          nextScores[item.studentId] = { ...item };
        });

        return nextScores;
      });

      const stu = students.find((s) => s.id === studentId);
      const name = stu ? stu.name : studentId;
      logActivity(
        'score',
        `បញ្ចូលពិន្ទុ ${scoreVal} មុខវិជ្ជា ${subjectKey} សម្រាប់សិស្ស ${name}`,
        `Entered score ${scoreVal} in ${subjectKey} for ${name}`,
        'ពិន្ទុ'
      );
    },
    [students, logActivity]
  );

  // Library Actions
  const addLoan = useCallback(
    (newLoan: Omit<LibraryLoan, 'id'>) => {
      const id = 'LOAN-' + (loans.length + 1).toString().padStart(2, '0');
      const item: LibraryLoan = { ...newLoan, id };
      setLoans((prev) => [item, ...prev]);
      logActivity(
        'library',
        `សិស្ស ${item.studentName} បានខ្ចីសៀវភៅ ${item.bookTitle}`,
        `${item.studentName} borrowed ${item.bookTitle}`,
        'បណ្ណាល័យ'
      );
    },
    [loans.length, logActivity]
  );

  const updateLoan = useCallback(
    (updated: LibraryLoan) => {
      setLoans((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      logActivity(
        'library',
        `បានកែប្រែកំណត់ត្រាសៀវភៅ៖ ${updated.bookTitle} (${updated.status})`,
        `Updated loan for ${updated.bookTitle} (${updated.status})`,
        'សៀវភៅ'
      );
    },
    [logActivity]
  );

  const deleteLoan = useCallback(
    (id: string) => {
      setLoans((prev) => prev.filter((l) => l.id !== id));
    },
    []
  );

  // Settings Actions
  const updateSettings = useCallback(
    (newSettings: Partial<SchoolSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      logActivity('system', 'បានរក្សាទុកការកំណត់សាលារៀន និងគ្រូបន្ទុកថ្នាក់', 'Saved school and teacher settings', 'ការកំណត់');
    },
    [logActivity]
  );

  const resetToDefaults = useCallback(() => {
    setStudents(INITIAL_STUDENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setScores(INITIAL_SCORES);
    setLoans(INITIAL_LOANS);
    setSettings(INITIAL_SETTINGS);
    setActivities(INITIAL_ACTIVITIES);
    logActivity('system', 'បានសម្អាត និងកំណត់ទិន្នន័យប្រព័ន្ធទៅលំនាំដើម', 'Reset all system data to initial state', 'កំណត់ដើម');
  }, [logActivity]);

  const exportBackupJson = useCallback(() => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      students,
      attendance,
      scores,
      loans,
      settings,
      activities,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ClassroomOS_Backup_${settings.academicYear}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [students, attendance, scores, loans, settings, activities]);

  const importBackupJson = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.students) setStudents(data.students);
        if (data.attendance) setAttendance(data.attendance);
        if (data.scores) setScores(data.scores);
        if (data.loans) setLoans(data.loans);
        if (data.settings) setSettings(data.settings);
        logActivity('system', 'បាននាំចូលទិន្នន័យបម្រុង (Backup Restore) ជោគជ័យ', 'Successfully restored database backup', 'នាំចូល');
        return true;
      } catch (err) {
        console.error('Import failed:', err);
        return false;
      }
    },
    [logActivity]
  );

  // Computed Real-Time Class Analytics
  const classStats = useMemo(() => {
    const active = students.filter((s) => s.status === 'Active');
    const total = active.length;
    const female = active.filter((s) => s.gender === 'ស្រី').length;
    const male = total - female;
    const scholarship = active.filter((s) => s.scholarship).length;
    const poor = active.filter((s) => s.poorId).length;

    let scoreSum = 0;
    let scoreCount = 0;
    let passing = 0;
    let failing = 0;

    active.forEach((s) => {
      const scoreItem = scores[s.id];
      if (scoreItem && scoreItem.average > 0) {
        scoreSum += scoreItem.average;
        scoreCount++;
        if (scoreItem.average >= 5.0) {
          passing++;
        } else {
          failing++;
        }
      }
    });

    const classAverage = scoreCount > 0 ? Number((scoreSum / scoreCount).toFixed(2)) : 0;

    // Attendance rate for month
    let totalPresent = 0;
    let totalRequired = 0;
    const daysEvaluated = 15; // default up to mid-month
    active.forEach((s) => {
      const att = attendance[s.id] || {};
      for (let d = 1; d <= daysEvaluated; d++) {
        const st = att[d];
        if (st && st !== '៖') {
          totalRequired++;
          if (st === 'P') totalPresent++;
        }
      }
    });

    const attendanceRate = totalRequired > 0 ? Number(((totalPresent / totalRequired) * 100).toFixed(1)) : 95.8;

    return {
      totalStudents: students.length,
      activeStudents: total,
      femaleCount: female,
      maleCount: male,
      scholarshipCount: scholarship,
      poorCount: poor,
      classAverage,
      attendanceRate,
      passingCount: passing,
      failingCount: failing,
    };
  }, [students, scores, attendance]);

  const value = {
    students,
    attendance,
    scores,
    loans,
    settings,
    activities,
    currentView,
    selectedMonth,
    selectedPeriodType,
    selectedGrade,
    selectedRoom,
    language,
    useKhmerNums,
    isDarkMode,
    isSyncing,
    lastSaved,
    isCommandPaletteOpen,
    isActivityDrawerOpen,
    setCurrentView,
    setSelectedMonth,
    setSelectedPeriodType,
    setSelectedGrade,
    setSelectedRoom,
    setLanguage,
    setUseKhmerNums,
    setIsDarkMode,
    setIsCommandPaletteOpen,
    setIsActivityDrawerOpen,
    t,
    addStudent,
    updateStudent,
    deleteStudent,
    updateAttendance,
    markAllAttendanceForDay,
    updateStudentScore,
    recalculateScoresAndRanks,
    addLoan,
    updateLoan,
    deleteLoan,
    updateSettings,
    logActivity,
    resetToDefaults,
    exportBackupJson,
    importBackupJson,
    classStats,
  };

  return <ClassroomContext.Provider value={value}>{children}</ClassroomContext.Provider>;
};

export function useClassroom(): ClassroomContextType {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within a ClassroomProvider');
  }
  return context;
}
