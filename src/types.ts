export type StageId = 'primary' | 'preparatory' | 'secondary';

export interface EducationalStage {
  id: StageId;
  name: string;
  description: string;
  gradesCount: number;
  iconName: string;
  badgeColor: string;
  gradient: string;
}

export interface Grade {
  id: string;
  stageId: StageId;
  name: string;
  code: string; // e.g. 'primary-1', 'prep-3', 'sec-3'
  order: number;
  description?: string;
}

export interface Subject {
  id: string;
  gradeId: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  title: string;
  orderNumber: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  orderNumber: number;
  durationMinutes?: number;
  summaryText?: string;
  keyPoints?: string[];
}

export interface Teacher {
  id: string;
  name: string;
  title: string; // e.g. "خبير مادة الرياضيات - 15 سنة خبرة"
  avatarUrl: string;
  specialization: string;
  subjectNames: string[];
  bio: string;
  youtubeChannelUrl?: string;
  rating: number;
  totalVideosCount: number;
  verified: boolean;
}

export interface VideoResource {
  id: string;
  lessonId: string;
  title: string;
  youtubeVideoId: string;
  teacherId: string;
  duration: string;
  viewsCount: number;
  levelTag: 'شرح كامل' | 'شرح مبسط' | 'حل تدريبات' | 'مراجعة نهائية' | 'أسئلة امتحانات';
  isFeatured?: boolean;
  createdAt: string;
}

export interface PdfResource {
  id: string;
  lessonId: string;
  title: string;
  type: 'school_book' | 'summary_note' | 'cheatsheet' | 'exam_pdf';
  typeNameAr: string;
  fileUrl: string;
  fileSize: string;
  pageCount: number;
  publisherName: string;
  downloadCount: number;
  description?: string;
}

export interface InfographicResource {
  id: string;
  lessonId: string;
  title: string;
  imageUrl: string;
  summary: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanationText: string;
}

export interface UserProgress {
  bookmarkedLessonIds: string[];
  completedLessonIds: string[];
  watchHistory: { lessonId: string; videoId: string; timestamp: number }[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
}

export type ContentTabType = 'videos' | 'school_books' | 'notes' | 'infographics' | 'quiz' | 'teachers';
