// CAPA 2: BUSINESS LAYER - Lógica de negocio
// Dependency Inversion Principle (D): Depende de interfaces, no de implementaciones

import { Movie, MovieGenre, UserProfile } from '@/data/models/types';
import { IMovieRepository } from '@/data/repositories/MovieRepository';
import { IUserRepository } from '@/data/repositories/UserRepository';
import { MovieFactoryManager } from '@/business/factories/MovieFactory';
import {
  RecommendationContext,
  GenreRecommendationStrategy,
  RatingRecommendationStrategy,
  PopularityRecommendationStrategy,
  HybridRecommendationStrategy,
} from '@/business/strategies/RecommendationStrategy';

export type RecommendationType = 'genre' | 'rating' | 'popularity' | 'hybrid';

export class NetflixService {
  private movieFactory: MovieFactoryManager;
  private recommendationContext: RecommendationContext;

  constructor(
    private movieRepository: IMovieRepository,
    private userRepository: IUserRepository
  ) {
    this.movieFactory = new MovieFactoryManager();
    this.recommendationContext = new RecommendationContext(
      new HybridRecommendationStrategy()
    );
  }

  // Métodos de películas
  searchMovies(query: string): Movie[] {
    return this.movieRepository.searchMovies(query);
  }

  getAllMovies(): Movie[] {
    return this.movieRepository.getAllMovies();
  }

  getMoviesByGenre(genre: MovieGenre): Movie[] {
    return this.movieRepository.getMoviesByGenre(genre);
  }

  // Open/Closed Principle (O): Se pueden agregar nuevas estrategias sin modificar este código
  getRecommendations(
    userId: string,
    type: RecommendationType = 'hybrid',
    limit: number = 5
  ): Movie[] {
    const user = this.userRepository.getProfile(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Strategy Pattern: Cambia el algoritmo en tiempo de ejecución
    switch (type) {
      case 'genre':
        this.recommendationContext.setStrategy(new GenreRecommendationStrategy());
        break;
      case 'rating':
        this.recommendationContext.setStrategy(new RatingRecommendationStrategy());
        break;
      case 'popularity':
        this.recommendationContext.setStrategy(new PopularityRecommendationStrategy());
        break;
      case 'hybrid':
        this.recommendationContext.setStrategy(new HybridRecommendationStrategy());
        break;
    }

    const allMovies = this.movieRepository.getAllMovies();
    return this.recommendationContext.execute(allMovies, user, limit);
  }

  // Métodos de usuarios
  getUserProfiles(): UserProfile[] {
    return this.userRepository.getAllProfiles();
  }

  getUserProfile(userId: string): UserProfile | undefined {
    return this.userRepository.getProfile(userId);
  }

  watchMovie(userId: string, movieId: string): void {
    this.userRepository.addToWatchHistory(userId, movieId);
  }

  // Factory Pattern: Crea películas usando factories
  addMovie(
    genre: MovieGenre,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    const id = (this.movieRepository.getAllMovies().length + 1).toString();
    const movie = this.movieFactory.createMovie(
      genre,
      id,
      title,
      rating,
      popularity,
      year,
      description
    );
    this.movieRepository.addMovie(movie);
    return movie;
  }
}
