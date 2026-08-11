import React, { useState } from 'react';
import { Unit, Lesson, VideoResource, PdfResource, InfographicResource, QuizQuestion, UserProgress } from '../types';
import {
  Folder,
  Play,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

interface UnitLessonAccordionProps {
  units: Unit[];
  lessons: Lesson[];
  videos: VideoResource[];
  pdfs: PdfResource[];
  infographics: InfographicResource[];
  quizzes: QuizQuestion[];
  userProgress: UserProgress;
  onOpenLesson: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  subjectName: string;
}

export const UnitLessonAccordion: React.FC<UnitLessonAccordionProps> = ({
  units,
  lessons,
  videos,
  pdfs,
  infographics,
  quizzes,
  userProgress,
  onOpenLesson,
  onToggleBookmark,
  subjectName
}) => {
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>(
    units.map(u => u.id) // Default all expanded
  );

  const toggleUnit = (unitId: string) => {
    setExpandedUnitIds(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  if (units.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 text-center space-y-3">
        <Folder className="w-12 h-12 text-slate-600 mx-auto" />
        <h4 className="font-bold text-slate-300">لا توجد وحدات بعد لمادة {subjectName}</h4>
        <p className="text-xs text-slate-400">
          يمكن للمسؤولين إضافة وحدات ودروس لهذه المادة عبر لوحة التحكم.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
          <span>الوحدات والدروس الدراسية</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-bold">
            {subjectName}
          </span>
        </h3>

        <div className="text-xs text-slate-400">
          إجمالي الوحدات: <span className="font-bold text-indigo-400">{units.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {units.map((unit) => {
          const unitLessons = lessons.filter(l => l.unitId === unit.id);
          const isExpanded = expandedUnitIds.includes(unit.id);

          return (
            <div
              key={unit.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              {/* Unit Header */}
              <div
                onClick={() => toggleUnit(unit.id)}
                className="p-3.5 sm:p-4 bg-slate-900 hover:bg-slate-800/80 transition-colors cursor-pointer flex items-center justify-between border-b border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-extrabold text-xs">
                    {unit.orderNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">
                      {unit.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {unitLessons.length} دروس تعليمية
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden sm:inline-block">
                    {isExpanded ? 'طي' : 'عرض'}
                  </span>
                  <div className={`p-1 rounded-lg bg-slate-800 text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Lessons List inside Unit */}
              {isExpanded && (
                <div className="p-3 sm:p-4 divide-y divide-slate-800/60">
                  {unitLessons.length === 0 ? (
                    <div className="text-xs text-slate-400 p-4 text-center">
                      لا توجد دروس حالياً في هذه الوحدة.
                    </div>
                  ) : (
                    unitLessons.map((lesson) => {
                      const lessonVideos = videos.filter(v => v.lessonId === lesson.id);
                      const lessonPdfs = pdfs.filter(p => p.lessonId === lesson.id);
                      const lessonInfos = infographics.filter(i => i.lessonId === lesson.id);
                      const lessonQuizzes = quizzes.filter(q => q.lessonId === lesson.id);

                      const isBookmarked = userProgress.bookmarkedLessonIds.includes(lesson.id);
                      const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
                      const quizScore = userProgress.quizScores[lesson.id];

                      return (
                        <div
                          key={lesson.id}
                          className="py-3 px-2 sm:px-4 rounded-2xl hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                        >
                          {/* Lesson Info */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  مكتمل
                                </span>
                              )}

                              {quizScore && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md font-bold">
                                  <Award className="w-3 h-3" />
                                  الاختبار: {quizScore.score}/{quizScore.total}
                                </span>
                              )}

                              <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                                {lesson.title}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {lesson.description}
                            </p>

                            {/* Resource Indicators */}
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                              {lesson.durationMinutes && (
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>{lesson.durationMinutes} دقيقة</span>
                                </span>
                              )}

                              <span className="flex items-center gap-1 text-slate-300 font-medium">
                                <Play className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{lessonVideos.length} فيديو</span>
                              </span>

                              <span className="flex items-center gap-1 text-slate-300 font-medium">
                                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{lessonPdfs.length} ملفات PDF</span>
                              </span>

                              {lessonInfos.length > 0 && (
                                <span className="flex items-center gap-1 text-slate-300 font-medium">
                                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                                  <span>{lessonInfos.length} إنفوجراف</span>
                                </span>
                              )}

                              {lessonQuizzes.length > 0 && (
                                <span className="flex items-center gap-1 text-purple-300 font-medium">
                                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                                  <span>{lessonQuizzes.length} أسئلة اختبار</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => onToggleBookmark(lesson.id)}
                              title={isBookmarked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                              className={`p-2 rounded-xl border transition-all ${
                                isBookmarked
                                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-rose-400' : ''}`} />
                            </button>

                            <button
                              onClick={() => onOpenLesson(lesson.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-indigo-600/20 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>دخول الدرس</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
