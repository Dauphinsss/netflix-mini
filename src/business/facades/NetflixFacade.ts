// CAPA 2: BUSINESS LAYER - Facade Pattern (Patrón Estructural)
// Single Responsibility Principle (S): Solo simplifica el acceso al sistema

import { Movie, MovieGenre, UserProfile } from '@/data/models/types';
import { MovieRepository } from '@/data/repositories/MovieRepository';
import { UserRepository } from '@/data/repositories/UserRepository';
import { NetflixService, RecommendationType } from '@/business/services/NetflixService';

export type { RecommendationType };

// Facade: Simplifica la interacción con el sistema de 3 capas
export class NetflixFacade {
  private netflixService: NetflixService;

  constructor() {
    // Inyección de dependencias
    const movieRepo = new MovieRepository();
    const userRepo = new UserRepository();
    this.netflixService = new NetflixService(movieRepo, userRepo);
  }

  searchMovies(query: string): Movie[] {
    return this.netflixService.searchMovies(query);
  }

  getRecommendations(
    userId: string,
    type: RecommendationType = 'hybrid',
    limit: number = 5
  ): Movie[] {
    return this.netflixService.getRecommendations(userId, type, limit);
  }

  getMoviesByGenre(genre: MovieGenre): Movie[] {
    return this.netflixService.getMoviesByGenre(genre);
  }

  getAllMovies(): Movie[] {
    return this.netflixService.getAllMovies();
  }

  getUserProfiles(): UserProfile[] {
    return this.netflixService.getUserProfiles();
  }

  getUserProfile(userId: string): UserProfile | undefined {
    return this.netflixService.getUserProfile(userId);
  }

  watchMovie(userId: string, movieId: string): void {
    this.netflixService.watchMovie(userId, movieId);
  }

  addMovie(
    genre: MovieGenre,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    return this.netflixService.addMovie(genre, title, rating, popularity, year, description);
  }
}
