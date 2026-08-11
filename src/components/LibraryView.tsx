import React, { useState } from 'react';
import { PdfResource, InfographicResource, EducationalStage, Grade, Subject, Lesson } from '../types';
import { getPdfEmbedUrl, handlePdfDownload } from '../lib/pdfAndVideoUtils';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Download,
  Search,
  Filter,
  Eye,
  Sparkles,
  ChevronLeft,
  X,
  ExternalLink
} from 'lucide-react';

interface LibraryViewProps {
  stages: EducationalStage[];
  grades: Grade[];
  subjects: Subject[];
  lessons: Lesson[];
  pdfs: PdfResource[];
  infographics: InfographicResource[];
  onOpenLesson: (lessonId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  stages,
  grades,
  subjects,
  lessons,
  pdfs,
  infographics,
  onOpenLesson
}) => {
  const [filterType, setFilterType] = useState<'all' | 'books' | 'notes' | 'infographics'>('all');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active embedded PDF selection
  const [selectedLibraryPdfId, setSelectedLibraryPdfId] = useState<string>('');

  // PDF Preview Modal State (fallback)
  const [previewPdf, setPreviewPdf] = useState<PdfResource | null>(null);

  // Zoomed Image
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Filter logic
  const filteredPdfs = pdfs.filter(pdf => {
    if (filterType === 'books' && pdf.type !== 'school_book') return false;
    if (filterType === 'notes' && pdf.type === 'school_book') return false;
    if (filterType === 'infographics') return false;

    if (searchQuery) {
      return pdf.title.includes(searchQuery) || (pdf.description && pdf.description.includes(searchQuery));
    }
    return true;
  });

  const filteredInfographics = filterType === 'books' || filterType === 'notes' ? [] : infographics.filter(info => {
    if (searchQuery) {
      return info.title.includes(searchQuery) || info.summary.includes(searchQuery);
    }
    return true;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-alexandria flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#0f172a] rounded-full"></span>
              <span>المكتبة التعليمية الرقمية 📕</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              جميع كتب وزارة التربية والتعليم، مذكرات الشرح، العروض التقديمية والإنفوجرافات للاستعراض والتحميل المباشر.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="ابحث باسم الكتاب، المذكرات، أو الدرس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f172a]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setFilterType('all')}
            className={`btn-glossy-4k text-xs py-1.5 px-3.5 cursor-pointer ${
              filterType === 'all'
                ? 'btn-glossy-dark'
                : 'hover:border-slate-300'
            }`}
          >
            <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${filterType === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              📚
            </div>
            <span>جميع الوسائط ({pdfs.length + infographics.length})</span>
          </button>

          <button
            onClick={() => setFilterType('books')}
            className={`btn-glossy-4k text-xs py-1.5 px-3.5 cursor-pointer ${
              filterType === 'books'
                ? 'btn-glossy-magenta'
                : 'hover:border-slate-300'
            }`}
          >
            <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${filterType === 'books' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'}`}>
              📕
            </div>
            <span>كتب المدرسة الرسمية ({pdfs.filter(p => p.type === 'school_book').length})</span>
          </button>

          <button
            onClick={() => setFilterType('notes')}
            className={`btn-glossy-4k text-xs py-1.5 px-3.5 cursor-pointer ${
              filterType === 'notes'
                ? 'btn-glossy-teal'
                : 'hover:border-slate-300'
            }`}
          >
            <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${filterType === 'notes' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'}`}>
              📄
            </div>
            <span>المذكرات والملخصات ({pdfs.filter(p => p.type !== 'school_book').length})</span>
          </button>

          <button
            onClick={() => setFilterType('infographics')}
            className={`btn-glossy-4k text-xs py-1.5 px-3.5 cursor-pointer ${
              filterType === 'infographics'
                ? 'btn-glossy-purple'
                : 'hover:border-slate-300'
            }`}
          >
            <div className={`btn-glossy-icon w-6 h-6 rounded-lg ${filterType === 'infographics' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>
              🧠
            </div>
            <span>الإنفوجرافات ({infographics.length})</span>
          </button>
        </div>

        {/* PDF Documents Direct Embedded Viewer & Grid */}
        {filteredPdfs.length > 0 && (() => {
          const activeLibraryPdf = filteredPdfs.find(p => p.id === selectedLibraryPdfId) || filteredPdfs[0];
          const activeLesson = activeLibraryPdf ? lessons.find(l => l.id === activeLibraryPdf.lessonId) : null;

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <h2 className="text-base font-bold text-slate-800 font-alexandria flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0f172a]" />
                  <span>العرض المباشر للملف: <span className="text-[#0f172a]">{activeLibraryPdf.title}</span></span>
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePdfDownload(activeLibraryPdf.fileUrl, activeLibraryPdf.title)}
                    className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل هذا الملف PDF</span>
                  </button>
                  {activeLesson && (
                    <button
                      onClick={() => onOpenLesson(activeLesson.id)}
                      className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-all cursor-pointer"
                    >
                      انتقل للدرس
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Embedded PDF Viewer Box */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-3 sm:p-5 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                      {activeLibraryPdf.typeNameAr}
                    </span>
                    <span className="font-bold text-slate-100">{activeLibraryPdf.title}</span>
                    <span className="text-slate-400 font-mono">({activeLibraryPdf.fileSize})</span>
                  </div>
                  <a
                    href={activeLibraryPdf.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>فتح في تبويب مستقل</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="w-full h-[600px] sm:h-[700px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                  <iframe
                    src={getPdfEmbedUrl(activeLibraryPdf.fileUrl)}
                    title={activeLibraryPdf.title}
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              {/* Cards Grid for Selecting Other PDF Files */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-500 font-alexandria">جميع الكتب والمذكرات المتاحة (اضغط لاختيار المستند واستعراضه مباشرة بالصفحة):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPdfs.map(pdf => {
                    const isSelected = activeLibraryPdf.id === pdf.id;
                    const lesson = lessons.find(l => l.id === pdf.lessonId);

                    return (
                      <div
                        key={pdf.id}
                        onClick={() => setSelectedLibraryPdfId(pdf.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#0f172a] text-white border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className={isSelected ? 'text-amber-400' : 'text-[#0f172a]'}>{pdf.typeNameAr}</span>
                            <span className={isSelected ? 'text-slate-400' : 'text-slate-500 font-mono'}>{pdf.fileSize}</span>
                          </div>
                          <h4 className="font-bold text-sm font-alexandria line-clamp-1">{pdf.title}</h4>
                          <p className={`text-xs line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                            {pdf.description}
                          </p>
                          {lesson && (
                            <p className={`text-[11px] ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                              الدرس: {lesson.title}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/20 text-xs font-bold">
                          <span className={isSelected ? 'text-amber-400' : 'text-[#0f172a]'}>
                            {isSelected ? '✓ يعرض حالياً أعلاه' : 'عرض مباشر بالصفحة'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePdfDownload(pdf.fileUrl, pdf.title);
                            }}
                            className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
                            title="تحميل"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Infographics Grid */}
        {filteredInfographics.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-slate-800 font-alexandria">الإنفوجرافات والخرائط الذهنية:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInfographics.map(info => (
                <div
                  key={info.id}
                  onClick={() => setZoomedImage(info.imageUrl)}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#0f172a] transition-all cursor-pointer group shadow-xs"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={info.imageUrl}
                      alt={info.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#0f172a] font-alexandria">
                      {info.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 font-readex">
                      {info.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* PDF Viewer / Preview Modal */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden dir-rtl">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
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
            <div className="flex-1 bg-slate-100 relative overflow-hidden">
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
