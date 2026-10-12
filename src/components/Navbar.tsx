import React, { useState } from 'react';
import { 
  Search, 
  Flame, 
  Star, 
  Bell, 
  Settings, 
  Sparkles,
  Users,
  LogOut,
  Plus,
  ChevronDown,
  Check
} from 'lucide-react';
import { UserAccount, VirtualPet, UserSettings } from '../types';
import { MascotAvatar } from './CuteIllustrations';
import { playChime, playSuccessSound } from '../utils/audio';

interface NavbarProps {
  currentUser: UserAccount | null;
  allAccounts: UserAccount[];
  pet: VirtualPet;
  settings: UserSettings;
  activeView: string;
  currentTime?: Date;
  onNavigate: (view: string) => void;
  onOpenSearchAndIndex: () => void;
  onOpenPetModal: () => void;
  onOpenAlarmsModal: () => void;
  onOpenSettingsModal: () => void;
  onSwitchAccount: (account: UserAccount) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allAccounts,
  pet,
  settings,
  activeView,
  currentTime,
  onNavigate,
  onOpenSearchAndIndex,
  onOpenPetModal,
  onOpenAlarmsModal,
  onOpenSettingsModal,
  onSwitchAccount,
  onOpenAuthModal,
  onLogout
}) => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#FFCCD5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Logo & App Name */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            {/* Cute Logo Icon */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF85A1] to-[#FFAAA6] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-[#D81B60] tracking-wider">
                  TIMI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#FFE4E8] text-[#C2185B]">
                  STUDENT
                </span>
              </div>
              <p className="text-[10px] text-[#8C6D7C] leading-none font-medium hidden sm:block">
                Đúng giờ • Tập trung • Hiệu quả
              </p>
            </div>
          </div>

          {/* Quick Search and Index Button */}
          <button
            onClick={onOpenSearchAndIndex}
            className="ml-2 px-3 py-1.5 rounded-2xl bg-[#FFF5F7] border border-[#FFCCD5] hover:bg-[#FFE4E8] text-xs font-semibold text-[#7D2E49] flex items-center gap-2 transition"
          >
            <Search className="w-3.5 h-3.5 text-[#FF85A1]" />
            <span className="hidden md:inline">Tìm kiếm & Mục lục</span>
            <span className="md:hidden">Mục lục</span>
            <kbd className="hidden lg:inline text-[10px] bg-white text-[#8C6D7C] px-1.5 py-0.2 rounded border border-[#FFCCD5]">
              Menu
            </kbd>
          </button>

          {/* Real-time Clock Header Pill */}
          {formattedTime && (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white border border-[#FFCCD5] text-[#D81B60] text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FF85A1] animate-ping"></span>
              <span className="font-mono">{formattedTime}</span>
            </div>
          )}
        </div>

        {/* Center: Navigation Shortcuts (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FFF5F7] p-1 rounded-2xl border border-[#FFE4E8]">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'home'
                ? 'bg-white text-[#D81B60] shadow-2xs'
                : 'text-[#8C6D7C] hover:text-[#4A3B43]'
            }`}
          >
            <span>🏠</span>
            Trang Chủ
          </button>
          <button
            onClick={() => onNavigate('schedule')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'schedule'
                ? 'bg-white text-[#9C27B0] shadow-2xs'
                : 'text-[#8C6D7C] hover:text-[#4A3B43]'
            }`}
          >
            <span>🗓️</span>
            Thời Gian Biểu
          </button>
          <button
            onClick={() => onNavigate('pomodoro')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'pomodoro'
                ? 'bg-white text-[#E53935] shadow-2xs'
                : 'text-[#8C6D7C] hover:text-[#4A3B43]'
            }`}
          >
            <span>⏱️</span>
            Pomodoro
          </button>
          <button
            onClick={() => onNavigate('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'completed'
                ? 'bg-white text-[#2E7D32] shadow-2xs'
                : 'text-[#8C6D7C] hover:text-[#4A3B43]'
            }`}
          >
            <span>✅</span>
            Đã Xong
          </button>
        </nav>

        {/* Right: Virtual Pet Mini Widget + Alarms Bell + User Account & Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Virtual Pet Mini pill (Streak & Stars & Name) */}
          <button
            onClick={() => {
              playChime('sweet');
              onOpenPetModal();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#FFF0F3] to-[#FFE8EE] border border-[#FFCCD5] hover:border-[#FF85A1] flex items-center gap-2 transition group shadow-2xs cursor-pointer"
            title={`Bé ${pet.name} (Chuỗi ${pet.streak} ngày • ${pet.stars} Sao) - Bấm để đổi tên & nhận thưởng`}
          >
            <div className="relative -my-1">
              <MascotAvatar
                type={pet.type}
                mood="happy"
                equippedHat={pet.equippedHat}
                size={34}
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="hidden lg:inline text-[11px] text-[#7D2E49] max-w-[80px] truncate font-extrabold mr-0.5">
                {pet.name}
              </span>
              <span className="text-[#E65100] flex items-center gap-0.5" title={`Chuỗi ${pet.streak} ngày hoàn thành`}>
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{pet.streak}d</span>
              </span>
              <span className="text-[#F57F17] flex items-center gap-0.5" title={`${pet.stars} Sao thưởng`}>
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{pet.stars}</span>
              </span>
            </div>
          </button>

          {/* Alarms & Alerts Bell */}
          <button
            onClick={() => {
              playChime('sweet');
              onOpenAlarmsModal();
            }}
            className="w-9 h-9 rounded-2xl bg-[#FFF5F7] border border-[#FFCCD5] text-[#7D2E49] hover:bg-[#FFE4E8] flex items-center justify-center transition relative"
            title="Báo thức & Chuông nhắc nhở"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#FF85A1] absolute top-2 right-2 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#FF85A1] absolute top-2 right-2"></span>
          </button>

          {/* User Account Switcher Dropdown Button OR Login Buttons */}
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 rounded-2xl bg-white border border-[#4285F4]/40 hover:border-[#4285F4] hover:bg-[#F8FAFF] text-xs font-bold text-[#1f1f1f] flex items-center gap-1.5 transition shadow-2xs group cursor-pointer"
                title="Đăng nhập nhanh với Google"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:scale-110 transition" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>

              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFAAA6] text-white text-xs font-bold hover:opacity-95 transition shadow-2xs cursor-pointer"
              >
                Đăng Nhập
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-2xl bg-white border border-[#FFCCD5] hover:bg-[#FFF5F7] transition shadow-2xs cursor-pointer"
                title="Tài khoản & Đổi tài khoản"
              >
                <span className="w-7 h-7 rounded-xl bg-[#FFE4E8] flex items-center justify-center text-base">
                  {currentUser.avatar}
                </span>
                <span className="text-xs font-bold text-[#4A3B43] hidden lg:inline max-w-[90px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8C6D7C]" />
              </button>

              {/* Account Switcher Dropdown */}
              {isAccountDropdownOpen && (
                <div 
                  className="absolute right-0 top-12 w-64 bg-white rounded-3xl shadow-xl border-2 border-[#FFD1DC] p-2 z-50 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 border-b border-[#FFE4E8]">
                    <p className="text-[10px] uppercase font-bold text-[#8C6D7C]">Tài khoản hiện tại</p>
                    <p className="text-xs font-bold text-[#D81B60] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#8C6D7C] truncate">{currentUser.email}</p>
                  </div>

                  {/* List of other registered accounts */}
                  <div className="py-2 max-h-48 overflow-y-auto space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#8C6D7C] px-2">Chuyển sang tài khoản khác</p>
                    {allAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          onSwitchAccount(acc);
                          setIsAccountDropdownOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition ${
                          acc.id === currentUser.id
                            ? 'bg-[#FFF0F3] text-[#D81B60] font-bold'
                            : 'hover:bg-[#FFF5F7] text-[#4A3B43]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{acc.avatar}</span>
                          <span className="truncate">{acc.name}</span>
                        </div>
                        {acc.id === currentUser.id && (
                          <Check className="w-3.5 h-3.5 text-[#D81B60]" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#FFE4E8] space-y-1">
                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full p-2 rounded-xl text-left text-xs font-bold text-[#1f1f1f] bg-[#F8FAFF] hover:bg-[#EEF4FF] border border-[#4285F4]/30 flex items-center gap-2 transition"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Đăng nhập bằng <strong>Google</strong></span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full p-2 rounded-xl text-left text-xs font-bold text-[#D81B60] hover:bg-[#FFF0F3] flex items-center gap-2 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Đăng ký / Thêm tài khoản mới</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        onOpenSettingsModal();
                      }}
                      className="w-full p-2 rounded-xl text-left text-xs text-[#4A3B43] hover:bg-[#FFF5F7] flex items-center gap-2 transition"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#FF85A1]" />
                      <span>Cài đặt giao diện & cỡ chữ</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAccountDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full p-2 rounded-xl text-left text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất khỏi tài khoản này</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#FFF9FA] border-t border-[#FFE4E8] text-xs font-semibold">
        <button
          onClick={() => onNavigate('home')}
          className={`px-3 py-1 rounded-xl transition ${
            activeView === 'home' ? 'bg-[#FF85A1] text-white font-bold' : 'text-[#8C6D7C]'
          }`}
        >
          Trang Chủ
        </button>
        <button
          onClick={() => onNavigate('schedule')}
          className={`px-3 py-1 rounded-xl transition ${
            activeView === 'schedule' ? 'bg-[#FF85A1] text-white font-bold' : 'text-[#8C6D7C]'
          }`}
        >
          Thời Gian Biểu
        </button>
        <button
          onClick={() => onNavigate('pomodoro')}
          className={`px-3 py-1 rounded-xl transition ${
            activeView === 'pomodoro' ? 'bg-[#FF85A1] text-white font-bold' : 'text-[#8C6D7C]'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => onNavigate('completed')}
          className={`px-3 py-1 rounded-xl transition ${
            activeView === 'completed' ? 'bg-[#FF85A1] text-white font-bold' : 'text-[#8C6D7C]'
          }`}
        >
          Đã Xong
        </button>
      </div>
    </header>
  );
};
