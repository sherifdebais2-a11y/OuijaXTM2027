import React from 'react';
import { Lesson, UserProgress, Subject, Grade, EducationalStage } from '../types';
import { Bookmark, CheckCircle2, Award, Clock, ArrowRight, Trash2 } from 'lucide-react';

interface BookmarksAndHistoryProps {
  lessons: Lesson[];
  subjects: Subject[];
  grades: Grade[];
  stages: EducationalStage[];
  userProgress: UserProgress;
  onOpenLesson: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
}

export const BookmarksAndHistory: React.FC<BookmarksAndHistoryProps> = ({
  lessons,
  subjects,
  grades,
  stages,
  userProgress,
  onOpenLesson,
  onToggleBookmark
}) => {
  const bookmarkedLessons = lessons.filter(l => userProgress.bookmarkedLessonIds.includes(l.id));
  const completedLessons = lessons.filter(l => userProgress.completedLessonIds.includes(l.id));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="border-b border-rose-100 pb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-alexandria flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#e11d48] rounded-full"></span>
            <span>دروسي المفضلة وسجل المذاكرة 🌟</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            متابعة استكمال المناهج والدروس المحفوظة لسهولة الرجوع إليها قبل الامتحانات.
          </p>
        </div>

        {/* Bookmarked Lessons Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-alexandria">
            <Bookmark className="w-4 h-4 text-[#e11d48]" />
            <span>الدروس المحفوظة بالمفضلة ({bookmarkedLessons.length}):</span>
          </h2>

          {bookmarkedLessons.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">لم تقم بإضافة أي دروس للمفضلة بعد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {bookmarkedLessons.map(lesson => (
                <div key={lesson.id} className="p-4 notebook-card border border-slate-200 rounded-2xl space-y-2.5 hover:border-[#e11d48] transition-all shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#e11d48] bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      درس مخصص
                    </span>
                    <button
                      onClick={() => onToggleBookmark(lesson.id)}
                      className="text-slate-400 hover:text-[#e11d48] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 font-alexandria">{lesson.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 font-readex">{lesson.description}</p>

                  <button
                    onClick={() => onOpenLesson(lesson.id)}
                    className="w-full py-2 rounded-xl btn-crimson text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    فتح الدرس واستكمال المذاكرة
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Lessons & Test Scores Section */}
        <div className="space-y-4 pt-4 border-t border-rose-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-alexandria">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>سجل الاختبارات المكتملة وشواهد الإنجاز:</span>
          </h2>

          {Object.keys(userProgress.quizScores).length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              لم تقم بإجراء أي اختبارات تفاعلية بعد. انقر على أي درس لإجراء الاختبار التفاعلي.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(userProgress.quizScores).map(([lessonId, resVal]) => {
                const res = resVal as { score: number; total: number; date: string };
                const lesson = lessons.find(l => l.id === lessonId);
                const percent = Math.round((res.score / res.total) * 100);

                return (
                  <div key={lessonId} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">{res.date}</span>
                      <span className={`px-2.5 py-0.5 rounded-full ${percent >= 80 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        النتيجة: {percent}%
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-800 font-alexandria">{lesson?.title || 'درس مخصص'}</h3>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-mono pt-2 border-t border-slate-100">
                      <span>الدرجات: {res.score} / {res.total}</span>
                      {lesson && (
                        <button
                          onClick={() => onOpenLesson(lesson.id)}
                          className="text-[#e11d48] font-bold hover:underline cursor-pointer"
                        >
                          مراجعة الإجابات ←
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
