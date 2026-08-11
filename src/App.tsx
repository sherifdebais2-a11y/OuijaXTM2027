import React, { useState, useEffect } from 'react';
import {
  loadStoredData,
  saveDataToStorage,
  DatabaseStore
} from './data/mockData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { StageGradeNavigator } from './components/StageGradeNavigator';
import { SubjectGrid } from './components/SubjectGrid';
import { UnitLessonAccordion } from './components/UnitLessonAccordion';
import { UnifiedInteractiveWorkbench } from './components/UnifiedInteractiveWorkbench';
import { LessonDetailView } from './components/LessonDetailView';
import { TeacherDirectory } from './components/TeacherDirectory';
import { LibraryView } from './components/LibraryView';
import { BookmarksAndHistory } from './components/BookmarksAndHistory';
import { AdminPanel } from './components/AdminPanel';
import { SearchModal } from './components/SearchModal';
import { DaheehAIChat, ChatContext } from './components/DaheehAIChat';
import { Footer } from './components/Footer';
import {
  Unit,
  Lesson,
  VideoResource,
  PdfResource,
  InfographicResource,
  QuizQuestion,
  Teacher
} from './types';

export default function App() {
  const [db, setDb] = useState<DatabaseStore>(() => loadStoredData());
  const [currentView, setCurrentView] = useState<string>('home'); // 'home' | 'catalog' | 'lesson_detail' | 'teachers' | 'library' | 'bookmarks' | 'admin'

  const [selectedStageId, setSelectedStageId] = useState<string>('preparatory');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('m3'); // الصف الثالث الإعدادي
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub_m3_math'); // الرياضيات
  const [activeLessonId, setActiveLessonId] = useState<string | null>('les_m3_m1_l1');
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>('t_ashry');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Keyboard shortcut for Cmd+K or Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync to localStorage whenever db changes
  useEffect(() => {
    saveDataToStorage(db);
  }, [db]);

  const selectFirstLessonForSubject = (subjectId: string) => {
    const subUnits = db.units.filter(u => u.subjectId === subjectId);
    const subUnitIds = subUnits.map(u => u.id);
    const subLessons = db.lessons.filter(l => subUnitIds.includes(l.unitId));
    if (subLessons.length > 0) {
      setActiveLessonId(subLessons[0].id);
    } else {
      setActiveLessonId(null);
    }
  };

  // Handle stage change & auto fallback grade / subject / lesson
  const handleSelectStage = (stageId: string) => {
    setSelectedStageId(stageId);
    const stageGrades = db.grades.filter(g => g.stageId === stageId);
    if (stageGrades.length > 0) {
      const firstGrade = stageGrades[0];
      setSelectedGradeId(firstGrade.id);
      const gradeSubjects = db.subjects.filter(s => s.gradeId === firstGrade.id);
      if (gradeSubjects.length > 0) {
        const firstSubject = gradeSubjects[0];
        setSelectedSubjectId(firstSubject.id);
        selectFirstLessonForSubject(firstSubject.id);
      }
    }
  };

  // Handle grade change
  const handleSelectGrade = (gradeId: string) => {
    setSelectedGradeId(gradeId);
    const gradeSubjects = db.subjects.filter(s => s.gradeId === gradeId);
    if (gradeSubjects.length > 0) {
      const firstSubject = gradeSubjects[0];
      setSelectedSubjectId(firstSubject.id);
      selectFirstLessonForSubject(firstSubject.id);
    }
  };

  // Handle subject change
  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    selectFirstLessonForSubject(subjectId);
  };

  // Open Lesson Detail View
  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentView('lesson_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bookmark Toggle
  const handleToggleBookmark = (lessonId: string) => {
    setDb(prev => {
      const isBookmarked = prev.userProgress.bookmarkedLessonIds.includes(lessonId);
      const updatedList = isBookmarked
        ? prev.userProgress.bookmarkedLessonIds.filter(id => id !== lessonId)
        : [...prev.userProgress.bookmarkedLessonIds, lessonId];

      return {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          bookmarkedLessonIds: updatedList
        }
      };
    });
  };

  // Complete Toggle
  const handleToggleComplete = (lessonId: string) => {
    setDb(prev => {
      const isCompleted = prev.userProgress.completedLessonIds.includes(lessonId);
      const updatedList = isCompleted
        ? prev.userProgress.completedLessonIds.filter(id => id !== lessonId)
        : [...prev.userProgress.completedLessonIds, lessonId];

      return {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          completedLessonIds: updatedList
        }
      };
    });
  };

  // Quiz Score Save
  const handleSaveQuizResult = (lessonId: string, score: number, total: number) => {
    setDb(prev => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        quizScores: {
          ...prev.userProgress.quizScores,
          [lessonId]: {
            score,
            total,
            date: new Date().toISOString().split('T')[0]
          }
        }
      }
    }));
  };

  // Admin CRUD Handlers
  const handleAddUnit = (u: Unit) => {
    setDb(prev => ({ ...prev, units: [...prev.units, u] }));
  };

  const handleAddLesson = (l: Lesson) => {
    setDb(prev => ({ ...prev, lessons: [...prev.lessons, l] }));
  };

  const navigateToLesson = (lessonId: string) => {
    const targetLesson = db.lessons.find(l => l.id === lessonId);
    if (targetLesson) {
      const targetUnit = db.units.find(u => u.id === targetLesson.unitId);
      if (targetUnit) {
        const targetSubject = db.subjects.find(s => s.id === targetUnit.subjectId);
        if (targetSubject) {
          setSelectedSubjectId(targetSubject.id);
          setSelectedGradeId(targetSubject.gradeId);
          const targetGrade = db.grades.find(g => g.id === targetSubject.gradeId);
          if (targetGrade) {
            setSelectedStageId(targetGrade.stageId);
          }
        }
      }
      setActiveLessonId(targetLesson.id);
    }
  };

  const handleAddVideo = (vid: VideoResource) => {
    setDb(prev => ({ ...prev, videos: [vid, ...prev.videos] }));
    if (vid.lessonId) {
      navigateToLesson(vid.lessonId);
    }
  };

  const handleAddPdf = (pdf: PdfResource) => {
    setDb(prev => ({ ...prev, pdfs: [pdf, ...prev.pdfs] }));
    if (pdf.lessonId) {
      navigateToLesson(pdf.lessonId);
    }
  };

  const handleAddInfographic = (info: InfographicResource) => {
    setDb(prev => ({ ...prev, infographics: [info, ...prev.infographics] }));
    if (info.lessonId) {
      navigateToLesson(info.lessonId);
    }
  };

  const handleAddQuiz = (quiz: QuizQuestion) => {
    setDb(prev => ({ ...prev, quizzes: [...prev.quizzes, quiz] }));
  };

  const handleAddTeacher = (t: Teacher) => {
    setDb(prev => ({ ...prev, teachers: [...prev.teachers, t] }));
  };

  const handleDeleteVideo = (id: string) => {
    setDb(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
  };

  const handleDeletePdf = (id: string) => {
    setDb(prev => ({ ...prev, pdfs: prev.pdfs.filter(p => p.id !== id) }));
  };

  const handleDeleteInfographic = (id: string) => {
    setDb(prev => ({ ...prev, infographics: prev.infographics.filter(i => i.id !== id) }));
  };

  const handleUpdateVideoLesson = (videoId: string, newLessonId: string) => {
    setDb(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === videoId ? { ...v, lessonId: newLessonId } : v)
    }));
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('madrasaty_platform_db_v1');
    setDb(loadStoredData());
  };

  // Derived filtered data for current Grade & Subject
  const currentGradeSubjects = db.subjects.filter(s => s.gradeId === selectedGradeId);
  const currentSubject = db.subjects.find(s => s.id === selectedSubjectId) || currentGradeSubjects[0];
  const currentUnits = currentSubject ? db.units.filter(u => u.subjectId === currentSubject.id) : [];
  const currentUnitIds = currentUnits.map(u => u.id);
  const currentLessons = db.lessons.filter(l => currentUnitIds.includes(l.unitId));

  // Derived active lesson details strictly respecting current filtered subject
  const activeLesson = currentLessons.find(l => l.id === activeLessonId) || currentLessons[0] || db.lessons.find(l => l.id === activeLessonId) || db.lessons[0];
  const activeUnit = activeLesson ? db.units.find(u => u.id === activeLesson.unitId) : undefined;
  const activeSubject = activeUnit ? db.subjects.find(s => s.id === activeUnit.subjectId) : undefined;
  const activeGrade = activeSubject ? db.grades.find(g => g.id === activeSubject.gradeId) : undefined;
  const activeStage = activeGrade ? db.stages.find(stg => stg.id === activeGrade.stageId) : undefined;

  const activeLessonVideos = activeLesson ? db.videos.filter(v => v.lessonId === activeLesson.id) : [];
  const activeLessonPdfs = activeLesson ? db.pdfs.filter(p => p.lessonId === activeLesson.id) : [];
  const activeLessonInfos = activeLesson ? db.infographics.filter(i => i.lessonId === activeLesson.id) : [];
  const activeLessonQuizzes = activeLesson ? db.quizzes.filter(q => q.lessonId === activeLesson.id) : [];

  // Featured Spotlight & Top 5 Items dynamically filtered by selected Subject or Grade
  const currentSubjectVideos = db.videos.filter(v => {
    const l = db.lessons.find(les => les.id === v.lessonId);
    if (!l) return false;
    const u = db.units.find(un => un.id === l.unitId);
    return u?.subjectId === currentSubject?.id;
  });

  const currentGradeVideos = db.videos.filter(v => {
    const l = db.lessons.find(les => les.id === v.lessonId);
    if (!l) return false;
    const u = db.units.find(un => un.id === l.unitId);
    if (!u) return false;
    const s = db.subjects.find(sub => sub.id === u.subjectId);
    return s?.gradeId === selectedGradeId;
  });

  // Top candidate videos pool for header carousel (max 5)
  const candidateVideos = [
    ...currentSubjectVideos,
    ...currentGradeVideos.filter(v => !currentSubjectVideos.some(sv => sv.id === v.id)),
    ...db.videos.filter(v => !currentSubjectVideos.some(sv => sv.id === v.id) && !currentGradeVideos.some(gv => gv.id === v.id))
  ].slice(0, 5);

  const featuredItems = candidateVideos.map(vid => {
    const les = db.lessons.find(l => l.id === vid.lessonId);
    const un = les ? db.units.find(u => u.id === les.unitId) : undefined;
    const sub = un ? db.subjects.find(s => s.id === un.subjectId) : undefined;
    const tch = vid.teacherId ? db.teachers.find(t => t.id === vid.teacherId) : undefined;
    return {
      video: vid,
      lesson: les,
      teacher: tch,
      subject: sub
    };
  });

  const featuredVideo = candidateVideos[0];
  const featuredLesson = featuredVideo ? db.lessons.find(l => l.id === featuredVideo.lessonId) : undefined;
  const featuredTeacher = featuredVideo ? db.teachers.find(t => t.id === featuredVideo.teacherId) : undefined;
  const featuredUnit = featuredLesson ? db.units.find(u => u.id === featuredLesson.unitId) : undefined;
  const featuredSubject = featuredUnit ? db.subjects.find(s => s.id === featuredUnit.subjectId) : undefined;

  return (
    <div dir="rtl" className="min-h-screen font-sans bg-[#faf8f5] text-slate-800">
      
      {/* Platform Header */}
      <Header
        stages={db.stages}
        grades={db.grades}
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedStageId={selectedStageId}
        setSelectedStageId={setSelectedStageId}
        selectedGradeId={selectedGradeId}
        setSelectedGradeId={setSelectedGradeId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarksCount={db.userProgress.bookmarkedLessonIds.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearchModal={() => setSearchModalOpen(true)}
        onOpenAiChat={() => setAiChatOpen(true)}
      />

      {/* Main Content Router View */}
      <main>
        
        {/* VIEW 1: HOME & UNIFIED INTERACTIVE WORKBENCH */}
        {currentView === 'home' && (
          <div>
            <HeroBanner
              stages={db.stages}
              selectedStageId={selectedStageId}
              onSelectStage={(sId) => {
                handleSelectStage(sId);
              }}
              featuredItems={featuredItems}
              featuredVideo={featuredVideo}
              featuredLesson={featuredLesson}
              featuredTeacher={featuredTeacher}
              featuredSubject={featuredSubject}
              onOpenLesson={(lId) => {
                navigateToLesson(lId);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              onOpenSearch={() => setSearchModalOpen(true)}
              totalVideos={db.videos.length}
              totalPdfs={db.pdfs.length}
              totalTeachers={db.teachers.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <UnifiedInteractiveWorkbench
                stages={db.stages}
                grades={db.grades}
                subjects={db.subjects}
                units={db.units}
                lessons={db.lessons}
                videos={db.videos}
                pdfs={db.pdfs}
                infographics={db.infographics}
                quizzes={db.quizzes}
                teachers={db.teachers}
                userProgress={db.userProgress}
                selectedStageId={selectedStageId}
                onSelectStage={handleSelectStage}
                selectedGradeId={selectedGradeId}
                onSelectGrade={handleSelectGrade}
                selectedSubjectId={selectedSubjectId}
                onSelectSubject={setSelectedSubjectId}
                activeLessonId={activeLessonId}
                setActiveLessonId={setActiveLessonId}
                onToggleBookmark={handleToggleBookmark}
                onToggleComplete={handleToggleComplete}
                onSaveQuizResult={handleSaveQuizResult}
                onOpenTeacherProfile={(teacherId) => {
                  setActiveTeacherId(teacherId);
                  setCurrentView('teachers');
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: CATALOG WORKBENCH */}
        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UnifiedInteractiveWorkbench
              stages={db.stages}
              grades={db.grades}
              subjects={db.subjects}
              units={db.units}
              lessons={db.lessons}
              videos={db.videos}
              pdfs={db.pdfs}
              infographics={db.infographics}
              quizzes={db.quizzes}
              teachers={db.teachers}
              userProgress={db.userProgress}
              selectedStageId={selectedStageId}
              onSelectStage={handleSelectStage}
              selectedGradeId={selectedGradeId}
              onSelectGrade={handleSelectGrade}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
              activeLessonId={activeLessonId}
              setActiveLessonId={setActiveLessonId}
              onToggleBookmark={handleToggleBookmark}
              onToggleComplete={handleToggleComplete}
              onSaveQuizResult={handleSaveQuizResult}
              onOpenTeacherProfile={(teacherId) => {
                setActiveTeacherId(teacherId);
                setCurrentView('teachers');
              }}
            />
          </div>
        )}

        {/* VIEW 3: LESSON DETAIL VIEW */}
        {currentView === 'lesson_detail' && activeLesson && (
          <LessonDetailView
            lesson={activeLesson}
            unit={activeUnit}
            subject={activeSubject}
            grade={activeGrade}
            stage={activeStage}
            videos={activeLessonVideos}
            pdfs={activeLessonPdfs}
            infographics={activeLessonInfos}
            quizzes={activeLessonQuizzes}
            teachers={db.teachers}
            userProgress={db.userProgress}
            onToggleBookmark={handleToggleBookmark}
            onToggleComplete={handleToggleComplete}
            onSaveQuizResult={handleSaveQuizResult}
            onBack={() => setCurrentView('catalog')}
            onOpenTeacherProfile={(teacherId) => {
              setActiveTeacherId(teacherId);
              setCurrentView('teachers');
            }}
          />
        )}

        {/* VIEW 4: TEACHER DIRECTORY */}
        {currentView === 'teachers' && (
          <TeacherDirectory
            teachers={db.teachers}
            videos={db.videos}
            lessons={db.lessons}
            onOpenLesson={handleOpenLesson}
            selectedTeacherId={activeTeacherId}
          />
        )}

        {/* VIEW 5: EDUCATIONAL LIBRARY */}
        {currentView === 'library' && (
          <LibraryView
            stages={db.stages}
            grades={db.grades}
            subjects={db.subjects}
            lessons={db.lessons}
            pdfs={db.pdfs}
            infographics={db.infographics}
            onOpenLesson={handleOpenLesson}
          />
        )}

        {/* VIEW 6: BOOKMARKS & PROGRESS HISTORY */}
        {currentView === 'bookmarks' && (
          <BookmarksAndHistory
            lessons={db.lessons}
            subjects={db.subjects}
            grades={db.grades}
            stages={db.stages}
            userProgress={db.userProgress}
            onOpenLesson={handleOpenLesson}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {/* VIEW 7: ADMIN CONTROL PANEL */}
        {currentView === 'admin' && (
          <AdminPanel
            stages={db.stages}
            grades={db.grades}
            subjects={db.subjects}
            units={db.units}
            lessons={db.lessons}
            teachers={db.teachers}
            videos={db.videos}
            pdfs={db.pdfs}
            infographics={db.infographics}
            quizzes={db.quizzes}
            onAddUnit={handleAddUnit}
            onAddLesson={handleAddLesson}
            onAddVideo={handleAddVideo}
            onAddPdf={handleAddPdf}
            onAddInfographic={handleAddInfographic}
            onAddQuiz={handleAddQuiz}
            onAddTeacher={handleAddTeacher}
            onDeleteVideo={handleDeleteVideo}
            onDeletePdf={handleDeletePdf}
            onDeleteInfographic={handleDeleteInfographic}
            onUpdateVideoLesson={handleUpdateVideoLesson}
            onResetDatabase={handleResetDatabase}
          />
        )}

      </main>

      {/* Global Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        lessons={db.lessons}
        subjects={db.subjects}
        videos={db.videos}
        pdfs={db.pdfs}
        teachers={db.teachers}
        onOpenLesson={handleOpenLesson}
        onOpenTeacherProfile={(tId) => {
          setActiveTeacherId(tId);
          setCurrentView('teachers');
        }}
      />

      {/* Footer */}
      <Footer
        onSelectStage={handleSelectStage}
        setCurrentView={setCurrentView}
      />

    </div>
  );
}
