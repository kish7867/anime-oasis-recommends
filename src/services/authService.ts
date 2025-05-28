
import { User } from '@/types/anime';

// Mock authentication service - in real app, this would connect to your backend
class AuthService {
  private currentUser: User | null = null;
  private users: User[] = [];

  constructor() {
    // Load from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedUsers = localStorage.getItem('users');
    
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
    
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  async register(username: string, email: string, password: string): Promise<User> {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      throw new Error('User already exists with this email or username');
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      preferences: {
        favoriteGenres: [],
        watchedAnime: [],
        favoriteAnime: []
      }
    };

    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    
    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async updateUserPreferences(preferences: Partial<User['preferences']>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
    
    // Update in users array
    const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
