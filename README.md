
# AnimeRec - Anime Recommendation System

A full-stack anime recommendation system built for a recruitment assignment. This application allows users to search for anime, manage preferences, and get personalized recommendations based on their favorite genres.

## Features

### Core Functionality
- **User Authentication**: Register, login with JWT-based authentication
- **Anime Search**: Search anime by name, genre, format, and status
- **Personalized Recommendations**: Get anime suggestions based on user preferences
- **User Preferences**: Manage favorite genres and viewing history
- **Responsive Design**: Beautiful, mobile-first interface

### Technical Features
- **REST API Integration**: Clean API structure for all endpoints
- **GraphQL Integration**: Uses AniList GraphQL API for anime data
- **Database Integration**: PostgreSQL for user data and preferences
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **TanStack Query** for state management

### Backend Integration
- **AniList GraphQL API** for anime data
- **JWT Authentication** (mock implementation)
- **Local Storage** for user persistence (development)

## API Endpoints

The application implements the following REST API structure:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and retrieve JWT token

### Anime
- `GET /anime/search` - Search anime by name or genre
- `GET /anime/recommendations` - Get personalized recommendations

### User
- `GET /user/preferences` - Get user preferences
- `PUT /user/preferences` - Update user preferences

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anime-recommendation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

### Usage

1. **Register an Account**
   - Go to register page
   - Create account with username, email, and password

2. **Set Preferences**
   - Select your favorite anime genres
   - This will be used for recommendations

3. **Search Anime**
   - Use the search functionality to find anime
   - Filter by genre, format, status
   - Browse trending anime

4. **Get Recommendations**
   - View personalized recommendations based on your preferences
   - Refresh for new suggestions

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AnimeCard.tsx   # Anime display card
│   ├── AnimeGrid.tsx   # Grid layout for anime
│   ├── Layout.tsx      # Main layout wrapper
│   └── Navigation.tsx  # Navigation bar
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   ├── Search.tsx      # Anime search
│   ├── Preferences.tsx # User preferences
│   └── Recommendations.tsx # Personalized recommendations
├── services/           # API and service layers
│   ├── anilistApi.ts   # AniList GraphQL integration
│   └── authService.ts  # Authentication service
├── types/              # TypeScript type definitions
│   └── anime.ts        # Anime and User types
└── App.tsx            # Main application component
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  favorite_genres TEXT[],
  watched_anime INTEGER[],
  favorite_anime INTEGER[],
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Documentation

### Sample Requests and Responses

#### Register User
```javascript
POST /auth/register
Content-Type: application/json

{
  "username": "anime_fan",
  "email": "fan@example.com",
  "password": "securepassword"
}

Response:
{
  "user": {
    "id": "1",
    "username": "anime_fan",
    "email": "fan@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Search Anime
```javascript
GET /anime/search?query=naruto&genres=Action,Adventure

Response:
{
  "data": [
    {
      "id": 20,
      "title": {
        "romaji": "Naruto",
        "english": "Naruto"
      },
      "genres": ["Action", "Adventure", "Martial Arts"],
      "averageScore": 79,
      "coverImage": {
        "large": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-YJvLbgJQpG4B.jpg"
      }
    }
  ]
}
```

#### Get Recommendations
```javascript
GET /anime/recommendations
Authorization: Bearer jwt_token_here

Response:
{
  "recommendations": [
    {
      "id": 11757,
      "title": {
        "romaji": "Sword Art Online"
      },
      "genres": ["Action", "Adventure", "Romance"],
      "averageScore": 72,
      "reason": "Based on your preference for Action and Adventure"
    }
  ]
}
```

## Development Notes

### Current Implementation
- Frontend-only implementation for demonstration
- Mock authentication using localStorage
- Direct integration with AniList GraphQL API
- Responsive design with modern UI patterns

### Production Considerations
- Backend API implementation needed
- Database integration for user data
- Proper JWT authentication
- API rate limiting and caching
- Error handling and logging
- Docker containerization

## Deployment

The application can be deployed to any static hosting service:

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Build files will be in dist/ directory
npm run build
# Deploy dist/ directory to your hosting service
```

## Future Enhancements

- **Backend API**: Full REST API implementation
- **Database**: PostgreSQL integration
- **Caching**: Redis for API response caching
- **Testing**: Unit and integration tests
- **Analytics**: User behavior tracking
- **Social Features**: User reviews and ratings
- **Advanced Recommendations**: Machine learning algorithms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is created for recruitment purposes and is available for evaluation.
