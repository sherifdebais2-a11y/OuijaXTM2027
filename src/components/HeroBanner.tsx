import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Play,
  Sparkles,
  Tv,
  FileText,
  HelpCircle,
  Users,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { EducationalStage, VideoResource, Teacher, Lesson, Subject } from '../types';

export interface FeaturedItem {
  video: VideoResource;
  lesson?: Lesson;
  teacher?: Teacher;
  subject?: Subject;
}

interface HeroBannerProps {
  stages: EducationalStage[];
  selectedStageId: string;
  onSelectStage: (stageId: string) => void;
  featuredItems?: FeaturedItem[];
  featuredVideo?: VideoResource;
  featuredLesson?: Lesson;
  featuredTeacher?: Teacher;
  featuredSubject?: Subject;
  onOpenLesson: (lessonId: string) => void;
  onOpenSearch: () => void;
  totalVideos: number;
  totalPdfs: number;
  totalTeachers: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  featuredItems,
  featuredVideo,
  featuredLesson,
  featuredTeacher,
  featuredSubject,
  onOpenLesson,
  totalVideos,
  totalPdfs,
  totalTeachers
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Construct item list (max 5 items)
  const items: FeaturedItem[] = (featuredItems && featuredItems.length > 0)
    ? featuredItems.slice(0, 5)
    : (featuredVideo ? [{ video: featuredVideo, lesson: featuredLesson, teacher: featuredTeacher, subject: featuredSubject }] : []);

  useEffect(() => {
    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  const activeItem = items[currentIndex];

  const handleNext = () => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="relative overflow-hidden bg-[#faf8f5] py-8 border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Container Banner with Metal Border */}
        <div className="metal-border p-6 sm:p-8 relative overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Main Hero Text */}
            <div className="lg:col-span-7 space-y-4 text-right">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 metal-badge text-[#0f172a] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>✏️ منصة التعليم الرقمي التفاعلي الشاملة للمناهج المصرية</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-snug text-[#0f172a] font-alexandria">
                مرحباً بك في <span className="marker-yellow text-[#0f172a]">المكتبة الرقمية الشاملة</span> 💡
              </h1>

              <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed font-readex">
                تصفح وشاهد شروحات المناهج الدراسية المصرية من الابتدائية حتى الثانوية على السبورة التفاعلية، مع توفير كتب الوزارة والملخصات والامتحانات التفاعلية.
              </p>

              {/* Quick Stats Yellow Sticky Note Pills */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#854d0e] pt-1">
                <div className="flex items-center gap-1.5 sticky-note px-3 py-1.5 text-xs font-semibold rounded-full shadow-xs">
                  <Tv className="w-3.5 h-3.5 text-[#0f172a]" />
                  <span>🎬 +{totalVideos || 0} فيديو شرح سبورة</span>
                </div>
                <div className="flex items-center gap-1.5 sticky-note px-3 py-1.5 text-xs font-semibold rounded-full shadow-xs">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>📚 +{totalPdfs || 0} كتب ومذكرات PDF</span>
                </div>
                <div className="flex items-center gap-1.5 sticky-note px-3 py-1.5 text-xs font-semibold rounded-full shadow-xs">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>📝 امتحانات تفاعلية</span>
                </div>
                <div className="flex items-center gap-1.5 sticky-note px-3 py-1.5 text-xs font-semibold rounded-full shadow-xs">
                  <Users className="w-3.5 h-3.5 text-slate-800" />
                  <span>👨‍🏫 +{totalTeachers || 0} نخبة المدرسين</span>
                </div>
              </div>

            </div>

            {/* Featured Video / Daily Spotlight Card with Carousel Navigation */}
            <div className="lg:col-span-5 space-y-2">
              
              {/* Carousel Header Controls */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 font-alexandria">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>أحدث الفيديوهات المتاحة</span>
                  {items.length > 0 && (
                    <span className="text-[10px] bg-slate-100 text-[#0f172a] px-2.5 py-0.5 rounded-full font-mono border border-slate-300">
                      {currentIndex + 1} من {items.length}
                    </span>
                  )}
                </div>

                {items.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrev}
                      title="الفيديو السابق"
                      className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0f172a] flex items-center justify-center transition-all cursor-pointer metal-badge shadow-xs active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      title="الفيديو التالي"
                      className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0f172a] flex items-center justify-center transition-all cursor-pointer metal-badge shadow-xs active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {activeItem && activeItem.video ? (
                <div className="relative rounded-2xl bg-white metal-badge p-3 shadow-md overflow-hidden group hover:border-slate-400 transition-all">
                  
                  {/* Poster Background Preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={`https://img.youtube.com/vi/${activeItem.video.youtubeVideoId}/hqdefault.jpg`}
                      alt={activeItem.video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800');
                      }}
                    />

                    {/* Play Badge */}
                    {activeItem.lesson && (
                      <button
                        onClick={() => onOpenLesson(activeItem.lesson!.id)}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer group/btn bg-black/10"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#0f172a] text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </button>
                    )}

                    <div className="absolute top-2.5 right-2.5 bg-[#0f172a] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow">
                      {activeItem.video.levelTag || 'شرح متميز'}
                    </div>

                    {activeItem.video.duration && (
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                        ⏱ {activeItem.video.duration}
                      </div>
                    )}
                  </div>

                  {/* Info Text */}
                  <div className="mt-3 space-y-1 text-right">
                    <div className="flex items-center justify-between text-xs text-[#0f172a] font-bold">
                      <span>{activeItem.subject?.name || 'شرح متكافئ'}</span>
                      <span className="text-slate-500 text-[11px] font-normal">{activeItem.lesson?.title}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#0f172a] transition-colors line-clamp-1 font-alexandria">
                      {activeItem.video.title}
                    </h3>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      {activeItem.teacher ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={activeItem.teacher.avatarUrl}
                            alt={activeItem.teacher.name}
                            className="w-5 h-5 rounded-full object-cover border border-slate-300"
                          />
                          <span className="font-medium text-slate-700 text-[11px]">{activeItem.teacher.name}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">المنصة التعليمية</span>
                      )}
                      
                      {activeItem.lesson && (
                        <button
                          onClick={() => onOpenLesson(activeItem.lesson!.id)}
                          className="btn-pill btn-pill-amber text-[11px] py-1 px-3"
                        >
                          <span>مشاهدة الدرس كامل</span>
                          <span className="btn-pill-icon w-4 h-4 text-amber-600">←</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-6 metal-border bg-white text-center space-y-2">
                  <GraduationCap className="w-10 h-10 text-[#0f172a] mx-auto" />
                  <h3 className="font-bold text-base text-slate-800 font-alexandria">المكتبة الرقمية المدرسية</h3>
                  <p className="text-xs text-slate-500">
                    اختر مرحلتك وصفك الدراسي لتصفح الفيديوهات والكتب والمذكرات المتاحة.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* High Density Stage Selector Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2 text-slate-800 font-alexandria">
              <span className="w-2 h-4 bg-gradient-to-b from-amber-500 to-rose-500 rounded-full"></span>
              اختر مرحلتك الدراسية
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stages.map((stg) => {
              const isSelected = selectedStageId === stg.id;
              let stageIcon = "👶";
              if (stg.id === 'preparatory') stageIcon = "🎒";
              if (stg.id === 'secondary') stageIcon = "🎓";

              return (
                <div
                  key={stg.id}
                  onClick={() => onSelectStage(stg.id)}
                  className={`p-4 transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'metal-border ring-2 ring-amber-500/50 shadow-lg text-slate-900 bg-white'
                      : 'metal-border opacity-90 hover:opacity-100 text-slate-700 hover:scale-[1.01]'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-slate-100 metal-badge text-[#0f172a] flex items-center justify-center text-xl shrink-0">
                    {stageIcon}
                  </div>
                  <div>
                    <div className="font-bold text-sm font-alexandria text-slate-800">
                      {stg.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {stg.gradesCount} صفوف دراسية
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

