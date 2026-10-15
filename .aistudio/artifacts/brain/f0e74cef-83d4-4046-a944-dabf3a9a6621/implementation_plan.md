# ClassroomOS | ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀនឌីជីថល (Classroom Management Suite)

A modern, minimalist, production-grade Classroom Management System built for teachers and school administrators. Re-architects the legacy monolithic portal into a sleek, responsive React 19 application featuring real-time reactive calculations, keyboard-driven data entry, bilingual Khmer/English support, MoEYS Cambodian educational standards, and live user activity tracking.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following recommended architecture decisions will be implemented based on your request for minimalist design, intuitive navigation, and real-time updates:

- **Confirmed Decision 1 (Unified Minimalist Workspace)**: Replace cluttered multi-card frames with a single-tier, clean workspace canvas featuring a collapsible sidebar, contextual breadcrumb top bar, and quick action palette (`Cmd/Ctrl + K`) for instant navigation between Students, Attendance, Gradebook, Rankings, Library, and Tracking Books.
- **Confirmed Decision 2 (Real-Time Reactive State & Activity Engine)**: Every score input, attendance toggle, and student update triggers instant reactive recalculations (ranks, averages, attendance percentages) alongside a live activity stream and auto-save indicator.
- **Confirmed Decision 3 (Bilingual Khmer & English with MoEYS Standards)**: Full typography support using Google Fonts (`Moul` for ceremonial headers and `Siemreap` / `Plus Jakarta Sans` for readable tables), with instant toggle between Khmer numerals (១, ២, ៣) and Western numerals (1, 2, 3), and Cambodian MoEYS grading scales.

---

## 1. Overview & Core Concept

- **What It Does**: ClassroomOS provides homeroom teachers with a unified command center to manage student registries, record daily attendance in seconds, enter multi-subject monthly and semester exam marks, view real-time ranked gradebooks, manage textbook loans, and generate print-ready MoEYS-compliant official reports and Honor Certificates.
- **Target Audience**: Primary and secondary teachers, academic coordinators, and school administrators in Cambodia who need quick, effortless tracking without repetitive manual calculations or bloated software.
- **Key Value**: Drastically cuts administrative friction down from hours to minutes through lightning-fast keyboard-driven data entry (Excel-style arrow navigation), instant zero-latency ranking calculation, and clean printable A4 landscape/portrait documents.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Teacher Dashboard & Real-Time Pulse**:
   - View classroom health at a glance: Total enrollment, gender ratio, attendance rate for today, class average, top performers, and live activity stream.
   - Quick action shortcuts to record today's attendance, input test scores, or register a new student.
2. **Student Roster & Profiles**:
   - Filterable, searchable student list with instant status toggles (Active / Dropped / Scholarship / ID Poor).
   - Fast modal/slide-over to edit student bio, parent contacts, address, and student portrait.
3. **Daily Real-Time Attendance Tracker**:
   - Monthly grid (Days 1–31) with rapid status toggling: Present, Permission (ច្បាប់ - ច្ប), Unexcused (អត់ច្បាប់ - អច្ប), Sick (ឈឺ - ឈ), and Holiday/Break (៖).
   - Quick Batch Actions: "Mark All Present", "Mark Class Holiday", and rapid single-day entry popup with mobile touch-friendly buttons.
   - Live recalculation of actual school days, attendance %, and absenteeism summary.
4. **Interactive Gradebook & Scores**:
   - Multi-period modes: Monthly tests, Semester 1 & 2 exams with automated monthly average weighting, and Annual final standings.
   - Excel-like arrow key navigation (`Up`, `Down`, `Left`, `Right`, `Enter`) with multi-cell selection.
   - Live score validation (color-coded passing/failing marks) and instant class rank assignment with tie handling.
5. **Honor Board & Official Certification**:
   - Top 3 / Top 5 student honor boards with customizable themes (Royal Gold, Academic Blue, Minimal Slate).
   - One-click print preparation for official Ministry of Education report cards and attendance booklets.
6. **Classroom Library & Textbook Loans**:
   - Track core subject books borrowed by each student with return status and condition notes.

### Visual Identity & Theme
- **Color Palette & Discipline (60-30-10)**:
  - *60% Canvas*: Clean crisp neutral slate (`bg-slate-50` light, `bg-slate-900` dark).
  - *30% Structure*: Refined white cards (`bg-white` / `bg-slate-800`), 1px hairline borders (`border-slate-200` / `border-slate-700/60`), muted metadata text.
  - *10% Purposeful Accents*: High-intent Indigo/Blue (`#4F46E5`, `#2563EB`) for primary focus, Emerald (`#10B981`) for passing/attendance, Rose (`#F43F5E`) for absences/failing marks, and Amber (`#F59E0B`) for honors and awards.
- **Typography & Scale**:
  - Headings: `Khmer OS Muol Light` / `Moul` for Khmer title gravity; `Plus Jakarta Sans` for English display.
  - Body & Tables: `Siemreap` / `Plus Jakarta Sans` for crisp scannability.
  - Data Numerals: `font-mono tabular-nums` for rock-solid tabular alignment.
- **Zero-Pill & Anti-Slop Discipline**:
  - No bloated candy pills for static metadata; metadata is separated with quiet typographic marks (`·`, `/`).
  - No decorative pulsing dots or pseudo-technical tickers.
  - Functional buttons use clean segmented controls and clear labels.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular TypeScript React Architecture vs. Monolithic HTML**:
  - *Chosen*: Transform the unstructured 2000-line vanilla JS prototype into a clean, modular component architecture (hooks for attendance, scores, students, state machine for undo/redo, real-time activity log).
  - *Why*: Eliminates DOM race conditions, ensures TypeScript type safety, prevents calculation bugs, and allows seamless mobile responsiveness.
- **Decision 2: Local-First Reactive State with Offline Fallback & JSON Sync**:
  - *Chosen*: Implement a reactive in-memory state engine backed by `localStorage` with automated debounced saving, snapshot versioning, and JSON import/export.
  - *Why*: Teachers often work in low-connectivity classroom environments; the app must never freeze, lose data on network dropouts, or require cumbersome server round-trips for routine score edits.
- **Decision 3: Universal Print & Export Engine**:
  - *Chosen*: Dedicated CSS print media stylesheets formatted for standard A4 landscape and portrait, ensuring zero layout truncation when printing or exporting to PDF/Excel.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ClassroomOS App Container                       │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │   Navigation Sidebar  │  │        Header & Command Bar           │  │
│  │   - Dashboard         │  │   - Breadcrumbs & Year Selector       │  │
│  │   - Students          │  │   - Quick Search (Cmd+K)              │  │
│  │   - Attendance        │  │   - Live Activity / Auto-save Status  │  │
│  │   - Scores & Grades   │  │   - Language & Numeral Toggle         │  │
│  │   - Honors & Awards   │  └───────────────────────────────────────┘  │
│  │   - Library Loans     │  ┌───────────────────────────────────────┐  │
│  │   - Settings          │  │         Main Viewport Canvas          │  │
│  └───────────────────────┘  │  [Dashboard | Students | Attendance   │  │
│                             │   Scores | Honors | Library | Settings]  │
│                             └───────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Reactive State & Storage Core                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────────────────┐ │
│  │  Students Store │ │ Attendance Data │ │  Scores & Calculation Hub │ │
│  └─────────────────┘ └─────────────────┘ └───────────────────────────┘ │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────────────────┐ │
│  │ Activity Logger │ │  Settings Store │ │ LocalStorage Auto-Sync    │ │
│  └─────────────────┘ └─────────────────┘ └───────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Entities & Schema
- **Student**: `id`, `name`, `gender`, `dob`, `grade`, `room`, `parentName`, `parentContact`, `village`, `commune`, `district`, `province`, `isPoor`, `hasScholarship`, `hasDisability`, `status ('Active' | 'Dropped')`, `photoUrl`.
- **AttendanceRecord**: `studentId`, `academicYear`, `month`, `records: { [day: number]: 'P' | 'ច្ប' | 'អច្ប' | 'ឈ' | '៖' }`.
- **ScoreRecord**: `studentId`, `periodType ('monthly' | 'semester' | 'annual')`, `periodValue`, `scores: { [subjectKey: string]: number }`, `monthlyAvg?`, `semesterAvg?`, `totalScore`, `average`, `rank`, `gradeLetter`, `evaluations`.
- **ActivityEvent**: `id`, `timestamp`, `type ('attendance' | 'score' | 'student' | 'system')`, `description`, `details`.

---

## 5. Implementation Sequence & Deliverables

1. **Foundation & Assets**:
   - Update `index.html` with Google Fonts (`Moul`, `Siemreap`, `Plus Jakarta Sans`) and synced metadata.
   - Configure global Tailwind design tokens and print utility classes.
2. **State & Domain Logic**:
   - Implement `types/classroom.ts` with comprehensive type definitions.
   - Build `hooks/useClassroomState.ts` managing students, real-time recalculations, rankings, attendance logs, and activity events.
   - Seed rich, authentic starter data (Cambodian primary & secondary student cohorts with realistic marks and attendance).
3. **Core Interface Components**:
   - `Sidebar` & `TopHeader` with minimalist layout, responsive mobile drawer, and Command Palette.
   - `DashboardView`: KPI statistics, live activity feed, quick attendance actions, and performance trends.
   - `StudentsView`: High-density roster, search & multi-field filter, and student add/edit modal.
   - `AttendanceView`: 31-day responsive matrix, quick daily marking modal, holiday scheduler, and MoEYS summary cards.
   - `ScoresView`: Full multi-subject gradebook with Excel navigation, live ranking engine, semester calculation, and report card exporter.
   - `HonorBoardView`: Interactive top student award certificates with customizable themes.
   - `LibraryView`: Textbook loan tracking by subject and condition.
   - `SettingsView`: School profile, homeroom teacher credentials, academic year, and data backup/restore.
4. **Verification & Polish**:
   - Run build and lint verification via `compile_applet`.
   - Validate responsive touch controls and printable layouts.
