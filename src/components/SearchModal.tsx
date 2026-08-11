import React, { useState } from 'react';
import { Lesson, Subject, VideoResource, PdfResource, Teacher } from '../types';
import { Search, X, Play, BookOpen, FileText, Users, ArrowLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  subjects: Subject[];
  videos: VideoResource[];
  pdfs: PdfResource[];
  teachers: Teacher[];
  onOpenLesson: (lessonId: string) => void;
  onOpenTeacherProfile: (teacherId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  lessons,
  subjects,
  videos,
  pdfs,
  teachers,
  onOpenLesson,
  onOpenTeacherProfile
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredLessons = query.trim()
    ? lessons.filter(l => l.title.includes(query) || l.description.includes(query))
    : [];

  const filteredVideos = query.trim()
    ? videos.filter(v => v.title.includes(query))
    : [];

  const filteredPdfs = query.trim()
    ? pdfs.filter(p => p.title.includes(query))
    : [];

  const filteredTeachers = query.trim()
    ? teachers.filter(t => t.name.includes(query) || t.title.includes(query))
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 px-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Bar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            placeholder="ابحث باسم الدرس، المادة، المعلم، أو كتاب الوزارة (مثال: حاصل الضرب الديكارتي)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-800/80 flex-1">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p>اكتب اسم الموضوع أو المادة أو المعلم للبحث الفوري في المنصة.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">جرّب: حاصل الضرب الديكارتي</span>
                <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">جرّب: عباد الرحمن</span>
                <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">جرّب: أحمد العشري</span>
              </div>
            </div>
          ) : (
            <>
              {/* Lessons Results */}
              {filteredLessons.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>الدروس والمواضيع ({filteredLessons.length}):</span>
                  </h4>
                  {filteredLessons.map(l => (
                    <div
                      key={l.id}
                      onClick={() => { onOpenLesson(l.id); onClose(); }}
                      className="p-3 bg-slate-950/80 hover:bg-slate-800 rounded-2xl border border-slate-800 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-100">{l.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{l.description}</div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* Videos Results */}
              {filteredVideos.length > 0 && (
                <div className="space-y-2 pt-3">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5" />
                    <span>فيديوهات الشرح ({filteredVideos.length}):</span>
                  </h4>
                  {filteredVideos.map(v => {
                    const l = lessons.find(les => les.id === v.lessonId);
                    return (
                      <div
                        key={v.id}
                        onClick={() => { if (l) onOpenLesson(l.id); onClose(); }}
                        className="p-3 bg-slate-950/80 hover:bg-slate-800 rounded-2xl border border-slate-800 cursor-pointer transition-colors flex items-center gap-3 text-xs"
                      >
                        <span className="bg-amber-500/10 text-amber-300 p-2 rounded-xl">🎬</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-100 truncate">{v.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">⏱ {v.duration} • {v.levelTag}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Teachers Results */}
              {filteredTeachers.length > 0 && (
                <div className="space-y-2 pt-3">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>المعلمون ({filteredTeachers.length}):</span>
                  </h4>
                  {filteredTeachers.map(t => (
                    <div
                      key={t.id}
                      onClick={() => { onOpenTeacherProfile(t.id); onClose(); }}
                      className="p-3 bg-slate-950/80 hover:bg-slate-800 rounded-2xl border border-slate-800 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img src={t.avatarUrl} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-100">{t.name}</div>
                          <div className="text-[11px] text-slate-400">{t.title}</div>
                        </div>
                      </div>
                      <span className="text-amber-400 font-bold">عرض ←</span>
                    </div>
                  ))}
                </div>
              )}

              {filteredLessons.length === 0 && filteredVideos.length === 0 && filteredTeachers.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  لم نجد نتائج مطابقة لـ "{query}". تأكد من صحة الكلمات.
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
