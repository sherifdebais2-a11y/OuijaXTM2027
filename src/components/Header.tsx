import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  BookOpen,
  Users,
  Bookmark,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { EducationalStage, Grade } from '../types';

interface HeaderProps {
  stages: EducationalStage[];
  grades: Grade[];
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedStageId: string;
  setSelectedStageId: (id: string) => void;
  selectedGradeId: string;
  setSelectedGradeId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  bookmarksCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSearchModal: () => void;
  onOpenAiChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stages,
  grades,
  currentView,
  setCurrentView,
  selectedStageId,
  setSelectedStageId,
  selectedGradeId,
  setSelectedGradeId,
  searchQuery,
  setSearchQuery,
  bookmarksCount,
  darkMode,
  setDarkMode,
  onOpenSearchModal,
  onOpenAiChat
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stagesDropdownOpen, setStagesDropdownOpen] = useState(false);

  const handleStageSelect = (stageId: string) => {
    setSelectedStageId(stageId);
    const firstGradeInStage = grades.find(g => g.stageId === stageId);
    if (firstGradeInStage) {
      setSelectedGradeId(firstGradeInStage.id);
    }
    setCurrentView('catalog');
    setStagesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 notebook-header text-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shadow-md font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[#0f172a] font-alexandria">
                  منصة تعلّم
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fef08a] text-[#854d0e] font-bold border border-[#fde047]">
                  مصر 🇪🇬
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-readex">
                المكتبة الرقمية الشاملة للمناهج الدراسية
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 font-medium text-xs">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'home'
                  ? 'btn-pill-amber text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f172a]'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white text-amber-600 flex items-center justify-center font-bold shadow-xs shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span>الرئيسية</span>
            </button>

            {/* Stages Dropdown */}
            <div className="relative">
              <button
                onClick={() => setStagesDropdownOpen(!stagesDropdownOpen)}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                  currentView === 'catalog'
                    ? 'btn-pill-cyan text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f172a]'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold shadow-xs shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
                <span>المراحل والصفوف</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${stagesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {stagesDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 metal-border p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 border-b border-slate-200">
                    اختر المرحلة الدراسية:
                  </div>
                  <div className="space-y-1 mt-1">
                    {stages.map(stg => (
                      <button
                        key={stg.id}
                        onClick={() => handleStageSelect(stg.id)}
                        className={`w-full text-right px-3 py-2.5 rounded-xl flex items-center justify-between transition-all text-xs font-medium cursor-pointer ${
                          selectedStageId === stg.id && currentView === 'catalog'
                            ? 'bg-slate-100 text-[#0f172a] font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0f172a]" />
                          <span>{stg.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {stg.gradesCount} صفوف
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentView('library')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'library'
                  ? 'btn-pill-pink text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f172a]'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white text-rose-600 flex items-center justify-center font-bold shadow-xs shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </span>
              <span>المكتبة والكتب</span>
            </button>

            <button
              onClick={() => setCurrentView('teachers')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'teachers'
                  ? 'btn-pill-purple text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f172a]'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white text-violet-600 flex items-center justify-center font-bold shadow-xs shrink-0">
                <Users className="w-3.5 h-3.5" />
              </span>
              <span>المدرسين</span>
            </button>

            <button
              onClick={() => setCurrentView('bookmarks')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-2 relative cursor-pointer ${
                currentView === 'bookmarks'
                  ? 'btn-pill-lime text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f172a]'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold shadow-xs shrink-0">
                <Bookmark className="w-3.5 h-3.5" />
              </span>
              <span>المفضلة</span>
              {bookmarksCount > 0 && (
                <span className="bg-[#0f172a] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Search trigger & Admin */}
          <div className="flex items-center gap-2">
            
            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearchModal}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-400 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs transition-all text-right cursor-pointer shadow-none"
            >
              <Search className="w-4 h-4 text-[#0f172a]" />
              <span className="hidden sm:inline text-slate-500">ابحث عن درس، مادة، أو مدرس...</span>
              <kbd className="hidden lg:inline-block text-[10px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={() => setCurrentView('admin')}
              title="لوحة التحكم"
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-[#0f172a] text-white border-[#0f172a]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#0f172a]'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="w-full text-right px-4 py-2.5 rounded-xl bg-slate-800/60 text-slate-200 font-medium flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>الرئيسية</span>
          </button>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 px-2 py-1">المراحل الدراسية:</div>
            {stages.map(s => (
              <button
                key={s.id}
                onClick={() => handleStageSelect(s.id)}
                className="w-full text-right px-4 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-between"
              >
                <span>{s.name}</span>
                <span className="text-[10px] text-slate-400">{s.description}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <button
              onClick={() => { setCurrentView('library'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>المكتبة والكتب 📕</span>
            </button>

            <button
              onClick={() => { setCurrentView('teachers'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>المدرسين 👨‍🏫</span>
            </button>

            {onOpenAiChat && (
              <button
                onClick={() => { onOpenAiChat(); setMobileMenuOpen(false); }}
                className="w-full text-right px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>اسأل الدحيح الذكي 🎓</span>
              </button>
            )}

            <button
              onClick={() => { setCurrentView('bookmarks'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-rose-400" />
                <span>دروسي المفضلة</span>
              </div>
              {bookmarksCount > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {bookmarksCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-2 font-medium"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>لوحة التحكم والإدارة</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
