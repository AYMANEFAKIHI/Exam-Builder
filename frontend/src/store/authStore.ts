import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '../../../shared/src/types';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

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
      
      // Find user by email
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (error || !users) {
        throw new Error('User not found');
      }

      // Verify password (simple comparison - in production use bcrypt)
      const isValidPassword = users.password === credentials.password || 
        (typeof users.password === 'string' && users.password.startsWith('$2') 
          ? await bcrypt.compare(credentials.password, users.password)
          : users.password === credentials.password);
      
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const user: User = {
        id: users.id.toString(),
        email: users.email,
        firstName: users.name.split(' ')[0] || users.name,
        lastName: users.name.split(' ').slice(1).join(' ') || '',
        createdAt: new Date(users.created_at),
        updatedAt: new Date(users.created_at),
      };
      
      const token = 'supabase_' + users.id;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', users.id.toString());
      
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
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user in Supabase
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: data.email,
          password: hashedPassword,
          name: `${data.firstName} ${data.lastName}`.trim(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const user: User = {
        id: newUser.id.toString(),
        email: newUser.email,
        firstName: data.firstName,
        lastName: data.lastName,
        institution: data.institution,
        createdAt: new Date(newUser.created_at),
        updatedAt: new Date(newUser.created_at),
      };
      
      const token = 'supabase_' + newUser.id;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', newUser.id.toString());
      
      set({ user, token, loading: false });
      toast.success('Registration successful!');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    set({ user: null, token: null });
    toast.info('Logged out');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
      set({ user: null, token: null });
      return;
    }

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', parseInt(userId))
        .single();

      if (error || !userData) {
        throw new Error('User not found');
      }

      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        firstName: userData.name.split(' ')[0] || userData.name,
        lastName: userData.name.split(' ').slice(1).join(' ') || '',
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.created_at),
      };

      set({ user, token });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      set({ user: null, token: null });
    }
  },
}));
