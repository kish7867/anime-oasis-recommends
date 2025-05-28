
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabaseAuthService } from '@/services/supabaseAuthService';
import { User } from '@/types/anime';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<User>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up initial state
    const initializeAuth = async () => {
      try {
        const currentUser = supabaseAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Since supabaseAuthService handles auth state changes internally,
    // we need to poll for user changes or implement an event system
    const checkUserInterval = setInterval(() => {
      const currentUser = supabaseAuthService.getCurrentUser();
      if (currentUser?.id !== user?.id) {
        setUser(currentUser);
      }
    }, 1000);

    return () => clearInterval(checkUserInterval);
  }, [user?.id]);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const user = await supabaseAuthService.login(email, password);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const user = await supabaseAuthService.register(username, email, password);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabaseAuthService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>): Promise<User> => {
    const updatedUser = await supabaseAuthService.updateUserPreferences(preferences);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updatePreferences,
    isAuthenticated: supabaseAuthService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
