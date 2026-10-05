import { 
  Task, 
  ScheduleItem, 
  Appointment, 
  AlarmItem, 
  VirtualPet, 
  PetItem, 
  UserSettings, 
  UserAccount 
} from '../types';

// Expanded Pet Catalog with 20 rich student-tailored costumes, hats, and accessories
export const PET_CATALOG: PetItem[] = [
  // --- NÓN & MŨ (HATS & HEADWEAR) ---
  {
    id: 'pink_ribbon',
    name: 'Nơ Hồng Pastel',
    type: 'hat',
    icon: '🎀',
    requiredStreak: 1,
    starPrice: 15,
    description: 'Chiếc nơ hoa xinh xắn cho ngày đầu chăm chỉ học tập',
    svgLayer: 'pink_ribbon'
  },
  {
    id: 'student_cap',
    name: 'Mũ Cử Nhân Đại Học',
    type: 'hat',
    icon: '🎓',
    requiredStreak: 3,
    starPrice: 40,
    description: 'Tượng trưng cho sự chuyên cần, nỗ lực đạt học bổng',
    svgLayer: 'student_cap'
  },
  {
    id: 'strawberry_beret',
    name: 'Mũ Nồi Dâu Tây',
    type: 'hat',
    icon: '🍓',
    requiredStreak: 5,
    starPrice: 60,
    description: 'Phong cách Hàn Quốc ngọt ngào mùa ôn thi',
    svgLayer: 'strawberry_beret'
  },
  {
    id: 'angel_halo',
    name: 'Vòng Thiên Thần',
    type: 'hat',
    icon: '✨',
    requiredStreak: 7,
    starPrice: 90,
    description: 'Dành riêng cho sinh viên có chuỗi 7 ngày hoàn hảo',
    svgLayer: 'angel_halo'
  },
  {
    id: 'sunflower_band',
    name: 'Bờm Hoa Hướng Dương',
    type: 'hat',
    icon: '🌻',
    requiredStreak: 2,
    starPrice: 25,
    description: 'Mang lại tinh thần lạc quan, rạng rỡ mỗi buổi sáng',
    svgLayer: 'sunflower_band'
  },
  {
    id: 'frog_hat',
    name: 'Mũ Ếch Xanh Dễ Thương',
    type: 'hat',
    icon: '🐸',
    requiredStreak: 4,
    starPrice: 50,
    description: 'Mũ len ếch mắt tròn tinh nghịch cho bé cưng',
    svgLayer: 'frog_hat'
  },
  {
    id: 'royal_crown',
    name: 'Vương Miện Thủ Khoa',
    type: 'hat',
    icon: '👑',
    requiredStreak: 10,
    starPrice: 150,
    description: 'Đặc quyền cho sinh viên kiên trì đạt chuỗi 10 ngày',
    svgLayer: 'royal_crown'
  },
  {
    id: 'warm_beanie',
    name: 'Mũ Len Mùa Thi',
    type: 'hat',
    icon: '🧶',
    requiredStreak: 6,
    starPrice: 70,
    description: 'Giữ ấm đôi tai và tập trung ôn tập đêm khuya',
    svgLayer: 'warm_beanie'
  },
  {
    id: 'bunny_ears',
    name: 'Băng Đô Tai Thỏ',
    type: 'hat',
    icon: '🐰',
    requiredStreak: 3,
    starPrice: 35,
    description: 'Tai thỏ nhung trắng mềm mại siêu đáng yêu',
    svgLayer: 'bunny_ears'
  },

  // --- PHỤ KIỆN & ĐỒ DÙNG (ACCESSORIES & ITEMS) ---
  {
    id: 'boba_tea',
    name: 'Ly Trà Sữa Trân Châu',
    type: 'accessory',
    icon: '🧋',
    requiredStreak: 1,
    starPrice: 20,
    description: 'Tiếp thêm 100% năng lượng chạy deadline bài tập',
    svgLayer: 'boba_tea'
  },
  {
    id: 'smart_glasses',
    name: 'Kính Cận Tri Thức',
    type: 'accessory',
    icon: '👓',
    requiredStreak: 2,
    starPrice: 30,
    description: 'Tăng 200% độ tập trung khi ngồi học ở thư viện',
    svgLayer: 'smart_glasses'
  },
  {
    id: 'magic_wand',
    name: 'Bút Chì Lấp Lánh',
    type: 'accessory',
    icon: '🪄',
    requiredStreak: 4,
    starPrice: 55,
    description: 'Giải quyết mọi bài tập khó trong tích tắc',
    svgLayer: 'magic_wand'
  },
  {
    id: 'mini_laptop',
    name: 'Laptop Mini Chạy Deadline',
    type: 'accessory',
    icon: '💻',
    requiredStreak: 5,
    starPrice: 75,
    description: 'Công cụ gõ đồ án và làm bài thuyết trình nhóm',
    svgLayer: 'mini_laptop'
  },
  {
    id: 'lofi_headphones',
    name: 'Tai Nghe Chống Ồn Lofi',
    type: 'accessory',
    icon: '🎧',
    requiredStreak: 6,
    starPrice: 85,
    description: 'Cách ly tạp âm để tập trung 100% cùng Pomodoro',
    svgLayer: 'lofi_headphones'
  },
  {
    id: 'student_backpack',
    name: 'Balo Sinh Viên Đi Học',
    type: 'accessory',
    icon: '🎒',
    requiredStreak: 3,
    starPrice: 45,
    description: 'Chiếc balo đựng tài liệu và giáo trình đại học',
    svgLayer: 'student_backpack'
  },
  {
    id: 'strawberry_cake',
    name: 'Bánh Kem Dâu Sinh Nhật',
    type: 'accessory',
    icon: '🍰',
    requiredStreak: 8,
    starPrice: 110,
    description: 'Món quà ngọt ngào tự thưởng sau kỳ thi căng thẳng',
    svgLayer: 'strawberry_cake'
  },
  {
    id: 'gold_medal',
    name: 'Huy Chương Xuất Sắc',
    type: 'accessory',
    icon: '🏅',
    requiredStreak: 9,
    starPrice: 130,
    description: 'Huy chương vàng tôn vinh tinh thần tự học kỷ luật',
    svgLayer: 'gold_medal'
  },
  {
    id: 'coffee_cup',
    name: 'Cốc Cà Phê Sáng Tỉnh Táo',
    type: 'accessory',
    icon: '☕',
    requiredStreak: 2,
    starPrice: 25,
    description: 'Đánh thức não bộ cho ca học sớm lúc 7h sáng',
    svgLayer: 'coffee_cup'
  },
  {
    id: 'water_bottle',
    name: 'Bình Nước Pastel',
    type: 'accessory',
    icon: '💧',
    requiredStreak: 1,
    starPrice: 15,
    description: 'Nhắc nhở uống đủ 2 lít nước mỗi ngày thanh lọc cơ thể',
    svgLayer: 'water_bottle'
  },
  {
    id: 'bubble_tea_hat',
    name: 'Mũ Cốc Trà Sữa Ngọt Ngào',
    type: 'hat',
    icon: '🥤',
    requiredStreak: 4,
    starPrice: 50,
    description: 'Chiếc mũ trà sữa xinh xắn mang lại cảm hứng học tập',
    svgLayer: 'bubble_tea_hat'
  },
  {
    id: 'sakura_umbrella',
    name: 'Ô Hoa Anh Đào Pastel',
    type: 'accessory',
    icon: '☂️',
    requiredStreak: 7,
    starPrice: 95,
    description: 'Chiếc ô che mưa nắng lãng mạn trên con đường đến giảng đường',
    svgLayer: 'sakura_umbrella'
  },
  {
    id: 'artist_palette',
    name: 'Bảng Màu Sáng Tạo',
    type: 'accessory',
    icon: '🎨',
    requiredStreak: 5,
    starPrice: 65,
    description: 'Tăng cường tư duy sáng tạo khi làm đồ án và bài tập nhóm',
    svgLayer: 'artist_palette'
  },
  {
    id: 'angel_wings',
    name: 'Cánh Thiên Thần Pastel',
    type: 'accessory',
    icon: '🪽',
    requiredStreak: 14,
    starPrice: 200,
    description: 'Phần thưởng chuỗi 14 ngày kỷ luật học tập hoàn hảo',
    svgLayer: 'angel_wings'
  },
  {
    id: 'wizard_cape',
    name: 'Áo Choàng Phù Thủy Học Thuật',
    type: 'accessory',
    icon: '🧙‍♀️',
    requiredStreak: 21,
    starPrice: 350,
    description: 'Phần thưởng danh giá chuỗi 21 ngày hình thành thói quen vàng',
    svgLayer: 'wizard_cape'
  },
  {
    id: 'honor_trophy',
    name: 'Cúp Vàng Danh Dự TIMI',
    type: 'accessory',
    icon: '🏆',
    requiredStreak: 30,
    starPrice: 500,
    description: 'Biểu tượng tối thượng vinh danh sinh viên kiên trì 30 ngày',
    svgLayer: 'honor_trophy'
  }
];

// Default settings template
export const DEFAULT_USER_SETTINGS: UserSettings = {
  fontSize: 'md',
  fontFamily: 'quicksand',
  theme: 'sakura',
  soundPreset: 'sweet',
  timetableDecor: 'mimi_cats',
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroLongBreak: 15,
  soundEnabled: true,
  notificationsAllowed: true,
  allowScheduleBookmark: true,
  allowScheduleAlerts: true
};

// Creates a fresh, clean, independent workspace for any newly logged-in/registered account
export function createFreshUserData(user: UserAccount) {
  const defaultPet: VirtualPet = {
    type: 'cat',
    name: `Bé Mochi của ${user.name}`,
    level: 1,
    exp: 20,
    streak: 1,
    stars: 50,
    happiness: 90,
    hunger: 80,
    equippedHat: 'pink_ribbon',
    equippedAccessory: 'boba_tea',
    unlockedItems: ['pink_ribbon', 'boba_tea']
  };

  const starterTasks: Task[] = [
    {
      id: `task_${user.id}_1`,
      title: 'Chào mừng bạn đến với TIMI! Hoàn thành thiết lập mục tiêu',
      note: 'Ứng dụng quản lý thời gian cá nhân độc lập dành cho bạn',
      category: 'work',
      flashcardColor: 'red',
      priorityLabel: 'Rất quan trọng',
      subCategory: 'work_important',
      dueTime: '18:00',
      dueDate: 'Hôm nay',
      durationMinutes: 25,
      completed: false,
      soundAlert: true,
      notifyBeforeMinutes: 20,
      isPinned: true
    },
    {
      id: `task_${user.id}_2`,
      title: 'Ca học hoặc ca làm thêm hôm nay',
      note: 'Dùng thẻ màu cam để ghi chú công việc thường ngày của bạn',
      category: 'work',
      flashcardColor: 'orange',
      priorityLabel: 'Thường ngày (Đi học & Làm thêm)',
      subCategory: 'work_routine',
      dueTime: '13:30',
      dueDate: 'Hôm nay',
      durationMinutes: 90,
      completed: false,
      soundAlert: true,
      notifyBeforeMinutes: 30
    },
    {
      id: `task_${user.id}_3`,
      title: 'Xem lại bài giảng và tài liệu môn học',
      note: 'Ghi chú bài tập cần hoàn thành trong ngày',
      category: 'study',
      flashcardColor: 'yellow',
      priorityLabel: 'Bài tập',
      subCategory: 'study_assignment',
      dueTime: '20:00',
      dueDate: 'Hôm nay',
      durationMinutes: 45,
      completed: false,
      soundAlert: true,
      notifyBeforeMinutes: 20
    },
    {
      id: `task_${user.id}_4`,
      title: 'Uống đủ nước và nghỉ ngơi vận động 15 phút',
      note: 'Giữ gìn sức khỏe trong mùa thi căng thẳng',
      category: 'life',
      flashcardColor: 'white',
      priorityLabel: 'Đời sống',
      subCategory: 'life_dining',
      dueTime: '15:30',
      dueDate: 'Hôm nay',
      durationMinutes: 15,
      completed: false,
      soundAlert: false,
      notifyBeforeMinutes: 0
    }
  ];

  const starterSchedule: ScheduleItem[] = [
    {
      id: `sch_${user.id}_1`,
      dayOfWeek: 1, // Thứ 2
      startTime: '07:30',
      endTime: '11:00',
      title: 'Tiết học lý thuyết chuyên ngành',
      category: 'study',
      location: 'Giảng đường A1',
      sticker: 'books',
      alertBefore: 30,
      reminderSound: 'sweet',
      isBookmarked: true,
      completed: false
    },
    {
      id: `sch_${user.id}_2`,
      dayOfWeek: 3, // Thứ 4
      startTime: '18:00',
      endTime: '21:30',
      title: 'Ca làm thêm sinh viên',
      category: 'work',
      location: 'Chỗ làm thêm',
      sticker: 'boba',
      alertBefore: 30,
      reminderSound: 'bell',
      isBookmarked: true,
      completed: false
    }
  ];

  const starterAppointments: Appointment[] = [
    {
      id: `apt_${user.id}_1`,
      title: 'Thảo luận bài tập nhóm và phân chia công việc',
      date: new Date().toISOString().split('T')[0],
      time: '15:30',
      location: 'Thư viện trường',
      alertMinutesBefore: 30,
      note: 'Chuẩn bị laptop và tài liệu tham khảo',
      category: 'study',
      completed: false
    }
  ];

  const starterAlarms: AlarmItem[] = [
    {
      id: `alm_${user.id}_1`,
      time: '06:30',
      label: 'Báo thức dậy sớm chuẩn bị ca học',
      days: [1, 2, 3, 4, 5],
      enabled: true,
      soundType: 'sweet',
      snoozeMinutes: 5
    }
  ];

  return {
    pet: defaultPet,
    tasks: starterTasks,
    schedule: starterSchedule,
    appointments: starterAppointments,
    alarms: starterAlarms,
    settings: DEFAULT_USER_SETTINGS
  };
}

// STORAGE KEY GENERATORS FOR COMPLETE USER ISOLATION
export const getAccountKeys = (userId: string) => ({
  SETTINGS: `timi_acc_${userId}_settings`,
  PET: `timi_acc_${userId}_pet`,
  TASKS: `timi_acc_${userId}_tasks`,
  SCHEDULE: `timi_acc_${userId}_schedule`,
  APPOINTMENTS: `timi_acc_${userId}_appointments`,
  ALARMS: `timi_acc_${userId}_alarms`
});

export const GLOBAL_STORAGE_KEYS = {
  CURRENT_USER_ID: 'timi_current_active_user_id',
  REGISTERED_ACCOUNTS: 'timi_registered_accounts_list'
};

// Generic LocalStorage Loader
export function loadData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

// Generic LocalStorage Saver
export function saveData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Save error', err);
  }
}

// Remove data
export function removeData(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('Remove error', err);
  }
}

// Purge all data belonging to an account
export function purgeAccountData(userId: string): void {
  const keys = getAccountKeys(userId);
  removeData(keys.SETTINGS);
  removeData(keys.PET);
  removeData(keys.TASKS);
  removeData(keys.SCHEDULE);
  removeData(keys.APPOINTMENTS);
  removeData(keys.ALARMS);
}
