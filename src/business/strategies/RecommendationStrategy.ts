// CAPA 2: BUSINESS LAYER - Strategy Pattern (Patrón de Comportamiento)
import { Movie, UserProfile } from '@/data/models/types';

export interface RecommendationStrategy {
  recommend(movies: Movie[], user: UserProfile, limit?: number): Movie[];
}

export class GenreRecommendationStrategy implements RecommendationStrategy {
  recommend(movies: Movie[], user: UserProfile, limit = 5): Movie[] {
    const unwatched = movies.filter((m) => !user.watchHistory.includes(m.id));

    return unwatched
      .sort((a, b) => {
        const aFav = user.favoriteGenres.includes(a.genre) ? 1 : 0;
        const bFav = user.favoriteGenres.includes(b.genre) ? 1 : 0;
        return bFav - aFav || b.rating - a.rating;
      })
      .slice(0, limit);
  }
}

export class RatingRecommendationStrategy implements RecommendationStrategy {
  recommend(movies: Movie[], user: UserProfile, limit = 5): Movie[] {
    const unwatched = movies.filter((m) => !user.watchHistory.includes(m.id));
    return unwatched.sort((a, b) => b.rating - a.rating).slice(0, limit);
  }
}

export class PopularityRecommendationStrategy implements RecommendationStrategy {
  recommend(movies: Movie[], user: UserProfile, limit = 5): Movie[] {
    const unwatched = movies.filter((m) => !user.watchHistory.includes(m.id));
    return unwatched.sort((a, b) => b.popularity - a.popularity).slice(0, limit);
  }
}

export class HybridRecommendationStrategy implements RecommendationStrategy {
  recommend(movies: Movie[], user: UserProfile, limit = 5): Movie[] {
    const unwatched = movies.filter((m) => !user.watchHistory.includes(m.id));

    const scored = unwatched.map((m) => ({
      movie: m,
      score: (user.favoriteGenres.includes(m.genre) ? 20 : 0) + m.rating,
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .map((s) => s.movie)
      .slice(0, limit);
  }
}

export class RecommendationContext {
  constructor(private strategy: RecommendationStrategy) {}

  setStrategy(strategy: RecommendationStrategy): void {
    this.strategy = strategy;
  }

  execute(movies: Movie[], user: UserProfile, limit?: number): Movie[] {
    return this.strategy.recommend(movies, user, limit);
  }
}
