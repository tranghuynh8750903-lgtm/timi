import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Bell, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { AlarmItem } from '../types';
import { playAlarmMelody, stopAlarmMelody, playChime } from '../utils/audio';

interface AlarmAndAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alarms: AlarmItem[];
  onAddAlarm: (alarm: Partial<AlarmItem>) => void;
  onDeleteAlarm: (id: string) => void;
  onToggleAlarm: (id: string) => void;
}

export const AlarmAndAlertsModal: React.FC<AlarmAndAlertsModalProps> = ({
  isOpen,
  onClose,
  alarms,
  onAddAlarm,
  onDeleteAlarm,
  onToggleAlarm
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [time, setTime] = useState('06:30');
  const [label, setLabel] = useState('');
  const [soundType, setSoundType] = useState<AlarmItem['soundType']>('sweet');
  const [snoozeMinutes, setSnoozeMinutes] = useState(5);
  const [isPlayingRingtone, setIsPlayingRingtone] = useState(false);

  if (!isOpen) return null;

  const handleTestSound = () => {
    if (isPlayingRingtone) {
      stopAlarmMelody();
      setIsPlayingRingtone(false);
    } else {
      setIsPlayingRingtone(true);
      playAlarmMelody(2);
      setTimeout(() => setIsPlayingRingtone(false), 4000);
    }
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) return;

    onAddAlarm({
      time,
      label: label.trim() || 'Báo thức học tập & làm việc',
      days: [1, 2, 3, 4, 5],
      enabled: true,
      soundType,
      snoozeMinutes
    });

    playChime('sweet');
    setLabel('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-[#FFD1DC] flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#FFE4E8] bg-gradient-to-r from-[#FFF5F7] to-[#FFF0F3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#4A3B43]">
                Báo Thức & Thông Báo Thời Gian Biểu
              </h3>
              <p className="text-xs text-[#8C6D7C]">
                Đảm bảo sinh viên luôn thức dậy đúng giờ và không trễ ca học
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAlarmMelody();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white text-[#7D2E49] hover:bg-[#FFE4E8] flex items-center justify-center transition border border-[#FFCCD5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Test Sound Banner */}
          <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-[#FFCCD5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF85A1]" />
              <span className="text-xs font-bold text-[#4A3B43]">Âm thanh chuông báo thức ngọt ngào</span>
            </div>
            <button
              onClick={handleTestSound}
              className="px-3 py-1 rounded-xl bg-white border border-[#FF85A1] text-[#D81B60] text-xs font-bold hover:bg-[#FFF0F3] transition flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isPlayingRingtone ? 'Dừng chuông' : 'Nghe thử chuông'}
            </button>
          </div>

          {/* Add Alarm Toggle */}
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[#7D2E49] uppercase tracking-wider">
              Danh Sách Báo Thức ({alarms.length})
            </h4>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 rounded-xl bg-[#FF85A1] text-white text-xs font-bold hover:bg-[#FF6B8B] transition flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm báo thức
            </button>
          </div>

          {/* Quick Add Form */}
          {isAdding && (
            <form onSubmit={handleCreateAlarm} className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FFCCD5] space-y-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">Giờ reo chuông</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#FFCCD5] bg-white text-base font-bold text-[#4A3B43]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">Báo lại (Snooze)</label>
                  <select
                    value={snoozeMinutes}
                    onChange={(e) => setSnoozeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#FFCCD5] bg-white text-xs"
                  >
                    <option value={5}>5 phút</option>
                    <option value={10}>10 phút</option>
                    <option value={15}>15 phút</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#7D2E49] block mb-1">Nhãn báo thức</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="VD: Dậy sớm đi học ca 1, Chuẩn bị ca làm thêm..."
                  className="w-full px-3 py-2 rounded-xl border border-[#FFCCD5] bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-[#8C6D7C]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#FF85A1] text-white text-xs font-bold"
                >
                  Lưu Báo Thức
                </button>
              </div>
            </form>
          )}

          {/* List of alarms */}
          <div className="space-y-2.5">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  alarm.enabled
                    ? 'bg-white border-[#FFCCD5] shadow-2xs'
                    : 'bg-[#FAFAFA] border-[#E0E0E0] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#4A3B43] tracking-tight">
                    {alarm.time}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-[#4A3B43]">{alarm.label}</h5>
                    <p className="text-[10px] text-[#8C6D7C]">
                      Lặp lại: Thứ 2 - Thứ 6 • Báo lại sau {alarm.snoozeMinutes}p
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alarm.enabled}
                      onChange={() => onToggleAlarm(alarm.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#FFAAA6] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF85A1]"></div>
                  </label>

                  <button
                    onClick={() => onDeleteAlarm(alarm.id)}
                    className="p-1.5 text-[#CFD8DC] hover:text-red-400"
                    title="Xóa báo thức"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
