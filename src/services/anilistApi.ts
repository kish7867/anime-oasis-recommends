
const ANILIST_API_URL = 'https://graphql.anilist.co';

export const searchAnimeQuery = `
  query ($search: String, $genre_in: [String], $status: MediaStatus, $format: MediaFormat, $season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(search: $search, genre_in: $genre_in, status: $status, format: $format, season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        coverImage {
          large
          medium
        }
        bannerImage
        format
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export const getAnimeByIdQuery = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description
      genres
      averageScore
      popularity
      episodes
      status
      season
      seasonYear
      coverImage {
        large
        medium
      }
      bannerImage
      format
      studios {
        nodes {
          name
        }
      }
      recommendations {
        nodes {
          mediaRecommendation {
            id
            title {
              romaji
              english
            }
            coverImage {
              medium
            }
            genres
            averageScore
          }
        }
      }
    }
  }
`;

export const trendingAnimeQuery = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          romaji
          english
          native
        }
        description
        genres
        averageScore
        popularity
        episodes
        status
        season
        seasonYear
        coverImage {
          large
          medium
        }
        bannerImage
        format
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export async function fetchFromAniList(query: string, variables: any = {}) {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('AniList API errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching from AniList:', error);
    throw error;
  }
}
