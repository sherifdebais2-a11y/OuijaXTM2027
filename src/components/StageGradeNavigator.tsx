import React from 'react';
import { EducationalStage, Grade } from '../types';
import { GraduationCap, ChevronLeft, BookOpen, Check } from 'lucide-react';

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

  // Map stage/grade index to deep sharp glossy colors
  const glossyColors = [
    'btn-glossy-blue',
    'btn-glossy-teal',
    'btn-glossy-magenta',
    'btn-glossy-purple',
    'btn-glossy-emerald',
    'btn-glossy-coral',
    'btn-glossy-amber'
  ];

  return (
    <div className="bg-slate-950 border-b border-slate-800 text-slate-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Stage Selector Tabs - Horizontally scrollable on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-slate-100 font-alexandria">اختر المرحلة والصف:</h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 w-full min-w-0 max-w-full">
            {stages.map((stg, idx) => {
              const active = stg.id === selectedStageId;
              const colorClass = glossyColors[idx % glossyColors.length];
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    onSelectStage(stg.id);
                    const firstG = grades.find(g => g.stageId === stg.id);
                    if (firstG) onSelectGrade(firstG.id);
                  }}
                  className={`btn-glossy-4k text-xs py-1.5 px-3 sm:px-3.5 shrink-0 ${
                    active
                      ? colorClass
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`btn-glossy-icon ${active ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <span>{stg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade Buttons Ribbon - Smooth Horizontal Scroll on Mobile or Clean Grid */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-6 gap-2 overflow-x-auto scrollbar-none pb-1 w-full min-w-0 max-w-full">
          {stageGrades.map((grade, idx) => {
            const isSelected = grade.id === selectedGradeId;
            const colorClass = glossyColors[(idx + 2) % glossyColors.length];
            return (
              <button
                key={grade.id}
                onClick={() => onSelectGrade(grade.id)}
                className={`btn-glossy-4k text-xs py-2 px-3 shrink-0 flex items-center justify-start gap-2.5 sm:w-auto ${
                  isSelected
                    ? `${colorClass} shadow-lg`
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`btn-glossy-icon w-6 h-6 rounded-lg shrink-0 ${isSelected ? 'bg-white/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                </div>
                <span className="font-bold text-xs whitespace-nowrap">
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
              <span className="btn-glossy-4k btn-glossy-blue text-[11px] py-1 px-3">
                <div className="btn-glossy-icon w-5 h-5 bg-white/20 text-white">
                  <GraduationCap className="w-3 h-3" />
                </div>
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

