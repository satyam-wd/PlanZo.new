// Planzo Sidebar Navigation
import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  ShieldCheck,
  BookOpen,
  BarChart2,
  Bot,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
  FolderKanban,
  Calendar,
  User,
  Sliders,
} from 'lucide-react';

interface SidebarNavProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavItem {
  id: 'home' | 'tasks' | 'schedule' | 'projects' | 'profile' | 'settings' | 'timeline' | 'attendance' | 'academic' | 'analytics' | 'ai';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isMobileOpen,
  setIsMobileOpen,
  isDarkMode,
  setIsDarkMode,
}) => {
  const { activeView, setActiveView, profile, currentUser, signOut, setIsPersonalizationWizardOpen } = useApp();

  const primaryNav: NavItem[] = [
    { id: 'home', label: 'Command Center', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'schedule', label: 'Calendar', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'timeline', label: 'Daily Timeline', icon: Clock },
    { id: 'attendance', label: 'Attendance', icon: ShieldCheck },
    { id: 'academic', label: 'Academics', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'ai', label: 'Sarthi AI', icon: Bot, badge: 'Copilot' },
  ];

  const handleNavClick = (viewId: any) => {
    setActiveView(viewId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#050C17]/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#0B1324] border-r border-stone-200/80 dark:border-[#1E2E4A] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: Brand Wordmark */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-stone-100 dark:border-[#1E2E4A]/80">
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C4DFF] to-[#3B9CFF] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-md shadow-[#6C4DFF]/25">
                P
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-stone-900 dark:text-white tracking-tight text-base font-display">
                    Planzo
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#6C4DFF]/15 text-[#6C4DFF] dark:text-[#A491FF] font-bold">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 dark:text-[#687D9C] font-medium truncate max-w-[140px]">
                  Plan Smarter. Do Better.
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-225px)] scrollbar-none">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#687D9C]">
              Workspace
            </div>

            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6C4DFF]/15 to-[#3B9CFF]/10 text-[#6C4DFF] dark:text-white border border-[#6C4DFF]/30 font-bold shadow-xs'
                      : 'text-stone-600 dark:text-[#93A4C1] hover:bg-stone-100/80 dark:hover:bg-[#111E36]/80 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#6C4DFF] dark:text-[#3B9CFF]' : 'text-stone-400 dark:text-[#687D9C]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#6C4DFF]/15 text-[#6C4DFF] dark:text-[#A491FF]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#687D9C]">
              Account & System
            </div>

            <button
              onClick={() => handleNavClick('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'profile'
                  ? 'bg-gradient-to-r from-[#6C4DFF]/15 to-[#3B9CFF]/10 text-[#6C4DFF] dark:text-white border border-[#6C4DFF]/30 font-bold'
                  : 'text-stone-600 dark:text-[#93A4C1] hover:bg-stone-100/80 dark:hover:bg-[#111E36]/80 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <User className={`w-4 h-4 ${activeView === 'profile' ? 'text-[#6C4DFF] dark:text-[#3B9CFF]' : 'text-stone-400 dark:text-[#687D9C]'}`} />
              <span>Profile</span>
            </button>

            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'settings'
                  ? 'bg-gradient-to-r from-[#6C4DFF]/15 to-[#3B9CFF]/10 text-[#6C4DFF] dark:text-white border border-[#6C4DFF]/30 font-bold'
                  : 'text-stone-600 dark:text-[#93A4C1] hover:bg-stone-100/80 dark:hover:bg-[#111E36]/80 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeView === 'settings' ? 'text-[#6C4DFF] dark:text-[#3B9CFF]' : 'text-stone-400 dark:text-[#687D9C]'}`} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setIsPersonalizationWizardOpen(true);
                if (isMobileOpen) setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#6C4DFF] dark:text-[#A491FF] bg-[#6C4DFF]/10 hover:bg-[#6C4DFF]/20 border border-[#6C4DFF]/20 transition-colors cursor-pointer mt-1"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-[#6C4DFF] dark:text-[#3B9CFF]" />
                <span>Routine Setup</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#6C4DFF] text-white">
                10+ Tasks
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-3 border-t border-stone-100 dark:border-[#1E2E4A]/80 space-y-2">
          {/* Quick Theme Toggle */}
          <div className="flex items-center justify-between px-2 py-1 text-xs">
            <span className="text-[11px] text-stone-400 dark:text-[#687D9C] truncate max-w-[130px]">
              Theme mode
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-[#1E2E4A] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
              title="Toggle dark/light mode"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
            </button>
          </div>

          {/* Authenticated User Card & Logout Button */}
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200/60 dark:border-[#1E2E4A] flex items-center justify-between gap-2">
            <div
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2 min-w-0 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#3B9CFF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {((currentUser?.name || profile.name || 'U').trim())[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {currentUser?.name || profile.name || 'Planzo User'}
                </div>
                <div className="text-[10px] text-stone-400 dark:text-[#687D9C] truncate">
                  {currentUser?.email || 'Authenticated Session'}
                </div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-stone-500 dark:text-[#93A4C1] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
              title="Logout of Planzo"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="sr-only sm:not-sr-only">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

