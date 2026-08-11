import React from 'react';
import { Subject, Unit, Lesson, VideoResource, PdfResource, InfographicResource } from '../types';
import {
  Calculator,
  BookMarked,
  Atom,
  Globe,
  Languages,
  Zap,
  FlaskConical,
  Dna,
  Binary,
  BookOpen,
  Sparkles,
  Tv,
  FileText,
  Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';

interface SubjectGridProps {
  subjects: Subject[];
  units: Unit[];
  lessons: Lesson[];
  videos: VideoResource[];
  pdfs: PdfResource[];
  infographics: InfographicResource[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  gradeName: string;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({
  subjects,
  units,
  lessons,
  videos,
  pdfs,
  infographics,
  selectedSubjectId,
  onSelectSubject,
  gradeName
}) => {
  // Helper icon map
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-6 h-6" />;
      case 'BookMarked': return <BookMarked className="w-6 h-6" />;
      case 'Atom': return <Atom className="w-6 h-6" />;
      case 'Globe': return <Globe className="w-6 h-6" />;
      case 'Languages': return <Languages className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'FlaskConical': return <FlaskConical className="w-6 h-6" />;
      case 'Dna': return <Dna className="w-6 h-6" />;
      case 'Binary': return <Binary className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-3">
        <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-300">جارٍ تجهيز مواد {gradeName}</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          يمكنك إضافة مواد جديدة وربط الدروس بها عبر لوحة التحكم والإدارة في أي وقت.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
            <span>المواد الدراسية المقررة</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-mono">
              {subjects.length} مواد
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            اختر المادة لتصفح الوحدات، الفيديوهات التعليمية، كتب الوزارة والملخصات
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {subjects.map(subject => {
          const isSelected = subject.id === selectedSubjectId;

          // Compute counts for this subject
          const subjectUnits = units.filter(u => u.subjectId === subject.id);
          const unitIds = subjectUnits.map(u => u.id);
          const subjectLessons = lessons.filter(l => unitIds.includes(l.unitId));
          const lessonIds = subjectLessons.map(l => l.id);

          const videoCount = videos.filter(v => lessonIds.includes(v.lessonId)).length;
          const pdfCount = pdfs.filter(p => lessonIds.includes(p.lessonId)).length;
          const infoCount = infographics.filter(i => lessonIds.includes(i.lessonId)).length;

          return (
            <div
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className={`p-4 transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'metal-border ring-2 ring-cyan-500/50 shadow-xl bg-slate-900'
                  : 'metal-border-dark opacity-90 hover:opacity-100 hover:scale-[1.01]'
              }`}
            >
              {/* Subject Gradient Accent */}
              <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${subject.color}`} />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${subject.color} flex items-center justify-center text-white shadow-md shrink-0 border border-white/20`}>
                    {renderSubjectIcon(subject.icon)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors font-alexandria">
                      {subject.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-readex">
                      {subject.description || `${subjectUnits.length} وحدات تعليمية`}
                    </p>
                  </div>
                </div>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${isSelected ? 'btn-pill-cyan text-white shadow-xs' : 'bg-slate-800 text-slate-400 group-hover:text-cyan-400'}`}>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>

              {/* Resource Badges Footer */}
              <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-800/50">
                    <Tv className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{videoCount} فيديو</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/50">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{pdfCount} كتب</span>
                  </span>
                </div>

                <span className="text-slate-400 font-semibold bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {subjectLessons.length} دروس
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
