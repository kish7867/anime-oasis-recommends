
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
  'Thriller', 'Mecha', 'Music', 'Psychological', 'Historical', 'Military',
  'School', 'Shounen', 'Shoujo', 'Seinen', 'Josei'
];

const Preferences = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updatePreferences } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSelectedGenres(user.preferences.favoriteGenres);
  }, [user, navigate]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSave = async () => {
    if (selectedGenres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }

    setLoading(true);

    try {
      await updatePreferences({
        favoriteGenres: selectedGenres
      });
      toast.success('Preferences saved successfully!');
      navigate('/recommendations');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Set Your Preferences</CardTitle>
          <CardDescription>
            Select your favorite anime genres to get personalized recommendations.
            You can always change these later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              Favorite Genres ({selectedGenres.length} selected)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {GENRES.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer justify-center py-2 px-4 text-sm hover:scale-105 transition-transform"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || selectedGenres.length === 0}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Preferences;
