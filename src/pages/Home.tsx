
import React, { useState, useEffect } from 'react';
import { fetchFromAniList, trendingAnimeQuery } from '@/services/anilistApi';
import { Anime } from '@/types/anime';
import AnimeGrid from '@/components/AnimeGrid';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

const Home = () => {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchFromAniList(trendingAnimeQuery, {
          page: 1,
          perPage: 12
        });
        setTrendingAnime(data.Page.media);
      } catch (error) {
        console.error('Error loading trending anime:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="gradient-bg rounded-2xl p-8 mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Discover Amazing Anime
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get personalized anime recommendations based on your preferences and discover your next favorite series.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Button size="lg" onClick={() => navigate('/recommendations')}>
                Get Recommendations
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/search')}>
                Search Anime
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate('/register')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/search')}>
                Browse Anime
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <Button variant="outline" onClick={() => navigate('/search')}>
            View All
          </Button>
        </div>
        <AnimeGrid anime={trendingAnime} loading={loading} />
      </section>

      {/* Features Section */}
      <section className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-xl bg-card">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
          <p className="text-muted-foreground">
            Find anime by title, genre, studio, or any criteria you can think of.
          </p>
        </div>
        
        <div className="text-center p-6 rounded-xl bg-card">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Personalized</h3>
          <p className="text-muted-foreground">
            Get recommendations tailored to your unique taste and preferences.
          </p>
        </div>
        
        <div className="text-center p-6 rounded-xl bg-card">
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Customizable</h3>
          <p className="text-muted-foreground">
            Fine-tune your preferences to get exactly what you're looking for.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
