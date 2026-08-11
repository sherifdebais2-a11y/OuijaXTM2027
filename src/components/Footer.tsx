import React from 'react';
import { GraduationCap, Heart, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectStage: (stageId: string) => void;
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectStage, setCurrentView }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Platform Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-100 font-cairo">منصة تعلّم التعليمية</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              منصة تعليمية مصرية متكاملة تهدف إلى دعم أبنائنا الطلاب في جميع المراحل الدراسية عبر تجميع وتنسيق شروحات الفيديوهات والكتب الرسمية والمذكرات.
            </p>
          </div>

          {/* Col 2: Educational Stages */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 text-sm font-cairo">المراحل الدراسية:</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { onSelectStage('primary'); setCurrentView('catalog'); }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  • المرحلة الابتدائية (الصفوف 1 - 6)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectStage('preparatory'); setCurrentView('catalog'); }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  • المرحلة الإعدادية (الشهادة الإعدادية)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectStage('secondary'); setCurrentView('catalog'); }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  • المرحلة الثانوية (الثانوية العامة)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Educational Services */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 text-sm font-cairo">خدمات المنصة:</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('library')} className="hover:text-indigo-400 transition-colors">
                  📕 كتب وزارة التربية والتعليم PDF
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('teachers')} className="hover:text-indigo-400 transition-colors">
                  👨‍🏫 دليل وقنوات معلمي مصر
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('bookmarks')} className="hover:text-indigo-400 transition-colors">
                  🌟 سجل الدروس المفضلة والاختبارات
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Fair Use Note */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>حقوق وحقوق الاستخدام:</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              جميع ملفات الفيديوهات المعروضة مشغلة مباشرة عبر تضمين YouTube الخاص بالقنوات الأصلية لضمان حقوق المبدعين والمعلمين. كتب الوزارة منسوبة لوزارة التربية والتعليم والتعليم الفني في جمهورية مصر العربية.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} - منصة مدرستي التعليمية 🇪🇬
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>صُنعت بحب لدعم التعليم والطلاب في مصر</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
