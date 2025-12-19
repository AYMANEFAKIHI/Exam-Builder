// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  institution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institution?: string;
}

// Exam Component Types
export type ComponentType = 'text' | 'table' | 'qcm' | 'image' | 'header' | 'trueFalse' | 'fillInBlanks' | 'writingArea' | 'exerciseHeader' | 'pageBreak';

export interface BaseComponent {
  id: string;
  type: ComponentType;
  order: number;
  isFavorite?: boolean; // For question bank favorites
}

export interface HeaderComponent extends BaseComponent {
  type: 'header';
  logo?: string;
  examTitle: string;
  academicYear: string;
  semester: string;
  duration: string;
  studentFields: {
    name: boolean;
    firstName: boolean;
    classGroup: boolean;
  };
}

export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string;
  points?: number;
  latex?: boolean;
}

export interface TableComponent extends BaseComponent {
  type: 'table';
  rows: number;
  columns: number;
  headers: string[];
  data: string[][];
  points?: number;
}

export interface QCMOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  latex?: boolean;
}

export interface QCMComponent extends BaseComponent {
  type: 'qcm';
  question: string;
  options: QCMOption[];
  multipleAnswers: boolean;
  points?: number;
  latex?: boolean;
  columns?: 1 | 2; // Multi-column layout for options
}

export interface ImageComponent extends BaseComponent {
  type: 'image';
  imageUrl: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface TrueFalseStatement {
  id: string;
  text: string;
  latex?: boolean;
}

export interface TrueFalseComponent extends BaseComponent {
  type: 'trueFalse';
  statements: TrueFalseStatement[];
  displayStyle: 'circles' | 'letters'; // Cercles ou Lettres V/F
  points?: number;
}

export interface FillInBlanksComponent extends BaseComponent {
  type: 'fillInBlanks';
  content: string; // Text with [word] for blanks
  points?: number;
  latex?: boolean;
}

export interface WritingAreaComponent extends BaseComponent {
  type: 'writingArea';
  lineCount: number; // Number of lines (5, 10, 20, etc.)
  lineStyle: 'ruled' | 'grid'; // Lignes or Carreaux
  points?: number;
}

export interface ExerciseHeaderComponent extends BaseComponent {
  type: 'exerciseHeader';
  exerciseNumber: number;
  title: string;
  points: number;
}

// Page Break Component
export interface PageBreakComponent extends BaseComponent {
  type: 'pageBreak';
}

export type ExamComponent = 
  | HeaderComponent 
  | TextComponent 
  | TableComponent 
  | QCMComponent 
  | ImageComponent
  | TrueFalseComponent
  | FillInBlanksComponent
  | WritingAreaComponent
  | ExerciseHeaderComponent
  | PageBreakComponent;

// Exam Types
export interface Exam {
  id: string;
  userId: string;
  title: string;
  components: ExamComponent[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface CreateExamDto {
  title: string;
  components: ExamComponent[];
  tags?: string[];
}

export interface UpdateExamDto {
  title?: string;
  components?: ExamComponent[];
  tags?: string[];
}

// Question Bank Types
export interface QuestionBankItem {
  id: string;
  userId: string;
  component: ExamComponent;
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  subject?: string;
  createdAt: Date;
  usageCount: number;
}

export interface CreateQuestionDto {
  component: ExamComponent;
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  subject?: string;
}

// Template Types
export interface Template {
  id: string;
  userId: string;
  name: string;
  description?: string;
  headerComponent: HeaderComponent;
  isPublic: boolean;
  createdAt: Date;
  usageCount: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// PDF Export Types
export interface PDFExportOptions {
  format: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  includeAnswers: boolean;
  correctionGrid: boolean;
  hidePoints?: boolean; // Mode "Examen Blanc"
  watermark?: string; // Filigrane (BROUILLON, CONFIDENTIEL, etc.)
  autoNumbering?: boolean; // Numérotation automatique
}

export interface CorrectionGrid {
  examId: string;
  components: Array<{
    componentId: string;
    maxPoints: number;
    studentPoints?: number;
    comments?: string;
  }>;
  totalPoints: number;
  studentScore?: number;
}
