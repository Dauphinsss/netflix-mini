'use client';

import { useState, useMemo } from 'react';
import { NetflixFacade, RecommendationType } from '@/business/facades/NetflixFacade';
import { Movie } from '@/data/models/types';

export default function Home() {
  const [netflixFacade] = useState(() => new NetflixFacade());
  const [selectedUser, setSelectedUser] = useState<string>('1');
  const [recommendationType, setRecommendationType] = useState<RecommendationType>('hybrid');
  const [searchQuery, setSearchQuery] = useState('');

  const userProfiles = useMemo(() => netflixFacade.getUserProfiles(), [netflixFacade]);
  const currentUser = useMemo(
    () => netflixFacade.getUserProfile(selectedUser),
    [netflixFacade, selectedUser]
  );

  const recommendations = useMemo(() => {
    try {
      return netflixFacade.getRecommendations(selectedUser, recommendationType, 6);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }, [netflixFacade, selectedUser, recommendationType]);

  const searchResults = useMemo(() => {
    if (searchQuery.trim() === '') return [];
    return netflixFacade.searchMovies(searchQuery);
  }, [netflixFacade, searchQuery]);

  const allMovies = useMemo(() => netflixFacade.getAllMovies(), [netflixFacade]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Netflix Mini
          </h1>
          <p className="text-zinc-400">Sistema de Recomendación con Patrones de Diseño</p>
        </header>

        {/* User Selection - Simple como Netflix */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors">
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold">
                {currentUser?.name.charAt(0)}
              </div>
              <span className="text-white">{currentUser?.name}</span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full mt-2 left-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[200px]">
              {userProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedUser(profile.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedUser === profile.id ? 'bg-zinc-800' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                    selectedUser === profile.id ? 'bg-red-600 text-white' : 'bg-zinc-700 text-zinc-300'
                  }`}>
                    {profile.name.charAt(0)}
                  </div>
                  <span className="text-white">{profile.name}</span>
                  {selectedUser === profile.id && (
                    <svg className="w-4 h-4 text-red-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          <span className="text-sm text-zinc-500">
            {currentUser?.favoriteGenres.join(', ')} • {currentUser?.watchHistory.length} vistas
          </span>
        </div>

        {/* Recommendation Strategy Selection */}
        <div className="mb-8 p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <label className="block text-sm font-medium mb-3 text-zinc-300">
            Estrategia de Recomendación (Patrón Strategy)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'hybrid', label: 'Híbrida', desc: 'Combina múltiples factores' },
              { value: 'genre', label: 'Por Género', desc: 'Basado en preferencias' },
              { value: 'rating', label: 'Por Rating', desc: 'Mejor calificadas' },
              { value: 'popularity', label: 'Por Popularidad', desc: 'Más vistas' },
            ].map((strategy) => (
              <button
                key={strategy.value}
                onClick={() => setRecommendationType(strategy.value as RecommendationType)}
                className={`p-3 rounded-lg border transition-all ${
                  recommendationType === strategy.value
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-zinc-900 border-zinc-600 text-zinc-300 hover:border-red-500'
                }`}
              >
                <div className="font-medium">{strategy.label}</div>
                <div className="text-xs opacity-75 mt-1">{strategy.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Search (Facade Pattern) */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3 text-zinc-300">
            Buscar Películas (Patrón Facade)
          </label>
          <input
            type="text"
            placeholder="Buscar por título, género o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
          />
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-3">Resultados de Búsqueda</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            Recomendaciones para {currentUser?.name}
            <span className="text-sm font-normal text-zinc-400">
              ({recommendationType})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} featured />
            ))}
          </div>
        </div>

        {/* All Movies Catalog */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Catálogo Completo (Factory Pattern)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} compact />
            ))}
          </div>
        </div>

        {/* Pattern Info */}
        <div className="mt-12 p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <h3 className="text-xl font-bold mb-4 text-red-500">Patrones de Diseño Implementados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Factory Method (Creacional)</h4>
              <p className="text-zinc-400">
                Crea diferentes tipos de películas (Drama, Acción, Terror, Comedia) usando factories especializadas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Strategy (Comportamiento)</h4>
              <p className="text-zinc-400">
                Algoritmos intercambiables de recomendación: por género, rating, popularidad e híbrido.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 mb-2">Facade (Estructural)</h4>
              <p className="text-zinc-400">
                Interfaz simplificada para buscar y recomendar películas, ocultando la complejidad del sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MovieCard({ movie, featured = false, compact = false }: { movie: Movie; featured?: boolean; compact?: boolean }) {
  return (
    <div
      className={`bg-zinc-800 rounded-lg overflow-hidden border transition-all hover:scale-105 hover:shadow-xl ${
        featured ? 'border-red-600' : 'border-zinc-700'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-bold ${compact ? 'text-sm' : 'text-lg'}`}>{movie.title}</h3>
        <span className={`flex-shrink-0 ml-2 px-2 py-1 bg-yellow-600 text-white rounded text-xs font-bold`}>
          {movie.rating}
        </span>
      </div>
      <div className={`flex gap-2 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <span className="px-2 py-1 bg-red-600 text-white rounded-full text-xs">{movie.genre}</span>
        <span className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded-full text-xs">{movie.year}</span>
      </div>
      {!compact && (
        <p className="text-sm text-zinc-400 mb-2">{movie.description}</p>
      )}
      <div className={`text-zinc-500 ${compact ? 'text-xs' : 'text-sm'}`}>
        Vistas: {movie.popularity}
      </div>
    </div>
  );
}
