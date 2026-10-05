import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { UserAccount } from '../types';
import { playSuccessSound, playChime } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAccounts: UserAccount[];
  onLoginSuccess: (account: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  allAccounts,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [googleStep, setGoogleStep] = useState<'idle' | 'picker' | 'custom_google'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states - Google custom
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleUniv, setCustomGoogleUniv] = useState('Đại Học Ngoại Thương');
  const [customGoogleAvatar, setCustomGoogleAvatar] = useState('🐰');

  // Standard form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('Đại Học Ngoại Thương');
  const [major, setMajor] = useState('Quản Trị Kinh Doanh');
  const [selectedAvatar, setSelectedAvatar] = useState('🐰');

  if (!isOpen) return null;

  // 1. Google 1-Click Fast Auth (Uses user's Google account: tranghuynh8750903@gmail.com)
  const handleSelectPreloadedGoogleAccount = () => {
    setErrorMessage(null);
    playSuccessSound();

    const targetEmail = 'tranghuynh8750903@gmail.com';
    // Check if this Google account already exists in registered accounts to preserve data!
    const existing = allAccounts.find(
      a => a.email.toLowerCase() === targetEmail.toLowerCase()
    );

    if (existing) {
      onLoginSuccess(existing);
    } else {
      const googleAccount: UserAccount = {
        id: 'usr_google_tranghuynh',
        name: 'Trang Huỳnh',
        email: targetEmail,
        avatar: '🐰',
        provider: 'google',
        university: 'Đại Học Ngoại Thương',
        major: 'Quản Trị Kinh Doanh',
        canNotify: true,
        canBookmark: true,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(googleAccount);
    }

    setGoogleStep('idle');
    onClose();
  };

  // 2. Google Custom Account Auth (Enter any Google account)
  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!customGoogleEmail.trim()) return;

    let finalEmail = customGoogleEmail.trim().toLowerCase();
    if (!finalEmail.includes('@')) {
      finalEmail = `${finalEmail}@gmail.com`;
    }

    playSuccessSound();

    // Check if already exists to preserve data!
    const existing = allAccounts.find(a => a.email.toLowerCase() === finalEmail);
    if (existing) {
      onLoginSuccess(existing);
    } else {
      const sanitizedId = 'usr_google_' + finalEmail.replace(/[^a-zA-Z0-9]/g, '_');
      const googleAccount: UserAccount = {
        id: sanitizedId,
        name: customGoogleName.trim() || finalEmail.split('@')[0],
        email: finalEmail,
        avatar: customGoogleAvatar,
        provider: 'google',
        university: customGoogleUniv.trim() || 'Đại Học',
        major: 'Sinh Viên',
        canNotify: true,
        canBookmark: true,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(googleAccount);
    }

    setGoogleStep('idle');
    onClose();
  };

  // 3. Standard Email / Password Form (Login or Register)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email!');
      return;
    }

    if (activeTab === 'login') {
      // Find existing account
      const found = allAccounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (!found) {
        setErrorMessage(
          'Email này chưa được đăng ký trong hệ thống TIMI. Bạn có thể nhấn tab "Đăng Ký Mới" bên trên hoặc đăng nhập nhanh bằng Google!'
        );
        return;
      }

      // If password was saved on account, verify it
      if (found.password && password && found.password !== password) {
        setErrorMessage('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
        return;
      }

      playSuccessSound();
      onLoginSuccess(found);
      onClose();
    } else {
      // Register Mode: Check if already registered
      const existing = allAccounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (existing) {
        setErrorMessage(
          'Email này đã được đăng ký trước đó. Vui lòng chuyển sang tab "Đăng Nhập" hoặc sử dụng tài khoản Google!'
        );
        return;
      }

      if (!password || password.length < 4) {
        setErrorMessage('Mật khẩu cần ít nhất 4 ký tự!');
        return;
      }

      playSuccessSound();
      const newAccount: UserAccount = {
        id: 'usr_' + Date.now(),
        name: name.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password,
        avatar: selectedAvatar,
        provider: 'local',
        university: university.trim() || 'Đại Học',
        major: major.trim() || 'Sinh Viên',
        canNotify: true,
        canBookmark: true,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(newAccount);
      onClose();
    }
  };

  // 4. Facebook Auth
  const handleFacebookAuth = () => {
    setErrorMessage(null);
    playSuccessSound();
    const fbEmail = email.trim() || 'student.facebook@gmail.com';
    const existing = allAccounts.find(a => a.email.toLowerCase() === fbEmail.toLowerCase());
    if (existing) {
      onLoginSuccess(existing);
    } else {
      const fbAccount: UserAccount = {
        id: 'usr_fb_' + Date.now(),
        name: name.trim() || 'Sinh Viên Facebook',
        email: fbEmail,
        avatar: '🐱',
        provider: 'facebook',
        university: university || 'Đại Học Bách Khoa',
        major: major || 'Công Nghệ Thông Tin',
        canNotify: true,
        canBookmark: true,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(fbAccount);
    }
    onClose();
  };

  // 5. Guest Demo Explore Mode
  const handleGuestDemo = () => {
    setErrorMessage(null);
    playSuccessSound();
    const guestAccount: UserAccount = {
      id: 'usr_guest_demo',
      name: 'Sinh Viên Dùng Thử',
      email: 'khach@timi.edu.vn',
      avatar: '🌟',
      provider: 'local',
      university: 'Đại Học Trải Nghiệm',
      major: 'Quản Lý Thời Gian',
      canNotify: true,
      canBookmark: true,
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(guestAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#FFD1DC] flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#FFE4E8] bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF0F3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF85A1] to-[#FFAAA6] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#4A3B43]">
                {googleStep !== 'idle' 
                  ? 'Đăng Nhập Bằng Google' 
                  : activeTab === 'login' 
                    ? 'Đăng Nhập Vào TIMI' 
                    : 'Đăng Ký Tài Khoản Mới'}
              </h3>
              <p className="text-[11px] text-[#8C6D7C]">
                {googleStep !== 'idle'
                  ? 'Đăng nhập an toàn & lưu trữ không gian riêng biệt'
                  : 'Mỗi tài khoản là một trang riêng biệt, bảo mật 100%'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setGoogleStep('idle');
              setErrorMessage(null);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white text-[#7D2E49] hover:bg-[#FFE4E8] flex items-center justify-center transition border border-[#FFCCD5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Error Alert Banner */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* GOOGLE SUB-FLOW 1: Account Chooser */}
        {googleStep === 'picker' && (
          <div className="p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 pb-1">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <h4 className="text-base font-bold text-[#3c4043]">Đăng nhập bằng Google</h4>
            </div>

            <p className="text-xs text-center text-[#5f6368]">
              Chọn tài khoản Google của bạn để vào không gian sinh viên <strong>TIMI</strong>
            </p>

            {/* Quick Available Google Account */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSelectPreloadedGoogleAccount}
                className="w-full p-3 rounded-2xl border-2 border-[#4285F4]/30 hover:border-[#4285F4] bg-[#F8FAFF] hover:bg-[#EEF4FF] flex items-center justify-between text-left transition group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF85A1] to-[#FFAAA6] text-white font-black flex items-center justify-center text-base shadow-xs">
                    T
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#1f1f1f] group-hover:text-[#1a73e8] transition">
                        Trang Huỳnh
                      </p>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#E8F0FE] text-[#1a73e8] rounded-full font-bold">
                        Google
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5f6368]">
                      tranghuynh8750903@gmail.com
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#1a73e8]" />
              </button>

              {/* Option to use another Google Account */}
              <button
                onClick={() => setGoogleStep('custom_google')}
                className="w-full p-3 rounded-2xl border border-[#dadce0] hover:bg-[#F8F9FA] flex items-center gap-3 text-left transition"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#3c4043]">
                    Sử dụng tài khoản Google khác
                  </p>
                  <p className="text-[11px] text-[#70757a]">
                    Nhập email @gmail.com hoặc Google Workspace trường học
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setGoogleStep('idle')}
                className="text-xs text-[#5f6368] hover:underline"
              >
                Quay lại các hình thức khác
              </button>
            </div>
          </div>
        )}

        {/* GOOGLE SUB-FLOW 2: Custom Google Account Entry */}
        {googleStep === 'custom_google' && (
          <form onSubmit={handleCustomGoogleSubmit} className="p-6 space-y-3.5 animate-fadeIn">
            <div className="flex items-center gap-2 pb-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <h4 className="text-sm font-bold text-[#1f1f1f]">Nhập tài khoản Google của bạn</h4>
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A3B43] block mb-1">
                Địa chỉ Gmail / Google Workspace
              </label>
              <input
                type="email"
                required
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="tenban@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-[#dadce0] text-xs focus:ring-2 focus:ring-[#4285F4] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A3B43] block mb-1">
                Họ và tên của bạn
              </label>
              <input
                type="text"
                required
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                placeholder="VD: Minh Anh, Hoàng Nam..."
                className="w-full px-3 py-2 rounded-xl border border-[#dadce0] text-xs focus:ring-2 focus:ring-[#4285F4] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A3B43] block mb-1">
                Trường Đại Học
              </label>
              <input
                type="text"
                value={customGoogleUniv}
                onChange={(e) => setCustomGoogleUniv(e.target.value)}
                placeholder="VD: ĐH Bách Khoa, ĐH Kinh Tế..."
                className="w-full px-3 py-2 rounded-xl border border-[#dadce0] text-xs focus:ring-2 focus:ring-[#4285F4] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#4A3B43] block mb-1">
                Chọn linh vật avatar
              </label>
              <div className="flex items-center gap-2">
                {['🐰', '🐱', '🐻', '🦊', '🐼', '🐧'].map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => setCustomGoogleAvatar(emo)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition border ${
                      customGoogleAvatar === emo
                        ? 'border-[#4285F4] bg-[#EEF4FF] scale-110'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGoogleStep('picker')}
                className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>Xác nhận đăng nhập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* MAIN AUTH FLOW (Google Button, Facebook Button, or Form) */}
        {googleStep === 'idle' && (
          <div className="p-5 space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#FFF0F3] p-1 rounded-2xl border border-[#FFCCD5]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'login'
                    ? 'bg-white text-[#D81B60] shadow-2xs'
                    : 'text-[#8C6D7C] hover:text-[#4A3B43]'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'register'
                    ? 'bg-white text-[#D81B60] shadow-2xs'
                    : 'text-[#8C6D7C] hover:text-[#4A3B43]'
                }`}
              >
                Đăng Ký Mới
              </button>
            </div>

            {/* Prominent Google Sign-in / Sign-up Button */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setGoogleStep('picker');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-white border-2 border-[#4285F4]/40 hover:border-[#4285F4] hover:bg-[#F8FAFF] font-black text-xs sm:text-sm text-[#1f1f1f] flex items-center justify-center gap-3 transition shadow-sm hover:shadow-md group cursor-pointer"
              >
                <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>
                  {activeTab === 'login' ? 'Đăng nhập bằng' : 'Đăng ký bằng'} <strong className="text-[#1a73e8]">Tài khoản Google</strong>
                </span>
              </button>

              <button
                type="button"
                onClick={handleFacebookAuth}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Tiếp tục với <strong>Facebook</strong></span>
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#FFE4E8] w-full"></div>
              <span className="bg-white px-3 text-[10px] text-[#8C6D7C] uppercase font-bold tracking-wider absolute">
                hoặc email sinh viên
              </span>
            </div>

            {/* Standard Form */}
            <form onSubmit={handleSubmitForm} className="space-y-3">
              {activeTab === 'register' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">
                      Họ và tên của bạn
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#FF85A1] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="VD: Minh Thư, Hoàng Nam..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#FFCCD5] text-xs focus:ring-2 focus:ring-[#FF85A1] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">
                      Trường Đại Học
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-[#FF85A1] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="VD: ĐH Quốc Gia, ĐH Ngoại Thương..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#FFCCD5] text-xs focus:ring-2 focus:ring-[#FF85A1] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">
                      Chọn avatar linh vật
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['🐰', '🐱', '🐻', '🦊', '🐼', '🐧', '🐹', '🐶'].map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setSelectedAvatar(emo)}
                          className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition border ${
                            selectedAvatar === emo
                              ? 'border-[#D81B60] bg-[#FFF0F3] scale-110 shadow-xs'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">
                  Email sinh viên
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#FF85A1] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#FFCCD5] text-xs focus:ring-2 focus:ring-[#FF85A1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#FF85A1] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#FFCCD5] text-xs focus:ring-2 focus:ring-[#FF85A1] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF85A1] to-[#FFAAA6] text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
              >
                <span>{activeTab === 'login' ? 'Đăng Nhập Vào TIMI' : 'Tạo Tài Khoản Sinh Viên'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Guest Demo Button */}
            <div className="pt-2 border-t border-[#FFE4E8]">
              <button
                type="button"
                onClick={handleGuestDemo}
                className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>🌟 Dùng thử nhanh (Chế độ Khách)</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-[#8C6D7C] flex items-center justify-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu mỗi tài khoản hoàn toàn riêng biệt & bảo mật</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
