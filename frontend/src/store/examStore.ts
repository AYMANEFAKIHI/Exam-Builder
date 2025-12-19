import { create } from 'zustand';
import { Exam, ExamComponent, CreateExamDto, UpdateExamDto } from '../../../shared/src/types';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

const getUserId = (): number | null => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
};

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

export const useExamStore = create<ExamState>((set, _get) => ({
  exams: [],
  currentExam: null,
  loading: false,

  fetchExams: async () => {
    try {
      set({ loading: true });
      const userId = getUserId();
      
      if (!userId) {
        set({ exams: [], loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const exams: Exam[] = (data || []).map(exam => ({
        id: exam.id.toString(),
        userId: exam.user_id.toString(),
        title: exam.title,
        components: exam.components || [],
        totalPoints: (exam.components || []).reduce((sum: number, comp: any) => 
          sum + (comp.points || 0), 0),
        createdAt: new Date(exam.created_at),
        updatedAt: new Date(exam.updated_at),
      }));

      set({ exams, loading: false });
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to fetch exams');
    }
  },

  fetchExam: async (id) => {
    try {
      set({ loading: true });
      
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;

      const exam: Exam = {
        id: data.id.toString(),
        userId: data.user_id.toString(),
        title: data.title,
        components: data.components || [],
        totalPoints: (data.components || []).reduce((sum: number, comp: any) => 
          sum + (comp.points || 0), 0),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set({ currentExam: exam, loading: false });
    } catch (error: any) {
      set({ loading: false });
      toast.error('Failed to fetch exam');
    }
  },

  createExam: async (data) => {
    try {
      set({ loading: true });
      const userId = getUserId();
      
      if (!userId) {
        throw new Error('User not logged in');
      }

      const { data: newExam, error } = await supabase
        .from('exams')
        .insert({
          user_id: userId,
          title: data.title,
          components: data.components || [],
        })
        .select()
        .single();

      if (error) throw error;

      const exam: Exam = {
        id: newExam.id.toString(),
        userId: newExam.user_id.toString(),
        title: newExam.title,
        components: newExam.components || [],
        totalPoints: 0,
        createdAt: new Date(newExam.created_at),
        updatedAt: new Date(newExam.updated_at),
      };
      
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
      
      const { data: updatedExam, error } = await supabase
        .from('exams')
        .update({
          title: data.title,
          components: data.components,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) throw error;

      const exam: Exam = {
        id: updatedExam.id.toString(),
        userId: updatedExam.user_id.toString(),
        title: updatedExam.title,
        components: updatedExam.components || [],
        totalPoints: (updatedExam.components || []).reduce((sum: number, comp: any) => 
          sum + (comp.points || 0), 0),
        createdAt: new Date(updatedExam.created_at),
        updatedAt: new Date(updatedExam.updated_at),
      };
      
      set((state) => ({
        exams: state.exams.map((e) => (e.id === id ? exam : e)),
        currentExam: state.currentExam?.id === id ? exam : state.currentExam,
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
      
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;
      
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

      // Save to Supabase in the background
      supabase
        .from('exams')
        .update({
          components,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parseInt(state.currentExam.id))
        .then(({ error }) => {
          if (error) console.error('Failed to save components:', error);
        });

      return {
        currentExam: updatedExam,
      };
    });
  },
}));
