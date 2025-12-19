import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '../../../shared/src/types';
import { toast } from 'react-toastify';

// Local storage keys
const USERS_KEY = 'exam_builder_users';
const CURRENT_USER_KEY = 'exam_builder_current_user';

// Helper functions for local storage
const getStoredUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (credentials) => {
    try {
      set({ loading: true });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Simple password check (in real app, this would be hashed)
      const storedPasswords = JSON.parse(localStorage.getItem('exam_builder_passwords') || '{}');
      if (storedPasswords[user.id] !== credentials.password) {
        throw new Error('Invalid password');
      }
      
      const token = 'local_' + generateId();
      localStorage.setItem('token', token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      set({ user, token, loading: false });
      toast.success('Login successful!');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || 'Login failed');
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ loading: true });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === data.email)) {
        throw new Error('User with this email already exists');
      }
      
      const newUser: User = {
        id: generateId(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        institution: data.institution,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Store password separately (simple demo - not secure for production)
      const storedPasswords = JSON.parse(localStorage.getItem('exam_builder_passwords') || '{}');
      storedPasswords[newUser.id] = data.password;
      localStorage.setItem('exam_builder_passwords', JSON.stringify(storedPasswords));
      
      users.push(newUser);
      saveUsers(users);
      
      const token = 'local_' + generateId();
      localStorage.setItem('token', token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      set({ user: newUser, token, loading: false });
      toast.success('Registration successful!');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem(CURRENT_USER_KEY);
    set({ user: null, token: null });
    toast.info('Logged out');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        set({ user: JSON.parse(storedUser), token });
      } else {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      }
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },
}));
