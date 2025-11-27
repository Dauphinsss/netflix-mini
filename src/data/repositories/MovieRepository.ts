// CAPA 1: DATA LAYER - Repository Pattern (Estructural)
// Responsabilidad: Acceso a datos de películas (Single Responsibility - SOLID)

import { Movie, MovieGenre } from '@/data/models/types';

export interface IMovieRepository {
  getAllMovies(): Movie[];
  getMoviesByGenre(genre: MovieGenre): Movie[];
  searchMovies(query: string): Movie[];
  addMovie(movie: Movie): void;
}

export class MovieRepository implements IMovieRepository {
  private movies: Movie[] = [];

  constructor() {
    this.initializeMovies();
  }

  private initializeMovies(): void {
    // Datos iniciales del catálogo
    this.movies = [
      {
        id: '1',
        title: 'El Padrino',
        genre: MovieGenre.DRAMA,
        rating: 9.2,
        popularity: 15000,
        year: 1972,
        description: 'La historia de una familia mafiosa en Nueva York',
      },
      {
        id: '2',
        title: 'Mad Max: Fury Road',
        genre: MovieGenre.ACTION,
        rating: 8.1,
        popularity: 12000,
        year: 2015,
        description: 'Una persecución épica en un desierto post-apocalíptico',
      },
      {
        id: '3',
        title: 'El Conjuro',
        genre: MovieGenre.HORROR,
        rating: 7.5,
        popularity: 10000,
        year: 2013,
        description: 'Investigadores paranormales ayudan a una familia aterrorizada',
      },
      {
        id: '4',
        title: 'Superbad',
        genre: MovieGenre.COMEDY,
        rating: 7.6,
        popularity: 9000,
        year: 2007,
        description: 'Dos amigos intentan conseguir alcohol para una fiesta',
      },
      {
        id: '5',
        title: 'La La Land',
        genre: MovieGenre.DRAMA,
        rating: 8.0,
        popularity: 11000,
        year: 2016,
        description: 'Un pianista y una actriz se enamoran en Los Ángeles',
      },
      {
        id: '6',
        title: 'John Wick',
        genre: MovieGenre.ACTION,
        rating: 7.4,
        popularity: 13000,
        year: 2014,
        description: 'Un asesino retirado busca venganza',
      },
      {
        id: '7',
        title: 'Hereditary',
        genre: MovieGenre.HORROR,
        rating: 7.3,
        popularity: 8500,
        year: 2018,
        description: 'Una familia es acechada por una presencia siniestra',
      },
      {
        id: '8',
        title: 'Parasite',
        genre: MovieGenre.DRAMA,
        rating: 8.6,
        popularity: 14000,
        year: 2019,
        description: 'Una familia pobre se infiltra en una casa rica',
      },
      {
        id: '9',
        title: 'Inception',
        genre: MovieGenre.ACTION,
        rating: 8.8,
        popularity: 16000,
        year: 2010,
        description: 'Un ladrón roba secretos del subconsciente',
      },
      {
        id: '10',
        title: 'The Grand Budapest Hotel',
        genre: MovieGenre.COMEDY,
        rating: 8.1,
        popularity: 9500,
        year: 2014,
        description: 'Las aventuras de un conserje de hotel legendario',
      },
      {
        id: '11',
        title: 'A Quiet Place',
        genre: MovieGenre.HORROR,
        rating: 7.5,
        popularity: 11500,
        year: 2018,
        description: 'Una familia sobrevive en silencio ante criaturas que cazan por sonido',
      },
      {
        id: '12',
        title: 'The Dark Knight',
        genre: MovieGenre.ACTION,
        rating: 9.0,
        popularity: 17000,
        year: 2008,
        description: 'Batman enfrenta al Joker in Gotham City',
      },
    ];
  }

  getAllMovies(): Movie[] {
    return [...this.movies];
  }

  getMoviesByGenre(genre: MovieGenre): Movie[] {
    return this.movies.filter((movie) => movie.genre === genre);
  }

  searchMovies(query: string): Movie[] {
    const lowerQuery = query.toLowerCase();
    return this.movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.description.toLowerCase().includes(lowerQuery) ||
        movie.genre.toLowerCase().includes(lowerQuery)
    );
  }

  addMovie(movie: Movie): void {
    this.movies.push(movie);
  }
}
