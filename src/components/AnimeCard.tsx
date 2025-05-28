
import React from 'react';
import { Anime } from '@/types/anime';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  onClick?: () => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick }) => {
  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A';

  return (
    <Card 
      className="anime-card cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.coverImage.large}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {anime.averageScore && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white font-medium">{score}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {anime.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
          {anime.genres.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{anime.genres.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div>{anime.format}</div>
          {anime.episodes && <div>{anime.episodes} episodes</div>}
          {anime.seasonYear && <div>{anime.season} {anime.seasonYear}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimeCard;
