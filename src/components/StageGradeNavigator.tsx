import React from 'react';
import { EducationalStage, Grade } from '../types';
import { GraduationCap, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';

interface StageGradeNavigatorProps {
  stages: EducationalStage[];
  grades: Grade[];
  selectedStageId: string;
  onSelectStage: (stageId: string) => void;
  selectedGradeId: string;
  onSelectGrade: (gradeId: string) => void;
}

export const StageGradeNavigator: React.FC<StageGradeNavigatorProps> = ({
  stages,
  grades,
  selectedStageId,
  onSelectStage,
  selectedGradeId,
  onSelectGrade
}) => {
  const currentStage = stages.find(s => s.id === selectedStageId) || stages[1]; // default prep
  const stageGrades = grades.filter(g => g.stageId === selectedStageId);
  const currentGrade = grades.find(g => g.id === selectedGradeId) || stageGrades[0];

  return (
    <div className="bg-slate-950 border-b border-slate-800 text-slate-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Stage Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
            <h2 className="text-base font-bold tracking-tight text-slate-100 font-alexandria">الصف الدراسي:</h2>
          </div>

          <div className="flex items-center bg-slate-900 p-1.5 rounded-full border border-slate-800 shadow-inner">
            {stages.map(stg => {
              const active = stg.id === selectedStageId;
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    onSelectStage(stg.id);
                    const firstG = grades.find(g => g.stageId === stg.id);
                    if (firstG) onSelectGrade(firstG.id);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'btn-pill-cyan text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  <span>{stg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade Buttons Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {stageGrades.map(grade => {
            const isSelected = grade.id === selectedGradeId;
            return (
              <button
                key={grade.id}
                onClick={() => onSelectGrade(grade.id)}
                className={`p-2.5 rounded-full text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'btn-pill-pink text-white font-bold shadow-lg'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${isSelected ? 'bg-white text-rose-600' : 'bg-slate-800 text-slate-400'} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                  {isSelected ? '✓' : '•'}
                </div>
                <span className="text-xs font-semibold leading-snug">
                  {grade.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Current Active Breadcrumb Banner with Metal Border */}
        {currentGrade && (
          <div className="metal-border-dark p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-cyan-400 font-bold">المرحلة المختارة:</span>
              <span className="text-slate-400">{currentStage.name}</span>
              <ChevronLeft className="w-4 h-4 text-slate-600" />
              <span className="btn-pill btn-pill-cyan text-[11px] py-1 px-3">
                <span className="btn-pill-icon w-4 h-4 text-blue-600">🎓</span>
                <span>{currentGrade.name}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>اختر المادة الدراسية أدناه لتصفح الدروس والكتب</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
