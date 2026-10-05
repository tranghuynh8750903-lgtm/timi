import React, { useState } from 'react';
import { 
  X, 
  User, 
  Settings, 
  Palette, 
  Type, 
  Bell, 
  Bookmark, 
  Volume2, 
  Trash2, 
  Plus, 
  Edit3, 
  Check, 
  Sparkles,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { UserAccount, UserSettings } from '../types';
import { playChime } from '../utils/audio';

interface SettingsAndAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  allAccounts: UserAccount[];
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onSwitchAccount: (account: UserAccount) => void;
  onSaveAccount: (account: UserAccount) => void;
  onDeleteAccount: (accountId: string) => void;
  onOpenAuthModal: () => void;
}

export const SettingsAndAccountModal: React.FC<SettingsAndAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allAccounts,
  settings,
  onUpdateSettings,
  onSwitchAccount,
  onSaveAccount,
  onDeleteAccount,
  onOpenAuthModal
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'accounts' | 'notifications'>('appearance');
  
  // Editing user account
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || 'Sinh Viên');
  const [editUniversity, setEditUniversity] = useState(currentUser?.university || 'Đại Học');
  const [editMajor, setEditMajor] = useState(currentUser?.major || 'Sinh Viên');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '🐰');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    onSaveAccount({
      ...currentUser,
      name: editName.trim(),
      university: editUniversity.trim(),
      major: editMajor.trim(),
      avatar: editAvatar
    });
    setIsEditingUser(false);
    playChime('sweet');
  };

  const avatarOptions = ['🐰', '🐱', '🐻', '🍓', '🎀', '🎓', '🧋', '🦄'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-[#FFD1DC] flex flex-col overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#FFE4E8] bg-gradient-to-r from-[#FFF5F7] to-[#FFF0F3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#4A3B43]">
                Cài Đặt & Quản Lý Tài Khoản
              </h3>
              <p className="text-xs text-[#8C6D7C]">
                Tùy chỉnh giao diện Pastel, cỡ chữ, trang trí thời gian biểu & quyền tài khoản
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#7D2E49] hover:bg-[#FFE4E8] flex items-center justify-center transition border border-[#FFCCD5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center px-5 pt-3 pb-2 border-b border-[#FFE4E8] bg-[#FFFDFE] gap-2">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'bg-[#FF85A1] text-white shadow-2xs'
                : 'bg-[#FFF0F3] text-[#7D2E49] hover:bg-[#FFE4E8]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Giao Diện & Âm Thanh
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'accounts'
                ? 'bg-[#FF85A1] text-white shadow-2xs'
                : 'bg-[#FFF0F3] text-[#7D2E49] hover:bg-[#FFE4E8]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Tài Khoản ({allAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-[#FF85A1] text-white shadow-2xs'
                : 'bg-[#FFF0F3] text-[#7D2E49] hover:bg-[#FFE4E8]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Quyền & Thông Báo
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: GIAO DIỆN & ÂM THANH */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              {/* Cỡ chữ */}
              <div>
                <label className="block text-xs font-bold text-[#7D2E49] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#FF85A1]" /> Cỡ Chữ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sm', label: 'Nhỏ (14px)', desc: 'Gọn gàng' },
                    { id: 'md', label: 'Vừa (16px)', desc: 'Chuẩn sinh viên' },
                    { id: 'lg', label: 'Lớn (18px)', desc: 'Dễ đọc' }
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => onUpdateSettings({ fontSize: size.id as any })}
                      className={`p-2.5 rounded-2xl border text-center transition ${
                        settings.fontSize === size.id
                          ? 'bg-[#FFE4E8] border-[#FF85A1] ring-2 ring-[#FFD1DC]'
                          : 'bg-[#FFFDFE] border-[#FFE4E8] hover:border-[#FFCCD5]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#4A3B43] block">{size.label}</span>
                      <span className="text-[10px] text-[#8C6D7C]">{size.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phông chữ */}
              <div>
                <label className="block text-xs font-bold text-[#7D2E49] uppercase tracking-wider mb-2">
                  Phông Chữ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'quicksand', label: 'Quicksand', desc: 'Mềm mại tròn trĩnh' },
                    { id: 'nunito', label: 'Nunito', desc: 'Thân thiện dễ thương' },
                    { id: 'bevietnam', label: 'Be Vietnam Pro', desc: 'Thanh lịch chuẩn mực' }
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => onUpdateSettings({ fontFamily: font.id as any })}
                      className={`p-2.5 rounded-2xl border text-center transition ${
                        settings.fontFamily === font.id
                          ? 'bg-[#FFE4E8] border-[#FF85A1] ring-2 ring-[#FFD1DC]'
                          : 'bg-[#FFFDFE] border-[#FFE4E8] hover:border-[#FFCCD5]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#4A3B43] block">{font.label}</span>
                      <span className="text-[10px] text-[#8C6D7C]">{font.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bảng màu Pastel */}
              <div>
                <label className="block text-xs font-bold text-[#7D2E49] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#FF85A1]" /> Bảng Màu Pastel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sakura', label: 'Hồng Sakura', color: '#FF85A1', sub: 'Pastel Hồng & Trắng' },
                    { id: 'sweet_peach', label: 'Sweet Peach', color: '#FFA07A', sub: 'Cam Đào Ngọt Ngào' },
                    { id: 'lavender', label: 'Lavender Dream', color: '#BA68C8', sub: 'Tím Khói Mộng Mơ' },
                    { id: 'night_pastel', label: 'Night Pastel', color: '#5C6BC0', sub: 'Tối Dịu Ôn Thi' }
                  ].map((th) => (
                    <button
                      key={th.id}
                      onClick={() => onUpdateSettings({ theme: th.id as any })}
                      className={`p-2.5 rounded-2xl border text-left transition ${
                        settings.theme === th.id
                          ? 'bg-[#FFF0F3] border-[#FF85A1] ring-2 ring-[#FFD1DC]'
                          : 'bg-[#FFFDFE] border-[#FFE4E8]'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: th.color }}></div>
                      <span className="text-xs font-bold text-[#4A3B43] block">{th.label}</span>
                      <span className="text-[10px] text-[#8C6D7C]">{th.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trang trí thời gian biểu */}
              <div>
                <label className="block text-xs font-bold text-[#7D2E49] uppercase tracking-wider mb-2">
                  Trang Trí Thời Gian Biểu (Stickers)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'mimi_cats', label: 'Mèo Bông Mimi', icon: '🐱' },
                    { id: 'strawberries', label: 'Dâu Tây Ngọt', icon: '🍓' },
                    { id: 'boba', label: 'Trà Sữa Trân Châu', icon: '🧋' },
                    { id: 'sparkles', label: 'Sao Lấp Lánh', icon: '✨' }
                  ].map((decor) => (
                    <button
                      key={decor.id}
                      onClick={() => onUpdateSettings({ timetableDecor: decor.id as any })}
                      className={`p-2.5 rounded-2xl border text-center transition ${
                        settings.timetableDecor === decor.id
                          ? 'bg-[#FFF0F3] border-[#FF85A1] ring-2 ring-[#FFD1DC]'
                          : 'bg-[#FFFDFE] border-[#FFE4E8]'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{decor.icon}</span>
                      <span className="text-xs font-bold text-[#4A3B43]">{decor.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cài đặt âm thanh */}
              <div>
                <label className="block text-xs font-bold text-[#7D2E49] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#FF85A1]" /> Cài Đặt Âm Thanh Theo Ý Muốn
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sweet', label: 'Chuông Ngọt', sound: 'Celesta' },
                    { id: 'bell', label: 'Chuông Kính', sound: 'Crystal Bell' },
                    { id: 'marimba', label: 'Marimba Ấm', sound: 'Gỗ ấm áp' },
                    { id: 'birds', label: 'Tiếng Chim Hót', sound: 'Thiên nhiên' }
                  ].map((snd) => (
                    <button
                      key={snd.id}
                      onClick={() => {
                        onUpdateSettings({ soundPreset: snd.id as any });
                        playChime(snd.id as any);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition ${
                        settings.soundPreset === snd.id
                          ? 'bg-[#FFF0F3] border-[#FF85A1] ring-2 ring-[#FFD1DC]'
                          : 'bg-[#FFFDFE] border-[#FFE4E8]'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#4A3B43] block">🎵 {snd.label}</span>
                      <span className="text-[10px] text-[#8C6D7C]">Bấm để nghe thử</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUẢN LÝ TÀI KHOẢN (THÊM, SỬA, XÓA) */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              {/* Current Active Account Profile Card */}
              {currentUser ? (
                <div className="p-4 rounded-3xl bg-gradient-to-r from-[#FFF0F3] to-[#FFE4E8] border border-[#FFCCD5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#FF85A1] flex items-center justify-center text-3xl shadow-xs">
                      {currentUser.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm sm:text-base font-bold text-[#4A3B43]">
                          {currentUser.name}
                        </h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#FF85A1] text-white font-bold">
                          Đang dùng
                        </span>
                      </div>
                      <p className="text-xs text-[#7D2E49]">{currentUser.email}</p>
                      <p className="text-[11px] text-[#8C6D7C] mt-0.5">
                        {currentUser.university} • {currentUser.major}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsEditingUser(!isEditingUser);
                      setEditName(currentUser.name);
                      setEditUniversity(currentUser.university);
                      setEditMajor(currentUser.major);
                      setEditAvatar(currentUser.avatar);
                    }}
                    className="p-2 rounded-xl bg-white border border-[#FFCCD5] text-[#7D2E49] hover:bg-[#FFE4E8] transition"
                    title="Chỉnh sửa thông tin"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Form */}
                {isEditingUser && (
                  <form onSubmit={handleSaveProfile} className="p-3.5 rounded-2xl bg-white border border-[#FFCCD5] space-y-3 animate-fadeIn">
                    <h5 className="text-xs font-bold text-[#7D2E49] uppercase">Chỉnh Sửa Hồ Sơ</h5>

                    <div>
                      <label className="text-[10px] text-[#8C6D7C] block mb-1">Chọn Avatar</label>
                      <div className="flex items-center gap-1.5">
                        {avatarOptions.map((av) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setEditAvatar(av)}
                            className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border transition ${
                              editAvatar === av ? 'bg-[#FFE4E8] border-[#FF85A1]' : 'bg-white border-[#E0E0E0]'
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#8C6D7C] block mb-1">Họ và tên</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-[#FFCCD5] text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8C6D7C] block mb-1">Trường đại học</label>
                        <input
                          type="text"
                          value={editUniversity}
                          onChange={(e) => setEditUniversity(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-[#FFCCD5] text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#8C6D7C] block mb-1">Chuyên ngành học</label>
                      <input
                        type="text"
                        value={editMajor}
                        onChange={(e) => setEditMajor(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-[#FFCCD5] text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingUser(false)}
                        className="px-3 py-1 text-xs text-[#8C6D7C]"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 rounded-xl bg-[#FF85A1] text-white text-xs font-bold"
                      >
                        Lưu Thay Đổi
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-[#FFF9FA] border-2 border-dashed border-[#FFCCD5] text-center space-y-2">
                <p className="text-sm font-bold text-[#4A3B43]">Chưa có người đăng nhập</p>
                <p className="text-xs text-[#8C6D7C]">
                  Đăng nhập hoặc đăng ký tài khoản để bắt đầu quản lý thời gian biểu và thú cưng ảo của riêng bạn.
                </p>
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFAAA6] text-white text-xs font-bold shadow-xs hover:opacity-95 transition cursor-pointer"
                >
                  Đăng Nhập / Đăng Ký Ngay
                </button>
              </div>
            )}

              {/* Other Accounts List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h5 className="text-xs font-bold text-[#7D2E49] uppercase tracking-wider">
                    Các Tài Khoản Đã Lưu ({allAccounts.length})
                  </h5>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#1f1f1f] border-2 border-[#4285F4]/40 hover:border-[#4285F4] hover:bg-[#F8FAFF] text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Google Login / Đăng ký</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF0F3] text-[#D81B60] border border-[#FFCCD5] hover:bg-[#FFE4E8] text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Mới
                    </button>
                  </div>
                </div>

                {allAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      acc.id === currentUser?.id
                        ? 'bg-[#FFF9FA] border-[#FF85A1]'
                        : 'bg-white border-[#FFE4E8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{acc.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h6 className="text-xs font-bold text-[#4A3B43]">{acc.name}</h6>
                          {acc.provider === 'google' && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-[#1a73e8] bg-[#EEF4FF] px-1.5 py-0.2 rounded-full border border-[#4285F4]/30">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                              </svg>
                              Google
                            </span>
                          )}
                          {acc.provider === 'facebook' && (
                            <span className="text-[9px] font-bold text-[#1877F2] bg-[#E7F3FF] px-1.5 py-0.2 rounded-full">
                              Facebook
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8C6D7C]">{acc.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {acc.id !== currentUser?.id && (
                        <button
                          onClick={() => onSwitchAccount(acc)}
                          className="px-2.5 py-1 rounded-lg bg-[#FFE4E8] text-[#C2185B] text-xs font-bold hover:bg-[#FFCCD5] transition"
                        >
                          Chuyển sang
                        </button>
                      )}
                      {allAccounts.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa tài khoản ${acc.name}?`)) {
                              onDeleteAccount(acc.id);
                            }
                          }}
                          className="p-1.5 text-[#CFD8DC] hover:text-red-500 transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUYỀN ĐÁNH DẤU VÀ NHẬN THÔNG BÁO VỀ THỜI GIAN BIỂU */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#FFCCD5] space-y-3">
                <h4 className="text-xs font-bold text-[#7D2E49] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF85A1]" />
                  Quyền Hạn Của Tài Khoản {currentUser?.name || 'Sinh Viên'}
                </h4>
                <p className="text-xs text-[#8C6D7C]">
                  Cài đặt quyền hạn cho tài khoản được quyền đánh dấu và nhận thông báo về thời gian biểu theo yêu cầu.
                </p>

                {/* 1. Quyền đánh dấu thời gian biểu */}
                <div className="p-3 bg-white rounded-xl border border-[#FFE4E8] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-[#FF85A1]" />
                    <div>
                      <p className="text-xs font-bold text-[#4A3B43]">Quyền Đánh Dấu Thời Gian Biểu</p>
                      <p className="text-[10px] text-[#8C6D7C]">Cho phép ghim bookmark các tiết học và ca làm việc ưu tiên</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowScheduleBookmark}
                      onChange={(e) => onUpdateSettings({ allowScheduleBookmark: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#FFAAA6] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF85A1]"></div>
                  </label>
                </div>

                {/* 2. Quyền nhận thông báo trước 20 - 30 phút */}
                <div className="p-3 bg-white rounded-xl border border-[#FFE4E8] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-[#FF85A1]" />
                    <div>
                      <p className="text-xs font-bold text-[#4A3B43]">Quyền Nhận Thông Báo Thời Gian Biểu</p>
                      <p className="text-[10px] text-[#8C6D7C]">Nhận cảnh báo âm thanh và pop-up trước 20 - 30 phút chuẩn bị</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowScheduleAlerts}
                      onChange={(e) => onUpdateSettings({ allowScheduleAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#FFAAA6] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF85A1]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
