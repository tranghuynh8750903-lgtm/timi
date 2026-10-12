import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Flame, 
  Star, 
  Bell, 
  Volume2, 
  Heart,
  ChevronRight,
  BookOpen,
  LogOut,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
  Compass
} from 'lucide-react';

import { 
  Task, 
  ScheduleItem, 
  Appointment, 
  AlarmItem, 
  VirtualPet, 
  UserSettings, 
  UserAccount 
} from './types';

import { 
  getAccountKeys,
  GLOBAL_STORAGE_KEYS,
  createFreshUserData,
  loadData, 
  saveData, 
  removeData,
  purgeAccountData,
  DEFAULT_USER_SETTINGS
} from './utils/storage';

import { playChime, playSuccessSound } from './utils/audio';

import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { ScheduleSection } from './components/ScheduleSection';
import { PomodoroAndCountdown } from './components/PomodoroAndCountdown';
import { CompletedTracker } from './components/CompletedTracker';
import { SearchAndIndexModal } from './components/SearchAndIndexModal';
import { TaskModal } from './components/TaskModal';
import { VirtualPetModal } from './components/VirtualPetModal';
import { AlarmAndAlertsModal } from './components/AlarmAndAlertsModal';
import { SettingsAndAccountModal } from './components/SettingsAndAccountModal';
import { AuthModal } from './components/AuthModal';
import { MascotAvatar } from './components/CuteIllustrations';
import { RealTimeClockBanner } from './components/RealTimeClockBanner';
import { LiveAlertToast } from './components/LiveAlertToast';
import { useRealTimeNotifier } from './hooks/useRealTimeNotifier';

export default function App() {
  // 1. Registered accounts list (Loaded from localStorage)
  const [allAccounts, setAllAccounts] = useState<UserAccount[]>(() => {
    return loadData<UserAccount[]>(GLOBAL_STORAGE_KEYS.REGISTERED_ACCOUNTS, []);
  });

  // 2. Active User state: Starts as NULL (chưa có người đăng nhập) unless previously explicitly logged in
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const activeId = loadData<string | null>(GLOBAL_STORAGE_KEYS.CURRENT_USER_ID, null);
    if (activeId) {
      const savedAccounts = loadData<UserAccount[]>(GLOBAL_STORAGE_KEYS.REGISTERED_ACCOUNTS, []);
      const found = savedAccounts.find(a => a.id === activeId);
      if (found) return found;
    }
    return null; // App starts as unauthenticated by default per user request
  });

  // 3. Isolated per-account states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [pet, setPet] = useState<VirtualPet>(() => {
    const dummyUser: UserAccount = {
      id: 'default_guest',
      name: 'Sinh Viên',
      email: 'student@timi.vn',
      avatar: '🐰',
      provider: 'local',
      university: 'Đại Học',
      major: 'Sinh Viên',
      canNotify: true,
      canBookmark: true,
      createdAt: new Date().toISOString()
    };
    return createFreshUserData(dummyUser).pet;
  });
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);

  // Navigation state
  const [activeView, setActiveView] = useState<'home' | 'schedule' | 'pomodoro' | 'completed'>('home');
  const [homeTab, setHomeTab] = useState<'work' | 'life' | 'study'>('work');
  const [selectedTaskForPomodoro, setSelectedTaskForPomodoro] = useState<Task | null>(null);

  // Modal open states
  const [isSearchIndexOpen, setIsSearchIndexOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskCategory, setDefaultTaskCategory] = useState<'work' | 'life' | 'study'>('work');
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isAlarmsModalOpen, setIsAlarmsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Track if current user data has loaded to prevent accidental overwrite
  const isLoadedForUser = useRef<string | null>(null);

  // LOAD ISOLATED DATA WHEN CURRENT USER CHANGES
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setSchedule([]);
      setAppointments([]);
      setAlarms([]);
      isLoadedForUser.current = null;
      return;
    }

    const keys = getAccountKeys(currentUser.id);
    const freshData = createFreshUserData(currentUser);

    const loadedTasks = loadData<Task[]>(keys.TASKS, freshData.tasks);
    const loadedSchedule = loadData<ScheduleItem[]>(keys.SCHEDULE, freshData.schedule);
    const loadedAppointments = loadData<Appointment[]>(keys.APPOINTMENTS, freshData.appointments);
    const loadedAlarms = loadData<AlarmItem[]>(keys.ALARMS, freshData.alarms);
    const loadedPet = loadData<VirtualPet>(keys.PET, freshData.pet);
    const loadedSettings = loadData<UserSettings>(keys.SETTINGS, freshData.settings);

    setTasks(loadedTasks);
    setSchedule(loadedSchedule);
    setAppointments(loadedAppointments);
    setAlarms(loadedAlarms);
    setPet(loadedPet);
    setSettings(loadedSettings);

    saveData(GLOBAL_STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    isLoadedForUser.current = currentUser.id;
  }, [currentUser?.id]);

  // SAVE ISOLATED DATA WHEN USER MODIFIES STATE (ONLY FOR THE ACTIVE USER)
  useEffect(() => {
    if (!currentUser || isLoadedForUser.current !== currentUser.id) return;
    const keys = getAccountKeys(currentUser.id);
    saveData(keys.TASKS, tasks);
  }, [tasks, currentUser?.id]);

  useEffect(() => {
    if (!currentUser || isLoadedForUser.current !== currentUser.id) return;
    const keys = getAccountKeys(currentUser.id);
    saveData(keys.SCHEDULE, schedule);
  }, [schedule, currentUser?.id]);

  useEffect(() => {
    if (!currentUser || isLoadedForUser.current !== currentUser.id) return;
    const keys = getAccountKeys(currentUser.id);
    saveData(keys.APPOINTMENTS, appointments);
  }, [appointments, currentUser?.id]);

  useEffect(() => {
    if (!currentUser || isLoadedForUser.current !== currentUser.id) return;
    const keys = getAccountKeys(currentUser.id);
    saveData(keys.ALARMS, alarms);
  }, [alarms, currentUser?.id]);

  useEffect(() => {
    if (!currentUser || isLoadedForUser.current !== currentUser.id) return;
    const keys = getAccountKeys(currentUser.id);
    saveData(keys.PET, pet);
  }, [pet, currentUser?.id]);

  useEffect(() => {
    if (!currentUser || isLoadedForUser.current !== currentUser.id) return;
    const keys = getAccountKeys(currentUser.id);
    saveData(keys.SETTINGS, settings);
  }, [settings, currentUser?.id]);

  // Sync registered accounts list
  useEffect(() => {
    saveData(GLOBAL_STORAGE_KEYS.REGISTERED_ACCOUNTS, allAccounts);
  }, [allAccounts]);

  // ================= REAL-TIME CLOCK & ALERT SYSTEM =================
  const { currentDate, activeAlerts, dismissAlert, triggerTestAlert, notifySetupEvent } = useRealTimeNotifier({
    tasks,
    schedule,
    appointments,
    alarms,
    soundEnabled: settings.soundEnabled,
    onCompleteTask: (taskId) => handleToggleTask(taskId)
  });

  // ================= TASK HANDLERS =================
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          // Reward pet
          setPet(p => ({
            ...p,
            exp: p.exp + 15,
            stars: p.stars + 10,
            happiness: Math.min(100, p.happiness + 5)
          }));
        }
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return t;
    }));
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    const targetUserId = currentUser ? currentUser.id : 'guest';
    if (taskData.id) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } as Task : t));
    } else {
      const newTask: Task = {
        id: `task_${targetUserId}_${Date.now()}`,
        title: taskData.title || '',
        note: taskData.note,
        category: taskData.category || 'work',
        flashcardColor: taskData.flashcardColor || 'red',
        priorityLabel: taskData.priorityLabel || 'Cần hoàn thành',
        subCategory: taskData.subCategory || 'work_important',
        dueTime: taskData.dueTime,
        dueDate: taskData.dueDate || 'Hôm nay',
        durationMinutes: taskData.durationMinutes || 30,
        completed: false,
        soundAlert: taskData.soundAlert ?? true,
        notifyBeforeMinutes: taskData.notifyBeforeMinutes ?? 20,
        isPinned: taskData.isPinned ?? false
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);

    // Prompt real-time notification confirmation for setup time
    if (taskData.dueTime) {
      notifySetupEvent(
        taskData.title || 'Công việc mới',
        taskData.dueTime,
        taskData.notifyBeforeMinutes ?? 20
      );
    } else {
      playSuccessSound();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    playChime('sweet');
  };

  const handleClearAllCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
    playChime('sweet');
  };

  // ================= SCHEDULE HANDLERS =================
  const handleAddScheduleItem = (item: Partial<ScheduleItem>) => {
    const targetUserId = currentUser ? currentUser.id : 'guest';
    const newItem: ScheduleItem = {
      id: `sch_${targetUserId}_${Date.now()}`,
      dayOfWeek: item.dayOfWeek ?? 1,
      startTime: item.startTime || '08:00',
      endTime: item.endTime || '10:00',
      title: item.title || '',
      category: item.category || 'study',
      location: item.location,
      sticker: item.sticker || 'books',
      alertBefore: item.alertBefore ?? 30,
      reminderSound: item.reminderSound || 'sweet',
      isBookmarked: item.isBookmarked ?? true,
      completed: false
    };
    setSchedule(prev => [...prev, newItem]);
    notifySetupEvent(
      newItem.title,
      newItem.startTime,
      newItem.alertBefore,
      newItem.location
    );
  };

  const handleDeleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
    playChime('sweet');
  };

  const handleToggleBookmark = (id: string) => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s));
  };

  // ================= APPOINTMENTS HANDLERS =================
  const handleAddAppointment = (apt: Partial<Appointment>) => {
    const targetUserId = currentUser ? currentUser.id : 'guest';
    const newApt: Appointment = {
      id: `apt_${targetUserId}_${Date.now()}`,
      title: apt.title || '',
      date: apt.date || new Date().toISOString().split('T')[0],
      time: apt.time || '15:00',
      location: apt.location || '',
      alertMinutesBefore: apt.alertMinutesBefore ?? 30,
      note: apt.note,
      category: apt.category || 'study',
      completed: false
    };
    setAppointments(prev => [newApt, ...prev]);
    notifySetupEvent(
      newApt.title,
      newApt.time,
      newApt.alertMinutesBefore,
      newApt.location
    );
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    playChime('sweet');
  };

  const handleToggleAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  // Pomodoro session completion
  const handleCompletePomodoroSession = (focusMinutes: number) => {
    setPet(p => ({
      ...p,
      exp: p.exp + focusMinutes,
      stars: p.stars + 15,
      streak: p.streak + 1,
      happiness: Math.min(100, p.happiness + 8)
    }));
  };

  // ================= ACCOUNT SWITCHING & ISOLATION =================
  const handleSwitchAccount = (account: UserAccount) => {
    if (currentUser && account.id === currentUser.id) return;
    playSuccessSound();
    setCurrentUser(account);
  };

  const handleSaveAccount = (updatedAccount: UserAccount) => {
    setCurrentUser(updatedAccount);
    setAllAccounts(prev => prev.map(a => a.id === updatedAccount.id ? updatedAccount : a));
  };

  const handleDeleteAccount = (accountId: string) => {
    purgeAccountData(accountId);
    const remaining = allAccounts.filter(a => a.id !== accountId);
    setAllAccounts(remaining);

    if (remaining.length > 0) {
      setCurrentUser(remaining[0]);
    } else {
      setCurrentUser(null);
      removeData(GLOBAL_STORAGE_KEYS.CURRENT_USER_ID);
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    playChime('sweet');
    removeData(GLOBAL_STORAGE_KEYS.CURRENT_USER_ID);
    setCurrentUser(null);
    isLoadedForUser.current = null;
    setTasks([]);
    setSchedule([]);
    setAppointments([]);
    setAlarms([]);
    setActiveView('home');
  };

  const handleLoginSuccess = (account: UserAccount) => {
    setAllAccounts(prev => {
      const idx = prev.findIndex(a => a.id === account.id || a.email.toLowerCase() === account.email.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...account };
        return copy;
      }
      return [...prev, account];
    });
    setCurrentUser(account);
    saveData(GLOBAL_STORAGE_KEYS.CURRENT_USER_ID, account.id);
    setIsAuthModalOpen(false);
    playSuccessSound();
  };

  // Navigation from search/index
  const handleIndexNavigation = (targetId: string) => {
    if (targetId === 'work' || targetId === 'life' || targetId === 'study') {
      setActiveView('home');
      setHomeTab(targetId as any);
    } else if (targetId === 'schedule') {
      setActiveView('schedule');
    } else if (targetId === 'pomodoro') {
      setActiveView('pomodoro');
    } else if (targetId === 'completed') {
      setActiveView('completed');
    } else if (targetId === 'pet') {
      setIsPetModalOpen(true);
    } else if (targetId === 'alarms') {
      setIsAlarmsModalOpen(true);
    } else if (targetId === 'settings') {
      setIsSettingsModalOpen(true);
    }
  };

  // Dynamic Theme & Typography Class Generator
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'sweet_peach':
        return 'theme-sweet_peach bg-[#FFF7F2] text-[#4A3528]';
      case 'lavender':
        return 'theme-lavender bg-[#FAF5FF] text-[#3B284C]';
      case 'night_pastel':
        return 'theme-night_pastel bg-[#16131D] text-[#F3E8FF]';
      case 'sakura':
      default:
        return 'theme-sakura bg-[#FFF5F7] text-[#4A3B43]';
    }
  };

  const getFontFamilyClass = () => {
    if (settings.fontFamily === 'nunito') return 'font-nunito';
    if (settings.fontFamily === 'bevietnam') return 'font-bevietnam';
    return 'font-quicksand';
  };

  const getFontSizeClass = () => {
    if (settings.fontSize === 'sm') return 'text-[13px]';
    if (settings.fontSize === 'lg') return 'text-[17px]';
    return 'text-[15px]';
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} ${getFontFamilyClass()} ${getFontSizeClass()} flex flex-col transition-colors duration-300 selection:bg-[#FFD1DC] selection:text-[#7D2E49]`}>
      {/* Live Toast Alerts Popups */}
      <LiveAlertToast
        alerts={activeAlerts}
        onDismiss={dismissAlert}
        onCompleteTask={handleToggleTask}
      />

      {/* Top Navbar with Account Switcher & Real Time */}
      <Navbar
        currentUser={currentUser}
        allAccounts={allAccounts}
        pet={pet}
        settings={settings}
        activeView={activeView}
        currentTime={currentDate}
        onNavigate={(view) => setActiveView(view as any)}
        onOpenSearchAndIndex={() => setIsSearchIndexOpen(true)}
        onOpenPetModal={() => setIsPetModalOpen(true)}
        onOpenAlarmsModal={() => setIsAlarmsModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onSwitchAccount={handleSwitchAccount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Account Identity Banner or Unauthenticated Welcome Banner */}
      {currentUser ? (
        <div className="bg-white/80 border-b border-[#FFE4E8] py-1.5 px-4 text-center text-xs flex items-center justify-center gap-2 flex-wrap animate-fadeIn">
          <span className="text-sm">{currentUser.avatar}</span>
          <span>Không gian riêng biệt của <strong>{currentUser.name}</strong> ({currentUser.email})</span>
          <span className="text-[#8C6D7C]">• {currentUser.university}</span>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="text-[#D81B60] font-bold hover:underline ml-2 cursor-pointer"
          >
            Đổi giao diện / Cài đặt
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFE8EE] border-b border-[#FFCCD5] py-2 px-4 text-center text-xs flex items-center justify-center gap-3 flex-wrap animate-fadeIn">
          <span className="text-xs bg-[#FFE4E8] text-[#C2185B] font-bold px-2 py-0.5 rounded-full">
            Chưa Đăng Nhập
          </span>
          <span className="text-[#6D5A64]">
            Đăng nhập bằng <strong>Google</strong> hoặc tài khoản cá nhân để đồng bộ thời gian biểu & nuôi thú cưng ảo của bạn:
          </span>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1 rounded-xl bg-white border border-[#4285F4]/40 hover:border-[#4285F4] hover:bg-[#F8FAFF] font-bold text-[#1a73e8] inline-flex items-center gap-1 transition shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Đăng nhập Google</span>
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF85A1] to-[#FFAAA6] text-white font-bold hover:opacity-95 transition shadow-2xs cursor-pointer"
          >
            Đăng Nhập / Đăng Ký
          </button>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Real-Time Live Clock & Accurate Notification Hub */}
        <RealTimeClockBanner
          currentDate={currentDate}
          tasks={tasks}
          schedule={schedule}
          appointments={appointments}
          alarms={alarms}
          onTriggerTestAlert={triggerTestAlert}
        />

        {/* VIEW 1: HOME (Work / Life / Study) */}
        {activeView === 'home' && (
          <HomeSection
            tasks={tasks}
            activeTab={homeTab}
            onTabChange={(tab) => setHomeTab(tab)}
            onToggleTask={handleToggleTask}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onAddTask={(category) => {
              if (!currentUser) {
                // If not logged in, prompt to log in or create guest account
                setIsAuthModalOpen(true);
                return;
              }
              setEditingTask(null);
              setDefaultTaskCategory(category);
              setIsTaskModalOpen(true);
            }}
            onStartPomodoroForTask={(t) => {
              setSelectedTaskForPomodoro(t);
              setActiveView('pomodoro');
            }}
          />
        )}

        {/* VIEW 2: SCHEDULE & APPOINTMENTS (20-30 min alert) */}
        {activeView === 'schedule' && (
          <ScheduleSection
            schedule={schedule}
            appointments={appointments}
            settings={settings}
            onAddScheduleItem={handleAddScheduleItem}
            onDeleteScheduleItem={handleDeleteScheduleItem}
            onToggleBookmark={handleToggleBookmark}
            onAddAppointment={handleAddAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onToggleAppointment={handleToggleAppointment}
          />
        )}

        {/* VIEW 3: POMODORO & COUNTDOWN */}
        {activeView === 'pomodoro' && (
          <PomodoroAndCountdown
            tasks={tasks}
            settings={settings}
            pet={pet}
            onOpenPetModal={() => setIsPetModalOpen(true)}
            selectedTask={selectedTaskForPomodoro}
            onCompletePomodoroSession={handleCompletePomodoroSession}
            onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
          />
        )}

        {/* VIEW 4: COMPLETED TASKS & PRODUCTIVITY */}
        {activeView === 'completed' && (
          <CompletedTracker
            tasks={tasks}
            streakCount={pet.streak}
            totalFocusMinutes={pet.exp}
            onRestoreTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onClearAllCompleted={handleClearAllCompleted}
            onOpenPetModal={() => setIsPetModalOpen(true)}
          />
        )}
      </main>

      {/* Cute Floating Virtual Pet Shortcut (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={() => {
            playChime('sweet');
            setIsPetModalOpen(true);
          }}
          className="group relative p-2 rounded-full bg-white/95 border-2 border-[#FFB6C1] shadow-lg hover:shadow-xl hover:scale-110 transition cursor-pointer flex items-center gap-2"
          title="Bấm để mở Thú Cưng Ảo & Tủ Đồ Trang Phục (20 món)"
        >
          <MascotAvatar
            type={pet.type}
            mood={pet.happiness > 70 ? 'happy' : 'sleepy'}
            equippedHat={pet.equippedHat}
            equippedAccessory={pet.equippedAccessory}
            size={52}
          />
          <div className="pr-3 hidden sm:block text-left">
            <p className="text-xs font-bold text-[#D81B60] leading-tight flex items-center gap-1">
              <span>{pet.name}</span>
              <Sparkles className="w-3 h-3 text-[#FF85A1]" />
            </p>
            <p className="text-[10px] text-[#8C6D7C] flex items-center gap-1 mt-0.5">
              <Flame className="w-2.5 h-2.5 text-[#E65100]" /> {pet.streak} ngày • {pet.stars} ⭐
            </p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#FFE4E8] bg-white/60 py-4 text-center text-xs text-[#8C6D7C] px-4">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>🌸</span>
          <strong className="text-[#D81B60]">TIMI</strong> — Trợ lý quản lý thời gian sinh viên (18-23 tuổi).
          <span>Đúng giờ • Tập trung • Hoàn thành xuất sắc.</span>
        </p>
      </footer>

      {/* ================= MODALS ================= */}
      {/* 1. Search & Index Modal */}
      <SearchAndIndexModal
        isOpen={isSearchIndexOpen}
        onClose={() => setIsSearchIndexOpen(false)}
        tasks={tasks}
        schedule={schedule}
        appointments={appointments}
        onNavigateTo={handleIndexNavigation}
        onSelectTask={(task) => {
          setEditingTask(task);
          setIsTaskModalOpen(true);
        }}
      />

      {/* 2. Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        defaultCategory={defaultTaskCategory}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* 3. Virtual Pet Modal (Streak & 20 Outfits Closet) */}
      <VirtualPetModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        pet={pet}
        onUpdatePet={(updatedPet) => setPet(prev => ({ ...prev, ...updatedPet }))}
      />

      {/* 4. Alarm & Alerts Modal */}
      <AlarmAndAlertsModal
        isOpen={isAlarmsModalOpen}
        onClose={() => setIsAlarmsModalOpen(false)}
        alarms={alarms}
        onAddAlarm={(alm) => {
          const targetUserId = currentUser ? currentUser.id : 'guest';
          const newAlm: AlarmItem = {
            id: `alm_${targetUserId}_${Date.now()}`,
            time: alm.time || '06:30',
            label: alm.label || 'Báo thức',
            days: alm.days || [1, 2, 3, 4, 5],
            enabled: true,
            soundType: alm.soundType || 'sweet',
            snoozeMinutes: alm.snoozeMinutes ?? 5
          };
          setAlarms(prev => [...prev, newAlm]);
          notifySetupEvent(newAlm.label, newAlm.time, 0);
        }}
        onDeleteAlarm={(id) => setAlarms(prev => prev.filter(a => a.id !== id))}
        onToggleAlarm={(id) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))}
      />

      {/* 5. Settings & Account Modal */}
      <SettingsAndAccountModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
        allAccounts={allAccounts}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings(prev => ({ ...prev, ...newSet }))}
        onSwitchAccount={handleSwitchAccount}
        onSaveAccount={handleSaveAccount}
        onDeleteAccount={handleDeleteAccount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 6. Auth Modal (Gmail & Facebook & Google Login & Guest Demo) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        allAccounts={allAccounts}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
