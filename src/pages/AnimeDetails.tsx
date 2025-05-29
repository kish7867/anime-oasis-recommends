
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFromAniList, getAnimeByIdQuery } from '@/services/anilistApi';
import { Anime } from '@/types/anime';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Calendar, Play, Users } from 'lucide-react';

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnimeDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchFromAniList(getAnimeByIdQuery, {
          id: parseInt(id)
        });
        setAnime(data.Media);
      } catch (err) {
        console.error('Error loading anime details:', err);
        setError('Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    loadAnimeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Anime Not Found</h1>
        <p className="text-muted-foreground mb-4">{error || 'The anime you are looking for could not be found.'}</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A';
  const studios = anime.studios.nodes.map(studio => studio.name).join(', ');

  // Clean HTML from description
  const cleanDescription = anime.description
    ? anime.description.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
    : 'No description available.';

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner */}
      {anime.bannerImage && (
        <div 
          className="h-64 md:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${anime.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute top-4 left-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cover Image */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <img
                src={anime.coverImage.large}
                alt={title}
                className="w-full aspect-[3/4] object-cover"
              />
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
              {anime.title.romaji !== title && (
                <p className="text-lg text-muted-foreground mb-2">{anime.title.romaji}</p>
              )}
              {anime.title.native && (
                <p className="text-muted-foreground">{anime.title.native}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {anime.averageScore && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{score}</span>
                </div>
              )}
              {anime.popularity && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{anime.popularity.toLocaleString()} users</span>
                </div>
              )}
              {anime.episodes && (
                <div className="flex items-center space-x-1">
                  <Play className="w-4 h-4 text-green-400" />
                  <span>{anime.episodes} episodes</span>
                </div>
              )}
              {anime.seasonYear && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>{anime.season} {anime.seasonYear}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div>
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed">
                {cleanDescription}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Format</h4>
                  <p className="text-muted-foreground">{anime.format}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Status</h4>
                  <p className="text-muted-foreground">{anime.status.replace('_', ' ')}</p>
                </CardContent>
              </Card>
              
              {studios && (
                <Card className="sm:col-span-2">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Studios</h4>
                    <p className="text-muted-foreground">{studios}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
