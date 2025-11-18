export enum MovieGenre {
  DRAMA = 'Drama',
  ACTION = 'Acción',
  HORROR = 'Terror',
  COMEDY = 'Comedia',
  SCIFI = 'Ciencia Ficción',
  ROMANCE = 'Romance',
}

export interface Movie {
  id: string;
  title: string;
  genre: MovieGenre;
  rating: number; // 1-10
  popularity: number; // número de vistas
  year: number;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  favoriteGenres: MovieGenre[];
  watchHistory: string[]; // IDs de películas vistas
}
