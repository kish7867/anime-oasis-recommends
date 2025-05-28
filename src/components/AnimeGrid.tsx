
import React from 'react';
import { Anime } from '@/types/anime';
import AnimeCard from './AnimeCard';
import { useNavigate } from 'react-router-dom';

interface AnimeGridProps {
  anime: Anime[];
  loading?: boolean;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ anime, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (anime.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No anime found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {anime.map((item) => (
        <AnimeCard
          key={item.id}
          anime={item}
          onClick={() => navigate(`/anime/${item.id}`)}
        />
      ))}
    </div>
  );
};

export default AnimeGrid;
