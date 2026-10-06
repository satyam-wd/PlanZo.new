// Planzo Calendar & Schedule View (/calendar)
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Coffee,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { MonthlyAcademicCalendar } from './MonthlyAcademicCalendar';
import { DailyTimeline } from './DailyTimeline';

interface ScheduleViewProps {
  onOpenAddTaskModal: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onOpenAddTaskModal }) => {
  const { profile, injectBufferZone, calendarEvents, addCalendarEvent, deleteCalendarEvent } = useApp();
  const [scheduleMode, setScheduleMode] = useState<'daily' | 'monthly'>('daily');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('15:00');
  const [eventCategory, setEventCategory] = useState<'deadline' | 'meeting' | 'study' | 'personal'>('study');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    addCalendarEvent({
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
      category: eventCategory,
    });
    setEventTitle('');
    setIsAddEventOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-[#1E2E4A]">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">
            Calendar & Schedule
          </h2>
          <p className="text-xs text-stone-500 dark:text-[#93A4C1]">
            Manage your upcoming events, time-blocked daily schedule, and monthly calendar
          </p>
        </div>

        {/* Mode Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-[#0B1324] border border-stone-200/70 dark:border-[#1E2E4A]">
            <button
              onClick={() => setScheduleMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                scheduleMode === 'daily'
                  ? 'bg-white dark:bg-[#13203B] text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-[#93A4C1] hover:text-stone-800 dark:hover:text-white'
              }`}
            >
              Daily Routine
            </button>
            <button
              onClick={() => setScheduleMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                scheduleMode === 'monthly'
                  ? 'bg-white dark:bg-[#13203B] text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 dark:text-[#93A4C1] hover:text-stone-800 dark:hover:text-white'
              }`}
            >
              Monthly Calendar
            </button>
          </div>

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] text-white text-xs font-bold shadow-sm shadow-[#6C4DFF]/25 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>

          <button
            onClick={() => injectBufferZone()}
            className="p-2 rounded-xl border border-stone-200 dark:border-[#1E2E4A] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#111E36] transition-colors cursor-pointer"
            title="Add a 25-minute calm buffer"
          >
            <Coffee className="w-4 h-4 text-[#3B9CFF]" />
          </button>
        </div>
      </div>

      {/* User Calendar Events Strip */}
      {calendarEvents.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200/80 dark:border-[#1E2E4A] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#6C4DFF] dark:text-[#3B9CFF]" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                Your Scheduled Events ({calendarEvents.length})
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {calendarEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200/60 dark:border-[#1E2E4A] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {ev.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 dark:text-[#93A4C1]">
                    <span>{ev.date}</span>
                    <span>·</span>
                    <span className="font-mono">{ev.time}</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-[#6C4DFF]/15 text-[#6C4DFF] dark:text-[#A491FF] font-bold">
                      {ev.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteCalendarEvent(ev.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                  title="Delete event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Selected View */}
      {scheduleMode === 'daily' ? (
        <DailyTimeline />
      ) : (
        <div className="space-y-4">
          <MonthlyAcademicCalendar />
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050C17]/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0B1324] border border-stone-200 dark:border-[#1E2E4A] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 dark:border-[#1E2E4A] flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Add Calendar Event
              </h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#D5E0F2] mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g., Project Milestone Review"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-[#1E2E4A] text-sm text-stone-900 dark:text-white focus:outline-none focus:border-[#6C4DFF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-[#D5E0F2] mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-[#1E2E4A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-[#D5E0F2] mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-[#1E2E4A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#6C4DFF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#D5E0F2] mb-1.5">
                  Category
                </label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#07111F] border border-stone-200 dark:border-[#1E2E4A] text-xs text-stone-900 dark:text-white focus:outline-none focus:border-[#6C4DFF]"
                >
                  <option value="study">Study Block</option>
                  <option value="deadline">Deadline</option>
                  <option value="meeting">Meeting</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-[#1E2E4A] text-xs font-semibold text-stone-600 dark:text-[#93A4C1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] text-white text-xs font-bold shadow-md shadow-[#6C4DFF]/25 cursor-pointer"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

