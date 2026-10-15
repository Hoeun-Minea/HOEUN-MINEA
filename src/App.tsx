import React, { useState } from 'react';
import { ClassroomProvider, useClassroom } from './context/ClassroomContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CommandPalette } from './components/CommandPalette';
import { ActivityDrawer } from './components/ActivityDrawer';
import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { AttendanceView } from './components/views/AttendanceView';
import { ScoresView } from './components/views/ScoresView';
import { HonorsView } from './components/views/HonorsView';
import { LibraryView } from './components/views/LibraryView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { currentView } = useClassroom();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-siemreap text-slate-800 dark:text-slate-100 transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((p) => !p)} />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-white dark:bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar collapsed={false} onToggleCollapse={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader onToggleMobileMenu={() => setMobileMenuOpen((p) => !p)} />

        {/* Scrollable Viewport Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1440px] mx-auto min-h-full">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'students' && <StudentsView />}
            {currentView === 'attendance' && <AttendanceView />}
            {currentView === 'scores' && <ScoresView />}
            {currentView === 'honors' && <HonorsView />}
            {currentView === 'library' && <LibraryView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Modals & Slide-overs */}
      <CommandPalette />
      <ActivityDrawer />
    </div>
  );
};

export default function App() {
  return (
    <ClassroomProvider>
      <MainLayout />
    </ClassroomProvider>
  );
}
