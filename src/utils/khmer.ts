import { SubjectConfig } from '../types/classroom';

const KHMER_NUMBERS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
const ARABIC_TO_KHMER: Record<string, string> = {
  '0': '០', '1': '១', '2': '២', '3': '៣', '4': '៤',
  '5': '៥', '6': '៦', '7': '៧', '8': '៨', '9': '៩',
};
const KHMER_TO_ARABIC: Record<string, string> = {
  '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4',
  '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9',
};

export const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

export const KHMER_DAYS = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
export const KHMER_DAYS_SHORT = ['អា', 'ច', 'អ', 'ពុ', 'ព្រ', 'សុ', 'ស'];

export function toKhmerNum(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '';
  return String(val).replace(/[0-9]/g, (digit) => ARABIC_TO_KHMER[digit] || digit);
}

export function toArabicNum(val: string | undefined | null): string {
  if (!val) return '';
  return String(val).replace(/[០-៩]/g, (digit) => KHMER_TO_ARABIC[digit] || digit);
}

export function formatNumberWithNumPref(val: number | string, useKhmer: boolean): string {
  return useKhmer ? toKhmerNum(val) : String(val);
}

export function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const parts = dob.replace(/T.*$/, '').split(/[-/]/);
  if (parts.length < 3) return null;
  let year = parseInt(parts[0].length === 4 ? parts[0] : parts[2], 10);
  if (isNaN(year)) return null;
  const currentYear = new Date().getFullYear();
  return currentYear - year;
}

export function formatKhmerDate(dateStr: string, useKhmerNum = true): string {
  if (!dateStr) return '';
  const clean = dateStr.replace(/T.*$/, '').replace(/[/]/g, '-');
  const parts = clean.split('-');
  if (parts.length < 3) return dateStr;

  let y = parts[0].length === 4 ? parts[0] : parts[2];
  let m = parseInt(parts[1], 10);
  let d = parts[0].length === 4 ? parts[2] : parts[0];

  const monthName = (m >= 1 && m <= 12) ? KHMER_MONTHS[m - 1] : parts[1];
  const dayStr = useKhmerNum ? toKhmerNum(parseInt(d, 10)) : d;
  const yearStr = useKhmerNum ? toKhmerNum(y) : y;

  return `ថ្ងៃទី ${dayStr} ខែ ${monthName} ឆ្នាំ ${yearStr}`;
}

export function getKhmerSolarDate(dateObj: Date = new Date(), useKhmer = true): string {
  const d = dateObj.getDate();
  const m = dateObj.getMonth();
  const y = dateObj.getFullYear();
  const dayStr = useKhmer ? toKhmerNum(d) : String(d);
  const yearStr = useKhmer ? toKhmerNum(y) : String(y);
  return `ថ្ងៃទី ${dayStr} ខែ ${KHMER_MONTHS[m]} ឆ្នាំ ${yearStr}`;
}

export function getKhmerLunarDate(dateObj: Date = new Date()): string {
  const solarYear = dateObj.getFullYear();
  const solarMonth = dateObj.getMonth() + 1;
  const solarDay = dateObj.getDate();
  const dayName = KHMER_DAYS[dateObj.getDay()];

  const animals = ['ជូត', 'ឆ្លូវ', 'ខាល', 'ថោះ', 'រោង', 'ម្សាញ់', 'មមី', 'មមែ', 'វក', 'រកា', 'ច', 'កុរ'];
  const animalYear = animals[(solarYear + 8) % 12];
  const beYear = toKhmerNum(solarYear + 543 + (solarMonth >= 5 ? 1 : 0));

  let lunarDayNum = solarDay % 15 || 15;
  let phase = solarDay <= 15 ? 'កើត' : 'រោច';
  let monthIndex = (solarMonth + 9) % 12;
  const lunarMonthNames = [
    'មិគសិរ', 'បុស្ស', 'មាឃ', 'ផល្គុន', 'ចេត្រ', 'ពិសាខ',
    'ជេស្ឋ', 'អាសាឍ', 'ស្រាពណ៍', 'ភទ្របទ', 'អស្សុជ', 'កត្តិក'
  ];
  const lunarMonth = lunarMonthNames[monthIndex];

  return `ថ្ងៃ${dayName} ${toKhmerNum(lunarDayNum)}${phase} ខែ${lunarMonth} ឆ្នាំ${animalYear} ព.ស.${beYear}`;
}

export function getMoEYSGrade(avg: number): {
  letter: string;
  mentionKh: string;
  mentionEn: string;
  color: string;
  badgeBg: string;
} {
  if (avg >= 9.5) {
    return { letter: 'A', mentionKh: 'ល្អណាស់', mentionEn: 'Excellent', color: 'text-emerald-700', badgeBg: 'bg-emerald-50 border-emerald-200' };
  } else if (avg >= 8.0) {
    return { letter: 'B', mentionKh: 'ល្អ', mentionEn: 'Very Good', color: 'text-indigo-700', badgeBg: 'bg-indigo-50 border-indigo-200' };
  } else if (avg >= 6.5) {
    return { letter: 'C', mentionKh: 'ល្អបង្គួរ', mentionEn: 'Good', color: 'text-blue-700', badgeBg: 'bg-blue-50 border-blue-200' };
  } else if (avg >= 5.0) {
    return { letter: 'D', mentionKh: 'មធ្យម', mentionEn: 'Satisfactory', color: 'text-amber-700', badgeBg: 'bg-amber-50 border-amber-200' };
  } else if (avg > 0) {
    return { letter: 'F', mentionKh: 'ខ្សោយ', mentionEn: 'Needs Improvement', color: 'text-rose-700', badgeBg: 'bg-rose-50 border-rose-200' };
  }
  return { letter: '-', mentionKh: '-', mentionEn: '-', color: 'text-slate-400', badgeBg: 'bg-slate-50 border-slate-200' };
}

export const PRIMARY_SUBJECTS: SubjectConfig[] = [
  { key: 'k_listen', nameKh: 'ស្តាប់', nameEn: 'Listening', groupKh: 'ភាសាខ្មែរ', groupEn: 'Khmer Language', maxScore: 10 },
  { key: 'k_write', nameKh: 'សរសេរ', nameEn: 'Writing', groupKh: 'ភាសាខ្មែរ', groupEn: 'Khmer Language', maxScore: 10 },
  { key: 'k_read', nameKh: 'អាន', nameEn: 'Reading', groupKh: 'ភាសាខ្មែរ', groupEn: 'Khmer Language', maxScore: 10 },
  { key: 'k_compose', nameKh: 'តែងសេចក្តី', nameEn: 'Composition', groupKh: 'ភាសាខ្មែរ', groupEn: 'Khmer Language', maxScore: 10 },
  { key: 'm_num', nameKh: 'ចំនួន និងលេខនព្វន្ត', nameEn: 'Numbers & Arithmetic', groupKh: 'គណិតវិទ្យា', groupEn: 'Mathematics', maxScore: 10 },
  { key: 'm_measure', nameKh: 'រង្វាស់រង្វាល់', nameEn: 'Measurement', groupKh: 'គណិតវិទ្យា', groupEn: 'Mathematics', maxScore: 10 },
  { key: 'm_geo', nameKh: 'ធរណីមាត្រ', nameEn: 'Geometry', groupKh: 'គណិតវិទ្យា', groupEn: 'Mathematics', maxScore: 10 },
  { key: 'm_alg', nameKh: 'ពីជគណិត', nameEn: 'Algebra', groupKh: 'គណិតវិទ្យា', groupEn: 'Mathematics', maxScore: 10 },
  { key: 'm_stat', nameKh: 'ស្ថិតិ', nameEn: 'Statistics', groupKh: 'គណិតវិទ្យា', groupEn: 'Mathematics', maxScore: 10 },
  { key: 's_phy_chem', nameKh: 'រូបវិទ្យា & គីមីវិទ្យា', nameEn: 'Physics & Chem', groupKh: 'វិទ្យាសាស្ត្រ', groupEn: 'Science', maxScore: 10 },
  { key: 's_bio_earth', nameKh: 'ជីវវិទ្យា & ផែនដី', nameEn: 'Bio & Earth', groupKh: 'វិទ្យាសាស្ត្រ', groupEn: 'Science', maxScore: 10 },
  { key: 'ss_moral', nameKh: 'សីលធម៌-ពលរដ្ឋ', nameEn: 'Civics & Morals', groupKh: 'សិក្សាសង្គម', groupEn: 'Social Studies', maxScore: 10 },
  { key: 'ss_geo_hist', nameKh: 'ភូមិវិទ្យា & ប្រវត្តិ', nameEn: 'Geo & History', groupKh: 'សិក្សាសង្គម', groupEn: 'Social Studies', maxScore: 10 },
  { key: 'pe_sport', nameKh: 'អប់រំកាយ & កីឡា', nameEn: 'Physical Ed & Sport', groupKh: 'អប់រំកាយ-សុខភាព', groupEn: 'PE & Health', maxScore: 10 },
  { key: 'life_skill', nameKh: 'អប់រំបំណិនជីវិត', nameEn: 'Life Skills', groupKh: 'បំណិនជីវិត', groupEn: 'Life Skills', maxScore: 10 },
  { key: 'foreign_lang', nameKh: 'ភាសាបរទេស (English)', nameEn: 'Foreign Language', groupKh: 'ភាសាបរទេស', groupEn: 'Foreign Language', maxScore: 10 },
];
