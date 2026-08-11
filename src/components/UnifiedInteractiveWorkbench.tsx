import React, { useState, useEffect } from 'react';
import {
  getPdfEmbedUrl,
  handlePdfDownload,
  getCleanYoutubeEmbedUrl,
  getCleanYoutubeWatchUrl
} from '../lib/pdfAndVideoUtils';
import {
  EducationalStage,
  Grade,
  Subject,
  Unit,
  Lesson,
  VideoResource,
  PdfResource,
  InfographicResource,
  QuizQuestion,
  Teacher,
  UserProgress,
  ContentTabType
} from '../types';
import {
  GraduationCap,
  BookOpen,
  Tv,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Play,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Download,
  Share2,
  Users,
  Search,
  ChevronDown,
  ChevronLeft,
  Clock,
  RotateCcw,
  Award,
  Check,
  X,
  Printer,
  Eye,
  Filter,
  ExternalLink,
  Video
} from 'lucide-react';

interface UnifiedInteractiveWorkbenchProps {
  stages: EducationalStage[];
  grades: Grade[];
  subjects: Subject[];
  units: Unit[];
  lessons: Lesson[];
  videos: VideoResource[];
  pdfs: PdfResource[];
  infographics: InfographicResource[];
  quizzes: QuizQuestion[];
  teachers: Teacher[];
  userProgress: UserProgress;
  selectedStageId: string;
  onSelectStage: (stageId: string) => void;
  selectedGradeId: string;
  onSelectGrade: (gradeId: string) => void;
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  activeLessonId: string | null;
  setActiveLessonId: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onToggleComplete: (lessonId: string) => void;
  onSaveQuizResult: (lessonId: string, score: number, total: number) => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
}

export const UnifiedInteractiveWorkbench: React.FC<UnifiedInteractiveWorkbenchProps> = ({
  stages,
  grades,
  subjects,
  units,
  lessons,
  videos,
  pdfs,
  infographics,
  quizzes,
  teachers,
  userProgress,
  selectedStageId,
  onSelectStage,
  selectedGradeId,
  onSelectGrade,
  selectedSubjectId,
  onSelectSubject,
  activeLessonId,
  setActiveLessonId,
  onToggleBookmark,
  onToggleComplete,
  onSaveQuizResult,
  onOpenTeacherProfile
}) => {
  // Filtered lists for Cascading Dropdowns
  const stageGrades = grades.filter(g => g.stageId === selectedStageId);
  const gradeSubjects = subjects.filter(s => s.gradeId === selectedGradeId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || gradeSubjects[0];

  const currentUnits = currentSubject ? units.filter(u => u.subjectId === currentSubject.id) : [];
  const currentUnitIds = currentUnits.map(u => u.id);
  const currentLessons = lessons.filter(l => currentUnitIds.includes(l.unitId));

  // Determine active lesson strictly within currentLessons
  const activeLesson = currentLessons.find(l => l.id === activeLessonId) || currentLessons[0];
  const activeUnit = activeLesson ? units.find(u => u.id === activeLesson.unitId) : undefined;

  // Active Lesson Resources
  const lessonVideos = activeLesson ? videos.filter(v => v.lessonId === activeLesson.id) : [];
  const lessonPdfs = activeLesson ? pdfs.filter(p => p.lessonId === activeLesson.id) : [];
  const lessonInfos = activeLesson ? infographics.filter(i => i.lessonId === activeLesson.id) : [];
  const lessonQuizzes = activeLesson ? quizzes.filter(q => q.lessonId === activeLesson.id) : [];

  // Active Tab & Active Video / PDF
  const [activeTab, setActiveTab] = useState<ContentTabType>('videos');
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [selectedPdfId, setSelectedPdfId] = useState<string>('');

  const activePdf = lessonPdfs.find(p => p.id === selectedPdfId) || lessonPdfs[0];

  // Sidebar Units accordion expansion
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Auto sync activeLessonId when grade or subject filter changes
  useEffect(() => {
    if (currentLessons.length > 0) {
      const isCurrentActiveValid = currentLessons.some(l => l.id === activeLessonId);
      if (!isCurrentActiveValid) {
        setActiveLessonId(currentLessons[0].id);
      }
    }
  }, [selectedStageId, selectedGradeId, selectedSubjectId, currentLessons]);

  // Auto select video when active lesson changes
  useEffect(() => {
    if (lessonVideos.length > 0) {
      setSelectedVideoId(lessonVideos[0].youtubeVideoId);
    } else {
      setSelectedVideoId('');
    }
  }, [activeLesson?.id, videos]);

  // Auto select PDF when active lesson changes
  useEffect(() => {
    if (lessonPdfs.length > 0) {
      setSelectedPdfId(lessonPdfs[0].id);
    } else {
      setSelectedPdfId('');
    }
  }, [activeLesson?.id, pdfs]);

  // Expand all units by default
  useEffect(() => {
    if (currentUnits.length > 0) {
      setExpandedUnitIds(currentUnits.map(u => u.id));
    }
  }, [selectedSubjectId]);

  const toggleUnitExpand = (unitId: string) => {
    setExpandedUnitIds(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const activeVideo = lessonVideos.find(v => v.youtubeVideoId === selectedVideoId) || lessonVideos[0];
  const activeTeacher = activeVideo ? teachers.find(t => t.id === activeVideo.teacherId) : null;

  const isBookmarked = activeLesson ? userProgress.bookmarkedLessonIds.includes(activeLesson.id) : false;
  const isCompleted = activeLesson ? userProgress.completedLessonIds.includes(activeLesson.id) : false;

  // Quiz handlers
  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    if (lessonQuizzes.length === 0 || !activeLesson) return;
    let score = 0;
    lessonQuizzes.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) score++;
    });
    setQuizSubmitted(true);
    onSaveQuizResult(activeLesson.id, score, lessonQuizzes.length);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* CASCADING FILTER BAR (المرحلة -> الصف -> المادة) */}
      <div className="notebook-card p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-4">
          
          {/* Header & Filter Title */}
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#e11d48]" />
              <h2 className="text-sm font-bold text-slate-800 font-alexandria">
                تصفية المنهج الدراسي بسرعة ويسر (اختر المرحلة والصف والمادة)
              </h2>
            </div>
            <span className="text-[11px] sticky-note px-3 py-0.5 font-bold">
              ⚡️ تصفح تفاعلي مباشر
            </span>
          </div>

          {/* STEP 1: STAGE SELECTOR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-2 text-xs font-bold text-slate-600 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#e11d48] text-white flex items-center justify-center text-[10px] font-black">1</span>
              <span>اختر المرحلة:</span>
            </div>
            <div className="md:col-span-10 flex flex-wrap gap-2">
              {stages.map(stg => {
                const isSelected = stg.id === selectedStageId;
                return (
                  <button
                    key={stg.id}
                    onClick={() => onSelectStage(stg.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#e11d48] text-white shadow-xs font-bold'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-rose-50 hover:text-[#e11d48]'
                    }`}
                  >
                    <span>{stg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: GRADE SELECTOR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-100">
            <div className="md:col-span-2 text-xs font-bold text-slate-600 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#e11d48] text-white flex items-center justify-center text-[10px] font-black">2</span>
              <span>اختر الصف:</span>
            </div>
            <div className="md:col-span-10 flex flex-wrap gap-2">
              {stageGrades.map(g => {
                const isSelected = g.id === selectedGradeId;
                return (
                  <button
                    key={g.id}
                    onClick={() => onSelectGrade(g.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: SUBJECT SELECTOR RIBBON */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-100">
            <div className="md:col-span-2 text-xs font-bold text-slate-600 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#e11d48] text-white flex items-center justify-center text-[10px] font-black">3</span>
              <span>اختر المادة:</span>
            </div>
            <div className="md:col-span-10 flex flex-wrap gap-2">
              {gradeSubjects.map(sub => {
                const isSelected = sub.id === selectedSubjectId;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubject(sub.id)}
                    className={`btn-pill text-xs py-1.5 px-4 cursor-pointer ${
                      isSelected
                        ? 'btn-pill-pink text-white shadow-md'
                        : 'bg-white text-slate-700 metal-badge hover:bg-slate-50'
                    }`}
                  >
                    <span className="btn-pill-icon w-5 h-5 text-rose-600 text-[10px]">📚</span>
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* SPLIT WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* RIGHT SIDE (DESKTOP): LESSON & UNIT DIRECTORY SIDEBAR (35%) */}
        <div className="lg:col-span-4 space-y-4 lg:order-2">
          <div className="metal-border p-4 space-y-4 sticky top-20">
            
            {/* Subject Info Header */}
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <span className="text-[10px] text-[#e11d48] font-bold uppercase tracking-wider">
                  المادة المختارة حالياً
                </span>
                <h3 className="text-base font-bold text-slate-800 font-alexandria">
                  {currentSubject?.name || 'المادة الدراسية'}
                </h3>
              </div>
              <span className="text-xs sticky-note px-2.5 py-0.5 font-bold">
                {currentLessons.length} دروس
              </span>
            </div>

            {/* Quick Filter Search inside Sidebar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="ابحث عن درس في المادة..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            {/* UNITS & LESSONS ACCORDION */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
              {currentUnits.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  لا توجد وحدات أو دروس مضافة لهذا المنهج بعد.
                </div>
              ) : (
                currentUnits.map(unit => {
                  const uLessons = currentLessons.filter(l => l.unitId === unit.id && l.title.includes(searchQuery));
                  const isExpanded = expandedUnitIds.includes(unit.id);
                  const unitVideoCount = uLessons.reduce((acc, l) => acc + videos.filter(v => v.lessonId === l.id).length, 0);

                  return (
                    <div key={unit.id} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => toggleUnitExpand(unit.id)}
                        className="w-full p-3 bg-slate-100/80 transition-colors flex items-center justify-between text-right cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#e11d48] text-white flex items-center justify-center font-bold text-[11px]">
                            {unit.orderNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800 line-clamp-1">{unit.title}</span>
                          {unitVideoCount > 0 && (
                            <span className="bg-rose-100 text-[#e11d48] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              🎬 {unitVideoCount}
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-2 space-y-1">
                          {uLessons.map(les => {
                            const isSelectedLesson = les.id === activeLesson?.id;
                            const lesVids = videos.filter(v => v.lessonId === les.id);
                            const lesPdfs = pdfs.filter(p => p.lessonId === les.id);

                            return (
                              <button
                                key={les.id}
                                onClick={() => setActiveLessonId(les.id)}
                                className={`w-full p-2.5 rounded-xl transition-all text-right cursor-pointer flex items-center justify-between ${
                                  isSelectedLesson
                                    ? 'bg-[#e11d48] text-white font-bold shadow-sm'
                                    : 'hover:bg-rose-50 text-slate-700'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="text-xs font-semibold flex items-center gap-1.5">
                                    <span>{les.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px]">
                                    {lesVids.length > 0 ? (
                                      <span className={isSelectedLesson ? 'bg-white/20 text-white font-bold px-1.5 py-0.5 rounded' : 'bg-rose-100 text-[#e11d48] font-bold px-1.5 py-0.5 rounded'}>
                                        🎬 {lesVids.length} فيديو
                                      </span>
                                    ) : (
                                      <span className={isSelectedLesson ? 'text-rose-100' : 'text-slate-400'}>لا يوجد فيديو</span>
                                    )}
                                    {lesPdfs.length > 0 && (
                                      <span className={isSelectedLesson ? 'bg-white/20 text-white font-bold px-1.5 py-0.5 rounded' : 'bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded'}>
                                        📕 {lesPdfs.length} كتب
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {isSelectedLesson && (
                                  <span className="text-[10px] bg-white text-[#e11d48] font-bold px-2 py-0.5 rounded-md shadow-xs shrink-0">
                                    يعرض الآن
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* LEFT / MAIN WORKSPACE: INTEGRATED VIDEO & RESOURCE WORKBENCH (65%) */}
        <div className="lg:col-span-8 space-y-4 lg:order-1">
          {activeLesson ? (
            <div className="notebook-card rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              
              {/* LESSON TITLE & TAB NAVIGATION WORKBENCH BAR */}
              <div className="p-5 border-b border-slate-200 bg-white space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#e11d48] font-bold">
                      <span>{currentSubject?.name}</span>
                      <span>/</span>
                      <span>{activeUnit?.title}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-alexandria">
                      {activeLesson.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBookmark(activeLesson.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isBookmarked
                          ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
                      <span className="hidden sm:inline">{isBookmarked ? 'محفوظ بالمفضلة' : 'حفظ بالمفضلة'}</span>
                    </button>

                    <button
                      onClick={() => onToggleComplete(activeLesson.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isCompleted ? 'تم الاستكمال' : 'تحديد كمكتمل'}</span>
                    </button>
                  </div>
                </div>

                {/* CONTENT RESOURCE TYPE TABS */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`btn-glossy-4k text-xs py-1.5 px-3 whitespace-nowrap cursor-pointer ${
                      activeTab === 'videos'
                        ? 'btn-glossy-amber'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      🎬
                    </div>
                    <span>شروحات السبورة ({lessonVideos.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('school_books')}
                    className={`btn-glossy-4k text-xs py-1.5 px-3 whitespace-nowrap cursor-pointer ${
                      activeTab === 'school_books'
                        ? 'btn-glossy-magenta'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${activeTab === 'school_books' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'}`}>
                      📕
                    </div>
                    <span>كتب ومذكرات PDF ({lessonPdfs.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`btn-glossy-4k text-xs py-1.5 px-3 whitespace-nowrap cursor-pointer ${
                      activeTab === 'notes'
                        ? 'btn-glossy-teal'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${activeTab === 'notes' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'}`}>
                      🧠
                    </div>
                    <span>ملخص السبورة</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`btn-glossy-4k text-xs py-1.5 px-3 whitespace-nowrap cursor-pointer ${
                      activeTab === 'quiz'
                        ? 'btn-glossy-purple'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${activeTab === 'quiz' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>
                      📝
                    </div>
                    <span>اختبار تفاعلي ({lessonQuizzes.length})</span>
                  </button>
                </div>
              </div>

              {/* TAB CONTENT WORKSPACE SCREEN */}
              <div className="p-5">
                
                {/* TAB 1: VIDEOS PLAYER WORKBENCH */}
                {activeTab === 'videos' && (
                  <div className="space-y-5">
                    {lessonVideos.length === 0 ? (
                      <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <Video className="w-10 h-10 text-rose-500 mx-auto opacity-80" />
                        <h3 className="font-bold text-sm text-slate-800">لا توجد فيديوهات شارحة لمحتوى هذا الدرس حتى الآن</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          يمكنك إضافة فيديوهات يوتيوب أو مقاطع تعليمية لهذا الدرس من خلال لوحة التحكم بالإدارة.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* YOUTUBE EMBED PLAYER */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-lg">
                          {activeVideo?.youtubeVideoId?.startsWith('http') && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(activeVideo.youtubeVideoId) ? (
                            <video src={activeVideo.youtubeVideoId} controls className="w-full h-full" />
                          ) : (
                            <iframe
                              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=0&rel=0&modestbranding=1`}
                              title={activeVideo?.title || activeLesson.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          )}
                        </div>

                        {/* Direct Youtube Watch Banner */}
                        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-slate-600">
                            💡 إن ظهر "Video unavailable" من يوتيوب، يمكنك مشاهدته على الموقع الرسمي مباشرة:
                          </span>
                          <a
                            href={selectedVideoId?.startsWith('http') ? selectedVideoId : `https://www.youtube.com/watch?v=${selectedVideoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#e11d48] hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>فتح على YouTube</span>
                          </a>
                        </div>
                      </>
                    )}

                    {/* VIDEO INFORMATION & TEACHER BADGE */}
                    {activeVideo && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm text-slate-800 font-alexandria">
                            {activeVideo.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#e11d48]" />
                              <span>المدة: {activeVideo.duration}</span>
                            </span>
                            <span className="text-[#e11d48] font-bold">{activeVideo.levelTag}</span>
                          </div>
                        </div>

                        {activeTeacher && (
                          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shrink-0 shadow-xs">
                            <img
                              src={activeTeacher.avatarUrl}
                              alt={activeTeacher.name}
                              className="w-9 h-9 rounded-full object-cover border border-rose-300"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-800">{activeTeacher.name}</div>
                              <div className="text-[10px] text-slate-500">{activeTeacher.title}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* OTHER AVAILABLE VIDEOS FOR THIS LESSON */}
                    {lessonVideos.length > 1 && (
                      <div className="space-y-2.5 pt-2">
                        <div className="text-xs font-bold text-slate-600">
                          فيديوهات شرح إضافية لهذا الدرس ({lessonVideos.length}):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {lessonVideos.map(vid => {
                            const isSelectedVid = vid.youtubeVideoId === selectedVideoId;
                            return (
                              <button
                                key={vid.id}
                                onClick={() => setSelectedVideoId(vid.youtubeVideoId)}
                                className={`p-3.5 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer ${
                                  isSelectedVid
                                    ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-800 hover:bg-rose-50'
                                }`}
                              >
                                <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#e11d48] flex items-center justify-center shrink-0 font-bold border border-slate-200">
                                  <Play className="w-4 h-4 fill-[#e11d48] ml-0.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold line-clamp-1">{vid.title}</div>
                                  <div className="text-[10px] opacity-80">{vid.duration}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* TAB 2: BOOKS & NOTES PDF */}
                {activeTab === 'school_books' && (
                  <div className="space-y-4">
                    {lessonPdfs.length > 0 && activePdf ? (
                      <div className="space-y-4">
                        {/* Multiple PDF Selector Buttons if lesson has > 1 PDF */}
                        {lessonPdfs.length > 1 && (
                          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                            <span className="text-xs text-slate-600 px-2 font-bold">اختر المستند:</span>
                            {lessonPdfs.map(pdf => (
                              <button
                                key={pdf.id}
                                onClick={() => setSelectedPdfId(pdf.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  (activePdf?.id === pdf.id)
                                    ? 'bg-[#e11d48] text-white shadow-sm'
                                    : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
                                }`}
                              >
                                {pdf.title}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Embedded PDF Viewer Box */}
                        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-3 sm:p-5 shadow-xl space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200 pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                {activePdf.typeNameAr || 'كتاب الوزارة'}
                              </span>
                              <span className="font-bold text-sm text-slate-100">{activePdf.title}</span>
                              {activePdf.fileSize && (
                                <span className="text-slate-400 font-mono">({activePdf.fileSize})</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handlePdfDownload(activePdf.fileUrl, activePdf.title)}
                                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                              >
                                <Download className="w-4 h-4" />
                                <span>تحميل الكتاب PDF</span>
                              </button>
                              <a
                                href={activePdf.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>فتح بتبويب مستقل</span>
                              </a>
                            </div>
                          </div>

                          {/* Direct Inline PDF Viewer Iframe */}
                          <div className="w-full h-[650px] sm:h-[750px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                            <iframe
                              src={getPdfEmbedUrl(activePdf.fileUrl)}
                              title={activePdf.title}
                              className="w-full h-full border-0"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                        <BookOpen className="w-8 h-8 text-[#e11d48] mx-auto" />
                        <p className="text-xs text-slate-500">
                          جاري تحديث ملفات كتب الوزارة والمذكرات الرسمية لهذا الدرس.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: WHITEBOARD NOTES & SUMMARY */}
                {activeTab === 'notes' && (
                  <div className="p-6 rounded-2xl sticky-note space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 text-[#854d0e] font-bold border-b border-[#fde047] pb-3">
                      <Sparkles className="w-4 h-4 text-[#e11d48]" />
                      <h3 className="text-base font-alexandria">ملخص وافٍ لسبورة الدرس 📝</h3>
                    </div>
                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-readex">
                      {activeLesson.summaryText || activeLesson.description}
                    </p>
                  </div>
                )}

                {/* TAB 4: INTERACTIVE QUIZ ENGINE */}
                {activeTab === 'quiz' && (
                  <div className="space-y-4">
                    {lessonQuizzes.length > 0 ? (
                      <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <h3 className="font-bold text-base text-slate-800 font-alexandria">
                            اختبر معلوماتك في {activeLesson.title}
                          </h3>
                          <span className="text-xs text-[#e11d48] font-bold font-mono">
                            {lessonQuizzes.length} أسئلة
                          </span>
                        </div>

                        <div className="space-y-5">
                          {lessonQuizzes.map((q, idx) => {
                            const selectedOption = userAnswers[q.id];
                            return (
                              <div key={q.id} className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="text-xs font-bold text-slate-800">
                                  س{idx + 1}: {q.questionText}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {q.options.map((opt, oIdx) => {
                                    const isSelected = selectedOption === oIdx;
                                    let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-rose-50";
                                    if (isSelected) btnStyle = "bg-[#e11d48] text-white font-bold border-[#e11d48] shadow-xs";
                                    if (quizSubmitted) {
                                      if (oIdx === q.correctAnswerIndex) btnStyle = "bg-emerald-600 text-white font-bold border-emerald-600";
                                      else if (isSelected && oIdx !== q.correctAnswerIndex) btnStyle = "bg-rose-600 text-white font-bold border-rose-600";
                                    }

                                    return (
                                      <button
                                        key={oIdx}
                                        onClick={() => handleAnswerSelect(q.id, oIdx)}
                                        className={`p-3 rounded-xl border text-xs text-right transition-all cursor-pointer ${btnStyle}`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {!quizSubmitted ? (
                          <button
                            onClick={handleQuizSubmit}
                            className="w-full py-3 rounded-xl btn-crimson text-xs transition-all cursor-pointer shadow-xs"
                          >
                            إنهاء واحتساب النتيجة 🏆
                          </button>
                        ) : (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-bold">
                            تم تسليم الاختبار وحفظ النتيجة في سجل المذاكرة 👍
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                        <HelpCircle className="w-8 h-8 text-[#e11d48] mx-auto" />
                        <p className="text-xs text-slate-500">
                          جاري إعداد الأسئلة التفاعلية الخاصة بهذا الدرس.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="p-12 notebook-card rounded-2xl text-center space-y-3">
              <GraduationCap className="w-12 h-12 text-[#e11d48] mx-auto" />
              <h3 className="font-bold text-lg text-slate-800 font-alexandria">اختر درساً للبدء</h3>
              <p className="text-xs text-slate-500">
                اختر المادة والدرس من القائمة الجانبية لتشغيل الشرح فوراً على نفس الصفحة.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
