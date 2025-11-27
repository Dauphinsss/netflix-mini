// CAPA 2: BUSINESS LAYER - Factory Pattern (Patrón Creacional)
import { Movie, MovieGenre } from '@/data/models/types';

export interface MovieFactory {
  createMovie(
    id: string,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie;
}

export class DramaMovieFactory implements MovieFactory {
  createMovie(
    id: string,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    return {
      id,
      title,
      genre: MovieGenre.DRAMA,
      rating,
      popularity,
      year,
      description,
    };
  }
}

export class ActionMovieFactory implements MovieFactory {
  createMovie(
    id: string,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    return {
      id,
      title,
      genre: MovieGenre.ACTION,
      rating,
      popularity,
      year,
      description,
    };
  }
}

export class HorrorMovieFactory implements MovieFactory {
  createMovie(
    id: string,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    return {
      id,
      title,
      genre: MovieGenre.HORROR,
      rating,
      popularity,
      year,
      description,
    };
  }
}

export class ComedyMovieFactory implements MovieFactory {
  createMovie(
    id: string,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    return {
      id,
      title,
      genre: MovieGenre.COMEDY,
      rating,
      popularity,
      year,
      description,
    };
  }
}

export class MovieFactoryManager {
  private factories = new Map<MovieGenre, MovieFactory>([
    [MovieGenre.DRAMA, new DramaMovieFactory()],
    [MovieGenre.ACTION, new ActionMovieFactory()],
    [MovieGenre.HORROR, new HorrorMovieFactory()],
    [MovieGenre.COMEDY, new ComedyMovieFactory()],
  ]);

  createMovie(
    genre: MovieGenre,
    id: string,
    title: string,
    rating: number,
    popularity: number,
    year: number,
    description: string
  ): Movie {
    const factory = this.factories.get(genre);
    if (!factory) throw new Error(`No factory for genre: ${genre}`);
    return factory.createMovie(id, title, rating, popularity, year, description);
  }
}
