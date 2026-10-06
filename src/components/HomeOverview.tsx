// PlanZo Home Overview
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Square,
  ChevronRight,
  GraduationCap,
  Play,
  RotateCcw,
  Sparkles,
  Coffee,
  BookOpen,
  Zap,
  Plus,
  X,
  Target,
  BarChart2,
  TrendingUp,
  AlertCircle,
  Activity,
  Sliders,
  Edit3,
} from 'lucide-react';
import { ScheduleTaskModal } from './ScheduleTaskModal';
import { StreakModal } from './StreakModal';
import { XpModal } from './XpModal';
import { LofiAudioModal } from './LofiAudioModal';
import { StudentAiChatbotModal } from './StudentAiChatbotModal';
import { UniversityPortalScraperModal } from './UniversityPortalScraperModal';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';

export const HomeOverview: React.FC = () => {
  const {
    profile,
    currentUser,
    timetable,
    attendance,
    overallAttendancePercentage,
    bandwidth,
    setActiveView,
    toggleItemComplete,
    snoozeItem,
    shiftItemToEvening,
    injectBufferZone,
    recalibrateSchedule,
    isRecalibrating,
    recalibrateNotice,
    clearRecalibrateNotice,
    startZenMode,
    userStreak,
    userXp,
    awardXp,
    subjects,
    setIsPersonalizationWizardOpen,
  } = useApp();

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState(false);
  const [isLofiModalOpen, setIsLofiModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);

  // Time calculations for live active/next task
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = currentHours * 60 + now.getMinutes();

  const getGreeting = () => {
    if (currentHours < 12) return 'Good morning';
    if (currentHours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const parseMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // 1. Classes vs Tasks separation
  const todayClasses = timetable.filter(
    (item) => item.category === 'lecture' || item.category === 'lab'
  );

  const priorityTasks = timetable.filter(
    (item) => item.category !== 'lecture' && item.category !== 'lab'
  );

  // Next Best Action determination
  const activeClass = todayClasses.find((item) => {
    const start = parseMinutes(item.startTime);
    const end = parseMinutes(item.endTime);
    return currentMinutes >= start && currentMinutes <= end;
  });

  const nextActionItem = activeClass ||
    timetable.find((item) => parseMinutes(item.startTime) >= currentMinutes && !item.completed) ||
    timetable.find((item) => !item.completed) ||
    timetable[0];

  // Productivity Metrics
  const completedCount = timetable.filter((item) => item.completed).length;
  const totalCount = timetable.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Attendance Calculations
  const isAttendanceSafe = overallAttendancePercentage >= 75;
  const totalAttended = attendance.reduce((acc, a) => acc + a.attendedClasses, 0);
  const totalConducted = attendance.reduce((acc, a) => acc + a.totalClasses, 0);
  const safeBunks = Math.max(0, Math.floor((4 * totalAttended - 3 * totalConducted) / 3));
  const classesNeededFor75 = Math.max(0, Math.ceil(3 * totalConducted - 4 * totalAttended));

  const handleTaskCheck = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      playTaskCompleteSound();
      fireConfetti();
      awardXp(20, 'Task Completed');
    }
    toggleItemComplete(id);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP GREETING & CONTEXTUAL HEADER                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80 dark:border-stone-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {getGreeting()}, {currentUser?.firstName || profile.firstName || (profile.name?.trim() ? profile.name.trim().split(' ')[0] : (currentUser?.name?.trim() ? currentUser.name.trim().split(' ')[0] : 'Student'))}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Here's what needs your attention today.
          </p>
        </div>

        {/* Quick Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPersonalizationWizardOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Setup your college timings, habits and tasks"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Setup Routine & Tasks</span>
          </button>

          <button
            onClick={() => injectBufferZone()}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Add a 25-minute calm buffer"
          >
            <Coffee className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>+ Chill Buffer</span>
          </button>

          <button
            onClick={() => recalibrateSchedule('Manual Trigger')}
            disabled={isRecalibrating}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:border-teal-500 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Intelligently rebalance remaining tasks without guilt"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRecalibrating ? 'animate-spin text-teal-600' : 'text-teal-600 dark:text-teal-400'}`} />
            <span>{isRecalibrating ? 'Balancing...' : 'Recalibrate'}</span>
          </button>
        </div>
      </div>

      {/* Recalibrate Notice Banner */}
      {recalibrateNotice && (
        <div className="rounded-xl border border-teal-200/80 bg-teal-50/90 dark:border-teal-900/60 dark:bg-teal-950/40 p-3.5 flex items-center justify-between gap-3 text-xs shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span><strong>Schedule Rebalanced: </strong>{recalibrateNotice}</span>
          </div>
          <button
            onClick={clearRecalibrateNotice}
            className="p-1 rounded-lg text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FIRST: NEXT BEST ACTION (Visually Dominant Hero)                       */}
      {/* ========================================================================= */}
      {nextActionItem && (
        <div className="relative rounded-2xl border border-teal-300 dark:border-teal-800 bg-gradient-to-r from-teal-50/70 via-white to-stone-50/40 dark:from-teal-950/40 dark:via-stone-900 dark:to-stone-900 p-5 sm:p-6 shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-700 text-white">
                  Next Best Action
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  {nextActionItem.startTime} – {nextActionItem.endTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 truncate">
                {nextActionItem.title}
              </h2>

              <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2">
                <span className="capitalize">{nextActionItem.category}</span>
                <span>·</span>
                <span>Weight: {nextActionItem.cognitiveWeight >= 4 ? 'Intensive' : 'Moderate'}</span>
                {nextActionItem.topic && (
                  <>
                    <span>·</span>
                    <span className="truncate">{nextActionItem.topic}</span>
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => startZenMode(nextActionItem)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Focus</span>
              </button>

              <button
                onClick={() => handleTaskCheck(nextActionItem.id, nextActionItem.completed)}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Mark Completed"
              >
                {nextActionItem.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ATTENDANCE STATUS (Prioritized at Top with Teal/Emerald Hover Effect)  */}
      {/* ========================================================================= */}
      <div
        onClick={() => setActiveView('attendance')}
        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs flex flex-col justify-between hover:border-teal-500 dark:hover:border-teal-500/80 hover:bg-gradient-to-r hover:from-teal-50/60 hover:via-emerald-50/30 hover:to-white dark:hover:from-teal-950/40 dark:hover:via-emerald-950/20 dark:hover:to-stone-900 hover:shadow-lg hover:shadow-teal-600/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
              {isAttendanceSafe ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              )}
              <span>Attendance Status</span>
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
              isAttendanceSafe
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/70 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-500'
                : 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
            }`}>
              {isAttendanceSafe ? 'Safe (≥75%)' : 'Warning'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors tabular-nums">
              {overallAttendancePercentage}%
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              ({totalAttended}/{totalConducted} classes attended)
            </span>
          </div>

          {/* Progress Bar with Teal/Emerald Gradient */}
          <div className="h-1.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#10B981] transition-all duration-500"
              style={{ width: `${Math.min(100, overallAttendancePercentage)}%` }}
            />
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {isAttendanceSafe
              ? `You have a buffer of ${safeBunks} safe classes you can miss while keeping 75%.`
              : `Attend next ${classesNeededFor75} consecutive lectures to recover safe margin.`}
          </p>

          {/* Interactive Subject-Wise Quick Pill Preview on Hover */}
          {attendance.length > 0 && (
            <div className="pt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 opacity-85 group-hover:opacity-100 transition-opacity">
              {attendance.slice(0, 5).map((sub) => {
                const subPct = sub.totalClasses > 0 ? Math.round((sub.attendedClasses / sub.totalClasses) * 100) : 100;
                return (
                  <div
                    key={sub.subjectId}
                    className="px-2.5 py-1.5 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/60 group-hover:border-teal-500/40 group-hover:bg-teal-50/50 dark:group-hover:bg-teal-950/40 transition-colors flex items-center justify-between gap-1.5 text-[11px]"
                  >
                    <span className="font-mono font-semibold text-stone-700 dark:text-stone-300 truncate">
                      {sub.subjectCode}
                    </span>
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-300 tabular-nums">
                      {subPct}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 group-hover:border-teal-500/30 flex items-center justify-between gap-2">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            AICTE 75% Mandatory Attendance Guard
          </span>
          <span className="px-3 py-1.5 rounded-xl border border-teal-500/40 bg-teal-50/80 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 group-hover:bg-gradient-to-r group-hover:from-[#0F766E] group-hover:to-[#10B981] group-hover:text-white group-hover:border-teal-500 group-hover:shadow-sm group-hover:shadow-teal-600/20 transition-all duration-150 text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap">
            <span>Open Attendance Simulator</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TODAY'S ADHERENCE (PRODUCTIVITY) & DAY STREAK / XP                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Productivity Summary */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-2.5 hover:border-teal-500 dark:hover:border-teal-500/80 hover:bg-gradient-to-br hover:from-teal-50/40 hover:to-white dark:hover:from-teal-950/30 dark:hover:to-stone-900 hover:shadow-md hover:shadow-teal-600/10 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
              Today's Adherence
            </span>
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 tabular-nums">
              {progressPercent}%
            </span>
          </div>

          <div className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {completedCount} of {totalCount} completed
          </div>

          <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#10B981] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[11px] text-stone-500 flex items-center justify-between gap-2 pt-1.5">
            <span>Mental Load: <strong className="text-stone-700 dark:text-stone-200">{bandwidth.status} ({bandwidth.densityScore}%)</strong></span>
            <button
              onClick={() => setActiveView('analytics')}
              className="px-3 py-1.5 rounded-xl border border-teal-500/40 bg-teal-50/80 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 hover:bg-gradient-to-r hover:from-[#0F766E] hover:to-[#10B981] hover:text-white hover:border-teal-500 hover:shadow-sm hover:shadow-teal-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Full Analytics →</span>
            </button>
          </div>
        </div>

        {/* XP and Day Streak */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs flex items-center justify-between gap-4 hover:border-teal-500 dark:hover:border-teal-500/80 hover:bg-gradient-to-br hover:from-teal-50/40 hover:to-white dark:hover:from-teal-950/30 dark:hover:to-stone-900 hover:shadow-md hover:shadow-teal-600/10 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex-1 flex flex-col items-start justify-between space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Day Streak</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-stone-900 dark:text-stone-100 tabular-nums">
              {userStreak} Days
            </div>
            <button
              type="button"
              onClick={() => setIsStreakModalOpen(true)}
              className="mt-1 px-2.5 py-1.5 rounded-xl border border-teal-500/40 bg-teal-50/80 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 hover:bg-gradient-to-r hover:from-[#0F766E] hover:to-[#10B981] hover:text-white hover:border-teal-500 hover:shadow-sm hover:shadow-teal-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>
                {completedCount >= 7
                  ? '7+ tasks · Streak active →'
                  : `${Math.min(7, completedCount)}/7 tasks to streak →`}
              </span>
            </button>
          </div>

          <div className="h-14 w-px bg-stone-100 dark:bg-stone-800 shrink-0" />

          <div className="flex-1 flex flex-col items-end justify-between space-y-1.5 text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs text-stone-400 font-semibold">
              <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400" />
              <span>Engineering XP</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-teal-700 dark:text-teal-300 tabular-nums">
              {userXp} XP
            </div>
            <button
              type="button"
              onClick={() => setIsXpModalOpen(true)}
              className="mt-1 px-2.5 py-1.5 rounded-xl border border-teal-500/40 bg-teal-50/80 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 hover:bg-gradient-to-r hover:from-[#0F766E] hover:to-[#10B981] hover:text-white hover:border-teal-500 hover:shadow-sm hover:shadow-teal-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Level {Math.max(1, Math.floor(userXp / 300) + 1)} Engineer →</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. TODAY'S TASKS & TODAY'S CLASSES (Moved Below Key Status & Milestones)  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Today's Priority Tasks */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3 hover:border-teal-500/70 dark:hover:border-teal-500/70 transition-all duration-200">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Today's Tasks</span>
              <span className="text-xs font-mono font-normal text-stone-400 tabular-nums">
                ({priorityTasks.filter((t) => t.completed).length}/{priorityTasks.length})
              </span>
            </h3>
            <button
              onClick={() => setActiveView('tasks')}
              className="px-3 py-1.5 rounded-xl border border-teal-500/40 bg-teal-50/80 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 hover:bg-gradient-to-r hover:from-[#0F766E] hover:to-[#10B981] hover:text-white hover:border-teal-500 hover:shadow-sm hover:shadow-teal-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>View All Tasks →</span>
            </button>
          </div>

          <div className="space-y-2">
            {priorityTasks.slice(0, 4).map((task) => {
              const isCompleted = task.completed;
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCompleted
                      ? 'border-stone-200/50 bg-stone-50/50 dark:border-stone-800/50 dark:bg-stone-850/30 opacity-60'
                      : 'border-stone-200/80 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-850/40 hover:border-teal-500/60 hover:bg-teal-50/30 dark:hover:bg-teal-950/25'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => handleTaskCheck(task.id, isCompleted)}
                      className="text-stone-400 hover:text-teal-600 transition-colors shrink-0 cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-100 dark:fill-teal-950" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`text-xs font-medium truncate ${
                      isCompleted ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'
                    }`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-stone-400 tabular-nums">{task.startTime}</span>
                    <button
                      onClick={() => setActiveView('tasks')}
                      className="p-1.5 rounded-lg border border-transparent hover:border-teal-500/40 hover:bg-teal-500/15 text-stone-400 hover:text-teal-600 dark:hover:text-teal-300 transition-all cursor-pointer"
                      title="Edit task in Schedule & Tasks"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    {!isCompleted && (
                      <button
                        onClick={() => startZenMode(task)}
                        className="p-1.5 rounded-lg border border-transparent hover:border-teal-500/40 hover:bg-teal-500/15 text-stone-400 hover:text-teal-600 dark:hover:text-teal-300 transition-all cursor-pointer"
                        title="Focus"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Classes */}
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-3 hover:border-teal-500/70 dark:hover:border-teal-500/70 transition-all duration-200">
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Today's Classes</span>
              <span className="text-xs font-mono font-normal text-stone-400 tabular-nums">
                ({todayClasses.length} sessions)
              </span>
            </h3>
            <button
              onClick={() => setActiveView('schedule')}
              className="px-3 py-1.5 rounded-xl border border-teal-500/40 bg-teal-50/80 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 hover:bg-gradient-to-r hover:from-[#0F766E] hover:to-[#10B981] hover:text-white hover:border-teal-500 hover:shadow-sm hover:shadow-teal-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Full Schedule →</span>
            </button>
          </div>

          <div className="space-y-2">
            {todayClasses.length === 0 ? (
              <div className="text-center py-6 text-stone-400 text-xs">
                No classes scheduled for today.
              </div>
            ) : (
              todayClasses.map((cls) => {
                const isLive = activeClass?.id === cls.id;
                const isLab = cls.category === 'lab';
                return (
                  <div
                    key={cls.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isLive
                        ? 'border-teal-500 bg-teal-50/40 dark:border-teal-600 dark:bg-teal-950/30'
                        : 'border-stone-200/80 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-850/40 hover:border-teal-500/60 hover:bg-teal-50/30 dark:hover:bg-teal-950/25'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        onClick={() => handleTaskCheck(cls.id, cls.completed)}
                        className="text-stone-400 hover:text-teal-600 transition-colors shrink-0 cursor-pointer"
                      >
                        {cls.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-100 dark:fill-teal-950" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold truncate ${
                            cls.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'
                          }`}>
                            {cls.title}
                          </span>
                          {isLive && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-600 text-white font-bold">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5 tabular-nums">
                          {cls.startTime} – {cls.endTime} · {isLab ? 'Lab Practical' : 'Lecture'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => startZenMode(cls)}
                      className="px-2.5 py-1.5 rounded-lg border border-teal-500/30 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-gradient-to-r hover:from-[#0F766E] hover:to-[#10B981] hover:text-white hover:border-teal-500 text-teal-800 dark:text-teal-300 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      Focus
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
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
      <StudentAiChatbotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      <UniversityPortalScraperModal
        isOpen={isScraperModalOpen}
        onClose={() => setIsScraperModalOpen(false)}
      />
    </div>
  );
};
