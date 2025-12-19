import { create } from 'zustand';
import { Exam, ExamComponent, CreateExamDto, UpdateExamDto } from '../../../shared/src/types';
import api from '../lib/api';
import { toast } from 'react-toastify';

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
      const response = await api.get('/exams');
      set({ exams: response.data.data, loading: false });
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to fetch exams');
    }
  },

  fetchExam: async (id) => {
    try {
      set({ loading: true });
      const response = await api.get(`/exams/${id}`);
      set({ currentExam: response.data.data, loading: false });
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to fetch exam');
    }
  },

  createExam: async (data) => {
    try {
      set({ loading: true });
      const response = await api.post('/exams', data);
      const exam = response.data.data;
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
      const response = await api.put(`/exams/${id}`, data);
      const updatedExam = response.data.data;
      
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
      await api.delete(`/exams/${id}`);
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

      return {
        currentExam: {
          ...state.currentExam,
          components,
          totalPoints,
        },
      };
    });
  },
}));
