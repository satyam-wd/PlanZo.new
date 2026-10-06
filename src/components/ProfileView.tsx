// Planzo User Profile View (/profile)
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Award,
  Flame,
  CheckCircle2,
  FolderKanban,
  LogOut,
  Save,
} from 'lucide-react';
import { playTaskCompleteSound } from '../utils/audioSynth';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    profile,
    updateProfile,
    timetable,
    projects,
    userXp,
    userStreak,
    signOut,
  } = useApp();

  const [fullName, setFullName] = useState(currentUser?.name || profile.name || '');
  const [college, setCollege] = useState(profile.customCollege || profile.college || '');
  const [branch, setBranch] = useState(profile.branch || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const completedTasks = timetable.filter((t) => t.completed).length;
  const totalTasks = timetable.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    const parts = fullName.trim().split(' ');
    updateProfile({
      name: fullName.trim(),
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
      college,
      customCollege: college,
      branch,
    });
    playTaskCompleteSound();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Your Planzo Profile
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-0.5">
            Personal account details, workspace security, and productivity milestones
          </p>
        </div>

        <button
          onClick={signOut}
          className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout of Session</span>
        </button>
      </div>

      {/* Profile Identity Card + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200/80 dark:border-slate-800 p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C4DFF] to-[#3B9CFF] text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-[#6C4DFF]/25">
              {(currentUser?.name || profile.name || 'P')[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white truncate">
                {currentUser?.name || profile.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 font-mono truncate">
                {currentUser?.email || 'verified@planzo.app'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authenticated Planzo Account</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 dark:border-slate-800/80">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200/60 dark:border-slate-800">
              <div className="text-[11px] text-stone-400 dark:text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3B9CFF]" />
                <span>Completion Rate</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-stone-900 dark:text-white mt-1 tabular-nums">
                {completionRate}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200/60 dark:border-slate-800">
              <div className="text-[11px] text-stone-400 dark:text-slate-400 flex items-center gap-1">
                <FolderKanban className="w-3.5 h-3.5 text-[#6C4DFF]" />
                <span>Active Projects</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-stone-900 dark:text-white mt-1 tabular-nums">
                {projects.length}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200/60 dark:border-slate-800">
              <div className="text-[11px] text-stone-400 dark:text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Consistency Streak</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-stone-900 dark:text-white mt-1 tabular-nums">
                {Math.max(1, userStreak)} Days
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200/60 dark:border-slate-800">
              <div className="text-[11px] text-stone-400 dark:text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total XP</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-stone-900 dark:text-white mt-1 tabular-nums">
                {userXp} XP
              </div>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 dark:text-slate-500 font-mono pt-1">
            User ID: {currentUser?.id} · Joined {currentUser?.accountCreatedAt || '2026'}
          </div>
        </div>

        {/* Edit Account Form */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200/80 dark:border-slate-800 p-6 space-y-5">
          <h3 className="text-base font-bold text-stone-900 dark:text-white">
            Update Profile Information
          </h3>

          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated and synced to your account!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                Registered Email (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-100 dark:bg-[#07111F]/60 border border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 text-xs sm:text-sm opacity-75 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                  Organization / Institute
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                  Department / Focus Track
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] hover:from-[#5B3DF5] hover:to-[#2B8CEB] text-white text-xs font-semibold shadow-md shadow-[#6C4DFF]/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
