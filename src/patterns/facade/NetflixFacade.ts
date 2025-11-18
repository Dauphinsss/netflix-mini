import { Movie, MovieGenre, UserProfile } from '@/types/movie';
import { MovieFactoryManager } from '@/patterns/factory/MovieFactory';
import {
  RecommendationContext,
  GenreRecommendationStrategy,
  RatingRecommendationStrategy,
  PopularityRecommendationStrategy,
  HybridRecommendationStrategy,
} from '@/patterns/strategy/RecommendationStrategy';
import { UserProfileService } from '@/services/UserProfileService';

export type RecommendationType = 'genre' | 'rating' | 'popularity' | 'hybrid';

export class NetflixFacade {
  private movieCatalog: Movie[] = [];
  private movieFactory: MovieFactoryManager;
  private userService: UserProfileService;
  private recommendationContext: RecommendationContext;

  constructor() {
    this.movieFactory = new MovieFactoryManager();
    this.userService = new UserProfileService();
    this.recommendationContext = new RecommendationContext(
      new HybridRecommendationStrategy()
    );
    this.initializeCatalog();
  }

  private initializeCatalog(): void {
    const moviesData = [
      {
        genre: MovieGenre.DRAMA,
        id: '1',
        title: 'El Padrino',
        rating: 9.2,
        popularity: 15000,
        year: 1972,
        description: 'La historia de una familia mafiosa en Nueva York',
      },
      {
        genre: MovieGenre.ACTION,
        id: '2',
        title: 'Mad Max: Fury Road',
        rating: 8.1,
        popularity: 12000,
        year: 2015,
        description: 'Una persecución épica en un desierto post-apocalíptico',
      },
      {
        genre: MovieGenre.HORROR,
        id: '3',
        title: 'El Conjuro',
        rating: 7.5,
        popularity: 10000,
        year: 2013,
        description: 'Investigadores paranormales ayudan a una familia aterrorizada',
      },
      {
        genre: MovieGenre.COMEDY,
        id: '4',
        title: 'Superbad',
        rating: 7.6,
        popularity: 9000,
        year: 2007,
        description: 'Dos amigos intentan conseguir alcohol para una fiesta',
      },
      {
        genre: MovieGenre.DRAMA,
        id: '5',
        title: 'La La Land',
        rating: 8.0,
        popularity: 11000,
        year: 2016,
        description: 'Un pianista y una actriz se enamoran en Los Ángeles',
      },
      {
        genre: MovieGenre.ACTION,
        id: '6',
        title: 'John Wick',
        rating: 7.4,
        popularity: 13000,
        year: 2014,
        description: 'Un asesino retirado busca venganza',
      },
      {
        genre: MovieGenre.HORROR,
        id: '7',
        title: 'Hereditary',
        rating: 7.3,
        popularity: 8500,
        year: 2018,
        description: 'Una familia es acechada por una presencia siniestra',
      },
      {
        genre: MovieGenre.DRAMA,
        id: '8',
        title: 'Parasite',
        rating: 8.6,
        popularity: 14000,
        year: 2019,
        description: 'Una familia pobre se infiltra en una casa rica',
      },
      {
        genre: MovieGenre.ACTION,
        id: '9',
        title: 'Inception',
        rating: 8.8,
        popularity: 16000,
        year: 2010,
        description: 'Un ladrón roba secretos del subconsciente',
      },
      {
        genre: MovieGenre.COMEDY,
        id: '10',
        title: 'The Grand Budapest Hotel',
        rating: 8.1,
        popularity: 9500,
        year: 2014,
        description: 'Las aventuras de un conserje de hotel legendario',
      },
      {
        genre: MovieGenre.HORROR,
        id: '11',
        title: 'A Quiet Place',
        rating: 7.5,
        popularity: 11500,
        year: 2018,
        description: 'Una familia sobrevive en silencio ante criaturas que cazan por sonido',
      },
      {
        genre: MovieGenre.ACTION,
        id: '12',
        title: 'The Dark Knight',
        rating: 9.0,
        popularity: 17000,
        year: 2008,
        description: 'Batman enfrenta al Joker en Gotham City',
      },
    ];

    this.movieCatalog = moviesData.map((data) =>
      this.movieFactory.createMovie(
        data.genre,
        data.id,
        data.title,
        data.rating,
        data.popularity,
        data.year,
        data.description
      )
    );
  }

  searchMovies(query: string): Movie[] {
    const lowerQuery = query.toLowerCase();
    return this.movieCatalog.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.description.toLowerCase().includes(lowerQuery) ||
        movie.genre.toLowerCase().includes(lowerQuery)
    );
  }

  getRecommendations(
    userId: string,
    type: RecommendationType = 'hybrid',
    limit: number = 5
  ): Movie[] {
    const user = this.userService.getProfile(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

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

    return this.recommendationContext.execute(this.movieCatalog, user, limit);
  }

  getMoviesByGenre(genre: MovieGenre): Movie[] {
    return this.movieCatalog.filter((movie) => movie.genre === genre);
  }

  getAllMovies(): Movie[] {
    return [...this.movieCatalog];
  }

  getUserProfiles(): UserProfile[] {
    return this.userService.getAllProfiles();
  }

  getUserProfile(userId: string): UserProfile | undefined {
    return this.userService.getProfile(userId);
  }

  watchMovie(userId: string, movieId: string): void {
    this.userService.addToWatchHistory(userId, movieId);
  }

  addMovie(
    genre: MovieGenre,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    const id = (this.movieCatalog.length + 1).toString();
    const movie = this.movieFactory.createMovie(
      genre,
      id,
      title,
      rating,
      popularity,
      year,
      description
    );
    this.movieCatalog.push(movie);
    return movie;
  }
}
