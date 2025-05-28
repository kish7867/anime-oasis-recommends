
export interface Anime {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
  };
  description?: string;
  genres: string[];
  averageScore?: number;
  popularity?: number;
  episodes?: number;
  status: string;
  season?: string;
  seasonYear?: number;
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage?: string;
  format: string;
  studios: {
    nodes: Array<{
      name: string;
    }>;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  preferences: {
    favoriteGenres: string[];
    watchedAnime: number[];
    favoriteAnime: number[];
  };
}

export interface SearchFilters {
  query?: string;
  genres?: string[];
  status?: string;
  format?: string;
  season?: string;
  year?: number;
}
