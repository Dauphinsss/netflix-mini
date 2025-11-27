// CAPA 1: DATA LAYER - Repository Pattern
// Interface Segregation Principle (I): Interfaces específicas
import { UserProfile, MovieGenre } from '@/data/models/types';

export interface IUserRepository {
  getAllProfiles(): UserProfile[];
  getProfile(userId: string): UserProfile | undefined;
  addToWatchHistory(userId: string, movieId: string): void;
}

export class UserRepository implements IUserRepository {
  private users: UserProfile[] = [
    {
      id: '1',
      name: 'Juan',
      favoriteGenres: [MovieGenre.DRAMA, MovieGenre.ACTION],
      watchHistory: ['1', '9'],
    },
    {
      id: '2',
      name: 'María',
      favoriteGenres: [MovieGenre.COMEDY, MovieGenre.HORROR],
      watchHistory: ['4', '7'],
    },
    {
      id: '3',
      name: 'Carlos',
      favoriteGenres: [MovieGenre.ACTION, MovieGenre.HORROR],
      watchHistory: ['2', '3', '6'],
    },
  ];

  getAllProfiles(): UserProfile[] {
    return [...this.users];
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.users.find((user) => user.id === userId);
  }

  addToWatchHistory(userId: string, movieId: string): void {
    const user = this.users.find((u) => u.id === userId);
    if (user && !user.watchHistory.includes(movieId)) {
      user.watchHistory.push(movieId);
    }
  }
}
