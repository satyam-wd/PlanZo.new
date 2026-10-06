import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SidebarNav } from './components/SidebarNav';
import { TopHeader } from './components/TopHeader';
import { HomeOverview } from './components/HomeOverview';
import { DailyTimeline } from './components/DailyTimeline';
import { TasksView } from './components/TasksView';
import { ScheduleView } from './components/ScheduleView';
import { ProjectsView } from './components/ProjectsView';
import { ProfileView } from './components/ProfileView';
import { AcademicHub } from './components/AcademicHub';
import { AttendanceTracker } from './components/AttendanceTracker';
import { AnalyticsView } from './components/AnalyticsView';
import { SarthiAiView } from './components/SarthiAiView';
import { SettingsView } from './components/SettingsView';
import { ZenModeModal } from './components/ZenModeModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ResourceModal } from './components/ResourceModal';
import { SubjectAttendanceFolderModal } from './components/SubjectAttendanceFolderModal';
import { AuthGatewayScreen } from './components/AuthGatewayScreen';
import { PersonalizationSetupWizard } from './components/PersonalizationSetupWizard';
import { StudentAiChatbotModal } from './components/StudentAiChatbotModal';
import { ScheduleTaskModal } from './components/ScheduleTaskModal';
import { StreakModal } from './components/StreakModal';
import { XpModal } from './components/XpModal';
import { LofiAudioModal } from './components/LofiAudioModal';
import { Bot, ArrowLeft } from 'lucide-react';

const PlanZoMain: React.FC = () => {
  const {
    activeView,
    setActiveView,
    profile,
    currentUser,
    isPersonalizationWizardOpen,
    setIsPersonalizationWizardOpen,
  } = useApp();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAiChatbotOpen, setIsAiChatbotOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState(false);
  const [isLofiModalOpen, setIsLofiModalOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('planzo_theme');
    if (saved) return saved === 'dark';
    return true;
  });

  // Apply dark class to html document and body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('planzo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('planzo_theme', 'light');
    }
  }, [isDarkMode]);

  // GATEWAY AUTHENTICATION CHECK (Protected Routes Guard):
  if (!currentUser || !currentUser.isAuthenticated) {
    return (
      <div className={`${isDarkMode ? 'dark' : ''} min-h-screen w-full max-w-full overflow-x-hidden bg-[#07111F] text-white font-sans transition-colors`}>
        <AuthGatewayScreen isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen w-full max-w-full overflow-x-hidden bg-stone-50/80 dark:bg-[#07111F] text-stone-900 dark:text-stone-100 font-sans transition-colors selection:bg-[#6C4DFF]/30 flex`}>
      
      {/* 1. Global Left Sidebar Navigation */}
      <SidebarNav
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* 2. Main Application Workspace (Offset by sidebar width on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        
        {/* Sticky Top Header */}
        <TopHeader
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
          onOpenXpModal={() => setIsXpModalOpen(true)}
          onOpenLofiModal={() => setIsLofiModalOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Back button if in detail sub-view */}
          {activeView !== 'home' && (
            <div className="flex items-center justify-between pb-1 border-b border-stone-100 dark:border-[#1E2E4A]">
              <button
                onClick={() => setActiveView('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-[#93A4C1] hover:text-[#6C4DFF] dark:hover:text-[#3B9CFF] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Command Center</span>
              </button>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-[#687D9C]">
                Planzo / {activeView === 'home' ? 'dashboard' : activeView === 'schedule' ? 'calendar' : activeView}
              </span>
            </div>
          )}

          {/* Primary View Switcher */}
          <div>
            {activeView === 'home' && <HomeOverview />}
            {activeView === 'timeline' && <DailyTimeline />}
            {activeView === 'tasks' && <TasksView onOpenAddTaskModal={() => setIsScheduleModalOpen(true)} />}
            {activeView === 'schedule' && <ScheduleView onOpenAddTaskModal={() => setIsScheduleModalOpen(true)} />}
            {activeView === 'projects' && <ProjectsView />}
            {activeView === 'profile' && <ProfileView />}
            {activeView === 'attendance' && <AttendanceTracker />}
            {activeView === 'academic' && <AcademicHub />}
            {activeView === 'analytics' && <AnalyticsView />}
            {activeView === 'ai' && <SarthiAiView />}
            {activeView === 'settings' && <SettingsView isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
          </div>

        </main>

        {/* Clean Startup Footer */}
        <footer className="mt-auto border-t border-stone-200/80 dark:border-[#1E2E4A] py-5 bg-white/40 dark:bg-[#0B1324]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-[#93A4C1]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-800 dark:text-white">Planzo</span>
              <span>·</span>
              <span className="text-[#6C4DFF] dark:text-[#3B9CFF] font-medium">
                Plan Smarter. Do Better.
              </span>
            </div>
            <div className="text-[11px] font-mono text-stone-400 dark:text-[#687D9C]">
              {profile.customCollege || profile.college || 'Planzo Workspace'} · Protected Session
            </div>
          </div>
        </footer>

      </div>

      {/* Floating Sarthi AI Quick Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsAiChatbotOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] hover:from-[#5B3DF5] hover:to-[#298CEB] text-white shadow-lg shadow-[#6C4DFF]/30 border border-white/15 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Open Sarthi AI Copilot"
        >
          <div className="relative">
            <Bot className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#07111F]" />
          </div>
          <span className="text-xs font-bold tracking-tight">Sarthi AI</span>
        </button>
      </div>

      {/* Global Modals */}
      <ZenModeModal />
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <ResourceModal />
      <SubjectAttendanceFolderModal />
      <PersonalizationSetupWizard
        isOpen={isPersonalizationWizardOpen}
        onClose={() => setIsPersonalizationWizardOpen(false)}
      />
      <StudentAiChatbotModal
        isOpen={isAiChatbotOpen}
        onClose={() => setIsAiChatbotOpen(false)}
      />
      <ScheduleTaskModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
      />
      <XpModal
        isOpen={isXpModalOpen}
        onClose={() => setIsXpModalOpen(false)}
      />
      <LofiAudioModal
        isOpen={isLofiModalOpen}
        onClose={() => setIsLofiModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PlanZoMain />
    </AppProvider>
  );
}


