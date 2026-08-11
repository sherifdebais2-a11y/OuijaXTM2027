import React, { useState } from 'react';
import { Teacher, VideoResource, Lesson } from '../types';
import {
  Users,
  Search,
  Star,
  Tv,
  CheckCircle2,
  ExternalLink,
  Play,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface TeacherDirectoryProps {
  teachers: Teacher[];
  videos: VideoResource[];
  lessons: Lesson[];
  onOpenLesson: (lessonId: string) => void;
  selectedTeacherId?: string | null;
}

export const TeacherDirectory: React.FC<TeacherDirectoryProps> = ({
  teachers,
  videos,
  lessons,
  onOpenLesson,
  selectedTeacherId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(
    selectedTeacherId || (teachers[0]?.id || null)
  );

  const filteredTeachers = teachers.filter(t =>
    t.name.includes(searchQuery) ||
    t.specialization.includes(searchQuery) ||
    t.bio.includes(searchQuery)
  );

  const activeTeacher = teachers.find(t => t.id === activeTeacherId) || teachers[0];
  const teacherVideos = activeTeacher ? videos.filter(v => v.teacherId === activeTeacher.id) : [];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-alexandria flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#e11d48] rounded-full"></span>
              <span>دليل معلمين منصة تعلّم 👨‍🏫</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              أفضل معلمي وصناع محتوى المواد الدراسية في مصر مع روابط القنوات الرسمية وفيديوهات الشرح.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="ابحث باسم المعلم أو المادة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#e11d48]"
            />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Teachers Cards Column */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-600">
              قائمة المعلمين المعتمدين ({filteredTeachers.length}):
            </h2>

            <div className="space-y-2.5">
              {filteredTeachers.map(t => {
                const isSelected = t.id === activeTeacherId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTeacherId(t.id)}
                    className={`p-3.5 cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'metal-border ring-2 ring-rose-500/50 shadow-md bg-white'
                        : 'metal-border opacity-90 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                  >
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-rose-400 shrink-0 shadow-xs"
                    />

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-800 font-alexandria flex items-center gap-1">
                          <span>{t.name}</span>
                          {t.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                          )}
                        </h3>
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                          ★ {t.rating}
                        </span>
                      </div>

                      <p className="text-[11px] text-rose-600 font-medium line-clamp-1">{t.title}</p>

                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {t.subjectNames.map((s, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Profile & Video Catalog Column */}
          <div className="lg:col-span-7 space-y-6">
            {activeTeacher ? (
              <div className="notebook-card p-6 space-y-6 shadow-xs border border-slate-200">
                
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeTeacher.avatarUrl}
                      alt={activeTeacher.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#e11d48] shadow-xs"
                    />
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-slate-800 font-alexandria flex items-center gap-2">
                        <span>{activeTeacher.name}</span>
                        <span className="text-xs bg-rose-100 text-[#e11d48] border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                          معلم موثوق
                        </span>
                      </h2>
                      <p className="text-xs text-[#e11d48] font-semibold">{activeTeacher.title}</p>
                      <p className="text-xs text-slate-600 max-w-lg leading-relaxed pt-1 font-readex">
                        {activeTeacher.bio}
                      </p>
                    </div>
                  </div>

                  {activeTeacher.youtubeChannelUrl && (
                    <a
                      href={activeTeacher.youtubeChannelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl btn-crimson text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                    >
                      <Tv className="w-4 h-4" />
                      <span>قناة YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Videos Catalog */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 font-alexandria">
                    <Play className="w-4 h-4 text-[#e11d48]" />
                    <span>فيديوهات الشرح المتاحة للأستاذ ({teacherVideos.length}):</span>
                  </h3>

                  {teacherVideos.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                      لا توجد فيديوهات مرتبطة لهذا المعلم حالياً.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {teacherVideos.map(vid => {
                        const lesson = lessons.find(l => l.id === vid.lessonId);
                        return (
                          <div
                            key={vid.id}
                            onClick={() => lesson && onOpenLesson(lesson.id)}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#e11d48] transition-all cursor-pointer group shadow-xs"
                          >
                            <div className="relative aspect-video overflow-hidden bg-slate-900">
                              <img
                                src={`https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <span className="absolute bottom-2 left-2 bg-slate-900/90 text-xs text-slate-200 px-2 py-0.5 rounded font-mono">
                                {vid.duration}
                              </span>
                            </div>

                            <div className="p-3 space-y-1">
                              <span className="text-[10px] text-[#e11d48] bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-100">
                                {vid.levelTag}
                              </span>
                              <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#e11d48] line-clamp-2">
                                {vid.title}
                              </h4>
                              {lesson && (
                                <p className="text-[10px] text-slate-500 font-medium">
                                  الدرس: {lesson.title}
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
            ) : (
              <div className="p-8 text-center text-slate-500">
                اختر معلماً للبدء
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
