import { create } from 'zustand';
import { Exam, ExamComponent, CreateExamDto, UpdateExamDto } from '../../../shared/src/types';
import { toast } from 'react-toastify';

// Local storage key
const EXAMS_KEY = 'exam_builder_exams';

// Helper functions
const getStoredExams = (): Exam[] => {
  const exams = localStorage.getItem(EXAMS_KEY);
  return exams ? JSON.parse(exams) : [];
};

const saveExams = (exams: Exam[]) => {
  localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  loading: boolean;
  fetchExams: () => Promise<void>;
  fetchExam: (id: string) => Promise<void>;
  createExam: (data: CreateExamDto) => Promise<Exam>;
  updateExam: (id: string, data: UpdateExamDto) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  setCurrentExam: (exam: Exam | null) => void;
  updateComponents: (components: ExamComponent[]) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  exams: [],
  currentExam: null,
  loading: false,

  fetchExams: async () => {
    try {
      set({ loading: true });
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const exams = getStoredExams();
      set({ exams, loading: false });
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to fetch exams');
    }
  },

  fetchExam: async (id) => {
    try {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 300));
      const exams = getStoredExams();
      const exam = exams.find(e => e.id === id);
      if (exam) {
        set({ currentExam: exam, loading: false });
      } else {
        set({ loading: false });
        toast.error('Exam not found');
      }
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to fetch exam');
    }
  },

  createExam: async (data) => {
    try {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const exam: Exam = {
        id: generateId(),
        title: data.title,
        components: data.components || [],
        tags: data.tags,
        totalPoints: 0,
        userId: 'local_user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const exams = getStoredExams();
      exams.unshift(exam);
      saveExams(exams);
      
      set((state) => ({
        exams: [exam, ...state.exams],
        currentExam: exam,
        loading: false,
      }));
      toast.success('Exam created successfully!');
      return exam;
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to create exam');
      throw error;
    }
  },

  updateExam: async (id, data) => {
    try {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const exams = getStoredExams();
      const examIndex = exams.findIndex(e => e.id === id);
      
      if (examIndex === -1) {
        throw new Error('Exam not found');
      }
      
      const updatedExam: Exam = {
        ...exams[examIndex],
        ...data,
        updatedAt: new Date(),
      };
      
      exams[examIndex] = updatedExam;
      saveExams(exams);
      
      set((state) => ({
        exams: state.exams.map((e) => (e.id === id ? updatedExam : e)),
        currentExam: state.currentExam?.id === id ? updatedExam : state.currentExam,
        loading: false,
      }));
      toast.success('Exam updated successfully!');
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to update exam');
      throw error;
    }
  },

  deleteExam: async (id) => {
    try {
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const exams = getStoredExams();
      const filteredExams = exams.filter(e => e.id !== id);
      saveExams(filteredExams);
      
      set((state) => ({
        exams: state.exams.filter((e) => e.id !== id),
        loading: false,
      }));
      toast.success('Exam deleted successfully!');
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to delete exam');
      throw error;
    }
  },

  setCurrentExam: (exam) => {
    set({ currentExam: exam });
  },

  updateComponents: (components) => {
    set((state) => {
      if (!state.currentExam) return state;
      
      const totalPoints = components.reduce((sum, comp) => {
        return sum + (('points' in comp && comp.points) ? comp.points : 0);
      }, 0);

      const updatedExam: Exam = {
        ...state.currentExam,
        components,
        totalPoints,
      };

      // Also save to localStorage
      const exams = getStoredExams();
      const examIndex = exams.findIndex(e => e.id === state.currentExam?.id);
      if (examIndex !== -1) {
        exams[examIndex] = updatedExam;
        saveExams(exams);
      }

      return {
        currentExam: updatedExam,
      };
    });
  },
}));
