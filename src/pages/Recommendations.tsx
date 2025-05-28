
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromAniList, searchAnimeQuery } from '@/services/anilistApi';
import { Anime } from '@/types/anime';
import AnimeGrid from '@/components/AnimeGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/services/authService';
import { RefreshCw } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.preferences.favoriteGenres.length === 0) {
      navigate('/preferences');
      return;
    }

    loadRecommendations();
  }, [user, navigate]);

  const loadRecommendations = async () => {
    if (!user || user.preferences.favoriteGenres.length === 0) return;

    setLoading(true);

    try {
      // Get a random subset of user's favorite genres for variety
      const shuffledGenres = [...user.preferences.favoriteGenres].sort(() => 0.5 - Math.random());
      const selectedGenres = shuffledGenres.slice(0, Math.min(3, shuffledGenres.length));

      const data = await fetchFromAniList(searchAnimeQuery, {
        genre_in: selectedGenres,
        page: 1,
        perPage: 20,
        sort: 'POPULARITY_DESC'
      });

      // Filter out anime the user has already marked as watched
      const filteredAnime = data.Page.media.filter((anime: Anime) => 
        !user.preferences.watchedAnime.includes(anime.id)
      );

      setRecommendations(filteredAnime);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (user.preferences.favoriteGenres.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Set Your Preferences First</CardTitle>
            <CardDescription>
              To get personalized recommendations, please set your favorite genres first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/preferences')}>
              Set Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Recommendations</h1>
            <p className="text-muted-foreground">
              Based on your favorite genres and viewing history
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadRecommendations}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {user.preferences.favoriteGenres.map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      {recommendations.length === 0 && !loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No recommendations found based on your current preferences.
            </p>
            <div className="space-x-2">
              <Button onClick={() => navigate('/preferences')}>
                Update Preferences
              </Button>
              <Button variant="outline" onClick={() => navigate('/search')}>
                Browse All Anime
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <AnimeGrid anime={recommendations} loading={loading} />
      )}
    </div>
  );
};

export default Recommendations;
