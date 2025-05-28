
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchFromAniList, searchAnimeQuery } from '@/services/anilistApi';
import { Anime } from '@/types/anime';
import AnimeGrid from '@/components/AnimeGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon } from 'lucide-react';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
  'Thriller', 'Mecha', 'Music', 'Psychological'
];

const FORMATS = ['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL'];
const STATUSES = ['RELEASING', 'FINISHED', 'NOT_YET_RELEASED', 'CANCELLED'];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query = searchQuery) => {
    setLoading(true);
    setHasSearched(true);

    try {
      const variables: any = {
        page: 1,
        perPage: 24
      };

      if (query.trim()) {
        variables.search = query.trim();
      }

      if (selectedGenres.length > 0) {
        variables.genre_in = selectedGenres;
      }

      if (selectedFormat) {
        variables.format = selectedFormat;
      }

      if (selectedStatus) {
        variables.status = selectedStatus;
      }

      const data = await fetchFromAniList(searchAnimeQuery, variables);
      setAnime(data.Page.media);
    } catch (error) {
      console.error('Error searching anime:', error);
      setAnime([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
    performSearch();
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedFormat('');
    setSelectedStatus('');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Anime</h1>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="search"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </div>
            </form>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Format</h3>
                  <div className="flex flex-wrap gap-2">
                    {FORMATS.map((format) => (
                      <Badge
                        key={format}
                        variant={selectedFormat === format ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedFormat(selectedFormat === format ? '' : format)}
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => (
                      <Badge
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedStatus(selectedStatus === status ? '' : status)}
                      >
                        {status.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={performSearch} disabled={loading}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {hasSearched && (
        <div className="mb-4">
          <p className="text-muted-foreground">
            {loading ? 'Searching...' : `Found ${anime.length} results`}
          </p>
        </div>
      )}

      <AnimeGrid anime={anime} loading={loading} />
    </div>
  );
};

export default Search;
