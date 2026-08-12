import React, { useState } from 'react';
import {
  EducationalStage,
  Grade,
  Subject,
  Unit,
  Lesson,
  Teacher,
  VideoResource,
  PdfResource,
  InfographicResource,
  QuizQuestion
} from '../types';
import {
  Settings,
  Tv,
  BookOpen,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Users,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Youtube,
  Edit3,
  Link2,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  Download,
  Upload,
  FileJson
} from 'lucide-react';

interface AdminPanelProps {
  stages: EducationalStage[];
  grades: Grade[];
  subjects: Subject[];
  units: Unit[];
  lessons: Lesson[];
  teachers: Teacher[];
  videos: VideoResource[];
  pdfs: PdfResource[];
  infographics: InfographicResource[];
  quizzes: QuizQuestion[];
  onAddVideo: (vid: VideoResource) => void;
  onAddPdf: (pdf: PdfResource) => void;
  onAddInfographic: (info: InfographicResource) => void;
  onAddQuiz: (quiz: QuizQuestion) => void;
  onAddTeacher: (t: Teacher) => void;
  onAddLesson?: (lesson: Lesson) => void;
  onAddUnit?: (unit: Unit) => void;
  onDeleteVideo: (id: string) => void;
  onDeletePdf: (id: string) => void;
  onDeleteInfographic: (id: string) => void;
  onUpdateVideoLesson?: (videoId: string, newLessonId: string) => void;
  onResetDatabase: () => void;
  onExportDatabase?: () => void;
  onRestoreDatabase?: (data: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  stages,
  grades,
  subjects,
  units,
  lessons,
  teachers,
  videos,
  pdfs,
  infographics,
  quizzes,
  onAddVideo,
  onAddPdf,
  onAddInfographic,
  onAddQuiz,
  onAddTeacher,
  onAddLesson,
  onAddUnit,
  onDeleteVideo,
  onDeletePdf,
  onDeleteInfographic,
  onUpdateVideoLesson,
  onResetDatabase,
  onExportDatabase,
  onRestoreDatabase
}) => {
  const [activeTab, setActiveTab] = useState<'lesson' | 'video' | 'pdf' | 'infographic' | 'quiz' | 'teacher' | 'manage'>('video');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editing Video Lesson Link State
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [targetLessonForVideo, setTargetLessonForVideo] = useState<string>('');

  // Lesson Form State
  const [newLessonStageId, setNewLessonStageId] = useState(stages[0]?.id || 'stg_prep');
  const availableGrades = grades.filter(g => g.stageId === newLessonStageId);
  const [newLessonGradeId, setNewLessonGradeId] = useState(availableGrades[0]?.id || 'g_prep_1');
  const availableSubjects = subjects.filter(s => s.gradeId === newLessonGradeId);
  const [newLessonSubjectId, setNewLessonSubjectId] = useState(availableSubjects[0]?.id || 'sub_math_p1');
  const availableUnits = units.filter(u => u.subjectId === newLessonSubjectId);
  const [newLessonUnitId, setNewLessonUnitId] = useState(availableUnits[0]?.id || 'u_new');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [isCreatingNewUnit, setIsCreatingNewUnit] = useState(false);

  // Video Form
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeUrlOrId, setYoutubeUrlOrId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [videoDuration, setVideoDuration] = useState('25:00');
  const [videoLevelTag, setVideoLevelTag] = useState<'شرح كامل' | 'شرح مبسط' | 'حل تدريبات' | 'مراجعة نهائية'>('شرح كامل');

  // PDF Form
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfType, setPdfType] = useState<'school_book' | 'summary_note' | 'cheatsheet'>('summary_note');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfSize, setPdfSize] = useState('5.2 MB');
  const [pdfPageCount, setPdfPageCount] = useState(20);
  const [pdfPublisher, setPdfPublisher] = useState('أستاذ متخصص');

  // Infographic Form
  const [infoTitle, setInfoTitle] = useState('');
  const [infoImageUrl, setInfoImageUrl] = useState('');
  const [infoSummary, setInfoSummary] = useState('');

  // Quiz Form
  const [questionText, setQuestionText] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState('');

  // Teacher Form
  const [teacherName, setTeacherName] = useState('');
  const [teacherTitle, setTeacherTitle] = useState('');
  const [teacherBio, setTeacherBio] = useState('');
  const [teacherChannel, setTeacherChannel] = useState('');
  const [teacherAvatar, setTeacherAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');

  // Extract YouTube ID helper
  const extractYoutubeId = (input: string) => {
    if (!input) return '';
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const ytReg = /(?:v=|\/embed\/|\/v\/|\/shorts\/|youtu\.be\/|\/e\/)([^"&?\/\s]{11})/;
    const ytMatch = trimmed.match(ytReg);
    if (ytMatch && ytMatch[1]) {
      return ytMatch[1];
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return trimmed;
  };

  // Helper to render grouped lessons select options
  const renderGroupedLessonOptions = () => {
    return grades.map(g => {
      const gradeSubjects = subjects.filter(s => s.gradeId === g.id);
      if (gradeSubjects.length === 0) return null;

      return gradeSubjects.map(s => {
        const subUnits = units.filter(u => u.subjectId === s.id);
        const subUnitIds = subUnits.map(u => u.id);
        const subLessons = lessons.filter(l => subUnitIds.includes(l.unitId));

        if (subLessons.length === 0) return null;

        return (
          <optgroup key={`${g.id}_${s.id}`} label={`📌 ${g.name} - ${s.name}`}>
            {subLessons.map(l => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </optgroup>
        );
      });
    });
  };

  const notify = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = JSON.parse(content);

        if (!parsedData || typeof parsedData !== 'object' || !Array.isArray(parsedData.lessons) || !Array.isArray(parsedData.units)) {
          alert('خطأ: صيغة الملف غير صحيحة. يرجى اختيار ملف استرجاع JSON صادر من المنصة.');
          return;
        }

        if (onRestoreDatabase) {
          onRestoreDatabase(parsedData);
          notify('تمت استعادة كافة الدروس والبيانات من الملف الاحتياطي بنجاح! 🎉');
        }
      } catch (err) {
        alert('تعذر قراءة ملف JSON الاحتياطي. يرجى التأكد من اختيار ملف سليم بصيغة JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Submit Handlers
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYoutubeId(youtubeUrlOrId);
    if (!videoTitle || !ytId) return;

    const newVid: VideoResource = {
      id: 'v_' + Date.now(),
      lessonId: selectedLessonId,
      title: videoTitle,
      youtubeVideoId: ytId,
      teacherId: selectedTeacherId,
      duration: videoDuration,
      viewsCount: 1000,
      levelTag: videoLevelTag,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddVideo(newVid);
    setVideoTitle('');
    setYoutubeUrlOrId('');
    notify('تمت إضافة فيديو الشرح بنجاح! 🎬');
  };

  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle || !pdfUrl) return;

    const newPdf: PdfResource = {
      id: 'pdf_' + Date.now(),
      lessonId: selectedLessonId,
      title: pdfTitle,
      type: pdfType,
      typeNameAr: pdfType === 'school_book' ? '📕 كتاب المدرسة الرسمية' : '📄 مذكرة شرح وتدريبات',
      fileUrl: pdfUrl,
      fileSize: pdfSize,
      pageCount: Number(pdfPageCount),
      publisherName: pdfPublisher,
      downloadCount: 1,
      description: pdfTitle
    };

    onAddPdf(newPdf);
    setPdfTitle('');
    setPdfUrl('');
    notify('تمت إضافة الملف بنجاح! 📕');
  };

  const handleAddInfographic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoTitle || !infoImageUrl) return;

    const newInfo: InfographicResource = {
      id: 'info_' + Date.now(),
      lessonId: selectedLessonId,
      title: infoTitle,
      imageUrl: infoImageUrl,
      summary: infoSummary || infoTitle,
      tags: ['إنفوجراف', 'شرح مصور']
    };

    onAddInfographic(newInfo);
    setInfoTitle('');
    setInfoImageUrl('');
    setInfoSummary('');
    notify('تمت إضافة الإنفوجراف بنجاح! 🧠');
  };

  const handleAddQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText || !opt1 || !opt2) return;

    const newQ: QuizQuestion = {
      id: 'q_' + Date.now(),
      lessonId: selectedLessonId,
      questionText,
      options: [opt1, opt2, opt3 || 'إجابة ج', opt4 || 'إجابة د'],
      correctAnswerIndex: correctIdx,
      explanationText: explanation || 'الإجابة الصحيحة هي الإجابة المحددة أعلاه.'
    };

    onAddQuiz(newQ);
    setQuestionText('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
    setExplanation('');
    notify('تمت إضافة السؤال بنجاح! 🧪');
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName) return;

    const newT: Teacher = {
      id: 't_' + Date.now(),
      name: teacherName,
      title: teacherTitle || 'معلم خبير بالمرحلة التعليمية',
      avatarUrl: teacherAvatar,
      specialization: 'المواد التعليمية',
      subjectNames: ['المواد العامة'],
      bio: teacherBio || 'مدرس خبير ومتخصص في شرح المناهج المصرية.',
      youtubeChannelUrl: teacherChannel,
      rating: 5.0,
      totalVideosCount: 10,
      verified: true
    };

    onAddTeacher(newT);
    setTeacherName('');
    setTeacherTitle('');
    setTeacherBio('');
    setTeacherChannel('');
    notify('تمت إضافة حساب معلم جديد بنجاح! 👨‍🏫');
  };

  const handleCreateLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle) return;

    let targetUnitId = newLessonUnitId;

    if (isCreatingNewUnit && newUnitTitle) {
      const createdUnitId = 'unit_' + Date.now();
      const newUnit: Unit = {
        id: createdUnitId,
        subjectId: newLessonSubjectId,
        title: newUnitTitle,
        orderNumber: availableUnits.length + 1
      };
      if (onAddUnit) onAddUnit(newUnit);
      targetUnitId = createdUnitId;
    }

    const createdLessonId = 'les_' + Date.now();
    const newLesson: Lesson = {
      id: createdLessonId,
      unitId: targetUnitId,
      title: newLessonTitle,
      orderNumber: 10,
      description: newLessonDesc || newLessonTitle,
      summaryText: newLessonDesc || newLessonTitle
    };

    if (onAddLesson) onAddLesson(newLesson);
    setSelectedLessonId(createdLessonId);
    setNewLessonTitle('');
    setNewLessonDesc('');
    setNewUnitTitle('');
    setIsCreatingNewUnit(false);
    notify('تمت إضافة الدرس الجديد للمنهج بنجاح! تم اختياره تلقائياً لربط الفيديو 📚');
  };

  // Admin Security & Authentication State
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(() => {
    return sessionStorage.getItem('madrasaty_admin_authed') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  // Change Password Modal State
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinError, setChangePinError] = useState<string | null>(null);
  const [changePinSuccess, setChangePinSuccess] = useState<string | null>(null);

  const getStoredPin = () => {
    return localStorage.getItem('madrasaty_admin_pin') || '1234';
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getStoredPin();
    if (enteredPin.trim() === correctPin) {
      sessionStorage.setItem('madrasaty_admin_authed', 'true');
      setIsAdminAuthed(true);
      setPinError(null);
      setEnteredPin('');
    } else {
      setPinError('كلمة المرور غير صحيحة! تأكد من إدخال رمز الأمان الخادمي الصحيح.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('madrasaty_admin_authed');
    setIsAdminAuthed(false);
    setEnteredPin('');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError(null);
    setChangePinSuccess(null);

    const currentPin = getStoredPin();
    if (oldPinInput.trim() !== currentPin) {
      setChangePinError('كلمة المرور الحالية غير صحيحة!');
      return;
    }

    if (!newPinInput || newPinInput.length < 4) {
      setChangePinError('يجب أن تتكون كلمة المرور الجديدة من 4 أرقام أو حروف على الأقل!');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setChangePinError('كلمة المرور الجديدة وتأكيدها غير متطابقين!');
      return;
    }

    localStorage.setItem('madrasaty_admin_pin', newPinInput.trim());
    setChangePinSuccess('تم تغيير كلمة المرور بنجاح! احتفظ بكلمة المرور الجديدة بداخل مكان آمن.');
    setOldPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setTimeout(() => {
      setIsChangePinOpen(false);
      setChangePinSuccess(null);
    }, 2000);
  };

  // If not authenticated, render the Security Protection Lock Screen
  if (!isAdminAuthed) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto font-cairo">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-3xl mx-auto flex items-center justify-center text-rose-600 shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800 font-alexandria flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-rose-600" />
              <span>منطقة لوحة التحكم المحمية 🔒</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              هذه المنطقة مخصصة لإدارة المنصة والمحتوى التعليمي فقط. يرجى إدخال كلمة مرور الإدارة للمتابعة.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة مرور الإدارة 🔑
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="أدخل كلمة المرور هنا..."
                  className="w-full p-3.5 pl-10 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white transition-all dir-ltr text-center"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-extrabold text-sm hover:from-rose-700 hover:to-rose-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>دخول لوحة التحكم</span>
            </button>
          </form>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-medium text-right space-y-1">
            <div className="font-bold flex items-center gap-1 text-amber-800">
              💡 معلومة للمسؤول:
            </div>
            <div>كلمة المرور الافتراضية الأولى هي: <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-black text-amber-950">1234</code></div>
            <div>يمكنك تغيير كلمة المرور بأي رمز جديد في أي وقت بعد تسجيل الدخول.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Title Header with Security Controls */}
        <div className="border-b border-rose-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-alexandria flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#e11d48] rounded-full"></span>
              <span>لوحة التحكم وإدارة المحتوى التعليمي ⚙️</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              إضافة وتعديل وإدارة الدروس، فيديوهات يوتيوب، كتب الوزارة الرسمية والأسئلة التفاعلية.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onExportDatabase && (
              <button
                onClick={onExportDatabase}
                title="تصدير نسخة احتياطية من جميع منشوراتك ودروسك لحفظها على جهازك"
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">تصدير نسخة احتياطية</span>
                <span className="sm:hidden">تصدير</span>
              </button>
            )}

            {onRestoreDatabase && (
              <label
                title="رفع ملف JSON احتياطي لاستعادة المحتوى والمنشورات فوراً"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">استرجاع نسخة</span>
                <span className="sm:hidden">استرجاع</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  className="hidden"
                />
              </label>
            )}

            <button
              onClick={() => setIsChangePinOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>تغيير كلمة المرور</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>خروج الإدارة</span>
            </button>
          </div>
        </div>

        {/* Modal for Changing Admin Password */}
        {isChangePinOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 text-right font-cairo">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-800 font-alexandria flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  <span>تغيير كلمة مرور الإدارة</span>
                </h3>
                <button
                  onClick={() => setIsChangePinOpen(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleChangePin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    كلمة المرور الحالية:
                  </label>
                  <input
                    type="password"
                    value={oldPinInput}
                    onChange={(e) => setOldPinInput(e.target.value)}
                    placeholder="أدخل كلمة المرور الحالية..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    كلمة المرور الجديدة:
                  </label>
                  <input
                    type="password"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="كلمة مرور جديدة (4 رموز على الأقل)..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تأكيد كلمة المرور الجديدة:
                  </label>
                  <input
                    type="password"
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور الجديدة..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {changePinError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                    ⚠️ {changePinError}
                  </div>
                )}

                {changePinSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                    ✅ {changePinSuccess}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold transition-all cursor-pointer shadow-xs"
                  >
                    حفظ كلمة المرور الجديدة
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangePinOpen(false)}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#e11d48] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>🎬 إضافة فيديو يوتيوب</span>
          </button>

          <button
            onClick={() => setActiveTab('lesson')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'lesson'
                ? 'bg-[#e11d48] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>➕ إضافة درس جديد للمنهج</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-[#e11d48] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📕 إضافة كتاب أو مذكرة PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('infographic')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'infographic'
                ? 'bg-[#e11d48] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>🧠 إضافة إنفوجراف</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-[#e11d48] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>📝 إضافة أسئلة اختبار</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👨‍🏫 إضافة معلم</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>📊 الإحصائيات والحذف</span>
          </button>
        </div>

        {/* TAB: ADD NEW LESSON */}
        {activeTab === 'lesson' && (
          <form onSubmit={handleCreateLessonSubmit} className="notebook-card p-6 space-y-5 shadow-xs border border-slate-200">
            <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
              <h2 className="font-bold text-base text-slate-800 font-alexandria flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#e11d48]" />
                <span>إضافة درس جديد وتحديد موقعه في المنهج الدراسي</span>
              </h2>
              <span className="text-xs bg-rose-50 text-[#e11d48] px-2.5 py-0.5 rounded-full font-bold border border-rose-100">
                خطوة أساسية لربط الفيديوهات والملفات
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">1. اختر المرحلة:</label>
                <select
                  value={newLessonStageId}
                  onChange={(e) => {
                    const stgId = e.target.value;
                    setNewLessonStageId(stgId);
                    const filteredG = grades.filter(g => g.stageId === stgId);
                    if (filteredG.length > 0) {
                      setNewLessonGradeId(filteredG[0].id);
                      const filteredS = subjects.filter(s => s.gradeId === filteredG[0].id);
                      if (filteredS.length > 0) setNewLessonSubjectId(filteredS[0].id);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  {stages.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">2. اختر الصف الدراسي:</label>
                <select
                  value={newLessonGradeId}
                  onChange={(e) => {
                    const gId = e.target.value;
                    setNewLessonGradeId(gId);
                    const filteredS = subjects.filter(s => s.gradeId === gId);
                    if (filteredS.length > 0) setNewLessonSubjectId(filteredS[0].id);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  {availableGrades.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">3. اختر المادة الدراسية:</label>
                <select
                  value={newLessonSubjectId}
                  onChange={(e) => setNewLessonSubjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  {availableSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">4. اختر الوحدة الدراسية:</label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewUnit(!isCreatingNewUnit)}
                  className="text-xs text-[#e11d48] font-bold underline cursor-pointer hover:text-rose-700"
                >
                  {isCreatingNewUnit ? '← العودة للوحدات المتاحة' : '➕ إضافة وحدة دراسية جديدة لهذه المادة'}
                </button>
              </div>

              {isCreatingNewUnit ? (
                <input
                  type="text"
                  placeholder="اكتب اسم الوحدة الجديدة (مثال: الوحدة الثالثة: الجبر والعلاقات)"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-white border border-rose-300 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              ) : (
                <select
                  value={newLessonUnitId}
                  onChange={(e) => setNewLessonUnitId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  {availableUnits.map(u => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">5. عنوان الدرس الجديد:</label>
                <input
                  type="text"
                  placeholder="مثال: الدرس الثاني: التغير الطردي والعكسي"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">6. ملخص ووصف مختصر للدرس:</label>
                <textarea
                  rows={3}
                  placeholder="اكتب النقاط الرئيسية للدرس والتي سيقرأها الطالب عند فتح الدرس..."
                  value={newLessonDesc}
                  onChange={(e) => setNewLessonDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-crimson text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>حفظ الدرس الجديد وربطه فوراً بالمنهج</span>
            </button>
          </form>
        )}

        {/* TAB 1: ADD VIDEO */}
        {activeTab === 'video' && (
          <form onSubmit={handleAddVideo} className="notebook-card p-6 space-y-4 shadow-xs border border-slate-200">
            <h2 className="font-bold text-base text-slate-800 font-alexandria flex items-center gap-2 border-b border-rose-100 pb-3">
              <Tv className="w-5 h-5 text-[#e11d48]" />
              <span>ربط فيديو شرح من يوتيوب بالدرس</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">اختر الدرس:</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('lesson')}
                    className="text-[11px] text-[#e11d48] font-bold underline cursor-pointer hover:text-rose-700"
                  >
                    + إضافة درس جديد للمنهج
                  </button>
                </div>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  {renderGroupedLessonOptions()}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">اختر المعلم:</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} - {t.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">عنوان الفيديو الشارح:</label>
              <input
                type="text"
                placeholder="مثال: شرح حاصل الضرب الديكارتي والتمثيل البياني بالتفصيل"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1 block">رابط الفيديو أو YouTube Video ID:</label>
                <input
                  type="text"
                  placeholder="مثال: https://www.youtube.com/watch?v=fA-Wb_0494U أو ID المكون من 11 حرف"
                  value={youtubeUrlOrId}
                  onChange={(e) => setYoutubeUrlOrId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#e11d48]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 يدعم روابط يوتيوب العادية، الشورتس، والمقاطع المباشرة. تم توفير زر تشغيل بنقرة واحدة على يوتيوب تحسّباً لمنع التضمين من بعض القنوات.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">نوع الشرح:</label>
                <select
                  value={videoLevelTag}
                  onChange={(e) => setVideoLevelTag(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  <option value="شرح كامل">شرح كامل</option>
                  <option value="شرح مبسط">شرح مبسط</option>
                  <option value="حل تدريبات">حل تدريبات</option>
                  <option value="مراجعة نهائية">مراجعة نهائية</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-crimson text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>حفظ ورابط الفيديو بالدرس فوراً</span>
            </button>
          </form>
        )}

        {/* TAB 2: ADD PDF */}
        {activeTab === 'pdf' && (
          <form onSubmit={handleAddPdf} className="notebook-card p-6 space-y-4 shadow-xs border border-slate-200">
            <h2 className="font-bold text-base text-slate-800 font-alexandria flex items-center gap-2 border-b border-rose-100 pb-3">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>إضافة كتاب مدرسة أو مذكرة شرح PDF</span>
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">الدرس المرتبط:</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('lesson')}
                  className="text-[11px] text-[#e11d48] font-bold underline cursor-pointer hover:text-rose-700"
                >
                  + إضافة درس جديد للمنهج
                </button>
              </div>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              >
                {renderGroupedLessonOptions()}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">اسم الملف/المذكرة:</label>
                <input
                  type="text"
                  placeholder="مثال: كتاب وزارة التربية والتعليم - الرياضيات"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">نوع الملف:</label>
                <select
                  value={pdfType}
                  onChange={(e) => setPdfType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                >
                  <option value="school_book">📕 كتاب المدرسة الرسمي</option>
                  <option value="summary_note">📄 مذكرة شرح وتدريبات</option>
                  <option value="cheatsheet">📋 ملخص وقوانين مركزة</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1 block">رابط تحميل الملف (PDF URL):</label>
                <input
                  type="text"
                  placeholder="https://example.com/file.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">حجم الملف:</label>
                <input
                  type="text"
                  value={pdfSize}
                  onChange={(e) => setPdfSize(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة واستيعاب الملف بالدرس</span>
            </button>
          </form>
        )}

        {/* TAB 3: ADD INFOGRAPHIC */}
        {activeTab === 'infographic' && (
          <form onSubmit={handleAddInfographic} className="notebook-card p-6 space-y-4 shadow-xs border border-slate-200">
            <h2 className="font-bold text-base text-slate-800 font-alexandria flex items-center gap-2 border-b border-rose-100 pb-3">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span>إضافة إنفوجراف وخريطة ذهنية</span>
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">الدرس المرتبط:</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('lesson')}
                  className="text-[11px] text-[#e11d48] font-bold underline cursor-pointer hover:text-rose-700"
                >
                  + إضافة درس جديد للمنهج
                </button>
              </div>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              >
                {renderGroupedLessonOptions()}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">عنوان الإنفوجراف:</label>
              <input
                type="text"
                placeholder="مثال: خريطة ذهنية لخطوات إيجاد حاصل الضرب الديكارتي"
                value={infoTitle}
                onChange={(e) => setInfoTitle(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">رابط صورة الإنفوجراف (Image URL):</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={infoImageUrl}
                onChange={(e) => setInfoImageUrl(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">وصف أو نبذة عن الشرح المصور:</label>
              <textarea
                placeholder="توضيح مختصر للنقاط الواردة بالإنفوجراف..."
                value={infoSummary}
                onChange={(e) => setInfoSummary(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>حفظ الإنفوجراف</span>
            </button>
          </form>
        )}

        {/* TAB 4: ADD QUIZ QUESTION */}
        {activeTab === 'quiz' && (
          <form onSubmit={handleAddQuiz} className="notebook-card p-6 space-y-4 shadow-xs border border-slate-200">
            <h2 className="font-bold text-base text-slate-800 font-alexandria flex items-center gap-2 border-b border-rose-100 pb-3">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <span>إضافة سؤال اختيار من متعدد لاختبار الدرس</span>
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 block">الدرس المرتبط:</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('lesson')}
                  className="text-[11px] text-[#e11d48] font-bold underline cursor-pointer hover:text-rose-700"
                >
                  + إضافة درس جديد للمنهج
                </button>
              </div>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              >
                {renderGroupedLessonOptions()}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">نص السؤال:</label>
              <input
                type="text"
                placeholder="مثال: إذا كانت س = {2} ، ص = {3} فإن س × ص تساوي:"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">الخيار 1:</label>
                <input
                  type="text"
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">الخيار 2:</label>
                <input
                  type="text"
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">الخيار 3:</label>
                <input
                  type="text"
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">الخيار 4:</label>
                <input
                  type="text"
                  value={opt4}
                  onChange={(e) => setOpt4(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-emerald-700 mb-1 block">حدد الإجابة الصحيحة:</label>
                <select
                  value={correctIdx}
                  onChange={(e) => setCorrectIdx(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#e11d48]"
                >
                  <option value={0}>الخيار 1 الصحيح</option>
                  <option value={1}>الخيار 2 الصحيح</option>
                  <option value={2}>الخيار 3 الصحيح</option>
                  <option value={3}>الخيار 4 الصحيح</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">شرح وتفسير الإجابة للطلاب:</label>
                <input
                  type="text"
                  placeholder="توضيح الخطوات الحسابية أو القاعدة..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة السؤال للاختبار</span>
            </button>
          </form>
        )}

        {/* TAB 5: ADD TEACHER */}
        {activeTab === 'teacher' && (
          <form onSubmit={handleAddTeacher} className="notebook-card p-6 space-y-4 shadow-xs border border-slate-200">
            <h2 className="font-bold text-base text-slate-800 font-alexandria flex items-center gap-2 border-b border-rose-100 pb-3">
              <Users className="w-5 h-5 text-amber-600" />
              <span>إضافة حساب معلم وتحديد قناته الرسمية</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">اسم المعلم:</label>
                <input
                  type="text"
                  placeholder="أ. أحمد محمد"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">اللقب والتخصص:</label>
                <input
                  type="text"
                  placeholder="خبير مادة الفيزياء والعلوم"
                  value={teacherTitle}
                  onChange={(e) => setTeacherTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">رابط صورة المعلم (Avatar URL):</label>
              <input
                type="text"
                value={teacherAvatar}
                onChange={(e) => setTeacherAvatar(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">رابط قناة YouTube:</label>
              <input
                type="text"
                placeholder="https://youtube.com/@..."
                value={teacherChannel}
                onChange={(e) => setTeacherChannel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">نبذة سريعة عن المعلم:</label>
              <textarea
                value={teacherBio}
                onChange={(e) => setTeacherBio(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#e11d48]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المعلم للقائمة</span>
            </button>
          </form>
        )}

        {/* TAB 6: DATA STATS & RESET */}
        {activeTab === 'manage' && (
          <div className="notebook-card p-6 space-y-6 shadow-xs border border-slate-200">
            <h2 className="font-bold text-base text-slate-800 font-alexandria flex items-center justify-between border-b border-rose-100 pb-3">
              <span>📊 إحصائيات وقاعدة بيانات المنصة</span>
              <button
                onClick={onResetDatabase}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-[#e11d48] border border-rose-200 text-xs font-bold flex items-center gap-2 hover:bg-[#e11d48] hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة ضبط البيانات للأصلية</span>
              </button>
            </h2>

            {/* BACKUP & RESTORE SECTION */}
            <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl border border-slate-700 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-alexandria text-slate-100">النسخ الاحتياطي والاستعادة الفورية (Backup & Restore)</h3>
                    <p className="text-[11px] text-slate-300">احفظ كل منشوراتك ودروسك بملف على جهازك واسترجعها فوراً بلمسة واحدة</p>
                  </div>
                </div>

                {onExportDatabase && (
                  <button
                    onClick={onExportDatabase}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4 stroke-[3]" />
                    <span>تصدير ملف Backup (JSON)</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Export Box */}
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <FileJson className="w-4 h-4" />
                    <span>تصدير وحفظ بياناتك الحاليّة</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    يقوم بتنزيل ملف JSON شامل يحتفظ بكل الوحدات والدروس والفيديوهات والأسئلة والاختبارات التي قمت بإضافتها.
                  </p>
                  <button
                    onClick={onExportDatabase}
                    className="w-full mt-2 py-2.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-600 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>تنزيل ملف النسخة الاحتياطية الآن</span>
                  </button>
                </div>

                {/* Import Box */}
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Upload className="w-4 h-4" />
                    <span>استرجاع البيانات من ملف سابق</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    رفع ملف JSON احتفظت به سابقاً لاستعادة جميع منشوراتك ودروسك فوراً وتطبيقها على المنصة بلمسة واحدة.
                  </p>
                  <label className="w-full mt-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>اختر ملف JSON للاسترجاع</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileRestore}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-[#e11d48] font-mono">{videos.length}</div>
                <div className="text-xs text-slate-600 mt-1 font-bold">فيديوهات مسجلة</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-emerald-600 font-mono">{pdfs.length}</div>
                <div className="text-xs text-slate-600 mt-1 font-bold">كتب ومذكرات PDF</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-blue-600 font-mono">{infographics.length}</div>
                <div className="text-xs text-slate-600 mt-1 font-bold">إنفوجرافات</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-purple-600 font-mono">{quizzes.length}</div>
                <div className="text-xs text-slate-600 mt-1 font-bold">أسئلة اختبارات</div>
              </div>
            </div>

            {/* List of videos with edit & delete buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-800 font-alexandria flex items-center gap-2">
                  <Tv className="w-4 h-4 text-rose-600" />
                  <span>إدارة الفيديوهات المسجلة ({videos.length})</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">يمكنك تغيير الدرس المربوط لأي فيديو في أي وقت</span>
              </div>

              {videos.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">لا توجد فيديوهات مضافة حالياً.</p>
              ) : (
                <div className="space-y-2.5">
                  {videos.map(v => {
                    const linkedLesson = lessons.find(l => l.id === v.lessonId);
                    const linkedUnit = linkedLesson ? units.find(u => u.id === linkedLesson.unitId) : undefined;
                    const linkedSubject = linkedUnit ? subjects.find(s => s.id === linkedUnit.subjectId) : undefined;
                    const linkedGrade = linkedSubject ? grades.find(g => g.id === linkedSubject.gradeId) : undefined;
                    const isEditingThisVideo = editingVideoId === v.id;

                    return (
                      <div key={v.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-800 text-xs">{v.title}</div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span className="bg-rose-50 text-[#e11d48] font-bold px-2 py-0.5 rounded-md border border-rose-100 flex items-center gap-1">
                                <Link2 className="w-3 h-3" />
                                {linkedGrade ? `${linkedGrade.name} • ${linkedSubject?.name}` : 'غير معروف'}
                                <span>←</span>
                                <span className="underline">{linkedLesson?.title || 'غير مربط بدرس'}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setEditingVideoId(isEditingThisVideo ? null : v.id);
                                setTargetLessonForVideo(v.lessonId || (lessons[0]?.id || ''));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer border border-blue-200"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>تعديل الدرس المربوط</span>
                            </button>

                            <button
                              onClick={() => onDeleteVideo(v.id)}
                              title="حذف الفيديو"
                              className="p-1.5 rounded-lg bg-rose-100 text-[#e11d48] hover:bg-[#e11d48] hover:text-white transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline editor to select new lesson */}
                        {isEditingThisVideo && (
                          <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2 pt-3 mt-2 shadow-xs">
                            <label className="block text-xs font-bold text-slate-700">اختر الدرس الجديد المطلوب ربط الفيديو به:</label>
                            <select
                              value={targetLessonForVideo}
                              onChange={(e) => setTargetLessonForVideo(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
                            >
                              {renderGroupedLessonOptions()}
                            </select>

                            <div className="flex items-center gap-2 pt-1 justify-end">
                              <button
                                onClick={() => setEditingVideoId(null)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                              >
                                إلغاء
                              </button>
                              <button
                                onClick={() => {
                                  if (onUpdateVideoLesson && targetLessonForVideo) {
                                    onUpdateVideoLesson(v.id, targetLessonForVideo);
                                    notify('تم تعديل ربط الفيديو بالدرس الجديد بنجاح!');
                                    setEditingVideoId(null);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>حفظ تعديل الربط</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* List of PDFs with delete buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 font-alexandria flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>إدارة كتب ومذكرات PDF ({pdfs.length})</span>
              </h3>
              {pdfs.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">لا توجد كتب أو مذكرات PDF مضافة حالياً.</p>
              ) : (
                <div className="space-y-2">
                  {pdfs.map(pdf => (
                    <div key={pdf.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-md">{pdf.title}</span>
                      <button
                        onClick={() => onDeletePdf(pdf.id)}
                        title="حذف الملف"
                        className="p-1.5 rounded-lg bg-rose-100 text-[#e11d48] hover:bg-[#e11d48] hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List of Infographics with delete buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 font-alexandria flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>إدارة الإنفوجرافات والخرائط الذهنية ({infographics.length})</span>
              </h3>
              {infographics.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">لا توجد إنفوجرافات مضافة حالياً.</p>
              ) : (
                <div className="space-y-2">
                  {infographics.map(info => (
                    <div key={info.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-md">{info.title}</span>
                      <button
                        onClick={() => onDeleteInfographic(info.id)}
                        title="حذف الإنفوجراف"
                        className="p-1.5 rounded-lg bg-rose-100 text-[#e11d48] hover:bg-[#e11d48] hover:text-white transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
