export type FlashcardColor = 'red' | 'orange' | 'yellow' | 'white';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  provider: 'google' | 'gmail' | 'facebook' | 'local';
  university: string;
  major: string;
  canNotify: boolean;
  canBookmark: boolean;
  createdAt: string;
}

export interface LiveAlert {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'schedule' | 'appointment' | 'alarm' | 'setup';
  time: string;
  timestamp: number;
  read?: boolean;
}

export interface Task {
  id: string;
  title: string;
  note?: string;
  category: 'work' | 'life' | 'study';
  flashcardColor: FlashcardColor;
  priorityLabel: string;
  subCategory: 
    | 'work_routine'       // Làm thêm, đi học thường ngày (Cam)
    | 'work_important'     // Rất quan trọng (Đỏ)
    | 'work_general'       // Cần hoàn thành (Vàng) hoặc thường (Trắng)
    | 'study_assignment'   // Bài tập
    | 'study_extra'        // Học thêm
    | 'study_reading'      // Đọc sách
    | 'study_softskills'   // Kỹ năng mềm
    | 'life_dining'        // Ăn uống
    | 'life_entertainment' // Giải trí
    | 'life_fitness';      // Vận động
  dueTime?: string; // e.g. "14:30"
  dueDate?: string; // YYYY-MM-DD
  durationMinutes: number;
  completed: boolean;
  completedAt?: string;
  soundAlert: boolean;
  notifyBeforeMinutes: number; // 0, 15, 20, 30
  isPinned?: boolean;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 0: CN, 1: T2, 2: T3, ... 6: T7
  startTime: string; // "07:00"
  endTime: string;   // "09:30"
  title: string;
  category: 'study' | 'work' | 'personal';
  location?: string;
  sticker?: string;
  alertBefore: number; // 20, 30, 15, 0
  reminderSound: string;
  isBookmarked: boolean;
  completed?: boolean;
  notes?: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // "15:00"
  location: string;
  alertMinutesBefore: 0 | 15 | 20 | 30;
  note?: string;
  category: 'study' | 'work' | 'personal';
  completed: boolean;
  dismissedAlert?: boolean;
}

export interface AlarmItem {
  id: string;
  time: string; // "06:30"
  label: string;
  days: number[]; // [1,2,3,4,5]
  enabled: boolean;
  soundType: 'sweet' | 'bell' | 'marimba' | 'birds';
  snoozeMinutes: number;
}

export interface PetItem {
  id: string;
  name: string;
  type: 'hat' | 'accessory' | 'costume';
  icon: string;
  requiredStreak: number;
  starPrice: number;
  description: string;
  svgLayer: string; // identifier for rendering
}

export interface VirtualPet {
  type: 'cat' | 'rabbit' | 'bear' | 'fox' | 'penguin' | 'puppy';
  name: string;
  level: number;
  exp: number;
  streak: number;
  stars: number;
  happiness: number; // 0 - 100
  hunger: number;    // 0 - 100
  equippedHat?: string;
  equippedAccessory?: string;
  unlockedItems: string[];
  claimedMilestones?: number[];
  lastSpinDate?: string;
}

export interface UserSettings {
  fontSize: 'sm' | 'md' | 'lg';
  fontFamily: 'quicksand' | 'nunito' | 'bevietnam';
  theme: 'sakura' | 'sweet_peach' | 'lavender' | 'night_pastel';
  soundPreset: 'sweet' | 'bell' | 'marimba' | 'birds';
  timetableDecor: 'mimi_cats' | 'sparkles' | 'strawberries' | 'boba';
  pomodoroWork: number;       // default 25
  pomodoroBreak: number;      // default 5
  pomodoroLongBreak: number;  // default 15
  soundEnabled: boolean;
  notificationsAllowed: boolean;
  allowScheduleBookmark: boolean;
  allowScheduleAlerts: boolean;
}

export interface ProductivitySummary {
  completedTodayCount: number;
  focusMinutesToday: number;
  streakCount: number;
  weeklyHistory: {
    day: string;
    completed: number;
    focusMinutes: number;
  }[];
}
