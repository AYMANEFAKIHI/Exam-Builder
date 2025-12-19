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
export type ComponentType = 'text' | 'table' | 'qcm' | 'image' | 'header';
export interface BaseComponent {
    id: string;
    type: ComponentType;
    order: number;
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
}
export interface ImageComponent extends BaseComponent {
    type: 'image';
    imageUrl: string;
    caption?: string;
    width?: number;
    height?: number;
}
export type ExamComponent = HeaderComponent | TextComponent | TableComponent | QCMComponent | ImageComponent;
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
export interface PDFExportOptions {
    format: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
    includeAnswers: boolean;
    correctionGrid: boolean;
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
//# sourceMappingURL=types.d.ts.map