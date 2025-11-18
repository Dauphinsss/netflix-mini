import { UserProfile, MovieGenre } from '@/types/movie';

export class UserProfileService {
  private profiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeDefaultProfiles();
  }

  private initializeDefaultProfiles(): void {
    const profiles: UserProfile[] = [
      {
        id: '1',
        name: 'Marko',
        favoriteGenres: [MovieGenre.DRAMA],
        watchHistory: ['1', '5', '8'],
      },
      {
        id: '2',
        name: 'Marcos',
        favoriteGenres: [MovieGenre.ACTION],
        watchHistory: ['2', '6', '9'],
      },
      {
        id: '3',
        name: 'Marco',
        favoriteGenres: [MovieGenre.HORROR],
        watchHistory: ['3', '7'],
      },
      {
        id: '4',
        name: 'Marcelo',
        favoriteGenres: [MovieGenre.COMEDY],
        watchHistory: ['4', '10'],
      },
    ];

    profiles.forEach((profile) => {
      this.profiles.set(profile.id, profile);
    });
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  createProfile(profile: UserProfile): void {
    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;

    const updatedProfile = { ...profile, ...updates };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  addToWatchHistory(userId: string, movieId: string): void {
    const profile = this.profiles.get(userId);
    if (profile && !profile.watchHistory.includes(movieId)) {
      profile.watchHistory.push(movieId);
    }
  }
}
