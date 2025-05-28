
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { User as AppUser } from '@/types/anime';

class SupabaseAuthService {
  private currentUser: AppUser | null = null;
  private session: Session | null = null;

  constructor() {
    // Initialize auth state
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await this.setSession(session);
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      await this.setSession(session);
    });
  }

  private async setSession(session: Session | null) {
    this.session = session;
    
    if (session?.user) {
      // Fetch user profile and preferences
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      this.currentUser = {
        id: session.user.id,
        username: profile?.username || '',
        email: session.user.email || '',
        preferences: {
          favoriteGenres: preferences?.favorite_genres || [],
          watchedAnime: preferences?.watched_anime || [],
          favoriteAnime: preferences?.favorite_anime || []
        }
      };
    } else {
      this.currentUser = null;
    }
  }

  async register(username: string, email: string, password: string): Promise<AppUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Registration failed');
    }

    // Wait a moment for the trigger to create profile and preferences
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh user data
    await this.setSession(data.session);
    
    if (!this.currentUser) {
      throw new Error('Failed to create user profile');
    }

    return this.currentUser;
  }

  async login(email: string, password: string): Promise<AppUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Login failed');
    }

    await this.setSession(data.session);
    
    if (!this.currentUser) {
      throw new Error('Failed to load user data');
    }

    return this.currentUser;
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    
    this.currentUser = null;
    this.session = null;
  }

  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }

  getSession(): Session | null {
    return this.session;
  }

  async updateUserPreferences(preferences: Partial<AppUser['preferences']>): Promise<AppUser> {
    if (!this.currentUser || !this.session) {
      throw new Error('No user logged in');
    }

    const updates: any = {};
    if (preferences.favoriteGenres) updates.favorite_genres = preferences.favoriteGenres;
    if (preferences.watchedAnime) updates.watched_anime = preferences.watchedAnime;
    if (preferences.favoriteAnime) updates.favorite_anime = preferences.favoriteAnime;

    const { error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', this.currentUser.id);

    if (error) {
      throw error;
    }

    // Update local state
    this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
    
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.session !== null;
  }
}

export const supabaseAuthService = new SupabaseAuthService();
