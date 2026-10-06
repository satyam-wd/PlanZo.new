// PlanZo Analytics View
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MentalBandwidthMeter } from './MentalBandwidthMeter';
import {
  BarChart2,
  TrendingUp,
  CheckCircle2,
  Heart,
  CheckSquare,
  Calendar,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    addReflection,
    todayReflection,
    timetable,
    scheduledTasks,
    awardXp,
  } = useApp();

  // Time scope: Daily, Weekly, or Monthly
  const [timeScope, setTimeScope] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // 10-second reflection slider state
  const [energyLevel, setEnergyLevel] = useState(todayReflection?.energyLevel || 4);
  const [focusLevel, setFocusLevel] = useState(todayReflection?.focusLevel || 4);
  const [stressLevel, setStressLevel] = useState(todayReflection?.stressLevel || 2);
  const [noteText, setNoteText] = useState(todayReflection?.note || '');
  const [submitted, setSubmitted] = useState(!!todayReflection);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    addReflection(energyLevel, focusLevel, stressLevel, noteText);
    setSubmitted(true);
    awardXp(15, 'Daily Reflection Recorded');
  };

  // Compute Past 7 Days Task Completion Data
  const past7DaysTaskData = useMemo(() => {
    const days: {
      dateStr: string;
      dayShort: string;
      dateLabel: string;
      completedTasks: number;
      totalTasks: number;
      isToday: boolean;
    }[] = [];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isToday = dateStr === todayStr;

      if (isToday) {
        const completedFromTimetable = timetable.filter((t) => t.completed).length;
        const totalFromTimetable = timetable.length;
        const scheduledForToday = scheduledTasks[dateStr] || [];
        const completedFromScheduled = scheduledForToday.filter((t) => t.completed).length;
        const completedTasks = Math.max(completedFromTimetable, completedFromScheduled);
        const totalTasks = Math.max(totalFromTimetable, scheduledForToday.length, completedTasks);

        days.push({
          dateStr,
          dayShort,
          dateLabel,
          completedTasks,
          totalTasks,
          isToday: true,
        });
      } else {
        const tasksForDay = scheduledTasks[dateStr] || [];
        const completedTasks = tasksForDay.filter((t) => t.completed).length;
        const totalTasks = tasksForDay.length;

        days.push({
          dateStr,
          dayShort,
          dateLabel,
          completedTasks,
          totalTasks,
          isToday: false,
        });
      }
    }

    return days;
  }, [timetable, scheduledTasks]);

  const totalWeeklyTasksDone = past7DaysTaskData.reduce((sum, d) => sum + d.completedTasks, 0);
  const averageDailyTasksDone = (totalWeeklyTasksDone / 7).toFixed(1);
  const peakTaskDay = useMemo(() => {
    return past7DaysTaskData.reduce(
      (best, cur) => (cur.completedTasks >= best.completedTasks ? cur : best),
      past7DaysTaskData[0]
    );
  }, [past7DaysTaskData]);

  // Dynamic Y-axis scale for the 7-day tasks completed graph
  const yAxisMax = useMemo(() => {
    const maxCompleted = Math.max(...past7DaysTaskData.map((d) => d.completedTasks), 0);
    const maxTotal = Math.max(...past7DaysTaskData.map((d) => d.totalTasks), 0);
    const referenceMax = Math.max(maxCompleted, Math.min(maxTotal, 10), 6);
    // Round up to a clean even number for 4 horizontal grid steps
    return Math.ceil(referenceMax / 2) * 2;
  }, [past7DaysTaskData]);

  const yAxisTicks = [
    yAxisMax,
    Math.round(yAxisMax * 0.75),
    Math.round(yAxisMax * 0.5),
    Math.round(yAxisMax * 0.25),
    0,
  ];

  // Today's live stats for Daily view
  const todayCompletedCount = timetable.filter((t) => t.completed).length;
  const todayTotalCount = timetable.length;
  const todayAdherenceRate =
    todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 1000) / 10 : 0;

  // Monthly stats
  const monthlyStats = {
    averageAdherence: 84,
    totalFocusHours: 128,
    codingProblemsSolved: 46,
    lecturesAttended: 68,
    burnoutIncidentsPrevented: 11,
    scheduleRecalibrationsWithoutGuilt: 19,
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Time Scope Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <span>Behavioral Analytics & Task Progress</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Track your daily completed tasks, focus consistency, and cognitive bandwidth across the semester.
          </p>
        </div>

        {/* Time Scope Segmented Control */}
        <div className="flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-750 shrink-0">
          <button
            onClick={() => setTimeScope('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timeScope === 'daily'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeScope('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timeScope === 'weekly'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            Weekly (7 Days)
          </button>
          <button
            onClick={() => setTimeScope('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timeScope === 'monthly'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            Monthly (30 Days)
          </button>
        </div>
      </div>

      {/* 2. Real-Time Mental Energy & Cognitive Load Engine */}
      <MentalBandwidthMeter />

      {/* 3. TIME SCOPE SPECIFIC VIEWS */}

      {/* DAILY VIEW */}
      {timeScope === 'daily' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Today's Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Tasks Completed Today
              </span>
              <div className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-1">
                {todayCompletedCount} / {todayTotalCount}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {todayAdherenceRate}% of today&apos;s scheduled tasks finished
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Deep Work & Study Time
              </span>
              <div className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 mt-1">
                4 hrs 15 mins
              </div>
              <p className="text-xs text-stone-500 mt-1">DSA Sprint + Core Subject revision</p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Guilt-Free Buffer Time
              </span>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                45 mins
              </div>
              <p className="text-xs text-stone-500 mt-1">Restorative chill blocks active</p>
            </div>
          </div>
        </div>
      )}

      {/* WEEKLY VIEW: Proper Graph Showing Tasks Completed Per Day */}
      {timeScope === 'weekly' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Graph Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                    Past 7 Days Task Completion Graph
                  </h3>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Number of tasks completed on each particular day over the last 7 days
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/70 dark:border-teal-900/70 flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                  <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300">
                    {totalWeeklyTasksDone} Tasks Done
                  </span>
                </div>
                <span className="text-xs font-mono text-stone-400">
                  Avg: {averageDailyTasksDone}/day
                </span>
              </div>
            </div>

            {/* Proper Cartesian Coordinate Graph (Y-Axis + Gridlines + SVG Trend Curve + Bars + X-Axis) */}
            <div className="pt-2">
              <div className="flex gap-3">
                {/* Y-Axis Labels (Task Count) */}
                <div className="flex flex-col justify-between h-56 pb-11 text-[11px] font-mono text-stone-400 dark:text-stone-500 select-none text-right pr-1 w-9 shrink-0">
                  {yAxisTicks.map((tick, idx) => (
                    <span key={idx} className="leading-none">
                      {tick}
                    </span>
                  ))}
                </div>

                {/* Plot Canvas */}
                <div className="relative flex-1 h-56 flex flex-col">
                  {/* Plot Area with Horizontal Gridlines */}
                  <div className="relative flex-1 border-l border-b border-stone-200 dark:border-stone-800">
                    {/* Horizontal Reference Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {yAxisTicks.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-full border-t ${
                            idx === yAxisTicks.length - 1
                              ? 'border-transparent'
                              : 'border-dashed border-stone-200/80 dark:border-stone-800/80'
                          }`}
                        />
                      ))}
                    </div>

                    {/* SVG Area & Line Overlay Connecting Daily Task Counts */}
                    <svg
                      viewBox="0 0 700 200"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10"
                    >
                      <defs>
                        <linearGradient id="taskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {(() => {
                        const points = past7DaysTaskData.map((d, idx) => {
                          const x = idx * 100 + 50;
                          const ratio = Math.min(1, d.completedTasks / Math.max(1, yAxisMax));
                          const y = 200 - ratio * 184 - 8;
                          return { x, y, ...d };
                        });

                        const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
                        const areaPoints = `50,200 ${polylinePoints} 650,200`;

                        return (
                          <>
                            <polygon points={areaPoints} fill="url(#taskAreaGrad)" />
                            <polyline
                              fill="none"
                              stroke="#14b8a6"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={polylinePoints}
                            />
                          </>
                        );
                      })()}
                    </svg>

                    {/* 7 Daily Columns with Bars & Data Points */}
                    <div className="relative z-20 grid grid-cols-7 h-full items-end">
                      {past7DaysTaskData.map((item, idx) => {
                        const heightPct = Math.min(
                          100,
                          Math.round((item.completedTasks / Math.max(1, yAxisMax)) * 92)
                        );
                        const isHovered = hoveredDayIndex === idx;

                        return (
                          <div
                            key={item.dateStr}
                            onMouseEnter={() => setHoveredDayIndex(idx)}
                            onMouseLeave={() => setHoveredDayIndex(null)}
                            className="relative h-full flex flex-col items-center justify-end px-1.5 sm:px-3 group cursor-pointer"
                          >
                            {/* Floating Tooltip / Pill showing exact task count */}
                            <div
                              className={`mb-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                                item.isToday || isHovered
                                  ? 'bg-teal-700 text-white shadow-xs scale-105'
                                  : item.completedTasks > 0
                                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200'
                                  : 'text-stone-400 dark:text-stone-500'
                              }`}
                            >
                              {item.completedTasks} {item.completedTasks === 1 ? 'task' : 'tasks'}
                            </div>

                            {/* Vertical Bar */}
                            <div className="w-full max-w-[42px] h-[82%] flex items-end justify-center">
                              <div
                                className={`w-full rounded-t-xl transition-all duration-500 relative ${
                                  item.isToday
                                    ? 'bg-gradient-to-t from-teal-700 to-emerald-500 shadow-sm'
                                    : item.completedTasks > 0
                                    ? 'bg-teal-600/75 dark:bg-teal-500/70 group-hover:bg-teal-600'
                                    : 'bg-stone-200 dark:bg-stone-800'
                                }`}
                                style={{
                                  height: item.completedTasks > 0 ? `${Math.max(heightPct, 10)}%` : '4px',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* X-Axis Labels (Day Name & Date) */}
                  <div className="grid grid-cols-7 pt-2.5 h-11">
                    {past7DaysTaskData.map((item) => (
                      <div key={item.dateStr} className="flex flex-col items-center text-center">
                        <span
                          className={`text-xs leading-tight ${
                            item.isToday
                              ? 'font-bold text-teal-700 dark:text-teal-400'
                              : 'font-medium text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          {item.isToday ? 'Today' : item.dayShort}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                          {item.dateLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Graph Summary Footer */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                <span>
                  Today&apos;s Progress:{' '}
                  <strong className="text-stone-900 dark:text-stone-100">
                    {todayCompletedCount} of {todayTotalCount} tasks done
                  </strong>
                </span>
              </span>
              <span>
                Most Productive Day:{' '}
                <strong className="text-stone-900 dark:text-stone-100">
                  {peakTaskDay.isToday ? 'Today' : `${peakTaskDay.dayShort} (${peakTaskDay.dateLabel})`} —{' '}
                  {peakTaskDay.completedTasks} {peakTaskDay.completedTasks === 1 ? 'task' : 'tasks'}
                </strong>
              </span>
              <span>
                7-Day Total:{' '}
                <strong className="text-teal-700 dark:text-teal-400">
                  {totalWeeklyTasksDone} tasks completed
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MONTHLY VIEW */}
      {timeScope === 'monthly' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Monthly KPI Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Monthly Adherence</span>
              <div className="text-xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-1">
                {monthlyStats.averageAdherence}%
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Total Focus Time</span>
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100 mt-1">
                {monthlyStats.totalFocusHours} hrs
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <span className="text-[10px] uppercase font-semibold text-stone-400">DSA Solved</span>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {monthlyStats.codingProblemsSolved} Ques
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Lectures Attended</span>
              <div className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">
                {monthlyStats.lecturesAttended}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Burnout Defenses</span>
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {monthlyStats.burnoutIncidentsPrevented} Buffers
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Auto Rebalances</span>
              <div className="text-xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-1">
                {monthlyStats.scheduleRecalibrationsWithoutGuilt} times
              </div>
            </div>
          </div>

          {/* 30-Day Consistency Heatmap Grid */}
          <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              30-Day Routine Consistency Matrix
            </h3>
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-2 pt-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const level = (i * 7 + 13) % 4;
                const colors = [
                  'bg-stone-100 dark:bg-stone-800',
                  'bg-teal-200 dark:bg-teal-950',
                  'bg-teal-400 dark:bg-teal-700',
                  'bg-teal-600 dark:bg-teal-500',
                ];
                return (
                  <div
                    key={i}
                    className={`h-8 rounded-lg ${colors[level]} transition-transform hover:scale-110 flex items-center justify-center text-[10px] font-mono text-stone-600 dark:text-stone-300`}
                    title={`Day ${i + 1}: ${level === 3 ? '100% Adherence' : level === 2 ? '75% Adherence' : 'Rest / Recalibrated'}`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-400 justify-end">
              <span>Less</span>
              <span className="w-3 h-3 rounded bg-stone-100 dark:bg-stone-800" />
              <span className="w-3 h-3 rounded bg-teal-200 dark:bg-teal-950" />
              <span className="w-3 h-3 rounded bg-teal-400 dark:bg-teal-700" />
              <span className="w-3 h-3 rounded bg-teal-600 dark:bg-teal-500" />
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. 10-Second Daily Cognitive Reflection Form */}
      <div className="rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              10-Second End-of-Day Cognitive Check-in
            </h3>
          </div>
          {submitted && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Calibrated for tomorrow</span>
            </span>
          )}
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          A quick slider check-in feeds directly into your Mental Bandwidth Engine so tomorrow&apos;s schedule auto-adjusts to your fatigue levels without guilt.
        </p>

        <form onSubmit={handleSaveReflection} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Energy Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300">Physical Energy</span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{energyLevel}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={(e) => {
                  setEnergyLevel(Number(e.target.value));
                  setSubmitted(false);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Drained</span>
                <span>Vibrant</span>
              </div>
            </div>

            {/* Mental Focus Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300">Mental Focus</span>
                <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">{focusLevel}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={focusLevel}
                onChange={(e) => {
                  setFocusLevel(Number(e.target.value));
                  setSubmitted(false);
                }}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Scattered</span>
                <span>Deep Flow</span>
              </div>
            </div>

            {/* Cognitive Stress Slider */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300">Academic Pressure</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{stressLevel}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={stressLevel}
                onChange={(e) => {
                  setStressLevel(Number(e.target.value));
                  setSubmitted(false);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Calm</span>
                <span>Exam Overload</span>
              </div>
            </div>
          </div>

          {/* Quick optional note */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                setSubmitted(false);
              }}
              placeholder="Optional: How did your coursework and habits feel today?"
              className="w-full sm:flex-1 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-4 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-500"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-teal-700 text-white hover:bg-teal-800 text-xs font-semibold shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              {submitted ? 'Update Reflection' : 'Save & Balance Tomorrow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
