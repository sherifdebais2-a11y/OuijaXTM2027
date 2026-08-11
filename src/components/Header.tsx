import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  BookOpen,
  Users,
  Bookmark,
  Settings,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Filter,
  Bot
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-900 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: BRAND LOGO, SEARCH BAR & QUICK ACTIONS */}
        <div className="flex items-center justify-between h-16 gap-4 border-b border-slate-100 py-2">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-center shadow-md font-bold border border-slate-700">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 font-alexandria">
                  منصة تعلّم
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  مصر 🇪🇬
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-readex">
                المكتبة الرقمية الشاملة للمناهج الدراسية
              </p>
            </div>
          </div>

          {/* Central Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div
              onClick={onOpenSearchModal}
              className="w-full flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-inner"
            >
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="flex-1 text-slate-400 font-medium">ابحث عن درس، مادة، أو كتاب...</span>
              <kbd className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Quick Actions & AI Assistant */}
          <div className="flex items-center gap-2.5">
            
            {/* Ask AI Assistant Button */}
            {onOpenAiChat && (
              <button
                onClick={onOpenAiChat}
                className="btn-glossy-4k btn-glossy-coral py-1.5 px-3 text-xs shadow-md hidden sm:flex items-center gap-2"
              >
                <div className="btn-glossy-icon bg-white/20 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <span>اسأل الدحيح 🎓</span>
              </button>
            )}

            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearchModal}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              title="بحث"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Settings */}
            <button
              onClick={() => setCurrentView('admin')}
              title="لوحة التحكم"
              className={`p-2.5 rounded-xl transition-all border cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 text-white shadow-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* ROW 2: CLEAN NAVIGATION BAR WITH 4K GLOSSY BUTTONS */}
        <div className="hidden md:flex items-center justify-between py-2 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-2 text-xs w-full">
            
            {/* Home Navigation Button */}
            <button
              onClick={() => setCurrentView('home')}
              className={`btn-glossy-4k ${
                currentView === 'home'
                  ? 'btn-glossy-amber'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className={`btn-glossy-icon ${currentView === 'home' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700'}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold">الرئيسية</span>
            </button>

            {/* Educational Stages Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setStagesDropdownOpen(!stagesDropdownOpen)}
                className={`btn-glossy-4k ${
                  currentView === 'catalog'
                    ? 'btn-glossy-blue'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className={`btn-glossy-icon ${currentView === 'catalog' ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-bold">المراحل والصفوف</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${stagesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {stagesDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 metal-border p-2 z-50 animate-in fade-in slide-in-from-top-2 bg-white shadow-xl">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 border-b border-slate-100">
                    اختر المرحلة الدراسية:
                  </div>
                  <div className="space-y-1 mt-1">
                    {stages.map(stg => (
                      <button
                        key={stg.id}
                        onClick={() => handleStageSelect(stg.id)}
                        className={`w-full text-right px-3 py-2.5 rounded-xl flex items-center justify-between transition-all text-xs font-medium cursor-pointer ${
                          selectedStageId === stg.id && currentView === 'catalog'
                            ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span>{stg.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 font-semibold">
                          {stg.gradesCount} صفوف
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Digital Library Button */}
            <button
              onClick={() => setCurrentView('library')}
              className={`btn-glossy-4k ${
                currentView === 'library'
                  ? 'btn-glossy-magenta'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className={`btn-glossy-icon ${currentView === 'library' ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'}`}>
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold">المكتبة والكتب</span>
            </button>

            {/* Teachers Button */}
            <button
              onClick={() => setCurrentView('teachers')}
              className={`btn-glossy-4k ${
                currentView === 'teachers'
                  ? 'btn-glossy-purple'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className={`btn-glossy-icon ${currentView === 'teachers' ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-700'}`}>
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold">المدرسين والمعلمين</span>
            </button>

            {/* Bookmarks / Favorites Button */}
            <button
              onClick={() => setCurrentView('bookmarks')}
              className={`btn-glossy-4k ${
                currentView === 'bookmarks'
                  ? 'btn-glossy-emerald'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className={`btn-glossy-icon ${currentView === 'bookmarks' ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="font-bold">المفضلة</span>
              {bookmarksCount > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${currentView === 'bookmarks' ? 'bg-white text-emerald-900' : 'bg-emerald-600 text-white'}`}>
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Quick Interactive Workbench Jump Button */}
            <button
              onClick={() => {
                setCurrentView('catalog');
                const workbenchEl = document.getElementById('interactive-workbench');
                if (workbenchEl) {
                  workbenchEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-glossy-4k btn-glossy-teal ml-auto text-xs py-1.5 px-3"
            >
              <div className="btn-glossy-icon bg-white/20 text-white">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <span>تصفية المنهج التفاعلي</span>
            </button>

          </nav>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2 text-white">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="w-full text-right px-4 py-2.5 rounded-xl bg-slate-800 text-slate-100 font-bold flex items-center gap-2"
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

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => { setCurrentView('library'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 font-bold"
            >
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>المكتبة والكتب 📕</span>
            </button>

            <button
              onClick={() => { setCurrentView('teachers'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 font-bold"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>المدرسين والمعلمين 👨‍🏫</span>
            </button>

            {onOpenAiChat && (
              <button
                onClick={() => { onOpenAiChat(); setMobileMenuOpen(false); }}
                className="w-full text-right px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold flex items-center gap-2 shadow-sm"
              >
                <Bot className="w-4 h-4 text-white" />
                <span>اسأل الدحيح الذكي 🎓</span>
              </button>
            )}

            <button
              onClick={() => { setCurrentView('bookmarks'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-between font-bold"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>دروسي المفضلة</span>
              </div>
              {bookmarksCount > 0 && (
                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {bookmarksCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
              className="w-full text-right px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2 font-medium"
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

