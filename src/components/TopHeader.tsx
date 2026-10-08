// Planzo Top Header
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlanzoLogo } from './PlanzoLogo';
import {
  Menu,
  Plus,
  Flame,
  Zap,
  Headphones,
  Sliders,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileNav: () => void;
  onOpenScheduleModal: () => void;
  onOpenStreakModal: () => void;
  onOpenXpModal: () => void;
  onOpenLofiModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileNav,
  onOpenScheduleModal,
  onOpenStreakModal,
  onOpenXpModal,
  onOpenLofiModal,
}) => {
  const { activeView, setActiveView, currentUser, profile, signOut, userStreak, userXp, setIsPersonalizationWizardOpen } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    home: { title: 'Overview', subtitle: 'Plan Smarter. Do Better.' },
    timeline: { title: 'My Day', subtitle: 'Time-Blocked Daily Routine' },
    tasks: { title: 'Schedule and Tasks', subtitle: 'Priority Action Queue & Daily Schedule' },
    schedule: { title: 'My Day', subtitle: 'Schedule, Deadlines & Time Blocks' },
    profile: { title: 'User Profile', subtitle: 'Account & Personal Details' },
    attendance: { title: 'Attendance Guard', subtitle: '75% AICTE Monitoring' },
    academic: { title: 'Academic Vault', subtitle: 'Syllabus, PYQs & Notes' },
    analytics: { title: 'Analytics', subtitle: 'Productivity & Momentum' },
    ai: { title: 'Sarthi AI', subtitle: 'Productivity & Academic Copilot' },
    settings: { title: 'Settings', subtitle: 'Workspace & Preferences' },
  };

  const current = viewTitles[activeView] || viewTitles.home;

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/90 dark:bg-[#0B1324]/90 border-b border-stone-200/80 dark:border-[#1E2E4A] backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="p-2 -ml-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 lg:hidden cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveView('home')}
          className="lg:hidden cursor-pointer shrink-0"
          title="Planzo Overview"
        >
          <PlanzoLogo size="sm" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
              {current.title}
            </h1>
            <span className="hidden sm:inline-block text-stone-300 dark:text-[#233554]">·</span>
            <span className="hidden sm:inline-block text-xs text-stone-400 dark:text-[#93A4C1] font-medium">
              {current.subtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Indicators & User Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Streak Indicator */}
        <button
          onClick={onOpenStreakModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200/70 dark:border-[#1E2E4A] bg-stone-50 dark:bg-[#07111F] text-stone-700 dark:text-stone-200 hover:border-amber-400/80 transition-colors text-xs font-semibold cursor-pointer"
          title="View Streak Milestones"
        >
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-mono tabular-nums">{userStreak}d</span>
        </button>

        {/* XP Indicator */}
        <button
          onClick={onOpenXpModal}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200/70 dark:border-[#1E2E4A] bg-stone-50 dark:bg-[#07111F] text-stone-700 dark:text-stone-200 hover:border-[#3B9CFF]/80 transition-colors text-xs font-semibold cursor-pointer"
          title="View XP"
        >
          <Zap className="w-3.5 h-3.5 text-[#3B9CFF] fill-[#3B9CFF]" />
          <span className="font-mono tabular-nums">{userXp} XP</span>
        </button>

        {/* Lo-Fi Focus Music */}
        <button
          onClick={onOpenLofiModal}
          className="p-2 rounded-lg border border-stone-200/70 dark:border-[#1E2E4A] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#111E36] transition-colors cursor-pointer"
          title="Focus Lo-Fi Beats & Ambient Sounds"
        >
          <Headphones className="w-4 h-4 text-[#6C4DFF] dark:text-[#3B9CFF]" />
        </button>

        {/* Primary Action: + New Task */}
        <button
          onClick={onOpenScheduleModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] hover:from-[#5B3DF5] hover:to-[#298CEB] text-white text-xs font-bold transition-all shadow-sm shadow-[#6C4DFF]/25 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* User Profile & Logout Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border border-stone-200/80 dark:border-[#1E2E4A] bg-stone-50 dark:bg-[#07111F] hover:border-[#6C4DFF]/50 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6C4DFF] to-[#3B9CFF] text-white flex items-center justify-center text-[11px] font-bold">
              {((currentUser?.name || profile.name || 'U').trim())[0]?.toUpperCase()}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-stone-800 dark:text-white max-w-[100px] truncate">
              {(currentUser?.name || profile.name || 'User').split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                onClick={() => setIsUserMenuOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200 dark:border-[#1E2E4A] shadow-xl py-2 z-50">
                <div className="px-3.5 py-2 border-b border-stone-100 dark:border-[#1E2E4A]">
                  <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {currentUser?.name || profile.name}
                  </div>
                  <div className="text-[11px] text-stone-400 dark:text-[#687D9C] truncate">
                    {currentUser?.email || 'Authenticated'}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-[#93A4C1] hover:bg-stone-50 dark:hover:bg-[#111E36] hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#6C4DFF]" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-[#93A4C1] hover:bg-stone-50 dark:hover:bg-[#111E36] hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#3B9CFF]" />
                    <span>Workspace Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPersonalizationWizardOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-[#93A4C1] hover:bg-stone-50 dark:hover:bg-[#111E36] hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Routine Setup</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-stone-100 dark:border-[#1E2E4A]">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

