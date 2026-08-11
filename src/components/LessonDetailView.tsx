import React, { useState } from 'react';
import {
  Lesson,
  Unit,
  Subject,
  Grade,
  EducationalStage,
  VideoResource,
  PdfResource,
  InfographicResource,
  QuizQuestion,
  Teacher,
  UserProgress,
  ContentTabType
} from '../types';
import {
  formatYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  getPdfEmbedUrl,
  handlePdfDownload
} from '../lib/pdfAndVideoUtils';
import {
  ArrowRight,
  Tv,
  BookOpen,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Users,
  Bookmark,
  CheckCircle2,
  Download,
  Share2,
  Clock,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Award,
  Eye,
  Check,
  X,
  Printer
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: Lesson;
  unit?: Unit;
  subject?: Subject;
  grade?: Grade;
  stage?: EducationalStage;
  videos: VideoResource[];
  pdfs: PdfResource[];
  infographics: InfographicResource[];
  quizzes: QuizQuestion[];
  teachers: Teacher[];
  userProgress: UserProgress;
  onToggleBookmark: (lessonId: string) => void;
  onToggleComplete: (lessonId: string) => void;
  onSaveQuizResult: (lessonId: string, score: number, total: number) => void;
  onBack: () => void;
  onOpenTeacherProfile: (teacherId: string) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  unit,
  subject,
  grade,
  stage,
  videos,
  pdfs,
  infographics,
  quizzes,
  teachers,
  userProgress,
  onToggleBookmark,
  onToggleComplete,
  onSaveQuizResult,
  onBack,
  onOpenTeacherProfile
}) => {
  const [activeTab, setActiveTab] = useState<ContentTabType>('videos');
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    videos[0]?.youtubeVideoId || 'fA-Wb_0494U'
  );

  // Active PDF selections for embedded page view
  const schoolBookPdfs = pdfs.filter(p => p.type === 'school_book');
  const notePdfs = pdfs.filter(p => p.type !== 'school_book');

  const [selectedSchoolBookId, setSelectedSchoolBookId] = useState<string>('');
  const [selectedNotePdfId, setSelectedNotePdfId] = useState<string>('');

  const activeSchoolBook = schoolBookPdfs.find(p => p.id === selectedSchoolBookId) || schoolBookPdfs[0];
  const activeNotePdf = notePdfs.find(p => p.id === selectedNotePdfId) || notePdfs[0];

  // PDF Preview Modal State
  const [previewPdf, setPreviewPdf] = useState<PdfResource | null>(null);

  // Infographic Zoom Modal
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Quiz Engine State
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const isBookmarked = userProgress.bookmarkedLessonIds.includes(lesson.id);
  const isCompleted = userProgress.completedLessonIds.includes(lesson.id);

  const activeVideo = videos.find(v => v.youtubeVideoId === selectedVideoId) || videos[0];
  const activeTeacher = activeVideo ? teachers.find(t => t.id === activeVideo.teacherId) : null;

  // Handle Quiz Submission
  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    if (quizzes.length === 0) return;
    let score = 0;
    quizzes.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    setQuizSubmitted(true);
    onSaveQuizResult(lesson.id, score, quizzes.length);
  };

  const handleQuizReset = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20">
      
      {/* Top Navigation & Breadcrumb Trail */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-amber-400 transition-colors font-bold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للدروس</span>
          </button>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span>الرئيسية</span>
            <span>/</span>
            <span>{stage?.name || 'المرحلة'}</span>
            <span>/</span>
            <span>{grade?.name || 'الصف'}</span>
            <span>/</span>
            <span className="text-amber-400 font-bold">{subject?.name || 'المادة'}</span>
            <span>/</span>
            <span className="text-slate-200">{lesson.title}</span>
          </div>
        </div>
      </div>

      {/* Lesson Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
                  {subject?.name || 'المادة'}
                </span>
                {unit && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                    {unit.title}
                  </span>
                )}
                {lesson.durationMinutes && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lesson.durationMinutes} دقيقة</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {lesson.title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {lesson.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onToggleBookmark(lesson.id)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isBookmarked ? 'في المفضلة' : 'حفظ بالمفضلة'}</span>
              </button>

              <button
                onClick={() => onToggleComplete(lesson.id)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isCompleted ? 'تم المذاكرة' : 'تعليم كمكتمل'}</span>
              </button>
            </div>
          </div>

          {/* Key Summary Cards */}
          {lesson.summaryText && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-300">ملخص الفكرة الأساسية للدرس: </span>
                <span>{lesson.summaryText}</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Tabs Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>🎬 فيديوهات الشرح ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('school_books')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'school_books'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📕 كتب المدرسة المعتمدة ({pdfs.filter(p => p.type === 'school_book').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📄 المذكرات والملخصات ({pdfs.filter(p => p.type !== 'school_book').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('infographics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'infographics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>🧠 الإنفوجرافات ({infographics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>🧪 امتحان الدرس ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'teachers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👨‍🏫 المعلمون المقترحون</span>
          </button>
        </div>

        {/* TAB 1: VIDEOS PLAYER & PLAYLIST */}
        {activeTab === 'videos' && (
          <div className="mt-6">
            {videos.length === 0 ? (
              <div className="p-8 sm:p-12 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-4 max-w-xl mx-auto my-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
                  <Tv className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-100 font-alexandria">لا توجد شروحات مرئية مضافة لهذا الدرس بعد</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  يمكنك إضافة رابط فيديو من YouTube أو أي شروحات مرئية لهذا الدرس بسهولة عبر لوحة إدارة المحتوى بالمنصة.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Embedded YouTube Player */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="relative aspect-video bg-black">
                      {activeVideo?.youtubeVideoId?.startsWith('http') && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(activeVideo.youtubeVideoId) ? (
                        <video src={activeVideo.youtubeVideoId} controls className="w-full h-full" />
                      ) : (
                        <iframe
                          src={formatYouTubeEmbedUrl(selectedVideoId)}
                          title={activeVideo?.title || lesson.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      )}
                    </div>

                    {/* Direct External Watch Link & Banner */}
                    <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span>💡 يمكنك أيضاً مشاهدة الدرس مباشرة بملء الشاشة على يوتيوب:</span>
                      </span>
                      <a
                        href={getYouTubeWatchUrl(selectedVideoId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-3.5 py-1.5 rounded-xl border border-slate-700 transition-all shadow-md"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>مشاهدة الدرس مباشرة على YouTube</span>
                      </a>
                    </div>

                {/* Video Meta Box */}
                {activeVideo && (
                  <div className="p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-amber-400 font-semibold">
                      <span className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                        {activeVideo.levelTag}
                      </span>
                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>{activeVideo.viewsCount?.toLocaleString()} مشاهدة</span>
                        </span>
                        <span>⏱ {activeVideo.duration}</span>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-100">
                      {activeVideo.title}
                    </h2>

                    {/* Teacher Info Strip */}
                    {activeTeacher && (
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={activeTeacher.avatarUrl}
                            alt={activeTeacher.name}
                            className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                              <span>{activeTeacher.name}</span>
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                                معلم موثوق ★ {activeTeacher.rating}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{activeTeacher.title}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenTeacherProfile(activeTeacher.id)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
                        >
                          عرض القناة
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Key Takeaways Section */}
              {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>أهم النقاط التي يجب أن تفهمها في هذا الدرس:</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {lesson.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Video Options List / Alternative Explanations */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                <Tv className="w-4 h-4 text-amber-400" />
                <span>اختر معلمك أو نوع الشرح:</span>
              </h3>

              {videos.length === 0 ? (
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                  لا توجد فيديوهات مسجلة لهذا الدرس حالياً. يمكنك إضافة فيديو جديد عبر لوحة التحكم.
                </div>
              ) : (
                <div className="space-y-3">
                  {videos.map((vid) => {
                    const isSelected = vid.youtubeVideoId === selectedVideoId;
                    const teacher = teachers.find(t => t.id === vid.teacherId);

                    return (
                      <div
                        key={vid.id}
                        onClick={() => setSelectedVideoId(vid.youtubeVideoId)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="relative w-24 aspect-video rounded-xl overflow-hidden bg-slate-950 shrink-0">
                          <img
                            src={`https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=250');
                            }}
                          />
                          <span className="absolute bottom-1 left-1 bg-slate-950/90 text-[9px] text-slate-200 px-1 rounded font-mono">
                            {vid.duration}
                          </span>
                        </div>

                        <div className="space-y-1 text-right flex-1 min-w-0">
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
                            {vid.levelTag}
                          </span>
                          <h4 className="font-bold text-xs text-slate-100 line-clamp-2">
                            {vid.title}
                          </h4>
                          {teacher && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>👨‍🏫 {teacher.name}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )}

        {/* TAB 2: SCHOOL BOOKS */}
        {activeTab === 'school_books' && (
          <div className="mt-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>عرض واستعراض كتب وزارة التربية والتعليم الرسمية</span>
              </span>
              {schoolBookPdfs.length > 0 && activeSchoolBook && (
                <button
                  onClick={() => handlePdfDownload(activeSchoolBook.fileUrl, activeSchoolBook.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل هذا الكتاب</span>
                </button>
              )}
            </h3>

            {schoolBookPdfs.length === 0 ? (
              <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-2">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">لا يوجد كتاب مدرسة متاح حالياً لهذا الدرس.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Book Switcher Tabs if multiple */}
                {schoolBookPdfs.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 px-2 font-bold">اختر الكتاب:</span>
                    {schoolBookPdfs.map(bk => (
                      <button
                        key={bk.id}
                        onClick={() => setSelectedSchoolBookId(bk.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          (activeSchoolBook?.id === bk.id)
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {bk.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Inline PDF Embed View */}
                {activeSchoolBook && (
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 p-3 sm:p-5 space-y-3 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                          {activeSchoolBook.typeNameAr}
                        </span>
                        <span className="font-bold text-sm text-slate-100">{activeSchoolBook.title}</span>
                        {activeSchoolBook.fileSize && (
                          <span className="text-slate-400 font-mono">({activeSchoolBook.fileSize})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={activeSchoolBook.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>فتح بتبويب مستقل</span>
                        </a>
                      </div>
                    </div>

                    <div className="w-full h-[650px] sm:h-[750px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                      <iframe
                        src={getPdfEmbedUrl(activeSchoolBook.fileUrl)}
                        title={activeSchoolBook.title}
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NOTES & SUMMARIES */}
        {activeTab === 'notes' && (
          <div className="mt-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>عرض واستعراض مذكرات الشرح والملخصات</span>
              </span>
              {notePdfs.length > 0 && activeNotePdf && (
                <button
                  onClick={() => handlePdfDownload(activeNotePdf.fileUrl, activeNotePdf.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل المذكرة</span>
                </button>
              )}
            </h3>

            {notePdfs.length === 0 ? (
              <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center text-xs text-slate-400">
                لا توجد مذكرات PDF مرفوعة حالياً بهذا الدرس.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Note Switcher Tabs if multiple */}
                {notePdfs.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 px-2 font-bold">اختر المذكرة:</span>
                    {notePdfs.map(nt => (
                      <button
                        key={nt.id}
                        onClick={() => setSelectedNotePdfId(nt.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          (activeNotePdf?.id === nt.id)
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {nt.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Inline PDF Embed View */}
                {activeNotePdf && (
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 p-3 sm:p-5 space-y-3 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                          {activeNotePdf.typeNameAr}
                        </span>
                        <span className="font-bold text-sm text-slate-100">{activeNotePdf.title}</span>
                        {activeNotePdf.fileSize && (
                          <span className="text-slate-400 font-mono">({activeNotePdf.fileSize})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={activeNotePdf.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>فتح بتبويب مستقل</span>
                        </a>
                      </div>
                    </div>

                    <div className="w-full h-[650px] sm:h-[750px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                      <iframe
                        src={getPdfEmbedUrl(activeNotePdf.fileUrl)}
                        title={activeNotePdf.title}
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INFOGRAPHICS GALLERY */}
        {activeTab === 'infographics' && (
          <div className="mt-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-400" />
              <span>الإنفوجرافات والتطبيقات التوضيحية المصورة</span>
            </h3>

            {infographics.length === 0 ? (
              <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center text-xs text-slate-400">
                لا توجد إنفوجرافات مسجلة لهذا الدرس بعد.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {infographics.map(info => (
                  <div
                    key={info.id}
                    onClick={() => setZoomedImage(info.imageUrl)}
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer group shadow-xl"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-950">
                      <img
                        src={info.imageUrl}
                        alt={info.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 font-bold">
                          🔍 تكبير الصورة
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-300">
                        {info.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {info.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INTERACTIVE QUIZ ENGINE */}
        {activeTab === 'quiz' && (
          <div className="mt-6 max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-400" />
                    <span>اختبار قياس الفهم التفاعلي</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    أجب على الأسئلة التالية لاختبار مدى استيعابك لهذا الدرس
                  </p>
                </div>

                {quizSubmitted && (
                  <button
                    onClick={handleQuizReset}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة الاختبار</span>
                  </button>
                )}
              </div>

              {quizzes.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  لا توجد أسئلة مسجلة لهذا الدرس حالياً. يمكنك إضافة أسئلة من لوحة التحكم.
                </div>
              ) : (
                <div className="space-y-6 pt-2">
                  {quizzes.map((q, idx) => {
                    const selectedOpt = userAnswers[q.id];
                    const isCorrect = selectedOpt === q.correctAnswerIndex;

                    return (
                      <div key={q.id} className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                        <div className="font-bold text-sm text-slate-100 flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <span>{q.questionText}</span>
                        </div>

                        <div className="space-y-2 pt-1">
                          {q.options.map((opt, oIdx) => {
                            let buttonStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800";
                            
                            if (selectedOpt === oIdx) {
                              buttonStyle = "bg-amber-500/20 border-amber-500 text-amber-300 font-bold";
                            }

                            if (quizSubmitted) {
                              if (oIdx === q.correctAnswerIndex) {
                                buttonStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                              } else if (selectedOpt === oIdx && !isCorrect) {
                                buttonStyle = "bg-rose-500/20 border-rose-500 text-rose-300 font-bold";
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleAnswerSelect(q.id, oIdx)}
                                className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${buttonStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && oIdx === q.correctAnswerIndex && (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                )}
                                {quizSubmitted && selectedOpt === oIdx && !isCorrect && (
                                  <X className="w-4 h-4 text-rose-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Text */}
                        {quizSubmitted && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                            <div className="font-bold text-amber-400">💡 الشرح والإجابة النموذجية:</div>
                            <p>{q.explanationText}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(userAnswers).length === 0}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      تسليم الإجابات وعرض النتيجة
                    </button>
                  ) : (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-1">
                      <Award className="w-8 h-8 text-amber-400 mx-auto" />
                      <div className="font-bold text-sm text-amber-300">تم تسجيل نتيجتك بنجاح!</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: TEACHERS DIRECTORY FOR THIS SUBJECT */}
        {activeTab === 'teachers' && (
          <div className="mt-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>نخبة من معلمي المادة المعتمدين</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachers.map(teacher => (
                <div key={teacher.id} className="p-5 bg-slate-900 rounded-3xl border border-slate-800 flex items-start gap-4">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shrink-0"
                  />
                  <div className="space-y-1.5 flex-1">
                    <h4 className="font-bold text-base text-slate-100">{teacher.name}</h4>
                    <p className="text-xs text-amber-400 font-medium">{teacher.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{teacher.bio}</p>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">التقييم: ★ {teacher.rating}</span>
                      <button
                        onClick={() => onOpenTeacherProfile(teacher.id)}
                        className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>تصفح كل فيديوهاته</span>
                        <span>←</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* PDF Viewer / Preview Modal */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn dir-rtl">
          <div className="bg-slate-900 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-100 font-alexandria">
                    {previewPdf.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {previewPdf.typeNameAr} • {previewPdf.fileSize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePdfDownload(previewPdf.fileUrl, previewPdf.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الملف</span>
                </button>
                <a
                  href={previewPdf.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">فتح بتبويب جديد</span>
                </a>
                <button
                  onClick={() => setPreviewPdf(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Embedded PDF Viewer */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden">
              <iframe
                src={getPdfEmbedUrl(previewPdf.fileUrl)}
                title={previewPdf.title}
                className="w-full h-full border-0"
              />
            </div>
            
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img src={zoomedImage} alt="Infographic Zoom" className="w-full h-auto rounded-2xl border border-slate-700" />
            <p className="text-center text-xs text-slate-400 mt-2">انقر في أي مكان للإغلاق</p>
          </div>
        </div>
      )}

    </div>
  );
};
