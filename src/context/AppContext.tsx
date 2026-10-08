import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  TimetableItem,
  SubjectCourse,
  MentalBandwidthState,
  ReflectionEntry,
  SubjectAttendance,
  SubjectFolderData,
  FolderItem,
  DailyScheduledTask,
  ItemCategory,
  AuthUser,
  ProjectItem,
  CalendarEventItem,
} from '../types';
import {
  CURRICULUM_DATA,
  INITIAL_TIMETABLE,
  COLLEGES_LIST,
  BRANCHES_LIST,
  DEFAULT_HABITS,
  INITIAL_ATTENDANCE_DATA,
  SUBJECT_FOLDERS_DATA,
} from '../data/btechData';
import {
  SATI_SUBJECT_FOLDERS_DATA,
  getCurriculumForSatiSemester,
} from '../data/satiVidishaData';
import { getBranchSemesterSubjects } from '../data/branchCurriculumData';
import {
  FOUNDATION_ENGINEERING_SUBJECTS,
  getFoundationSemesterSubjects,
} from '../data/foundationSubjects';
import {
  FIRST_YEAR_SUBJECT_NOTES_CATALOG,
  generateSubjectFolderDataFromCatalog,
} from '../data/firstYearDetailedNotes';

export interface BunkCalculation {
  percentage: number;
  safeToBunk: number;
  needToAttend: number;
  isSafe: boolean;
  statusLabel: string;
}

export type AppViewType =
  | 'home'
  | 'timeline'
  | 'tasks'
  | 'schedule'
  | 'projects'
  | 'profile'
  | 'attendance'
  | 'academic'
  | 'analytics'
  | 'ai'
  | 'settings';

interface AppContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  timetable: TimetableItem[];
  setTimetable: React.Dispatch<React.SetStateAction<TimetableItem[]>>;
  toggleItemComplete: (id: string) => void;
  snoozeItem: (id: string, minutes?: number) => void;
  shiftItemToEvening: (id: string) => void;
  injectBufferZone: (afterItemId?: string, durationMinutes?: number) => void;
  recalibrateSchedule: (missedItemTitle?: string) => Promise<void>;
  isRecalibrating: boolean;
  recalibrateNotice: string | null;
  clearRecalibrateNotice: () => void;
  subjects: SubjectCourse[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectCourse[]>>;
  toggleTopicComplete: (subjectId: string, moduleId: string, topicId: string) => void;
  bandwidth: MentalBandwidthState;
  reflections: ReflectionEntry[];
  addReflection: (energy: number, focus: number, stress: number, note?: string) => void;
  todayReflection: ReflectionEntry | undefined;
  zenModeOpen: boolean;
  setZenModeOpen: (open: boolean) => void;
  activeZenTask: TimetableItem | null;
  startZenMode: (item?: TimetableItem) => void;
  activeView: AppViewType;
  setActiveView: (view: AppViewType) => void;
  navigateToPath: (path: string, replace?: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isAttendanceModalOpen: boolean;
  setIsAttendanceModalOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  selectedResourceForModal: any | null;
  setSelectedResourceForModal: (resource: any | null) => void;
  isPersonalizationWizardOpen: boolean;
  setIsPersonalizationWizardOpen: (open: boolean) => void;
  // 75% Attendance Feature
  attendance: SubjectAttendance[];
  setAttendance: React.Dispatch<React.SetStateAction<SubjectAttendance[]>>;
  markAttendance: (subjectId: string, status: 'present' | 'absent') => void;
  adjustAttendanceCount: (subjectId: string, attended: number, total: number) => void;
  calculateBunkStatus: (attended: number, total: number, target?: number) => BunkCalculation;
  overallAttendancePercentage: number;
  // Subject Folders Feature
  subjectFolders: Record<string, SubjectFolderData>;
  toggleAssignmentStatus: (subjectId: string, assignmentId: string) => void;
  addCustomNoteToFolder: (subjectId: string, note: FolderItem) => void;
  // Monthly Calendar & Task Scheduling Feature
  scheduledTasks: Record<string, DailyScheduledTask[]>;
  addTaskForDate: (task: Omit<DailyScheduledTask, 'id'>) => void;
  toggleTaskForDate: (date: string, taskId: string) => void;
  deleteTaskForDate: (date: string, taskId: string) => void;
  getDateTaskStats: (dateStr: string) => { total: number; completed: number; percentage: number };
  // Projects & Calendar Events (User-Isolated)
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id' | 'userId' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  calendarEvents: CalendarEventItem[];
  addCalendarEvent: (event: Omit<CalendarEventItem, 'id' | 'userId' | 'createdAt'>) => void;
  deleteCalendarEvent: (id: string) => void;
  // XP & Day Streak Feature
  userXp: number;
  userStreak: number;
  awardXp: (amount: number, reason: string) => void;
  // Auth & Student Account
  currentUser: AuthUser | null;
  signUp: (userData: {
    name: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    isVerified?: boolean;
    college?: string;
    branch?: string;
    semester?: number;
    rollNo?: string;
    avatarUrl?: string;
  }) => { ok: boolean; error?: string; user?: AuthUser };
  signIn: (identifier: string, password?: string) => boolean;
  authenticateWithCredentials: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  registerAccount: (fullName: string, email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  requestPasswordReset: (email: string, newPassword?: string) => Promise<{ ok: boolean; step?: string; message?: string; error?: string }>;
  signOut: () => void;
  // Study Block Scheduling
  scheduleStudyBlock: (block: {
    title: string;
    category: ItemCategory;
    startTime: string;
    endTime: string;
    date: string;
    subjectId?: string;
    cognitiveWeight?: number;
    notes?: string;
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'planzo_profile_v1',
  TIMETABLE: 'planzo_timetable_v1',
  SUBJECTS: 'planzo_subjects_v1',
  REFLECTIONS: 'planzo_reflections_v1',
  ATTENDANCE: 'planzo_attendance_v1',
  FOLDERS: 'planzo_folders_v1',
  SCHEDULED_TASKS: 'planzo_scheduled_tasks_v5',
};

function generateDefaultScheduledTasks(): Record<string, DailyScheduledTask[]> {
  // A fresh account starts with a clean calendar (0 tasks) from the day of account creation!
  // XP points, streak, and completed tasks all start at zero.
  return {};
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem('planzo_profile_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedName = parsed.name || '';
        const savedFirst = parsed.firstName || (savedName ? savedName.split(' ')[0] : '');
        const savedLast = parsed.lastName || (savedName && savedName.split(' ').length > 1 ? savedName.split(' ').slice(1).join(' ') : '');
        return {
          name: savedName,
          firstName: savedFirst,
          lastName: savedLast,
          phone: parsed.phone || '',
          isVerified: parsed.isVerified || false,
          avatarUrl: parsed.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=PlanZoStudent&colors=emerald,cyan,teal',
          college: parsed.college || COLLEGES_LIST[0],
          customCollege: parsed.customCollege || parsed.college || COLLEGES_LIST[0],
          branch: parsed.branch && BRANCHES_LIST.includes(parsed.branch) ? parsed.branch : BRANCHES_LIST[0],
          semester: parsed.semester || 1,
          wakeTime: parsed.wakeTime || '07:00',
          sleepTime: parsed.sleepTime || '23:30',
          collegeStart: parsed.collegeStart || '10:00',
          collegeEnd: parsed.collegeEnd || '17:00',
          selectedHabits: parsed.selectedHabits || [DEFAULT_HABITS[0], DEFAULT_HABITS[1], DEFAULT_HABITS[2]],
          onboarded: parsed.onboarded !== undefined ? parsed.onboarded : true,
          accountCreatedAt: parsed.accountCreatedAt || new Date().toISOString().split('T')[0],
        };
      } catch (e) {}
    }
    return {
      name: '',
      firstName: '',
      lastName: '',
      phone: '',
      isVerified: false,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=PlanZoStudent&colors=emerald,cyan,teal',
      college: COLLEGES_LIST[0],
      customCollege: 'Samrat Ashok Technological Institute (SATI), Vidisha M.P.',
      branch: 'B.Tech. Computer Science & Engineering',
      semester: 1,
      wakeTime: '07:00',
      sleepTime: '23:30',
      collegeStart: '10:00',
      collegeEnd: '17:00',
      selectedHabits: [DEFAULT_HABITS[0], DEFAULT_HABITS[1], DEFAULT_HABITS[2]],
      onboarded: true,
      accountCreatedAt: new Date().toISOString().split('T')[0],
    };
  });

  // 2. Timetable State (Minimum 10 daily tasks, with 4 study tasks of 1 hour each and zero overlaps)
  const [timetable, setTimetable] = useState<TimetableItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE) || localStorage.getItem('planzo_timetable_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed;
        }
      } catch (e) {}
    }
    return [
      {
        id: 'routine-1',
        title: '🏃‍♂️ Morning Fitness: Gym / Workout / Physical Fitness',
        category: 'habit',
        startTime: '07:00',
        endTime: '07:40',
        completed: false,
        cognitiveWeight: 2,
        notes: 'Morning physical workout to activate energy and build peak mental stamina.',
      },
      {
        id: 'routine-study-1-morning',
        title: '⭐ Morning Deep Study (1 Hr): C Programming & DSA',
        category: 'study',
        startTime: '07:40',
        endTime: '08:40',
        completed: false,
        cognitiveWeight: 4,
        notes: 'Dedicated 1-hour morning deep study session on Most Important Task.',
      },
      {
        id: 'routine-2',
        title: 'Breakfast & Commute to Campus',
        category: 'chill',
        startTime: '08:40',
        endTime: '10:00',
        completed: false,
        cognitiveWeight: 1,
        notes: 'Nutritious breakfast, campus travel, and settling into lectures.',
      },
      {
        id: 'routine-college',
        title: 'Institute — Full College Schedule (Lectures & Labs)',
        category: 'lecture',
        startTime: '10:00',
        endTime: '17:00',
        completed: false,
        cognitiveWeight: 4,
        notes: 'One unified college schedule for all lectures & labs (10:00 – 17:00). Mark once for the entire day.',
      },
      {
        id: 'routine-3',
        title: 'Campus Departure & Evening Chai / Refreshment',
        category: 'chill',
        startTime: '17:00',
        endTime: '17:25',
        completed: false,
        cognitiveWeight: 1,
        notes: 'Evening tea, decompression and transition back from campus.',
      },
      {
        id: 'routine-outdoor-evening',
        title: '🌳 Evening Outdoor Habit: Outdoor Walk & Campus Fresh Air',
        category: 'habit',
        startTime: '17:25',
        endTime: '17:55',
        completed: false,
        cognitiveWeight: 1,
        notes: 'Evening outdoor activity, fresh air walk or sports to recharge after lectures.',
      },
      {
        id: 'routine-study-2-primary-focus',
        title: '🎯 Evening Study (1 Hr): Engineering Mathematics - I & Problem Solving',
        category: 'study',
        startTime: '17:55',
        endTime: '18:55',
        completed: false,
        cognitiveWeight: 4,
        notes: 'Dedicated 1-hour evening study block aligned with your semester focus.',
      },
      {
        id: 'routine-habit-extra',
        title: '⚡ Daily Habit: Daily Coding / DSA & Hydration Check',
        category: 'habit',
        startTime: '18:55',
        endTime: '19:20',
        completed: false,
        cognitiveWeight: 2,
        notes: 'Daily consistency block for coding practice and hydration goal.',
      },
      {
        id: 'routine-dinner',
        title: 'Dinner & Mindful Decompression',
        category: 'chill',
        startTime: '19:20',
        endTime: '20:00',
        completed: false,
        cognitiveWeight: 1,
        notes: 'Dinner with friends or family, and evening wind-down.',
      },
      {
        id: 'routine-study-3-night',
        title: '⭐ Night Deep Study (1 Hr): C Programming & Core Concepts',
        category: 'study',
        startTime: '20:00',
        endTime: '21:00',
        completed: false,
        cognitiveWeight: 4,
        notes: 'Dedicated 1-hour night study session for your Most Important Task.',
      },
      {
        id: 'routine-study-4-additional-study',
        title: '📘 Academic Study (1 Hr): Engineering Physics — Revision & Notes',
        category: 'study',
        startTime: '21:00',
        endTime: '22:00',
        completed: false,
        cognitiveWeight: 3,
        notes: 'Dedicated 1-hour focused revision session on core semester syllabus.',
      },
      {
        id: 'routine-night',
        title: '🌙 Night Wind-down: Tomorrow Timetable Sync & Rest',
        category: 'habit',
        startTime: '22:00',
        endTime: '23:30',
        completed: false,
        cognitiveWeight: 1,
        notes: 'Reflection, habit review, and restorative rest.',
      },
    ];
  });

  // 3. Subjects & Curriculum State (SATI Vidisha B.Tech CSE Official Syllabus)
  const [subjects, setSubjects] = useState<SubjectCourse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS) || localStorage.getItem('planzo_subjects_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return getFoundationSemesterSubjects(1);
  });

  // 4. Daily Reflections State (Starts clean for new user)
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REFLECTIONS) || localStorage.getItem('planzo_reflections_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 5. 75% Attendance State (Starts at 0 attended, 0 conducted for fresh tracking)
  const [attendance, setAttendance] = useState<SubjectAttendance[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || localStorage.getItem('planzo_attendance_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const defaultSubs = getCurriculumForSatiSemester(1);
    return defaultSubs.map((sub) => ({
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      attendedClasses: 0,
      totalClasses: 0,
      isLab: sub.name.toLowerCase().includes('lab'),
      professorName: 'SATI Vidisha Faculty',
    }));
  });

  // 6. Subject-Wise Folders State (Official 1st Year Notes & Curricula, PYQs, Lab Viva, Assignments)
  const [subjectFolders, setSubjectFolders] = useState<Record<string, SubjectFolderData>>(() => {
    const initialFirstYearFolders: Record<string, SubjectFolderData> = {};
    Object.values(FIRST_YEAR_SUBJECT_NOTES_CATALOG).forEach((detail) => {
      const folder = generateSubjectFolderDataFromCatalog(detail);
      initialFirstYearFolders[detail.subjectId] = folder;
      initialFirstYearFolders[detail.subjectCode.toLowerCase()] = folder;
      initialFirstYearFolders[detail.subjectCode] = folder;
    });

    const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS) || localStorage.getItem('planzo_folders_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge so that all 1st year foundation subject notes are guaranteed to exist, while keeping user changes
        return { ...initialFirstYearFolders, ...SATI_SUBJECT_FOLDERS_DATA, ...parsed };
      } catch (e) {}
    }
    return { ...SATI_SUBJECT_FOLDERS_DATA, ...initialFirstYearFolders };
  });

  // 7. Monthly Calendar Scheduled Tasks State
  const [scheduledTasks, setScheduledTasks] = useState<Record<string, DailyScheduledTask[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULED_TASKS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return generateDefaultScheduledTasks();
  });

  // UI States
  const [activeView, setActiveViewState] = useState<AppViewType>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p === '/tasks') return 'tasks';
      if (p === '/calendar' || p === '/schedule') return 'schedule';
      if (p === '/projects') return 'projects';
      if (p === '/profile') return 'profile';
      if (p === '/settings') return 'settings';
      if (p === '/timeline') return 'timeline';
      if (p === '/attendance') return 'attendance';
      if (p === '/academic') return 'academic';
      if (p === '/analytics') return 'analytics';
      if (p === '/ai') return 'ai';
    }
    return 'home';
  });

  const navigateToPath = (path: string, replace: boolean = false) => {
    if (typeof window === 'undefined') return;
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const setActiveView = (view: AppViewType) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      const routeMap: Record<AppViewType, string> = {
        home: '/dashboard',
        timeline: '/timeline',
        tasks: '/tasks',
        schedule: '/calendar',
        projects: '/projects',
        profile: '/profile',
        attendance: '/attendance',
        academic: '/academic',
        analytics: '/analytics',
        ai: '/ai',
        settings: '/settings',
      };
      const targetPath = routeMap[view] || '/dashboard';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    }
  };

  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [zenModeOpen, setZenModeOpen] = useState(false);
  const [activeZenTask, setActiveZenTask] = useState<TimetableItem | null>(null);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState<any | null>(null);
  const [isPersonalizationWizardOpen, setIsPersonalizationWizardOpen] = useState(false);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrateNotice, setRecalibrateNotice] = useState<string | null>(null);

  // Projects & Calendar Events State (Strictly scoped per user)
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([]);

  // User XP and Streak State - START AT ZERO for fresh account!
  const [userXp, setUserXp] = useState<number>(() => {
    const saved = localStorage.getItem('planzo_user_xp_v5');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [userStreak, setUserStreak] = useState<number>(() => {
    const saved = localStorage.getItem('planzo_user_streak_v5');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('planzo_user_xp_v5', userXp.toString());
  }, [userXp]);

  useEffect(() => {
    localStorage.setItem('planzo_user_streak_v5', userStreak.toString());
  }, [userStreak]);

  const awardXp = (amount: number, reason: string) => {
    setUserXp((prev) => prev + amount);
    setRecalibrateNotice(`+${amount} XP Earned! ${reason}`);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(subjectFolders));
  }, [subjectFolders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_TASKS, JSON.stringify(scheduledTasks));
  }, [scheduledTasks]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const nextCollege = updates.college !== undefined ? updates.college : prev.college;
      const nextCustomCollege = updates.customCollege !== undefined 
        ? updates.customCollege 
        : updates.college !== undefined 
          ? updates.college 
          : prev.customCollege;
      return {
        ...prev,
        ...updates,
        college: nextCollege,
        customCollege: nextCustomCollege,
      };
    });

    // Keep currentUser in sync with profile changes if logged in
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updatedUser: AuthUser = {
        ...prev,
        name: updates.name !== undefined ? updates.name : prev.name,
        college: updates.customCollege || updates.college || prev.college,
        branch: updates.branch !== undefined ? updates.branch : prev.branch,
        semester: updates.semester !== undefined ? updates.semester : prev.semester,
        rollNo: updates.rollNo !== undefined ? updates.rollNo : prev.rollNo,
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : prev.avatarUrl,
      };
      localStorage.setItem('planzo_auth_user_v1', JSON.stringify(updatedUser));
      return updatedUser;
    });

    if (updates.branch || updates.semester !== undefined) {
      const targetSem = updates.semester !== undefined ? updates.semester : (profile.semester || 1);
      const targetBranch = updates.branch || profile.branch || 'Computer Science & Engineering (CSE)';
      if (targetSem === 1 || targetSem === 2) {
        setSubjects(FOUNDATION_ENGINEERING_SUBJECTS.slice(0, 5));
      } else {
        const branchSubs = getBranchSemesterSubjects(targetBranch, targetSem);
        if (branchSubs && branchSubs.length > 0) {
          setSubjects(branchSubs);
        }
      }
    }
  };

  // Helper: Compute current consecutive streak of days with >= 7 completed tasks
  const computeSevenTaskStreak = (
    tasksByDate: Record<string, DailyScheduledTask[]>,
    todayTimetable: TimetableItem[]
  ): number => {
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];

    const getCountForDate = (dateKey: string): number => {
      if (dateKey === todayKey) {
        const fromTimetable = todayTimetable.filter((t) => t.completed).length;
        const fromScheduled = (tasksByDate[dateKey] || []).filter((t) => t.completed).length;
        return Math.max(fromTimetable, fromScheduled);
      }
      return (tasksByDate[dateKey] || []).filter((t) => t.completed).length;
    };

    // Check past consecutive days ending yesterday
    let pastStreak = 0;
    for (let offset = 1; offset <= 365; offset++) {
      const d = new Date(today);
      d.setDate(today.getDate() - offset);
      const key = d.toISOString().split('T')[0];
      if (getCountForDate(key) >= 7) {
        pastStreak += 1;
      } else {
        break;
      }
    }

    const todayCompleted = getCountForDate(todayKey);
    if (todayCompleted >= 7) {
      return pastStreak + 1;
    }
    return pastStreak;
  };

  // Keep userStreak synced with the 7-task completion rule
  useEffect(() => {
    const calculatedStreak = computeSevenTaskStreak(scheduledTasks, timetable);
    setUserStreak(calculatedStreak);
  }, [timetable, scheduledTasks]);

  const toggleItemComplete = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setTimetable((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const next = !item.completed;
          if (next) {
            awardXp(25, `Completed: ${item.title}`);
          }
          return { ...item, completed: next };
        }
        return item;
      });
      const nextScheduledForToday = updated.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        startTime: item.startTime,
        endTime: item.endTime,
        date: todayStr,
        completed: item.completed,
        cognitiveWeight: item.cognitiveWeight || 3,
        subjectId: item.subjectId,
      }));
      setScheduledTasks((prevScheduled) => {
        const nextScheduled = {
          ...prevScheduled,
          [todayStr]: nextScheduledForToday,
        };
        setUserStreak(computeSevenTaskStreak(nextScheduled, updated));
        return nextScheduled;
      });
      return updated;
    });
  };

  const parseTimeMins = (t: string): number => {
    if (!t) return 0;
    const parts = t.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  };

  const formatMinsToTime = (mins: number): string => {
    const bounded = Math.max(0, Math.min(1439, Math.round(mins)));
    const h = Math.floor(bounded / 60);
    const m = bounded % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Enforces strict wakeTime -> sleepTime boundaries and zero overlaps across any timetable list
  const enforceStrictNonOverlappingTimetable = (
    items: TimetableItem[],
    wTime: string = profile.wakeTime || '07:00',
    sTime: string = profile.sleepTime || '23:30'
  ): TimetableItem[] => {
    if (!items || items.length === 0) return [];
    const wakeM = parseTimeMins(wTime);
    let sleepM = parseTimeMins(sTime);
    if (sleepM <= wakeM) sleepM = 1439;

    const sorted = [...items].sort(
      (a, b) => parseTimeMins(a.startTime) - parseTimeMins(b.startTime)
    );

    const resolved: TimetableItem[] = [];
    let cursor = wakeM;

    for (let i = 0; i < sorted.length; i++) {
      const cur = { ...sorted[i] };
      const rawS = parseTimeMins(cur.startTime);
      const rawE = parseTimeMins(cur.endTime);
      const desiredDur = Math.max(15, rawE > rawS ? rawE - rawS : 30);

      const startM = Math.max(cursor, Math.min(sleepM - 10, rawS));
      if (startM >= sleepM) break;

      const endM = Math.min(sleepM, startM + desiredDur);
      cur.startTime = formatMinsToTime(startM);
      cur.endTime = formatMinsToTime(Math.max(startM + 10, endM));
      resolved.push(cur);
      cursor = parseTimeMins(cur.endTime);
    }

    return resolved;
  };

  const snoozeItem = (id: string, minutes: number = 30) => {
    setTimetable((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      const startM = parseTimeMins(target.startTime);
      const endM = parseTimeMins(target.endTime);
      const dur = Math.max(20, endM - startM);
      const newStartM = Math.min(1420, startM + minutes);
      const newEndM = Math.min(1439, newStartM + dur);

      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              startTime: formatMinsToTime(newStartM),
              endTime: formatMinsToTime(newEndM),
              snoozed: true,
            }
          : item
      );
      return enforceStrictNonOverlappingTimetable(updated);
    });
  };

  const shiftItemToEvening = (id: string) => {
    setTimetable((prev) => {
      const sleepM = parseTimeMins(profile.sleepTime || '23:30');
      const targetStart = Math.max(parseTimeMins(profile.collegeEnd || '17:00'), sleepM - 150);
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              startTime: formatMinsToTime(targetStart),
              endTime: formatMinsToTime(Math.min(sleepM, targetStart + 45)),
              snoozed: true,
              notes: (item.notes ? item.notes + ' · ' : '') + 'Moved to evening study slot.',
            }
          : item
      );
      return enforceStrictNonOverlappingTimetable(updated);
    });
  };

  const injectBufferZone = (afterItemId?: string, durationMinutes: number = 25) => {
    setTimetable((prev) => {
      const cEnd = profile.collegeEnd || '17:00';
      const newBuffer: TimetableItem = {
        id: `buffer-${Date.now()}`,
        title: 'Canteen Chai & Buffer Break',
        category: 'chill',
        startTime: cEnd,
        endTime: formatMinsToTime(parseTimeMins(cEnd) + durationMinutes),
        completed: false,
        cognitiveWeight: 1,
        notes: 'Unplug from monitors, grab cutting chai/samosa, and refresh your mind.',
      };

      if (!afterItemId) {
        return enforceStrictNonOverlappingTimetable([...prev, newBuffer]);
      }
      const index = prev.findIndex((item) => item.id === afterItemId);
      if (index === -1) {
        return enforceStrictNonOverlappingTimetable([...prev, newBuffer]);
      }
      const anchorEnd = prev[index].endTime;
      newBuffer.startTime = anchorEnd;
      newBuffer.endTime = formatMinsToTime(parseTimeMins(anchorEnd) + durationMinutes);
      const clone = [...prev];
      clone.splice(index + 1, 0, newBuffer);
      return enforceStrictNonOverlappingTimetable(clone);
    });

    setRecalibrateNotice(`Chai & Buffer Zone added. No engineering burnout today!`);
  };

  const recalibrateSchedule = async (missedItemTitle?: string) => {
    setIsRecalibrating(true);
    try {
      const { resolveDynamicApiUrl, logSarthiConnectivityEvent } = await import('../services/sarthiChatService');
      const recalibrateUrl = resolveDynamicApiUrl('/api/recalibrate');
      const response = await fetch(recalibrateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          items: timetable.filter((t) => !t.completed),
          missedItemTitle: missedItemTitle || 'Missed Study Slot',
          reason: 'Auto-adjustment triggered to balance student cognitive load',
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        logSarthiConnectivityEvent({
          stage: 'endpoint_attempt',
          endpoint: recalibrateUrl,
          status: response.status,
          message: `Recalibrate endpoint returned ${response.status}; using local schedule rebalance fallback.`,
        });
      }
      const data = response.ok && contentType.includes('application/json') ? await response.json() : {};

      setTimetable((prev) => {
        let hasBuffer = prev.some((i) => i.category === 'chill' && i.title.includes('Chai'));
        const updated = prev.map((item) => {
          if (!item.completed && item.category === 'study' && item.cognitiveWeight > 3) {
            return {
              ...item,
              cognitiveWeight: 3,
              notes: (item.notes ? item.notes + ' · ' : '') + 'Paced into 45-min sprint',
            };
          }
          return item;
        });

        if (!hasBuffer) {
          updated.push({
            id: `chill-recal-${Date.now()}`,
            title: 'Decompression & Chai Break',
            category: 'chill',
            startTime: profile.collegeEnd || '17:00',
            endTime: formatMinsToTime(parseTimeMins(profile.collegeEnd || '17:00') + 30),
            completed: false,
            cognitiveWeight: 1,
            notes: 'Restorative buffer added to prevent burnout.',
          });
        }
        return enforceStrictNonOverlappingTimetable(updated);
      });

      setRecalibrateNotice(
        data.summary || 'Schedule quietly balanced. Unfinished topics shifted into manageable sprints.'
      );
    } catch (err) {
      console.error(err);
      setRecalibrateNotice('Schedule quietly adjusted. Added a calm buffer block.');
    } finally {
      setIsRecalibrating(false);
    }
  };

  const clearRecalibrateNotice = () => setRecalibrateNotice(null);

  const toggleTopicComplete = (subjectId: string, moduleId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          modules: sub.modules.map((mod) => {
            if (mod.id !== moduleId) return mod;
            return {
              ...mod,
              topics: mod.topics.map((top) =>
                top.id === topicId ? { ...top, completed: !top.completed } : top
              ),
            };
          }),
        };
      })
    );
  };

  // 75% Attendance Functions
  const markAttendance = (subjectId: string, status: 'present' | 'absent') => {
    setAttendance((prev) =>
      prev.map((sub) => {
        if (sub.subjectId !== subjectId) return sub;
        const newAttended = status === 'present' ? sub.attendedClasses + 1 : sub.attendedClasses;
        const newTotal = sub.totalClasses + 1;
        return {
          ...sub,
          attendedClasses: newAttended,
          totalClasses: newTotal,
        };
      })
    );

    const targetSub = attendance.find((s) => s.subjectId === subjectId);
    if (status === 'present') {
      awardXp(15, `Attendance Marked: ${targetSub?.subjectCode || 'lecture'}`);
      setRecalibrateNotice(`Marked Present in ${targetSub?.subjectCode || 'lecture'}! 75% attendance boosted.`);
    } else {
      setRecalibrateNotice(`Marked Bunk / Absent in ${targetSub?.subjectCode || 'lecture'}. Attendance formula recalculated.`);
    }
  };

  const adjustAttendanceCount = (subjectId: string, attended: number, total: number) => {
    setAttendance((prev) =>
      prev.map((sub) =>
        sub.subjectId === subjectId
          ? { ...sub, attendedClasses: Math.max(0, attended), totalClasses: Math.max(1, total) }
          : sub
      )
    );
  };

  // Formula for B.Tech 75% Attendance & Bunk Calculator
  const calculateBunkStatus = (attended: number, total: number, target: number = 75): BunkCalculation => {
    if (total === 0) {
      return { percentage: 100, safeToBunk: 0, needToAttend: 0, isSafe: true, statusLabel: 'No classes yet' };
    }
    const targetFraction = target / 100;
    const currentFraction = attended / total;
    const percentage = Math.round(currentFraction * 1000) / 10;

    if (currentFraction >= targetFraction) {
      // Safe to bunk: how many more classes can we miss without dropping below target?
      // (attended) / (total + x) >= targetFraction  =>  total + x <= attended / targetFraction => x = floor(attended / targetFraction - total)
      const safeToBunk = Math.max(0, Math.floor(attended / targetFraction - total));
      return {
        percentage,
        safeToBunk,
        needToAttend: 0,
        isSafe: true,
        statusLabel: safeToBunk > 0 ? `Can safely bunk ${safeToBunk} more classes` : 'On the 75% edge (Do not bunk!)',
      };
    } else {
      // Below target: how many consecutive classes must we attend to reach target?
      // (attended + y) / (total + y) >= targetFraction => attended + y >= targetFraction * total + targetFraction * y
      // y * (1 - targetFraction) >= targetFraction * total - attended => y = ceil((targetFraction * total - attended) / (1 - targetFraction))
      const needToAttend = Math.max(1, Math.ceil((targetFraction * total - attended) / (1 - targetFraction)));
      return {
        percentage,
        safeToBunk: 0,
        needToAttend,
        isSafe: false,
        statusLabel: `Need to attend next ${needToAttend} classes to escape debar risk!`,
      };
    }
  };

  // Overall aggregate attendance
  const totalAttended = attendance.reduce((sum, s) => sum + s.attendedClasses, 0);
  const totalConducted = attendance.reduce((sum, s) => sum + s.totalClasses, 0);
  const overallAttendancePercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 1000) / 10 : 100;

  // Subject Folders Functions
  const toggleAssignmentStatus = (subjectId: string, assignmentId: string) => {
    setSubjectFolders((prev) => {
      const folder = prev[subjectId];
      if (!folder) return prev;
      return {
        ...prev,
        [subjectId]: {
          ...folder,
          assignments: folder.assignments.map((asg) =>
            asg.id === assignmentId ? { ...asg, completed: !asg.completed } : asg
          ),
        },
      };
    });
  };

  const addCustomNoteToFolder = (subjectId: string, note: FolderItem) => {
    setSubjectFolders((prev) => {
      const folder = prev[subjectId] || {
        subjectId,
        topperNotes: [],
        previousYearQuestions: [],
        labVivaQuestions: [],
        assignments: [],
      };
      return {
        ...prev,
        [subjectId]: {
          ...folder,
          topperNotes: [note, ...folder.topperNotes],
        },
      };
    });
    setRecalibrateNotice(`Added "${note.title}" to ${subjectId.toUpperCase()} folder.`);
  };

  // Monthly Calendar & Task Scheduling Methods
  const addTaskForDate = (task: Omit<DailyScheduledTask, 'id'>) => {
    const id = `task-${task.date}-${Date.now()}`;
    const newTask: DailyScheduledTask = { ...task, id };

    setScheduledTasks((prev) => {
      const existing = prev[task.date] || [];
      return { ...prev, [task.date]: [...existing, newTask] };
    });

    const todayStr = new Date().toISOString().split('T')[0];
    if (task.date === todayStr) {
      const newTimetableItem: TimetableItem = {
        id,
        title: task.title,
        category: task.category,
        startTime: task.startTime,
        endTime: task.endTime,
        completed: task.completed,
        cognitiveWeight: task.cognitiveWeight || 3,
        date: task.date,
      };
      setTimetable((prev) => [...prev, newTimetableItem]);
    }

    setRecalibrateNotice(`Scheduled "${task.title}" for ${task.date}.`);
  };

  const toggleTaskForDate = (date: string, taskId: string) => {
    setScheduledTasks((prev) => {
      const existing = prev[date] || [];
      const updated = existing.map((t) => {
        if (t.id === taskId) {
          const next = !t.completed;
          if (next) {
            awardXp(20, `Task Completed: ${t.title}`);
          }
          return { ...t, completed: next };
        }
        return t;
      });
      return { ...prev, [date]: updated };
    });

    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      setTimetable((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const deleteTaskForDate = (date: string, taskId: string) => {
    setScheduledTasks((prev) => {
      const existing = prev[date] || [];
      return { ...prev, [date]: existing.filter((t) => t.id !== taskId) };
    });

    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      setTimetable((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const getDateTaskStats = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tasks = scheduledTasks[dateStr];

    if (dateStr === todayStr && timetable.length > 0) {
      const total = timetable.length;
      const completed = timetable.filter((t) => t.completed).length;
      const percentage = total === 0 ? 100 : Math.round((completed / total) * 100);
      return { total, completed, percentage };
    }

    if (!tasks || tasks.length === 0) {
      return { total: 0, completed: 0, percentage: 0 };
    }

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  // Mental Bandwidth Computation
  const todayReflections = reflections.filter(
    (r) => r.date === new Date().toISOString().split('T')[0]
  );
  const todayReflection = todayReflections[0];

  const totalLoad = timetable.reduce((acc, item) => acc + (item.completed ? item.cognitiveWeight * 0.5 : item.cognitiveWeight), 0);
  const bufferCount = timetable.filter((i) => i.category === 'chill').length;
  const labMinutes = timetable.filter((i) => i.category === 'lab').length * 150;
  const studyMinutes = timetable.filter((i) => i.category === 'study').length * 60;
  const bufferMinutes = bufferCount * 30;

  let densityScore = Math.min(100, Math.round((totalLoad / 32) * 100));
  if (bufferCount >= 2) densityScore = Math.max(20, densityScore - 15);
  if (todayReflection && todayReflection.stressLevel >= 4) densityScore = Math.min(95, densityScore + 10);

  let status: MentalBandwidthState['status'] = 'balanced';
  let recommendation = 'Schedule has healthy focus intervals and breathing room.';

  if (densityScore < 40) {
    status = 'calm';
    recommendation = 'Light day. Perfect for DSA consistency or canteen chill.';
  } else if (densityScore > 75) {
    status = 'overload';
    recommendation = 'Heavy load (lab + theory). Take a chai break to protect your sanity.';
  } else if (densityScore > 60) {
    status = 'dense';
    recommendation = 'Moderate load. Take a brief screen detox after afternoon lab.';
  }

  const bandwidth: MentalBandwidthState = {
    densityScore,
    status,
    totalStudyMinutes: studyMinutes,
    totalLabMinutes: labMinutes,
    bufferMinutes,
    recommendation,
  };

  const addReflection = (energyLevel: number, focusLevel: number, stressLevel: number, note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      date: today,
      energyLevel,
      focusLevel,
      stressLevel,
      note,
      timestamp: new Date().toISOString(),
    };
    setReflections((prev) => [newEntry, ...prev.filter((r) => r.date !== today)]);
    setRecalibrateNotice('Daily reflection logged. Tomorrow\'s schedule calibrated.');
  };

  const startZenMode = (item?: TimetableItem) => {
    const target = item || timetable.find((t) => !t.completed && (t.category === 'study' || t.category === 'habit')) || timetable[0];
    setActiveZenTask(target || null);
    setZenModeOpen(true);
  };

  // Student Authentication State & Methods
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('planzo_auth_user_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isAuthenticated && parsed.id) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });

  // Helper: Generate starter projects & events for a user ID
  const getStarterProjectsForUser = (userId: string): ProjectItem[] => {
    const nextWeek = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    const twoWeeks = new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0];
    return [
      {
        id: `proj-${userId.slice(-6)}-1`,
        userId,
        name: 'Semester Core & Academic Excellence',
        description: 'Structured 1-hour deep study blocks, syllabus completion, and lab viva preparation.',
        status: 'active',
        progress: 68,
        dueDate: nextWeek,
        color: '#6C4DFF',
        createdAt: new Date().toISOString(),
      },
      {
        id: `proj-${userId.slice(-6)}-2`,
        userId,
        name: 'Full-Stack Capstone & DSA Sprint',
        description: 'Building production-ready engineering projects and solving daily algorithm problems.',
        status: 'active',
        progress: 45,
        dueDate: twoWeeks,
        color: '#3B9CFF',
        createdAt: new Date().toISOString(),
      },
    ];
  };

  const getStarterEventsForUser = (userId: string): CalendarEventItem[] => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const inThreeDays = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    return [
      {
        id: `evt-${userId.slice(-6)}-1`,
        userId,
        title: 'Algorithm Design & Problem Solving Sprint',
        date: today,
        startTime: '18:00',
        endTime: '19:00',
        type: 'study',
        notes: 'Focus on dynamic programming and graph traversal.',
        createdAt: new Date().toISOString(),
      },
      {
        id: `evt-${userId.slice(-6)}-2`,
        userId,
        title: 'Project Milestone Review & Submission',
        date: tomorrow,
        startTime: '14:00',
        endTime: '15:00',
        type: 'deadline',
        notes: 'Prepare demo walkthrough and architecture slides.',
        createdAt: new Date().toISOString(),
      },
      {
        id: `evt-${userId.slice(-6)}-3`,
        userId,
        title: 'Mid-Semester Assessment & Lab Evaluation',
        date: inThreeDays,
        startTime: '10:30',
        endTime: '12:30',
        type: 'milestone',
        notes: 'Review unit 1-3 notes and previous year questions.',
        createdAt: new Date().toISOString(),
      },
    ];
  };

  // Load strictly isolated user data whenever currentUser.id changes
  useEffect(() => {
    if (!currentUser || !currentUser.isAuthenticated || !currentUser.id) {
      setProjects([]);
      setCalendarEvents([]);
      return;
    }

    const uid = currentUser.id;
    const userPrefix = `planzo_u_${uid}_`;

    // 1. Load user-specific Timetable
    const savedTimetable = localStorage.getItem(`${userPrefix}timetable`);
    if (savedTimetable) {
      try {
        const parsed = JSON.parse(savedTimetable);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimetable(parsed);
        }
      } catch (e) {}
    }

    // 2. Load user-specific Scheduled Tasks
    const savedScheduled = localStorage.getItem(`${userPrefix}scheduled_tasks`);
    if (savedScheduled) {
      try {
        setScheduledTasks(JSON.parse(savedScheduled));
      } catch (e) {}
    } else {
      setScheduledTasks({});
    }

    // 3. Load user-specific Projects
    const savedProjects = localStorage.getItem(`${userPrefix}projects`);
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(Array.isArray(parsed) ? parsed : getStarterProjectsForUser(uid));
      } catch (e) {
        setProjects(getStarterProjectsForUser(uid));
      }
    } else {
      const starter = getStarterProjectsForUser(uid);
      setProjects(starter);
      localStorage.setItem(`${userPrefix}projects`, JSON.stringify(starter));
    }

    // 4. Load user-specific Calendar Events
    const savedEvents = localStorage.getItem(`${userPrefix}events`);
    if (savedEvents) {
      try {
        const parsed = JSON.parse(savedEvents);
        setCalendarEvents(Array.isArray(parsed) ? parsed : getStarterEventsForUser(uid));
      } catch (e) {
        setCalendarEvents(getStarterEventsForUser(uid));
      }
    } else {
      const starter = getStarterEventsForUser(uid);
      setCalendarEvents(starter);
      localStorage.setItem(`${userPrefix}events`, JSON.stringify(starter));
    }

    // 5. Load user-specific XP & Streak
    const savedXp = localStorage.getItem(`${userPrefix}xp`);
    if (savedXp !== null) setUserXp(parseInt(savedXp, 10) || 0);
    const savedStreak = localStorage.getItem(`${userPrefix}streak`);
    if (savedStreak !== null) setUserStreak(parseInt(savedStreak, 10) || 0);

    // 6. Also fetch from backend /api/workspace if sessionToken is available
    if (currentUser.sessionToken) {
      fetch('/api/workspace', {
        headers: { Authorization: `Bearer ${currentUser.sessionToken}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data) return;
          if (data.workspace?.timetable && Array.isArray(data.workspace.timetable) && data.workspace.timetable.length > 0) {
            setTimetable(data.workspace.timetable);
            localStorage.setItem(`${userPrefix}timetable`, JSON.stringify(data.workspace.timetable));
          }
          if (data.workspace?.scheduledTasks) {
            setScheduledTasks(data.workspace.scheduledTasks);
            localStorage.setItem(`${userPrefix}scheduled_tasks`, JSON.stringify(data.workspace.scheduledTasks));
          }
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            const mappedProjects: ProjectItem[] = data.projects.map((p: any) => ({
              id: p.id,
              userId: p.user_id || uid,
              name: p.name,
              description: p.description,
              status: p.status || 'active',
              progress: Number(p.progress ?? 50),
              dueDate: p.due_date || p.dueDate || new Date().toISOString().split('T')[0],
              color: p.color || '#6C4DFF',
              createdAt: p.created_at || p.createdAt || new Date().toISOString(),
            }));
            setProjects(mappedProjects);
            localStorage.setItem(`${userPrefix}projects`, JSON.stringify(mappedProjects));
          }
          if (Array.isArray(data.events) && data.events.length > 0) {
            const mappedEvents: CalendarEventItem[] = data.events.map((e: any) => ({
              id: e.id,
              userId: e.user_id || uid,
              title: e.title,
              date: e.date,
              startTime: e.start_time || e.startTime || '10:00',
              endTime: e.end_time || e.endTime || '11:00',
              type: e.type || 'study',
              notes: e.notes || '',
              createdAt: e.created_at || e.createdAt || new Date().toISOString(),
            }));
            setCalendarEvents(mappedEvents);
            localStorage.setItem(`${userPrefix}events`, JSON.stringify(mappedEvents));
          }
        })
        .catch(() => {});
    }
  }, [currentUser?.id]);

  // Persist user-scoped changes whenever timetable, scheduledTasks, projects, or events change
  useEffect(() => {
    if (!currentUser || !currentUser.isAuthenticated || !currentUser.id) return;
    const uid = currentUser.id;
    const userPrefix = `planzo_u_${uid}_`;

    localStorage.setItem(`${userPrefix}timetable`, JSON.stringify(timetable));
    localStorage.setItem(`${userPrefix}scheduled_tasks`, JSON.stringify(scheduledTasks));
    localStorage.setItem(`${userPrefix}projects`, JSON.stringify(projects));
    localStorage.setItem(`${userPrefix}events`, JSON.stringify(calendarEvents));
    localStorage.setItem(`${userPrefix}xp`, userXp.toString());
    localStorage.setItem(`${userPrefix}streak`, userStreak.toString());

    if (currentUser.sessionToken) {
      fetch('/api/workspace/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.sessionToken}`,
        },
        body: JSON.stringify({
          workspace: {
            timetable,
            scheduledTasks,
            profile,
            userXp,
            userStreak,
          },
          tasks: timetable,
          projects: projects.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            status: p.status,
            progress: p.progress,
            due_date: p.dueDate,
            color: p.color,
            created_at: p.createdAt,
          })),
          events: calendarEvents.map((e) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            start_time: e.startTime,
            end_time: e.endTime,
            type: e.type,
            notes: e.notes,
            created_at: e.createdAt,
          })),
        }),
      }).catch(() => {});
    }
  }, [timetable, scheduledTasks, projects, calendarEvents, userXp, userStreak, currentUser?.id]);

  // Projects CRUD (User-Isolated)
  const addProject = (proj: Omit<ProjectItem, 'id' | 'userId' | 'createdAt'>) => {
    const uid = currentUser?.id || 'guest';
    const newProj: ProjectItem = {
      ...proj,
      id: `proj-${Date.now()}`,
      userId: uid,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProj, ...prev]);
    awardXp(30, `Created Project: ${proj.name}`);
    setRecalibrateNotice(`Project "${proj.name}" created in your workspace.`);
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...updates };
        if (next.progress >= 100 && p.status !== 'completed') {
          next.status = 'completed';
          awardXp(50, `Project Completed: ${p.name}`);
        }
        return next;
      })
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Calendar Events CRUD (User-Isolated)
  const addCalendarEvent = (evt: Omit<CalendarEventItem, 'id' | 'userId' | 'createdAt'>) => {
    const uid = currentUser?.id || 'guest';
    const newEvt: CalendarEventItem = {
      ...evt,
      id: `evt-${Date.now()}`,
      userId: uid,
      createdAt: new Date().toISOString(),
    };
    setCalendarEvents((prev) => [...prev, newEvt].sort((a, b) => a.date.localeCompare(b.date)));
    addTaskForDate({
      title: evt.title,
      category: evt.type === 'deadline' ? 'assignment' : 'study',
      startTime: evt.startTime,
      endTime: evt.endTime,
      completed: false,
      date: evt.date,
      cognitiveWeight: evt.type === 'deadline' ? 4 : 3,
    });
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const signUp = (userData: {
    name: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    isVerified?: boolean;
    college?: string;
    branch?: string;
    semester?: number;
    rollNo?: string;
    avatarUrl?: string;
    id?: string;
    sessionToken?: string;
  }): { ok: boolean; error?: string; user?: AuthUser } => {
    const todayStr = new Date().toISOString().split('T')[0];
    const derivedFirstName = userData.firstName || (userData.name ? userData.name.trim().split(' ')[0] : 'Student');
    const derivedLastName = userData.lastName || (userData.name && userData.name.trim().split(' ').length > 1 ? userData.name.trim().split(' ').slice(1).join(' ') : '');
    const fullName = `${derivedFirstName} ${derivedLastName}`.trim();
    const cleanEmail = userData.email?.toLowerCase().trim() || `${derivedFirstName.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.planzo`;

    // Check duplicate email in localStorage registry
    try {
      const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
      const registeredUsers: AuthUser[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const existingByEmail = registeredUsers.find(
        (u) => u.email && u.email.toLowerCase() === cleanEmail
      );
      if (existingByEmail && !userData.sessionToken) {
        return {
          ok: false,
          error: 'An account with this email already exists. Please log in instead.',
        };
      }
    } catch (e) {}

    const userId = userData.id || `usr-${Date.now()}`;
    const userPrefix = `planzo_u_${userId}_`;

    const newUser: AuthUser = {
      id: userId,
      name: fullName,
      firstName: derivedFirstName,
      lastName: derivedLastName,
      email: cleanEmail,
      phone: userData.phone || '',
      password: userData.password || '',
      isVerified: userData.isVerified !== undefined ? userData.isVerified : true,
      rollNo: userData.rollNo || '',
      college: userData.college || 'Samrat Ashok Technological Institute (SATI), Vidisha M.P.',
      branch: userData.branch || 'B.Tech. Computer Science & Engineering',
      semester: userData.semester || 1,
      avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(derivedFirstName)}&colors=emerald,cyan,teal`,
      isAuthenticated: true,
      joinedAt: 'Just now',
      accountCreatedAt: todayStr,
      sessionToken: userData.sessionToken,
    };

    try {
      const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
      const registeredUsers: AuthUser[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const filtered = registeredUsers.filter((u) => u.email?.toLowerCase() !== cleanEmail);
      filtered.push(newUser);
      localStorage.setItem('planzo_registered_users_v1', JSON.stringify(filtered));
    } catch (e) {
      console.error('Error saving registered user', e);
    }

    // Initialize isolated starter data for this new user
    const starterProjs = getStarterProjectsForUser(userId);
    const starterEvts = getStarterEventsForUser(userId);
    setProjects(starterProjs);
    setCalendarEvents(starterEvts);
    localStorage.setItem(`${userPrefix}projects`, JSON.stringify(starterProjs));
    localStorage.setItem(`${userPrefix}events`, JSON.stringify(starterEvts));

    setUserXp(0);
    setUserStreak(0);
    localStorage.setItem(`${userPrefix}xp`, '0');
    localStorage.setItem(`${userPrefix}streak`, '0');
    localStorage.setItem('planzo_user_xp_v5', '0');
    localStorage.setItem('planzo_user_streak_v5', '0');

    const freshTasks: Record<string, DailyScheduledTask[]> = {};
    setScheduledTasks(freshTasks);
    localStorage.setItem(`${userPrefix}scheduled_tasks`, JSON.stringify(freshTasks));
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_TASKS, JSON.stringify(freshTasks));

    const targetSem = userData.semester || 1;
    const semSubjects = (targetSem === 1 || targetSem === 2)
      ? FOUNDATION_ENGINEERING_SUBJECTS.slice(0, 5)
      : getBranchSemesterSubjects(newUser.branch, targetSem);
    setSubjects(semSubjects);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(semSubjects));

    const cleanAttendance: SubjectAttendance[] = semSubjects.map((sub) => ({
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      attendedClasses: 0,
      totalClasses: 0,
      isLab: sub.name.toLowerCase().includes('lab'),
      professorName: 'SATI Vidisha Faculty',
    }));
    setAttendance(cleanAttendance);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(cleanAttendance));

    setReflections([]);
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify([]));

    const newProfile: StudentProfile = {
      name: fullName,
      firstName: derivedFirstName,
      lastName: derivedLastName,
      phone: userData.phone || '',
      isVerified: true,
      college: newUser.college,
      customCollege: newUser.college,
      branch: newUser.branch,
      semester: targetSem,
      rollNo: userData.rollNo || '',
      wakeTime: '07:00',
      sleepTime: '23:30',
      collegeStart: '10:30',
      collegeEnd: '17:30',
      selectedHabits: [DEFAULT_HABITS[0], DEFAULT_HABITS[1], DEFAULT_HABITS[2]],
      onboarded: true,
      accountCreatedAt: todayStr,
      avatarUrl: newUser.avatarUrl,
    };

    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    localStorage.setItem('planzo_profile_v3', JSON.stringify(newProfile));

    setCurrentUser(newUser);
    localStorage.setItem('planzo_auth_user_v1', JSON.stringify(newUser));

    setRecalibrateNotice(`Account created successfully. Welcome to Planzo, ${derivedFirstName}!`);
    return { ok: true, user: newUser };
  };

  const signIn = (identifier: string, password?: string): boolean => {
    const cleanId = identifier.trim();
    const cleanLower = cleanId.toLowerCase();
    const todayStr = new Date().toISOString().split('T')[0];

    let matchedUser: AuthUser | null = null;
    try {
      const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
      if (savedUsersRaw) {
        const users: AuthUser[] = JSON.parse(savedUsersRaw);
        matchedUser = users.find(
          (u) =>
            u.name.toLowerCase() === cleanLower ||
            (u.email && u.email.toLowerCase() === cleanLower) ||
            (u.firstName && u.firstName.toLowerCase() === cleanLower) ||
            (u.rollNo && u.rollNo.toLowerCase() === cleanLower)
        ) || null;
      }
    } catch (e) {}

    if (matchedUser) {
      // Strictly validate password if the user registered with one and this is not a verified OAuth token
      if (
        password !== 'oauth_verified_token' &&
        matchedUser.password &&
        password &&
        matchedUser.password !== password
      ) {
        return false;
      }
      const userToLogin: AuthUser = {
        ...matchedUser,
        isAuthenticated: true,
      };
      setCurrentUser(userToLogin);
      localStorage.setItem('planzo_auth_user_v1', JSON.stringify(userToLogin));

      const updatedProfile: StudentProfile = {
        ...profile,
        name: userToLogin.name,
        firstName: userToLogin.firstName || userToLogin.name.split(' ')[0],
        lastName: userToLogin.lastName || '',
        phone: userToLogin.phone || profile.phone || '',
        isVerified: true,
        college: userToLogin.college,
        customCollege: userToLogin.college,
        branch: userToLogin.branch,
        semester: userToLogin.semester,
        rollNo: userToLogin.rollNo,
      };
      setProfile(updatedProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
      localStorage.setItem('planzo_profile_v3', JSON.stringify(updatedProfile));
      setRecalibrateNotice(`Welcome back, ${userToLogin.firstName || userToLogin.name}!`);
      return true;
    }

    // If user is not yet in the local registry, automatically provision their account & log them in seamlessly
    if (cleanId && password && password.length >= 1) {
      const formatted = cleanId.includes('@') ? cleanId.split('@')[0] : cleanId;
      const cleanNameParts = formatted.replace(/[._-]/g, ' ').trim().split(/\s+/);
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const fName = capitalize(cleanNameParts[0] || 'Student');
      const lName = cleanNameParts.slice(1).map(capitalize).join(' ');
      const displayFullName = lName ? `${fName} ${lName}` : fName;
      const derivedEmail = cleanId.includes('@') ? cleanLower : `${fName.toLowerCase()}@planzo.app`;
      const userId = `usr-${cleanLower.replace(/[^a-z0-9]/g, '') || Date.now()}`;
      const userPrefix = `planzo_u_${userId}_`;

      const userToLogin: AuthUser = {
        id: userId,
        name: displayFullName,
        firstName: fName,
        lastName: lName,
        email: derivedEmail,
        phone: '',
        password: password,
        isVerified: true,
        rollNo: '',
        college: profile.customCollege || profile.college || 'Samrat Ashok Technological Institute (SATI), Vidisha M.P.',
        branch: profile.branch || 'B.Tech. Computer Science & Engineering',
        semester: profile.semester || 1,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fName)}&colors=emerald,cyan,teal`,
        isAuthenticated: true,
        joinedAt: 'Active Member',
        accountCreatedAt: todayStr,
      };

      try {
        const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
        const registeredUsers: AuthUser[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
        registeredUsers.push(userToLogin);
        localStorage.setItem('planzo_registered_users_v1', JSON.stringify(registeredUsers));
      } catch (e) {}

      // Initialize starter projects & events if not already present for this user
      if (!localStorage.getItem(`${userPrefix}projects`)) {
        const starterProjs = getStarterProjectsForUser(userId);
        setProjects(starterProjs);
        localStorage.setItem(`${userPrefix}projects`, JSON.stringify(starterProjs));
      }
      if (!localStorage.getItem(`${userPrefix}events`)) {
        const starterEvts = getStarterEventsForUser(userId);
        setCalendarEvents(starterEvts);
        localStorage.setItem(`${userPrefix}events`, JSON.stringify(starterEvts));
      }

      const updatedProfile: StudentProfile = {
        ...profile,
        name: userToLogin.name,
        firstName: userToLogin.firstName,
        lastName: userToLogin.lastName,
        isVerified: true,
        onboarded: true,
      };
      setProfile(updatedProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
      localStorage.setItem('planzo_profile_v3', JSON.stringify(updatedProfile));

      setCurrentUser(userToLogin);
      localStorage.setItem('planzo_auth_user_v1', JSON.stringify(userToLogin));
      setRecalibrateNotice(`Welcome to Planzo, ${fName}!`);
      return true;
    }

    return false;
  };

  // Full Backend + Local Synchronized Registration
  const registerAccount = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string; user?: AuthUser }> => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return { ok: false, error: 'All fields are required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters long.' };
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: cleanName, email: cleanEmail, password }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, error: data.error || 'Could not create account.' };
        }
        const parts = cleanName.split(' ');
        const result = signUp({
          id: data.user?.id,
          name: cleanName,
          firstName: parts[0] || cleanName,
          lastName: parts.slice(1).join(' '),
          email: cleanEmail,
          password,
          isVerified: true,
          sessionToken: data.token,
        });
        return result;
      }
    } catch (e) {
      // Fallback to local persistent store if running on static host
    }

    const parts = cleanName.split(' ');
    return signUp({
      name: cleanName,
      firstName: parts[0] || cleanName,
      lastName: parts.slice(1).join(' '),
      email: cleanEmail,
      password,
      isVerified: true,
    });
  };

  // Full Backend + Local Synchronized Login
  const authenticateWithCredentials = async (
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string; user?: AuthUser }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { ok: false, error: 'Please enter both your email and password.' };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          // Also check localStorage in case user registered locally before server restart
          const localSuccess = signIn(cleanEmail, password);
          if (localSuccess) {
            return { ok: true };
          }
          return { ok: false, error: data.error || 'Invalid email or password.' };
        }

        // Sync user into local registry and state
        const dbUser = data.user;
        const parts = (dbUser.full_name || cleanEmail).split(' ');
        const fName = parts[0] || 'Student';
        const lName = parts.slice(1).join(' ');
        const syncedUser: AuthUser = {
          id: dbUser.id,
          name: dbUser.full_name,
          firstName: fName,
          lastName: lName,
          email: dbUser.email,
          password,
          isVerified: true,
          college: dbUser.college || profile.college || 'Samrat Ashok Technological Institute (SATI), Vidisha M.P.',
          branch: dbUser.branch || profile.branch || 'B.Tech. Computer Science & Engineering',
          semester: dbUser.semester || profile.semester || 1,
          avatarUrl: dbUser.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fName)}&colors=emerald,cyan,teal`,
          isAuthenticated: true,
          joinedAt: 'Active Member',
          accountCreatedAt: (dbUser.created_at || new Date().toISOString()).split('T')[0],
          sessionToken: data.token,
        };

        try {
          const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
          const registeredUsers: AuthUser[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
          const filtered = registeredUsers.filter((u) => u.email?.toLowerCase() !== cleanEmail);
          filtered.push(syncedUser);
          localStorage.setItem('planzo_registered_users_v1', JSON.stringify(filtered));
        } catch (e) {}

        setCurrentUser(syncedUser);
        localStorage.setItem('planzo_auth_user_v1', JSON.stringify(syncedUser));

        setProfile((prev) => {
          const updated = {
            ...prev,
            name: syncedUser.name,
            firstName: syncedUser.firstName,
            lastName: syncedUser.lastName,
            college: syncedUser.college,
            customCollege: syncedUser.college,
            branch: syncedUser.branch,
            semester: syncedUser.semester,
          };
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
          return updated;
        });

        setRecalibrateNotice(`Welcome back, ${fName}!`);
        return { ok: true, user: syncedUser };
      }
    } catch (e) {}

    // Fallback check against local registry
    try {
      const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
      const users: AuthUser[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const found = users.find(
        (u) =>
          (u.email && u.email.toLowerCase() === cleanEmail) ||
          u.name.toLowerCase() === cleanEmail
      );
      if (!found) {
        return { ok: false, error: 'No account found with that email address. Please sign up first.' };
      }
      if (found.password && found.password !== password) {
        return { ok: false, error: 'Incorrect email or password. Please try again.' };
      }
      signIn(cleanEmail, password);
      return { ok: true, user: found };
    } catch (e) {
      return { ok: false, error: 'Authentication error. Please try again.' };
    }
  };

  // Password Reset Flow (Verify email & update password)
  const requestPasswordReset = async (
    email: string,
    newPassword?: string
  ): Promise<{ ok: boolean; step?: string; message?: string; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { ok: false, error: 'Please enter your registered email address.' };
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, newPassword }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok) {
          // Also sync updated password in local registry if newPassword was provided
          if (newPassword) {
            try {
              const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
              if (savedUsersRaw) {
                const users: AuthUser[] = JSON.parse(savedUsersRaw);
                const updated = users.map((u) =>
                  u.email?.toLowerCase() === cleanEmail ? { ...u, password: newPassword } : u
                );
                localStorage.setItem('planzo_registered_users_v1', JSON.stringify(updated));
              }
            } catch (e) {}
          }
          return { ok: true, step: data.step, message: data.message };
        }
      }
    } catch (e) {}

    // Check local registry fallback
    try {
      const savedUsersRaw = localStorage.getItem('planzo_registered_users_v1');
      const users: AuthUser[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const idx = users.findIndex((u) => u.email?.toLowerCase() === cleanEmail);
      if (idx === -1) {
        return { ok: false, error: 'No account found with that email address.' };
      }
      if (newPassword !== undefined) {
        if (newPassword.length < 8) {
          return { ok: false, error: 'New password must be at least 8 characters long.' };
        }
        users[idx].password = newPassword;
        localStorage.setItem('planzo_registered_users_v1', JSON.stringify(users));
        return {
          ok: true,
          step: 'reset_complete',
          message: 'Your password has been reset successfully! You can now log in with your new password.',
        };
      }
      return {
        ok: true,
        step: 'email_verified',
        message: 'Account verified! Enter your new password below to complete the reset.',
      };
    } catch (e) {
      return { ok: false, error: 'Failed to process password reset.' };
    }
  };

  const signOut = () => {
    if (currentUser?.sessionToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.sessionToken}` },
      }).catch(() => {});
    }
    setCurrentUser(null);
    localStorage.removeItem('planzo_auth_user_v1');
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const scheduleStudyBlock = (block: {
    title: string;
    category: ItemCategory;
    startTime: string;
    endTime: string;
    date: string;
    subjectId?: string;
    cognitiveWeight?: number;
    notes?: string;
  }) => {
    const taskId = `block-${Date.now()}`;
    const newTask: DailyScheduledTask = {
      id: taskId,
      title: block.title,
      category: block.category,
      startTime: block.startTime,
      endTime: block.endTime,
      completed: false,
      date: block.date,
      cognitiveWeight: block.cognitiveWeight || 3,
    };

    // 1. Add to scheduledTasks
    addTaskForDate(newTask);

    // 2. If for today, also add to active timetable
    const todayStr = new Date().toISOString().split('T')[0];
    if (block.date === todayStr) {
      const timetableItem: TimetableItem = {
        id: taskId,
        title: block.title,
        category: block.category,
        startTime: block.startTime,
        endTime: block.endTime,
        completed: false,
        cognitiveWeight: block.cognitiveWeight || 3,
        notes: block.notes,
        date: block.date,
        subjectId: block.subjectId,
      };
      setTimetable((prev) => [...prev, timetableItem].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    }

    setRecalibrateNotice(`Study block "${block.title}" scheduled for ${block.date} at ${block.startTime}!`);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        timetable,
        setTimetable,
        toggleItemComplete,
        snoozeItem,
        shiftItemToEvening,
        injectBufferZone,
        recalibrateSchedule,
        isRecalibrating,
        recalibrateNotice,
        clearRecalibrateNotice,
        subjects,
        setSubjects,
        toggleTopicComplete,
        bandwidth,
        reflections,
        addReflection,
        todayReflection,
        zenModeOpen,
        setZenModeOpen,
        activeZenTask,
        startZenMode,
        activeView,
        setActiveView,
        navigateToPath,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isAttendanceModalOpen,
        setIsAttendanceModalOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        selectedResourceForModal,
        setSelectedResourceForModal,
        isPersonalizationWizardOpen,
        setIsPersonalizationWizardOpen,
        // Attendance
        attendance,
        setAttendance,
        markAttendance,
        adjustAttendanceCount,
        calculateBunkStatus,
        overallAttendancePercentage,
        // Subject Folders
        subjectFolders,
        toggleAssignmentStatus,
        addCustomNoteToFolder,
        // Monthly Calendar & Scheduling
        scheduledTasks,
        addTaskForDate,
        toggleTaskForDate,
        deleteTaskForDate,
        getDateTaskStats,
        // Projects & Calendar Events
        projects,
        addProject,
        updateProject,
        deleteProject,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        // XP & Day Streak Feature
        userXp,
        userStreak,
        awardXp,
        // Auth
        currentUser,
        signUp,
        signIn,
        authenticateWithCredentials,
        registerAccount,
        requestPasswordReset,
        signOut,
        // Study Block Scheduling
        scheduleStudyBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
