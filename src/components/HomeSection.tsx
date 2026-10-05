import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Bell, 
  Volume2, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Flame, 
  BookOpen, 
  Coffee, 
  Activity, 
  Droplet, 
  ChevronRight,
  Filter,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, FlashcardColor } from '../types';
import { playSuccessSound, playChime } from '../utils/audio';

interface HomeSectionProps {
  tasks: Task[];
  activeTab: 'work' | 'life' | 'study';
  onTabChange: (tab: 'work' | 'life' | 'study') => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (category: 'work' | 'life' | 'study') => void;
  onStartPomodoroForTask: (task: Task) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  tasks,
  activeTab,
  onTabChange,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onStartPomodoroForTask
}) => {
  const [colorFilter, setColorFilter] = useState<FlashcardColor | 'all'>('all');
  const [waterGlasses, setWaterGlasses] = useState(5); // 8 glasses daily goal

  const filteredTasks = tasks.filter((t) => {
    if (t.category !== activeTab) return false;
    if (colorFilter !== 'all' && t.flashcardColor !== colorFilter) return false;
    return true;
  });

  const handleCheckTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      // Confetti sparkles celebration!
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x, y },
        colors: ['#FF85A1', '#FFAAA6', '#FFD1DC', '#FFEE58', '#BA68C8']
      });
      playSuccessSound();
    }
    onToggleTask(task.id);
  };

  const getFlashcardStyles = (color: FlashcardColor) => {
    switch (color) {
      case 'red':
        return {
          cardBg: 'bg-gradient-to-br from-[#FFF0F2] to-[#FFEBEF]',
          border: 'border-[#FFAAA6] hover:border-[#E53935]',
          badgeBg: 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]',
          tag: '🔴 Rất quan trọng',
          accent: '#E53935'
        };
      case 'orange':
        return {
          cardBg: 'bg-gradient-to-br from-[#FFF8F0] to-[#FFF3E6]',
          border: 'border-[#FFCC80] hover:border-[#FB8C00]',
          badgeBg: 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]',
          tag: '🟠 Thường ngày (Làm thêm & Đi học)',
          accent: '#FB8C00'
        };
      case 'yellow':
        return {
          cardBg: 'bg-gradient-to-br from-[#FFFFF2] to-[#FFFDE7]',
          border: 'border-[#FFF59D] hover:border-[#FBC02D]',
          badgeBg: 'bg-[#FFFDE7] text-[#F57F17] border border-[#FFF9C4]',
          tag: '🟡 Cần hoàn thành',
          accent: '#FBC02D'
        };
      case 'white':
      default:
        return {
          cardBg: 'bg-white',
          border: 'border-[#E0E0E0] hover:border-[#9E9E9E]',
          badgeBg: 'bg-[#F5F5F5] text-[#455A64] border border-[#E0E0E0]',
          tag: '⚪ Ghi chú nhẹ',
          accent: '#78909C'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Main Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#FFE4E8]">
        <div className="flex items-center p-1 bg-[#FFF0F3] rounded-2xl border border-[#FFCCD5]">
          <button
            onClick={() => { onTabChange('work'); setColorFilter('all'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'work'
                ? 'bg-white text-[#D81B60] shadow-sm'
                : 'text-[#8C6D7C] hover:text-[#4A3B43]'
            }`}
          >
            <span>💼</span>
            Trang Công Việc
          </button>
          <button
            onClick={() => { onTabChange('life'); setColorFilter('all'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'life'
                ? 'bg-white text-[#E65100] shadow-sm'
                : 'text-[#8C6D7C] hover:text-[#4A3B43]'
            }`}
          >
            <span>🌸</span>
            Trang Đời Sống
          </button>
          <button
            onClick={() => { onTabChange('study'); setColorFilter('all'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'study'
                ? 'bg-white text-[#0277BD] shadow-sm'
                : 'text-[#8C6D7C] hover:text-[#4A3B43]'
            }`}
          >
            <span>📚</span>
            Trang Học Tập
          </button>
        </div>

        {/* Add button */}
        <button
          onClick={() => onAddTask(activeTab)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF85A1] to-[#FFAAA6] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Flashcard {activeTab === 'work' ? 'Công Việc' : activeTab === 'life' ? 'Đời Sống' : 'Học Tập'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TRANG CÔNG VIỆC (FLASHCARD MÀU: ĐỎ, CAM, VÀNG, TRẮNG) */}
      {/* ========================================================================= */}
      {activeTab === 'work' && (
        <div className="space-y-4">
          {/* Color filter chips */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-semibold text-[#8C6D7C] flex items-center gap-1 pr-1">
                <Filter className="w-3.5 h-3.5 text-[#FF85A1]" /> Màu:
              </span>
              <button
                onClick={() => setColorFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  colorFilter === 'all'
                    ? 'bg-[#FF85A1] text-white shadow-xs'
                    : 'bg-white text-[#8C6D7C] border border-[#FFCCD5] hover:bg-[#FFF0F3]'
                }`}
              >
                Tất cả ({tasks.filter(t => t.category === 'work').length})
              </button>
              <button
                onClick={() => setColorFilter('red')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  colorFilter === 'red'
                    ? 'bg-[#E53935] text-white shadow-xs'
                    : 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#E53935]"></span>
                Đỏ: Rất quan trọng
              </button>
              <button
                onClick={() => setColorFilter('orange')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  colorFilter === 'orange'
                    ? 'bg-[#FB8C00] text-white shadow-xs'
                    : 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FB8C00]"></span>
                Cam: Thường ngày (Làm thêm & Đi học)
              </button>
              <button
                onClick={() => setColorFilter('yellow')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  colorFilter === 'yellow'
                    ? 'bg-[#FBC02D] text-white shadow-xs'
                    : 'bg-[#FFFDE7] text-[#F57F17] border border-[#FFF9C4]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FBC02D]"></span>
                Vàng: Cần làm
              </button>
              <button
                onClick={() => setColorFilter('white')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  colorFilter === 'white'
                    ? 'bg-[#546E7A] text-white shadow-xs'
                    : 'bg-white text-[#455A64] border border-[#CFD8DC]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#B0BEC5]"></span>
                Trắng: Ghi chú
              </button>
            </div>
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-[#FFCCD5] p-6">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] text-3xl mx-auto flex items-center justify-center mb-3">
                  ✨
                </div>
                <h4 className="text-base font-bold text-[#4A3B43]">Chưa có flashcard công việc nào</h4>
                <p className="text-xs text-[#8C6D7C] mt-1 max-w-md mx-auto">
                  Hãy thêm công việc quan trọng (Đỏ), ca làm thêm và lịch đi học (Cam), hoặc các mục cần hoàn thành!
                </p>
                <button
                  onClick={() => onAddTask('work')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#FF85A1] text-white text-xs font-bold shadow-md hover:bg-[#FF6B8B] transition inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tạo flashcard đầu tiên
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const styles = getFlashcardStyles(task.flashcardColor);
                return (
                  <div
                    key={task.id}
                    onClick={() => onEditTask(task)}
                    className={`relative p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md ${styles.cardBg} ${styles.border} ${
                      task.completed ? 'opacity-70' : ''
                    }`}
                  >
                    {/* Top status bar */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${styles.badgeBg}`}>
                        {styles.tag}
                      </span>

                      <div className="flex items-center gap-2">
                        {task.soundAlert && (
                          <button
                            type="button"
                            title="Có âm thanh nhắc nhở"
                            onClick={(e) => {
                              e.stopPropagation();
                              playChime('sweet');
                            }}
                            className="text-[#FF85A1] hover:scale-110 transition p-1"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Xóa flashcard này"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Bạn có chắc muốn xóa flashcard này?')) {
                              onDeleteTask(task.id);
                            }
                          }}
                          className="text-[#9E9E9E] hover:text-red-500 hover:scale-110 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCheckTask(task, e)}
                          className="hover:scale-110 transition"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-[#4CAF50] fill-[#E8F5E9]" />
                          ) : (
                            <Circle className="w-6 h-6 text-[#FF85A1] hover:text-[#E91E63]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Title & Note */}
                    <h3 className={`text-base font-bold mb-1 ${task.completed ? 'line-through text-[#8C6D7C]' : 'text-[#4A3B43]'}`}>
                      {task.title}
                    </h3>
                    {task.note && (
                      <p className="text-xs text-[#6D5A64] line-clamp-2 mb-3">
                        {task.note}
                      </p>
                    )}

                    {/* Bottom details: Time, countdown, pomodoro quick launch */}
                    <div className="pt-2 border-t border-[#0000000a] flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-3 text-[#7D5A68] font-medium">
                        {task.dueTime && (
                          <span className="flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-black/5">
                            <Clock className="w-3 h-3 text-[#FF85A1]" />
                            {task.dueTime}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="text-xs">⏱️</span>
                          {task.durationMinutes} phút
                        </span>
                        {task.notifyBeforeMinutes > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-[#C2185B] bg-[#FFF0F3] px-1.5 py-0.5 rounded-md">
                            <Bell className="w-2.5 h-2.5" /> -{task.notifyBeforeMinutes}p
                          </span>
                        )}
                      </div>

                      {/* Pomodoro Focus Button for this task */}
                      {!task.completed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartPomodoroForTask(task);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white text-[#C2185B] font-bold text-[11px] border border-[#FFCCD5] hover:bg-[#FFE4E8] transition flex items-center gap-1 shadow-2xs"
                        >
                          <Play className="w-3 h-3 fill-[#C2185B]" /> Bật Pomodoro
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TRANG ĐỜI SỐNG (ĂN UỐNG, GIẢI TRÍ, VẬN ĐỘNG) */}
      {/* ========================================================================= */}
      {activeTab === 'life' && (
        <div className="space-y-6">
          {/* Quick Water Tracker Widget */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#E0F7FA] via-[#E1F5FE] to-[#FFF0F5] border border-[#B2EBF2] shadow-sm flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#80DEEA] flex items-center justify-center text-2xl shadow-xs">
                💧
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#006064]">
                  Nhắc nhở uống đủ 2L nước mỗi ngày cho sinh viên
                </h4>
                <p className="text-xs text-[#00838F]">
                  Đã uống: <strong className="text-sm">{waterGlasses * 250}ml</strong> / 2.000ml ({waterGlasses}/8 ly)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setWaterGlasses(g);
                    playChime('sweet');
                  }}
                  className={`w-7 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition ${
                    g <= waterGlasses
                      ? 'bg-[#00BCD4] text-white shadow-xs'
                      : 'bg-white text-[#80DEEA] border border-[#B2EBF2]'
                  }`}
                  title={`${g * 250}ml`}
                >
                  🥤
                </button>
              ))}
            </div>
          </div>

          {/* 3 Categories Columns: Ăn uống, Giải trí, Vận động */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cột 1: Ăn uống */}
            <div className="p-4 rounded-3xl bg-[#FFF9F5] border border-[#FFE0B2] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#FFE0B2] flex items-center justify-center text-lg">
                    🥗
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#E65100]">Ăn Uống</h4>
                    <p className="text-[11px] text-[#FB8C00]">Bữa chính & Dinh dưỡng</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask('life')}
                  className="w-7 h-7 rounded-full bg-white text-[#E65100] border border-[#FFCC80] hover:bg-[#FFE0B2] flex items-center justify-center text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.category === 'life' && t.subCategory === 'life_dining')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-3 rounded-2xl bg-white border border-[#FFE4C4] hover:border-[#FB8C00] transition cursor-pointer flex items-start justify-between gap-2 shadow-2xs ${
                        task.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#4A3B43]">{task.title}</p>
                        {task.note && <p className="text-[11px] text-[#8C6D7C] line-clamp-1">{task.note}</p>}
                        {task.dueTime && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#E65100] mt-1">
                            <Clock className="w-2.5 h-2.5" /> {task.dueTime}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleCheckTask(task, e)}
                        className="p-1 hover:scale-110 transition flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#FFB74D]" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cột 2: Giải trí */}
            <div className="p-4 rounded-3xl bg-[#FDF7FF] border border-[#E1BEE7] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#E1BEE7] flex items-center justify-center text-lg">
                    🎮
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#6A1B9A]">Giải Trí</h4>
                    <p className="text-[11px] text-[#8E24AA]">Thư giãn, nghe nhạc, phim</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask('life')}
                  className="w-7 h-7 rounded-full bg-white text-[#6A1B9A] border border-[#CE93D8] hover:bg-[#E1BEE7] flex items-center justify-center text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.category === 'life' && t.subCategory === 'life_entertainment')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-3 rounded-2xl bg-white border border-[#EDE7F6] hover:border-[#AB47BC] transition cursor-pointer flex items-start justify-between gap-2 shadow-2xs ${
                        task.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#4A3B43]">{task.title}</p>
                        {task.note && <p className="text-[11px] text-[#8C6D7C] line-clamp-1">{task.note}</p>}
                        {task.dueTime && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#8E24AA] mt-1">
                            <Clock className="w-2.5 h-2.5" /> {task.dueTime}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleCheckTask(task, e)}
                        className="p-1 hover:scale-110 transition flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#BA68C8]" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cột 3: Vận động */}
            <div className="p-4 rounded-3xl bg-[#F1F8E9] border border-[#C5E1A5] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#C5E1A5] flex items-center justify-center text-lg">
                    🏃
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#33691E]">Vận Động</h4>
                    <p className="text-[11px] text-[#558B2F]">Thể thao, yoga, giãn cơ</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask('life')}
                  className="w-7 h-7 rounded-full bg-white text-[#33691E] border border-[#AED581] hover:bg-[#C5E1A5] flex items-center justify-center text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.category === 'life' && t.subCategory === 'life_fitness')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-3 rounded-2xl bg-white border border-[#E8F5E9] hover:border-[#7CB342] transition cursor-pointer flex items-start justify-between gap-2 shadow-2xs ${
                        task.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#4A3B43]">{task.title}</p>
                        {task.note && <p className="text-[11px] text-[#8C6D7C] line-clamp-1">{task.note}</p>}
                        {task.dueTime && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#558B2F] mt-1">
                            <Clock className="w-2.5 h-2.5" /> {task.dueTime}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleCheckTask(task, e)}
                        className="p-1 hover:scale-110 transition flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#8BC34A]" />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TRANG HỌC TẬP (BÀI TẬP, HỌC THÊM, ĐỌC SÁCH, KỸ NĂNG MỀM) */}
      {/* ========================================================================= */}
      {activeTab === 'study' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Bài tập */}
            <div className="p-4 rounded-3xl bg-white border border-[#FFCDD2] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#FFEBEE]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#C62828] uppercase tracking-wide">Bài Tập</h4>
                    <p className="text-[10px] text-[#8C6D7C]">Tiểu luận & Deadline</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask('study')}
                  className="w-6 h-6 rounded-full bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFCDD2] flex items-center justify-center text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.category === 'study' && t.subCategory === 'study_assignment')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-3 rounded-2xl bg-[#FFF9FA] border border-[#FFEBEE] hover:border-[#EF5350] transition cursor-pointer ${
                        task.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="text-xs font-bold text-[#4A3B43]">{task.title}</p>
                        <button
                          onClick={(e) => handleCheckTask(task, e)}
                          className="hover:scale-110 transition flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#EF5350]" />
                          )}
                        </button>
                      </div>
                      {task.note && <p className="text-[11px] text-[#8C6D7C] line-clamp-1 mt-1">{task.note}</p>}
                    </div>
                  ))}
              </div>
            </div>

            {/* 2. Học thêm */}
            <div className="p-4 rounded-3xl bg-white border border-[#BBDEFB] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3F2FD]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎓</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wide">Học Thêm</h4>
                    <p className="text-[10px] text-[#8C6D7C]">IELTS, Tin học, Khóa học</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask('study')}
                  className="w-6 h-6 rounded-full bg-[#E3F2FD] text-[#0D47A1] hover:bg-[#BBDEFB] flex items-center justify-center text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.category === 'study' && t.subCategory === 'study_extra')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-3 rounded-2xl bg-[#F5F9FF] border border-[#E3F2FD] hover:border-[#42A5F5] transition cursor-pointer ${
                        task.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="text-xs font-bold text-[#4A3B43]">{task.title}</p>
                        <button
                          onClick={(e) => handleCheckTask(task, e)}
                          className="hover:scale-110 transition flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#2196F3]" />
                          )}
                        </button>
                      </div>
                      {task.note && <p className="text-[11px] text-[#8C6D7C] line-clamp-1 mt-1">{task.note}</p>}
                    </div>
                  ))}
              </div>
            </div>

            {/* 3. Đọc sách */}
            <div className="p-4 rounded-3xl bg-white border border-[#FFE082] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#FFF8E1]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#E65100] uppercase tracking-wide">Đọc Sách</h4>
                    <p className="text-[10px] text-[#8C6D7C]">Mỗi ngày 20 - 30 trang</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask('study')}
                  className="w-6 h-6 rounded-full bg-[#FFF8E1] text-[#E65100] hover:bg-[#FFE082] flex items-center justify-center text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.category === 'study' && t.subCategory === 'study_reading')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-3 rounded-2xl bg-[#FFFDF7] border border-[#FFF8E1] hover:border-[#FFA000] transition cursor-pointer ${
                        task.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="text-xs font-bold text-[#4A3B43]">{task.title}</p>
                        <button
                          onClick={(e) => handleCheckTask(task, e)}
                          className="hover:scale-110 transition flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#FFA000]" />
                          )}
                        </button>
                      </div>
                      {task.note && <p className="text-[11px] text-[#8C6D7C] line-clamp-1 mt-1">{task.note}</p>}
                    </div>
                  ))}
              </div>
            </div>

            {/* 4. Kỹ năng mềm */}
            <div className="p-4 rounded-3xl bg-white border border-[#D1C4E9] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE7F6]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#512DA8] uppercase tracking-wide">Kỹ Năng Mềm</h4>
                    <p className="text-[10px] text-[#8C6D7C]">Thuyết trình & Làm việc nhóm</p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask('study')}
                  className="w-6 h-6 rounded-full bg-[#EDE7F6] text-[#512DA8] hover:bg-[#D1C4E9] flex items-center justify-center text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((t) => t.category === 'study' && t.subCategory === 'study_softskills')
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`p-3 rounded-2xl bg-[#FCF8FF] border border-[#EDE7F6] hover:border-[#7E57C2] transition cursor-pointer ${
                        task.completed ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="text-xs font-bold text-[#4A3B43]">{task.title}</p>
                        <button
                          onClick={(e) => handleCheckTask(task, e)}
                          className="hover:scale-110 transition flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#7E57C2]" />
                          )}
                        </button>
                      </div>
                      {task.note && <p className="text-[11px] text-[#8C6D7C] line-clamp-1 mt-1">{task.note}</p>}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
