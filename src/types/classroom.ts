export type ViewType =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'scores'
  | 'honors'
  | 'library'
  | 'settings';

export type AttendanceStatus = '' | 'P' | 'ច្ប' | 'អច្ប' | 'ឈ' | '៖';

export interface Student {
  id: string;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  dob: string;
  grade: string;
  room: string;
  pobVillage?: string;
  pobCommune?: string;
  pobDistrict?: string;
  pobProvince?: string;
  currVillage?: string;
  currCommune?: string;
  currDistrict?: string;
  currProvince?: string;
  fatherName?: string;
  fatherJob?: string;
  motherName?: string;
  motherJob?: string;
  parentContact?: string;
  poorId?: boolean;
  scholarship?: boolean;
  disability?: boolean;
  status: 'Active' | 'Dropped';
  photoUrl?: string;
}

export interface SubjectConfig {
  key: string;
  nameKh: string;
  nameEn: string;
  groupKh: string;
  groupEn: string;
  maxScore: number;
}

export type ScorePeriodType = 'monthly' | 'semester' | 'annual';

export interface ScoreItem {
  studentId: string;
  scores: Record<string, number>;
  monthlyAvg?: number;
  totalScore: number;
  average: number;
  rank: number;
  gradeLetter: string;
  evalKnowledge?: string;
  evalSkill?: string;
  evalMoral?: string;
  evalSolidarity?: string;
}

export interface AttendanceRecordMap {
  [studentId: string]: Record<number, AttendanceStatus>;
}

export interface HolidayMap {
  [day: number]: {
    type: 'holiday' | 'sunday' | 'meeting' | 'other';
    title: string;
  };
}

export interface LibraryLoan {
  id: string;
  studentId: string;
  studentName: string;
  bookTitle: string;
  borrowDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'lost';
  condition: 'new' | 'good' | 'fair' | 'damaged';
  notes?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'attendance' | 'score' | 'student' | 'library' | 'system';
  messageKh: string;
  messageEn: string;
  badge?: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolNameEn: string;
  schoolCode: string;
  schoolType: string;
  cluster: string;
  principalName: string;
  academicYear: string;
  schoolContact: string;
  province: string;
  district: string;
  commune: string;
  village: string;
  teacherName: string;
  teacherPhone: string;
  teacherLevel: string;
  teacherRoom: string;
  autoSync: boolean;
  logoUrl?: string;
  signatureUrl?: string;
}
