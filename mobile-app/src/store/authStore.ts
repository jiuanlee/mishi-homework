import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  phone?: string;
  className?: string;
  role: 'teacher' | 'student';
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (phone: string, code: string, registerData?: any) => Promise<boolean>;
  studentLogin: (classCode: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,

  login: async (phone: string, code: string, registerData?: any) => {
    set({loading: true});
    try {
      // TODO: 调用实际登录 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: 'teacher_1',
        name: registerData?.teacherName || '老师',
        phone,
        role: 'teacher',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', 'mock_token_123');
      
      set({user, loading: false});
      return true;
    } catch (error) {
      set({loading: false});
      return false;
    }
  },

  studentLogin: async (classCode: string, name: string) => {
    set({loading: true});
    try {
      // TODO: 调用实际登录 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: 'student_1',
        name,
        className: `${classCode}班`,
        role: 'student',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', 'mock_token_456');
      
      set({user, loading: false});
      return true;
    } catch (error) {
      set({loading: false});
      return false;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      set({user: null});
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        set({user});
      }
    } catch (error) {
      console.error('Check auth error:', error);
    }
  },
}));
