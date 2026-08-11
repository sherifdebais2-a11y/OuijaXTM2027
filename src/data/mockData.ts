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
  QuizQuestion,
  UserProgress
} from '../types';

export const INITIAL_STAGES: EducationalStage[] = [
  {
    id: 'primary',
    name: 'المرحلة الابتدائية',
    description: 'من الصف الأول الابتدائي إلى الصف السادس الابتدائي',
    gradesCount: 6,
    iconName: 'BookOpen',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    gradient: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'preparatory',
    name: 'المرحلة الإعدادية',
    description: 'من الصف الأول الإعدادي إلى الصف الثالث الإعدادي (الشهادة الإعدادية)',
    gradesCount: 3,
    iconName: 'GraduationCap',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    gradient: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'secondary',
    name: 'المرحلة الثانوية',
    description: 'من الصف الأول الثانوي إلى الصف الثالث الثانوي (الظاهرة والثانوية العامة)',
    gradesCount: 3,
    iconName: 'Award',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    gradient: 'from-amber-600 to-orange-800',
  },
];

export const INITIAL_GRADES: Grade[] = [
  // الابتدائية
  { id: 'p1', stageId: 'primary', name: 'الصف الأول الابتدائي', code: 'primary-1', order: 1 },
  { id: 'p2', stageId: 'primary', name: 'الصف الثاني الابتدائي', code: 'primary-2', order: 2 },
  { id: 'p3', stageId: 'primary', name: 'الصف الثالث الابتدائي', code: 'primary-3', order: 3 },
  { id: 'p4', stageId: 'primary', name: 'الصف الرابع الابتدائي', code: 'primary-4', order: 4 },
  { id: 'p5', stageId: 'primary', name: 'الصف الخامس الابتدائي', code: 'primary-5', order: 5 },
  { id: 'p6', stageId: 'primary', name: 'الصف السادس الابتدائي', code: 'primary-6', order: 6 },

  // الإعدادية
  { id: 'm1', stageId: 'preparatory', name: 'الصف الأول الإعدادي', code: 'prep-1', order: 1 },
  { id: 'm2', stageId: 'preparatory', name: 'الصف الثاني الإعدادي', code: 'prep-2', order: 2 },
  { id: 'm3', stageId: 'preparatory', name: 'الصف الثالث الإعدادي (الشهادة الإعدادية)', code: 'prep-3', order: 3 },

  // الثانوية
  { id: 's1', stageId: 'secondary', name: 'الصف الأول الثانوي', code: 'sec-1', order: 1 },
  { id: 's2', stageId: 'secondary', name: 'الصف الثاني الثانوي', code: 'sec-2', order: 2 },
  { id: 's3', stageId: 'secondary', name: 'الصف الثالث الثانوي (الثانوية العامة)', code: 'sec-3', order: 3 },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't_ashry',
    name: 'أ. أحمد العشري',
    title: 'خبير ومُقدم شروحات مادة الرياضيات',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    specialization: 'الرياضيات والجبر والتفاضل',
    subjectNames: ['الرياضيات', 'الجبر والهندسة', 'التفاضل والتكامل'],
    bio: 'مدرس قدير ومتميز في تبسيط المفاهيم الرياضية وحل التدريبات والامتحانات للشهادة الإعدادية والثانوية.',
    youtubeChannelUrl: 'https://youtube.com',
    rating: 4.9,
    totalVideosCount: 142,
    verified: true,
  },
  {
    id: 't_farouk',
    name: 'أ. رضا الفاروق',
    title: 'مُكرم وخبير اللغة العربية للثانوية العامة',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    specialization: 'اللغة العربية والنحو والبلاغة',
    subjectNames: ['اللغة العربية', 'النحو والصرف', 'البلاغة والأدب'],
    bio: 'صاحب طريقة مبتكرة وسلسة في تدريس النحو والبلاغة وأساليب إجابة امتحانات الثانوية العامة.',
    youtubeChannelUrl: 'https://youtube.com',
    rating: 5.0,
    totalVideosCount: 210,
    verified: true,
  },
  {
    id: 't_ayman',
    name: 'د. محمد أيمن',
    title: 'طبيب ومدرس مادة الأحياء والعلوم',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    specialization: 'العلوم والأحياء',
    subjectNames: ['العلوم', 'الأحياء'],
    bio: 'شرح ممتع بالإنفوجرافات والمجسمات لتبسيط مادة الأحياء والعلوم لجميع المراحل.',
    youtubeChannelUrl: 'https://youtube.com',
    rating: 4.8,
    totalVideosCount: 98,
    verified: true,
  },
  {
    id: 't_english',
    name: 'مستر شريف المنسي',
    title: 'خبير تدريس اللغة الإنجليزية والجرامر',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    specialization: 'اللغة الإنجليزية والقواعد',
    subjectNames: ['اللغة الإنجليزية', 'English'],
    bio: 'متخصص في تبسيط قواعد الجرامر، وحفظ الكلمات بأساليب التذكر الحديثة للمرحلتين الإعدادية والثانوية.',
    youtubeChannelUrl: 'https://youtube.com',
    rating: 4.9,
    totalVideosCount: 85,
    verified: true,
  },
  {
    id: 't_physics',
    name: 'مستر محمود مجدي',
    title: 'استشاري وخبير مادة الفيزياء',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    specialization: 'الفيزياء',
    subjectNames: ['الفيزياء', 'العلوم'],
    bio: 'تبسيط التجريب العملي وحل مسارات المسائل الفيزيائية والتطبيقات الحسابية بكفاءة عالية.',
    youtubeChannelUrl: 'https://youtube.com',
    rating: 4.9,
    totalVideosCount: 115,
    verified: true,
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  // ==================== المرحلة الابتدائية ====================
  // p1: الصف الأول الابتدائي
  { id: 'sub_p1_arabic', gradeId: 'p1', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'تأسيس الحروف والقراءة والكتابة' },
  { id: 'sub_p1_english', gradeId: 'p1', name: 'اللغة الإنجليزية (Connect 1)', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'المفردات الأساسية والمحادثات البسيطة' },
  { id: 'sub_p1_math', gradeId: 'p1', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'الأعداد من 1 إلى 100 والجمع والطرح' },
  { id: 'sub_p1_discover', gradeId: 'p1', name: 'اكتشف (Discover)', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'من أكون والبيئة الموحدة حولنا' },
  { id: 'sub_p1_religion', gradeId: 'p1', name: 'التربية الدينية الإسلامية', icon: 'BookOpen', color: 'from-teal-600 to-emerald-700', description: 'أركان الإسلام والسلوكيات الحميدة' },

  // p2: الصف الثاني الابتدائي
  { id: 'sub_p2_arabic', gradeId: 'p2', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'القرائية والنصوص والأساليب والتركيب' },
  { id: 'sub_p2_english', gradeId: 'p2', name: 'اللغة الإنجليزية (Connect 2)', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'توسيع القراءة والقواعد الأساسية' },
  { id: 'sub_p2_math', gradeId: 'p2', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'القيمة المكانية والجمع والطرح بالتعويض' },
  { id: 'sub_p2_discover', gradeId: 'p2', name: 'اكتشف (Discover)', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'الاعتناء بالذات وبناء المهارات' },

  // p3: الصف الثالث الابتدائي
  { id: 'sub_p3_arabic', gradeId: 'p3', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'القصص والنصوص وتنمية القراءة' },
  { id: 'sub_p3_english', gradeId: 'p3', name: 'اللغة الإنجليزية (Connect 3)', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'تطوير جمل المراسلة وتدريبات النطق' },
  { id: 'sub_p3_math', gradeId: 'p3', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'جدول الضرب والمساحة والأشكال الهندسية' },
  { id: 'sub_p3_discover', gradeId: 'p3', name: 'اكتشف (Discover)', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'الحياة الصحية والتواصل المجتمعي' },

  // p4: الصف الرابع الابتدائي
  { id: 'sub_p4_arabic', gradeId: 'p4', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'النحو المطوّر والنصوص والاستماع' },
  { id: 'sub_p4_english', gradeId: 'p4', name: 'اللغة الإنجليزية (Connect 4)', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'الكتابة الإبداعية واستكشاف المفردات' },
  { id: 'sub_p4_math', gradeId: 'p4', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'الأعداد الكبيرة والكسور العشرية' },
  { id: 'sub_p4_science', gradeId: 'p4', name: 'العلوم', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'التكيف والبقاء وتغيرات الطاقة' },
  { id: 'sub_p4_studies', gradeId: 'p4', name: 'الدراسات الاجتماعية', icon: 'Globe', color: 'from-orange-500 to-amber-600', description: 'موقع مصر والمعالم السياحية والتاريخية' },
  { id: 'sub_p4_ict', gradeId: 'p4', name: 'تكنولوجيا المعلومات ICT', icon: 'Binary', color: 'from-cyan-500 to-blue-600', description: 'أدوات الاتصال والأمان الرقمي' },
  { id: 'sub_p4_skills', gradeId: 'p4', name: 'المهارات المهنية', icon: 'Zap', color: 'from-pink-500 to-rose-600', description: 'المهن الحرفية والرعاية الذاتية' },

  // p5: الصف الخامس الابتدائي
  { id: 'sub_p5_arabic', gradeId: 'p5', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'القواعد النحوية الشاملة والذوق الأدبي' },
  { id: 'sub_p5_english', gradeId: 'p5', name: 'اللغة الإنجليزية (Connect 5)', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'قواعد الجرامر والتعبيرات اللغوية' },
  { id: 'sub_p5_math', gradeId: 'p5', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'ضرب وقسمة الكسور والهندسة الفضائية' },
  { id: 'sub_p5_science', gradeId: 'p5', name: 'العلوم', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'احتياجات النبات والأنظمة البيئية' },
  { id: 'sub_p5_studies', gradeId: 'p5', name: 'الدراسات الاجتماعية', icon: 'Globe', color: 'from-orange-500 to-amber-600', description: 'الموارد المائية والاقتصادية في مصر' },

  // p6: الصف السادس الابتدائي
  { id: 'sub_p6_arabic', gradeId: 'p6', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'تحليل النصوص والنحو والقواعد المتقدمة' },
  { id: 'sub_p6_english', gradeId: 'p6', name: 'اللغة الإنجليزية (Connect 6)', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'المستويات الإعدادية والمهارات المقالية' },
  { id: 'sub_p6_math', gradeId: 'p6', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'النسبة والتناسب والأعداد الصحيحة' },
  { id: 'sub_p6_science', gradeId: 'p6', name: 'العلوم', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'الكتلة والوزن وروافع الجهد' },
  { id: 'sub_p6_studies', gradeId: 'p6', name: 'الدراسات الاجتماعية', icon: 'Globe', color: 'from-orange-500 to-amber-600', description: 'البيئات المصرية الزراعية والصناعية' },

  // ==================== المرحلة الإعدادية ====================
  // m1: الصف الأول الإعدادي (المنهج المطور الجديد)
  { id: 'sub_m1_arabic', gradeId: 'm1', name: 'اللغة العربية والخط العربي', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'نصوص وقراءة ونحو وفق المنهج المطور الجديد' },
  { id: 'sub_m1_english', gradeId: 'm1', name: 'اللغة الإنجليزية (English)', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'قواعد الجرامر والتعبير والمحادثة المتقدمة' },
  { id: 'sub_m1_math', gradeId: 'm1', name: 'الرياضيات (الجبر والهندسة)', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'الأعداد النسبية، الجبر، والهندسة والقياس' },
  { id: 'sub_m1_science', gradeId: 'm1', name: 'العلوم (الكيمياء والفيزياء والأحياء)', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'المادة والطاقة والتركيب الذري والتنوع الحيوى' },
  { id: 'sub_m1_studies', gradeId: 'm1', name: 'الدراسات الاجتماعية', icon: 'Globe', color: 'from-orange-500 to-amber-600', description: 'الجغرافيا المناخية والتاريخ الحضاري' },
  { id: 'sub_m1_ict', gradeId: 'm1', name: 'الحاسب الآلي وتكنولوجيا المعلومات', icon: 'Binary', color: 'from-cyan-500 to-blue-600', description: 'أساسيات البرمجة والأنظمة الرقمية' },
  { id: 'sub_m1_french', gradeId: 'm1', name: 'اللغة الفرنسية (اللغة الثانية)', icon: 'Languages', color: 'from-pink-500 to-rose-600', description: 'القواعد والتواصل البسيط بالفرنسية' },
  { id: 'sub_m1_religion', gradeId: 'm1', name: 'التربية الدينية الإسلامية', icon: 'BookOpen', color: 'from-teal-600 to-emerald-700', description: 'السيرة النبوية والقرآن الكريم والفقه' },

  // m2: الصف الثاني الإعدادي
  { id: 'sub_m2_arabic', gradeId: 'm2', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'الإعراب، النصوص الأدبية والقصة' },
  { id: 'sub_m2_english', gradeId: 'm2', name: 'اللغة الإنجليزية', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'القواعد اللغوية والتراكيب المقالية' },
  { id: 'sub_m2_math', gradeId: 'm2', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'الجذور التكعيبية والمثلث المتساوي الساقين' },
  { id: 'sub_m2_science', gradeId: 'm2', name: 'العلوم', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'محاولات تصنيف العناصر وطبقات الغلاف الجوي' },
  { id: 'sub_m2_studies', gradeId: 'm2', name: 'الدراسات الاجتماعية', icon: 'Globe', color: 'from-orange-500 to-amber-600', description: 'جغرافيا الوطن العربي وتاريخ الدولة الإسلامية' },

  // m3: الصف الثالث الإعدادي (الشهادة الإعدادية)
  { id: 'sub_m3_math', gradeId: 'm3', name: 'الرياضيات', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'الجبر والإحصاء وهندسة وحساب المثلثات' },
  { id: 'sub_m3_arabic', gradeId: 'm3', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-amber-500 to-rose-600', description: 'النحو، النصوص، القراءة، والقصة' },
  { id: 'sub_m3_science', gradeId: 'm3', name: 'العلوم', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'الكيمياء، الفيزياء، الأحياء والفلك' },
  { id: 'sub_m3_studies', gradeId: 'm3', name: 'الدراسات الاجتماعية', icon: 'Globe', color: 'from-orange-500 to-amber-600', description: 'الجغرافيا والتاريخ' },
  { id: 'sub_m3_english', gradeId: 'm3', name: 'اللغة الإنجليزية', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'المفردات، الجرامر والمحادثة' },
  { id: 'sub_m3_ict', gradeId: 'm3', name: 'الحاسب الآلي والبرمجة', icon: 'Binary', color: 'from-cyan-500 to-blue-600', description: 'خرائط التدفق ولغة ف Visual Basic' },

  // ==================== المرحلة الثانوية ====================
  // s1: الصف الأول الثانوي
  { id: 'sub_s1_arabic', gradeId: 's1', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-rose-500 to-red-600', description: 'البلاغة والأدب والنحو التراكمي' },
  { id: 'sub_s1_english', gradeId: 's1', name: 'اللغة الإنجليزية', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'القواعد والقصة العالمية والترجمة' },
  { id: 'sub_s1_french', gradeId: 's1', name: 'اللغة الأجنبية الثانية (الفرنسية)', icon: 'Languages', color: 'from-pink-500 to-rose-600', description: 'المحادثات والتراكيب الفرنسية' },
  { id: 'sub_s1_math', gradeId: 's1', name: 'الرياضيات العامة', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'الجبر وحساب المثلثات والهندسة التحليلية' },
  { id: 'sub_s1_science', gradeId: 's1', name: 'العلوم المتكاملة / الفيزياء والكيمياء', icon: 'Atom', color: 'from-emerald-500 to-teal-600', description: 'المفاهيم الفيزيائية والكيميائية المدمجة' },
  { id: 'sub_s1_history', gradeId: 's1', name: 'التاريخ', icon: 'Globe', color: 'from-amber-500 to-orange-600', description: 'حضارة مصر القديمة والحضارات المجاورة' },
  { id: 'sub_s1_geography', gradeId: 's1', name: 'الجغرافيا', icon: 'Globe', color: 'from-teal-500 to-cyan-600', description: 'جغرافيا مصر الطبيعية والسكانية' },
  { id: 'sub_s1_philosophy', gradeId: 's1', name: 'مبادئ التفكير الفلسفي والعلمي', icon: 'BookOpen', color: 'from-indigo-500 to-purple-600', description: 'خصائص التفكير العلمي والتفكير الناقد' },

  // s2: الصف الثاني الثانوي
  { id: 'sub_s2_arabic', gradeId: 's2', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-rose-500 to-red-600', description: 'الأدب العباسي والنحو المتقدم' },
  { id: 'sub_s2_english', gradeId: 's2', name: 'اللغة الإنجليزية', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'مهارات الترجمة واللغة التخصصية' },
  { id: 'sub_s2_math', gradeId: 's2', name: 'الرياضيات البحتاً والتطبيقية', icon: 'Calculator', color: 'from-blue-500 to-indigo-600', description: 'الجبر والتفاضل وحساب المثلثات والميكانيكا' },
  { id: 'sub_s2_physics', gradeId: 's2', name: 'الفيزياء', icon: 'Zap', color: 'from-cyan-500 to-blue-600', description: 'الموجات والضوء والخواص الميكانيكية للسوائل' },
  { id: 'sub_s2_chemistry', gradeId: 's2', name: 'الكيمياء', icon: 'FlaskConical', color: 'from-teal-500 to-emerald-600', description: 'البنية الذرية والروابط الكيميائية' },
  { id: 'sub_s2_biology', gradeId: 's2', name: 'الأحياء', icon: 'Dna', color: 'from-emerald-500 to-green-600', description: 'التغذية والنقل والتنفس في الكائنات' },

  // s3: الصف الثالث الثانوي (الثانوية العامة)
  { id: 'sub_s3_arabic', gradeId: 's3', name: 'اللغة العربية', icon: 'BookMarked', color: 'from-rose-500 to-red-600', description: 'شامل المنهج: نحو، بلاغة، أدب، وقراءة' },
  { id: 'sub_s3_physics', gradeId: 's3', name: 'الفيزياء', icon: 'Zap', color: 'from-cyan-500 to-blue-600', description: 'الكهربية، المغناطيسية، والفيزياء الحديثة' },
  { id: 'sub_s3_chemistry', gradeId: 's3', name: 'الكيمياء', icon: 'FlaskConical', color: 'from-teal-500 to-emerald-600', description: 'الكيمياء غير العضوية والكيمياء العضوية' },
  { id: 'sub_s3_biology', gradeId: 's3', name: 'الأحياء', icon: 'Dna', color: 'from-emerald-500 to-green-600', description: 'الدعامة والحركة والتكاثر والبيولوجيا الجزيئية' },
  { id: 'sub_s3_math', gradeId: 's3', name: 'الرياضيات المحتوتة والتطبيقية', icon: 'Binary', color: 'from-blue-600 to-indigo-700', description: 'التفاضل، التكامل، الجبر والهندسة الفراغية والديناميكا' },
  { id: 'sub_s3_english', gradeId: 's3', name: 'اللغة الإنجليزية', icon: 'Languages', color: 'from-purple-500 to-violet-600', description: 'الترجمة المتقدمة والقصة وقواعد اللغة الشاملة' },
  { id: 'sub_s3_geology', gradeId: 's3', name: 'الجيولوجيا وعلوم البيئة', icon: 'Globe', color: 'from-amber-600 to-orange-700', description: 'مكونات الأرض والتراكيب الجيولوجية والتوازن البيئي' },
];

export const INITIAL_UNITS: Unit[] = [
  // ==================== وحدات الصف الأول الإعدادي (m1) المنهج الجديد ====================
  // رياضيات الأول الإعدادي
  { id: 'u_m1_m1', subjectId: 'sub_m1_math', title: 'الوحدة الأولى: الأعداد النسبية والعمليات عليها', orderNumber: 1 },
  { id: 'u_m1_m2', subjectId: 'sub_m1_math', title: 'الوحدة الثانية: الجبر والحدود والمقادير الجبرية', orderNumber: 2 },
  { id: 'u_m1_m3', subjectId: 'sub_m1_math', title: 'الوحدة الثالثة: الهندسة والقياس والتطابق', orderNumber: 3 },
  { id: 'u_m1_m4', subjectId: 'sub_m1_math', title: 'الوحدة الرابعة: الإحصاء وعرض البيانات والاحتمال', orderNumber: 4 },

  // عربي الأول الإعدادي
  { id: 'u_m1_a1', subjectId: 'sub_m1_arabic', title: 'الوحدة الأولى: قيم وأخلاق إنسانية (نصوص وقراءة)', orderNumber: 1 },
  { id: 'u_m1_a2', subjectId: 'sub_m1_arabic', title: 'الوحدة الثانية: القواعد النحوية (همزة القطع وألف الوصل وأنواع الخبر)', orderNumber: 2 },

  // علوم الأول الإعدادي
  { id: 'u_m1_s1', subjectId: 'sub_m1_science', title: 'الوحدة الأولى: المادة وتركيبها وتفاعلاتها', orderNumber: 1 },
  { id: 'u_m1_s2', subjectId: 'sub_m1_science', title: 'الوحدة الثانية: الطاقة وصورها وتحولاتها', orderNumber: 2 },

  // دراسات الأول الإعدادي
  { id: 'u_m1_st1', subjectId: 'sub_m1_studies', title: 'الوحدة الأولى: رحلة عبر الفضاء والمجموعة الشمسية', orderNumber: 1 },
  { id: 'u_m1_st2', subjectId: 'sub_m1_studies', title: 'الوحدة الثانية: تاريخ مصر القديم وحضارتها الفرعونية', orderNumber: 2 },

  // إنجليزي الأول الإعدادي
  { id: 'u_m1_e1', subjectId: 'sub_m1_english', title: 'Unit 1: My Family and Me', orderNumber: 1 },
  { id: 'u_m1_e2', subjectId: 'sub_m1_english', title: 'Unit 2: It is my favorite subject', orderNumber: 2 },

  // ==================== وحدات الصفوف الأخرى ====================
  // رياضيات الثالث الإعدادي (m3)
  { id: 'u_m3_m1', subjectId: 'sub_m3_math', title: 'الوحدة الأولى: العلاقات والدوال', orderNumber: 1 },
  { id: 'u_m3_m2', subjectId: 'sub_m3_math', title: 'الوحدة الثانية: النسبة والتناسب والتغير', orderNumber: 2 },
  { id: 'u_m3_m3', subjectId: 'sub_m3_math', title: 'الوحدة الثالثة: حساب المثلثات وهندسة إحداثية', orderNumber: 3 },

  // عربي الثالث الإعدادي
  { id: 'u_m3_a1', subjectId: 'sub_m3_arabic', title: 'الوحدة الأولى: عباد الرحمن والقراءة', orderNumber: 1 },
  { id: 'u_m3_a2', subjectId: 'sub_m3_arabic', title: 'الوحدة الثانية: قواعد النحو (النداء، البدل، الممنوع من الصرف)', orderNumber: 2 },

  // علوم الثالث الإعدادي
  { id: 'u_m3_s1', subjectId: 'sub_m3_science', title: 'الوحدة الأولى: القوة والحركة', orderNumber: 1 },

  // عربي ثانوية عامة (s3)
  { id: 'u_s3_a1', subjectId: 'sub_s3_arabic', title: 'الوحدة الأولى: الإعرب والنحو الشامل', orderNumber: 1 },

  // فيزياء ثانوية عامة (s3)
  { id: 'u_s3_p1', subjectId: 'sub_s3_physics', title: 'الوحدة الأولى: التيار الكهربي وقانون أوم وقوانين كيرشوف', orderNumber: 1 },

  // رياضيات الرابع الابتدائي (p4)
  { id: 'u_p4_m1', subjectId: 'sub_p4_math', title: 'الوحدة الأولى: القيمة المكانية والأعداد الكبيرة', orderNumber: 1 },
  // علوم الرابع الابتدائي
  { id: 'u_p4_s1', subjectId: 'sub_p4_science', title: 'الوحدة الأولى: الأجهزة والتكيف والبقاء', orderNumber: 1 },
];

export const INITIAL_LESSONS: Lesson[] = [
  // ==================== دروس الصف الأول الإعدادي (m1) ====================
  // رياضيات أولي إعدادي
  {
    id: 'les_m1_m1_l1',
    unitId: 'u_m1_m1',
    title: 'الدرس الأول: مجموعة الأعداد النسبية (ن) وترتيبها ومقارنتها',
    description: 'تعريف العدد النسبي صورة أ/ب حيث ب ≠ 0، تمثيل الأعداد النسبية على خط الأعداد ومقارنة عددين نسبين.',
    orderNumber: 1,
    durationMinutes: 35,
    summaryText: 'العدد النسبي هو كل عدد يمكن وضعه على صورة أ/ب حيث أ، ب أعداد صحيحة وب لا تساوي صفر.',
    keyPoints: [
      'شروط العدد النسبي: المقام ب ≠ 0',
      'تمثيل الأعداد النسبية على خط الأعداد',
      'المقارنة بين عددين نسبين موجَب وسالب',
      'كثافة الأعداد النسبية بين أي عددين'
    ]
  },
  {
    id: 'les_m1_m1_l2',
    unitId: 'u_m1_m1',
    title: 'الدرس الثاني: جمع وطرح الأعداد النسبية وخواص الجمع',
    description: 'طريقة توحيد المقامات لجمع وطرح الأعداد النسبية، وخاصية الإغلاق والتجميع والمحايد الجمعي والمعكوس الجمعي.',
    orderNumber: 2,
    durationMinutes: 40,
    summaryText: 'لجمع عددين نسبين مقامهما موحد نجمع البسطين، ولتغيير المقامات نوجد م.م.أ المقامات.',
    keyPoints: [
      'خواص عملية الجمع: الإغلاق، الإبدال، الدمج',
      'المحايد الجمعي هو الصفر',
      'المعكوس الجمعي للعدد أ/ب هو -أ/ب'
    ]
  },
  {
    id: 'les_m1_m2_l1',
    unitId: 'u_m1_m2',
    title: 'الدرس الأول: الحدود الجبرية والمقادير الجبرية ودرجتها',
    description: 'مفهوم الحد الجبري ومعامله ودرجته، والفرق بين الحد الجبري والمقدار الجبري وكيفية الترتيب.',
    orderNumber: 1,
    durationMinutes: 30,
    summaryText: 'الحد الجبري يتكون من حاصل ضرب عوامل، ودرجته هي مجموع أسس رموزه.',
    keyPoints: [
      'تعريف معامل الحد الجبري ودرجته',
      'المقدار الجبري يتكون من حدين أو أكثر',
      'طريقة ترتيب المقدار الجبري تنازلياً أو تصاعدياً'
    ]
  },
  {
    id: 'les_m1_a1_l1',
    unitId: 'u_m1_a1',
    title: 'الدرس الأول: نص الحرية (مصطفى لطفى المنفلوطي)',
    description: 'قصة الكاتب مع الهرة ومفهوم الحرية وأهميتها في حياة الإنسان والكائنات الحية.',
    orderNumber: 1,
    durationMinutes: 30,
    summaryText: 'الحرية شمس يجب أن تشرق في كل نفس، ومن عاش محرروماً منها عاش في ظلام دامس.',
    keyPoints: [
      'أهمية الحرية للكائنات الحية قاطبة',
      'المقارنة بين طالب الحرية والشحاذ',
      'المفردات الجديدة واللغويات والجماليات'
    ]
  },
  {
    id: 'les_m1_a2_l1',
    unitId: 'u_m1_a2',
    title: 'الدرس الأول: همزة القطع وألف الوصل',
    description: 'مواضع كتابة همزة القطع (أ، إ) وألف الوصل (ا) في الأفعال والأسماء والحروف بأسلوب مبسط.',
    orderNumber: 1,
    durationMinutes: 25,
    summaryText: 'همزة القطع تنطق وتكتب دائماً، بينما ألف الوصل تنطق في أول الكلام وتسقط في وسطه.',
    keyPoints: [
      'طريقة اختبار الواو أو الفاء قبل الكلمة (وَاكتب، وَأحمد)',
      'مواضع ألف الوصل في الأسماء التسعة والتعريف بالألف واللام',
      'مواضع همزة القطع في الماضي الثلاثي والرباعي ومصادرهما'
    ]
  },
  {
    id: 'les_m1_s1_l1',
    unitId: 'u_m1_s1',
    title: 'الدرس الأول: المادة وخواصها الفيزيائية والكيميائية',
    description: 'تعريف المادة وكل ما له كتلة وحجم، والخواص الفيزيائية مثل الكثافة، درجة الانصهار، التوصيل الكهربي والحراري.',
    orderNumber: 1,
    durationMinutes: 45,
    summaryText: 'الكثافة = الكتلة ÷ الحجم. المواد أقل كثافة من الماء تطفو، وأعلى كثافة تغوص.',
    keyPoints: [
      'قانون الكثافة ث = ك / ح وتطبيقاتها الحسابية',
      'الفرق بين الموصلات الجيدة والرديئة للكهرباء والحرارة',
      'درجة الانصهار ودرجة الغليان والنشاط الكيميائي'
    ]
  },
  {
    id: 'les_m1_s1_l2',
    unitId: 'u_m1_s1',
    title: 'الدرس الثاني: تركيب الذرة والتركيب الذري للمادة',
    description: 'تركيب ذرة العنصر (النواة، البروتونات، النيوترونات، والإلكترونات) والعدد الذري وعدد الكتلة والتوزيع الإلكتروني.',
    orderNumber: 2,
    durationMinutes: 50,
    summaryText: 'الذرة متثاقلة في النواة ومتعادلة كهربائياً، تدور حولها الإلكترونات في مستويات الطاقة.',
    keyPoints: [
      'مكونات النواة: البروتونات (+) والنيوترونات (المتعادلة)',
      'العدد الذري = عدد البروتونات = عدد الإلكترونات',
      'قواعد التوزيع الإلكتروني في مستويات الطاقة (K, L, M, N)',
      'تطبيقات عمل الذرة والرموز الكيميائية'
    ]
  },
  {
    id: 'les_m1_s1_l3',
    unitId: 'u_m1_s1',
    title: 'الدرس الثالث: التفاعلات الكيميائية والرموز',
    description: 'الصيغ الكيميائية والتكافؤ والمجموعات الذرية وكيفية كتابة وتوازن المعادلة الكيميائية.',
    orderNumber: 3,
    durationMinutes: 40,
    summaryText: 'التفاعل الكيميائي هو كسر روابط وتكوين روابط جديدة، والمجموعات الذرية تسلك مسلك الذرة الواحدة.',
    keyPoints: [
      'مفهوم التكافؤ والمجموعات الذرية الأحادية والثنائية',
      'خطوات كتابة الصيغة الكيميائية للمركبات',
      'قانون بقاء المادة ووزن المعادلة الكيميائية'
    ]
  },

  // ==================== دروس المرحلة الإعدادية والثانوية الأخرى ====================
  {
    id: 'les_m3_m1_l1',
    unitId: 'u_m3_m1',
    title: 'الدرس الأول: حاصل الضرب الديكارتي',
    description: 'تعريف الزوج المرتب ومساواة زوجين مرتبين، وحاصل الضرب الديكارتي لمجموعتين منتهيتين مع التمثيل بمخطط سهمي وبياني.',
    orderNumber: 1,
    durationMinutes: 42,
    summaryText: 'الزوج المرتب (أ ، ب) يختلف عن المجموعات، وفي الضرب الديكارتي س × ص نحصل على أزواج مرتبة مسقطها الأول من س والثاني من ص.',
    keyPoints: [
      'تساوي زوجين مرتبين: (أ، ب) = (س، ص) تعني أن أ = س و ب = ص',
      'حاصل الضرب الديكارتي س × ص هو مجموعة الأزواج المرتبة',
      'التمثيل بمخطط سهمي ومخطط بياني (ديكارتي)',
      'خواص حاصل الضرب الديكارتي والمجموعات غير المنتهية'
    ]
  },
  {
    id: 'les_m3_m1_l2',
    unitId: 'u_m3_m1',
    title: 'الدرس الثاني: العلاقات والمجال والمدى',
    description: 'مفهوم العلاقة بين مجموعتين، بيان العلاقة، تحديد متى تكون العلاقة دالة (تطبيق) والمجال والمدى.',
    orderNumber: 2,
    durationMinutes: 38,
    summaryText: 'تكون العلاقة دالة إذا خرج من كل عنصر من س سهم واحد فقط في المخطط السهمي، والمدى هو صور عناصر المجال.',
    keyPoints: [
      'تعريف العلاقة من مجموعة س إلى مجموعة ص',
      'شرط الدالة: كل عنصر في س يظهر كمسقط أول مرة واحدة فقط',
      'تعريف المجال والمجال المقابل والمدى',
      'تطبيقات محلولة وحل المسائل الصعبة'
    ]
  },
  {
    id: 'les_m3_a1_l1',
    unitId: 'u_m3_a1',
    title: 'الدرس الأول: نص عباد الرحمن (سورة الفرقان)',
    description: 'دراسة وتفسير آيات عباد الرحمن من سورة الفرقان ومظاهر الجمال والإعراب النحوي لأهم الكلمات.',
    orderNumber: 1,
    durationMinutes: 30,
    summaryText: 'يتناول النص صفات عباد الرحمن: التواضع، الحلم، التجهد ليلاً، الخوف من عذاب جهنم، والاعتدال في الإنفاق.',
    keyPoints: [
      'صفة التواضع والحلم عند التعامل مع الجاهلين',
      'القيام والاطمئنان بالصلاة واللجوء إلى الله',
      'الإنفاق القويم دون إسراف ولا تقتير',
      'مظاهر الجمال وأساليب الأمر والنهي والتأكيد'
    ]
  },
  {
    id: 'les_m3_s1_l1',
    unitId: 'u_m3_s1',
    title: 'الدرس الأول: الحركة في اتجاه واحد والسرعة',
    description: 'مفهوم الحركة والمفهوم الفيزيائي للسرعة وأنواعها (منتظمة وغير منتظمة) والسرعة المتوسطة والنسبية.',
    orderNumber: 1,
    durationMinutes: 45,
    summaryText: 'السرعة = المسافة ÷ الزمن. السرعة المنتظمة يقطع فيها الجسم مسافات متساوية في أزمنة متساوية.',
    keyPoints: [
      'قانون السرعة ع = ف / ز وحدات القياس (م/ث أو كم/س)',
      'الفرق بين السرعة المنتظمة والسرعة غير المنتظمة',
      'حساب السرعة المتوسطة = الكلية ف / الكلي ز',
      'السرعة النسبية بالنسبة للمراقب'
    ]
  },
  {
    id: 'les_s3_p1_l1',
    unitId: 'u_s3_p1',
    title: 'الدرس الأول: التيار الكهربي وقانون أوم والمقاومة النوعية',
    description: 'شدة التيار الكهربي، فرق الجهد، المقاومة الكهربية، وقانون أوم والتوصيل على التوالي والتوازي.',
    orderNumber: 1,
    durationMinutes: 55,
    summaryText: 'قانون أوم V = I * R. المقاومة تتوقف على نوع المادة R = ρe * L / A.',
    keyPoints: [
      'مفهوم شدة التيار I = Q / t وفروق الجهد V = W / Q',
      'العوامل المؤثرة على المقاومة الكهربية وطاقة التوصيل',
      'المقاومة النوعية والتوصيلية الكهربية',
      'حساب المقاومة المكافئة للتوالي والتوازي'
    ]
  }
];

export const INITIAL_VIDEOS: VideoResource[] = [
  {
    id: 'vid_m1_s1_l2_1',
    lessonId: 'les_m1_s1_l2',
    teacherId: 't_m_ibrahim',
    title: 'تركيب الذرة | الدرس الاول علوم الصف الاول الاعدادي 2027 شرح المنهج الجديد كامل',
    youtubeVideoId: 'fA-Wb_0494U',
    duration: '25:00',
    viewsCount: 14200,
    createdAt: '2026-08-10',
    isFeatured: true,
    levelTag: 'شرح كامل',
  },
  {
    id: 'vid_m1_s1_l2_2',
    lessonId: 'les_m1_s1_l2',
    teacherId: 't_m_ibrahim',
    title: 'الدرس الأول _ تركيب الذرة _ الصف الأول الإعدادي',
    youtubeVideoId: 'fA-Wb_0494U',
    duration: '22:15',
    viewsCount: 9800,
    createdAt: '2026-08-09',
    isFeatured: true,
    levelTag: 'شرح مبسط',
  },
  {
    id: 'vid_m1_s1_l1_1',
    lessonId: 'les_m1_s1_l1',
    teacherId: 't_m_ibrahim',
    title: 'الدرس الأول: المادة وخواصها الفيزيائية والكيميائية - علوم أولي إعدادي',
    youtubeVideoId: 'fA-Wb_0494U',
    duration: '28:30',
    viewsCount: 18500,
    createdAt: '2026-08-08',
    isFeatured: true,
    levelTag: 'شرح كامل',
  }
];

export const INITIAL_PDFS: PdfResource[] = [];

export const INITIAL_INFOGRAPHICS: InfographicResource[] = [];

export const INITIAL_QUIZZES: QuizQuestion[] = [];

// LocalStorage helpers for persistence & state management
const STORAGE_KEY = 'madrasaty_platform_db_v3';

export interface DatabaseStore {
  stages: EducationalStage[];
  grades: Grade[];
  teachers: Teacher[];
  subjects: Subject[];
  units: Unit[];
  lessons: Lesson[];
  videos: VideoResource[];
  pdfs: PdfResource[];
  infographics: InfographicResource[];
  quizzes: QuizQuestion[];
  userProgress: UserProgress;
}

// Repair helper to fix video lesson IDs if mismatch occurs
const repairVideoLessonAssociations = (vids: VideoResource[], currentLessons: Lesson[]): VideoResource[] => {
  return vids.map(vid => {
    const titleLower = vid.title.toLowerCase();
    
    // Check if video is Science Atom composition
    if (titleLower.includes('تركيب الذرة') || titleLower.includes('الذرة')) {
      const atomLesson = currentLessons.find(l => l.id === 'les_m1_s1_l2' || l.title.includes('تركيب الذرة'));
      if (atomLesson && vid.lessonId !== atomLesson.id) {
        return { ...vid, lessonId: atomLesson.id };
      }
    }
    
    // Check if video is Science Matter properties
    if (titleLower.includes('المادة وخواصها') || titleLower.includes('الكثافة')) {
      const matterLesson = currentLessons.find(l => l.id === 'les_m1_s1_l1');
      if (matterLesson && vid.lessonId !== matterLesson.id) {
        return { ...vid, lessonId: matterLesson.id };
      }
    }

    return vid;
  });
};

export const loadStoredData = (): DatabaseStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      
      // Ensure missing initial lessons exist
      const loadedLessons = parsed.lessons || INITIAL_LESSONS;
      const mergedLessons = [...loadedLessons];
      INITIAL_LESSONS.forEach(initL => {
        if (!mergedLessons.some(l => l.id === initL.id)) {
          mergedLessons.push(initL);
        }
      });

      // Repair video links if needed
      const rawVideos = (parsed.videos && parsed.videos.length > 0) ? parsed.videos : INITIAL_VIDEOS;
      const repairedVideos = repairVideoLessonAssociations(rawVideos, mergedLessons);

      return {
        stages: parsed.stages || INITIAL_STAGES,
        grades: parsed.grades || INITIAL_GRADES,
        teachers: parsed.teachers || INITIAL_TEACHERS,
        subjects: parsed.subjects || INITIAL_SUBJECTS,
        units: parsed.units || INITIAL_UNITS,
        lessons: mergedLessons,
        videos: repairedVideos,
        pdfs: parsed.pdfs || INITIAL_PDFS,
        infographics: parsed.infographics || INITIAL_INFOGRAPHICS,
        quizzes: parsed.quizzes || INITIAL_QUIZZES,
        userProgress: parsed.userProgress || {
          bookmarkedLessonIds: ['les_m3_m1_l1'],
          completedLessonIds: [],
          watchHistory: [],
          quizScores: {},
        },
      };
    }
  } catch (err) {
    console.error('Error reading localStorage, using initial seed data:', err);
  }

  return {
    stages: INITIAL_STAGES,
    grades: INITIAL_GRADES,
    teachers: INITIAL_TEACHERS,
    subjects: INITIAL_SUBJECTS,
    units: INITIAL_UNITS,
    lessons: INITIAL_LESSONS,
    videos: INITIAL_VIDEOS,
    pdfs: INITIAL_PDFS,
    infographics: INITIAL_INFOGRAPHICS,
    quizzes: INITIAL_QUIZZES,
    userProgress: {
      bookmarkedLessonIds: ['les_m3_m1_l1'],
      completedLessonIds: [],
      watchHistory: [],
      quizScores: {},
    },
  };
};

export const saveDataToStorage = (store: DatabaseStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Failed to save store to localStorage:', err);
  }
};
