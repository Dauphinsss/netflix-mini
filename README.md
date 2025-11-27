# Netflix Mini - Arquitectura de 3 Capas

Sistema de recomendación de películas implementado con **arquitectura de 3 capas real**, **principios SOLID** y **patrones de diseño** (Factory, Strategy, Facade).

---

## 🚀 Ejecución Rápida

```bash
npm install
npm run dev
```

**Abrir en navegador**: http://localhost:3000

---

## 📋 Tabla de Contenidos

1. [Arquitectura de 3 Capas](#arquitectura-de-3-capas)
2. [Principios SOLID](#principios-solid)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Flujo de Datos](#flujo-de-datos)
6. [Guía de Defensa](#guía-de-defensa)

---

## 🏗️ Arquitectura de 3 Capas

Esta es una arquitectura **real y profesional** donde cada capa tiene una responsabilidad clara:

```
src/
├── data/                        [CAPA 1: DATA/PERSISTENCE]
│   ├── models/
│   │   └── types.ts            Interfaces: Movie, UserProfile, MovieGenre
│   └── repositories/
│       ├── MovieRepository.ts  Acceso a datos de películas
│       └── UserRepository.ts   Acceso a datos de usuarios
│
├── business/                    [CAPA 2: BUSINESS LOGIC]
│   ├── factories/
│   │   └── MovieFactory.ts     Patrón Creacional: Factory Method
│   ├── strategies/
│   │   └── RecommendationStrategy.ts  Patrón Comportamiento: Strategy
│   ├── facades/
│   │   └── NetflixFacade.ts    Patrón Estructural: Facade
│   └── services/
│       └── NetflixService.ts   Lógica de negocio principal
│
└── app/                         [CAPA 3: PRESENTATION]
    ├── layout.tsx
    └── page.tsx                React UI - Interfaz de usuario
```

### Diagrama de Capas

```
┌──────────────────────────────────┐
│  CAPA 3: PRESENTATION            │
│  ┌────────────────────────────┐  │
│  │  app/page.tsx              │  │
│  │  (React UI)                │  │
│  └────────────────────────────┘  │
└──────────────┬───────────────────┘
               │ usa NetflixFacade
┌──────────────▼───────────────────┐
│  CAPA 2: BUSINESS LOGIC          │
│  ┌────────────────────────────┐  │
│  │  NetflixFacade             │  │
│  │  NetflixService            │  │
│  │  Strategies (4 tipos)      │  │
│  │  Factory                   │  │
│  └────────────────────────────┘  │
└──────────────┬───────────────────┘
               │ usa Repositories
┌──────────────▼───────────────────┐
│  CAPA 1: DATA/PERSISTENCE        │
│  ┌────────────────────────────┐  │
│  │  MovieRepository           │  │
│  │  UserRepository            │  │
│  │  Models (types.ts)         │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### ¿Por qué esta arquitectura es REAL?

1. **Data tiene SOLO datos**: Modelos y repositorios, sin lógica de negocio
2. **Business tiene TODA la lógica**: Servicios, factories, strategies, facade
3. **App es SOLO UI**: React components, sin lógica de negocio
4. **Separación clara de responsabilidades**: Cada capa solo conoce la capa inferior
5. **Independencia**: Puedes cambiar la UI sin tocar la lógica de negocio

---

## ✅ Principios SOLID

### **S - Single Responsibility Principle** (Responsabilidad Única)

Cada clase tiene **UNA y solo UNA** responsabilidad:

| Clase | Responsabilidad | Ubicación |
|-------|----------------|-----------|
| `MovieRepository` | Solo acceso a datos de películas | `data/repositories/MovieRepository.ts` |
| `UserRepository` | Solo acceso a datos de usuarios | `data/repositories/UserRepository.ts` |
| `NetflixService` | Solo lógica de negocio de Netflix | `business/services/NetflixService.ts` |
| `NetflixFacade` | Solo simplificar el acceso al sistema | `business/facades/NetflixFacade.ts` |
| `MovieFactory` | Solo crear películas | `business/factories/MovieFactory.ts` |

**Ejemplo en código**:
```typescript
// MovieRepository solo maneja datos, nada de lógica de negocio
export class MovieRepository implements IMovieRepository {
  private movies: Movie[] = [];

  getAllMovies(): Movie[] { /* ... */ }
  searchMovies(query: string): Movie[] { /* ... */ }
}
```

---

### **O - Open/Closed Principle** (Abierto/Cerrado)

Abierto para **extensión**, cerrado para **modificación**.

**Ejemplo**: Puedes agregar una nueva estrategia de recomendación sin modificar `NetflixService`:

```typescript
// ✅ PUEDES agregar esta nueva estrategia:
export class YearBasedStrategy implements RecommendationStrategy {
  recommend(movies: Movie[], user: UserProfile): Movie[] {
    return movies.filter(m => m.year >= 2020);
  }
}

// ❌ NO necesitas modificar NetflixService
// Solo la usas:
const strategy = new YearBasedStrategy();
recommendationContext.setStrategy(strategy);
```

**Implementado en**: `business/services/NetflixService.ts:46-74`

---

### **L - Liskov Substitution Principle** (Sustitución de Liskov)

Las estrategias son **completamente intercambiables** sin romper el código:

```typescript
// Todas estas estrategias son intercambiables:
const strategy1 = new GenreRecommendationStrategy();
const strategy2 = new RatingRecommendationStrategy();
const strategy3 = new PopularityRecommendationStrategy();
const strategy4 = new HybridRecommendationStrategy();

// Cualquiera funciona igual:
recommendationContext.setStrategy(strategy1); // ✅
recommendationContext.setStrategy(strategy2); // ✅
```

**Implementado en**: `business/strategies/RecommendationStrategy.ts`

---

### **I - Interface Segregation Principle** (Segregación de Interfaces)

Interfaces **pequeñas y específicas**, no interfaces gordas:

```typescript
// ✅ BIEN: Interfaces específicas
export interface IMovieRepository {
  getAllMovies(): Movie[];
  searchMovies(query: string): Movie[];
}

export interface IUserRepository {
  getProfile(userId: string): UserProfile | undefined;
  addToWatchHistory(userId: string, movieId: string): void;
}

// ❌ MAL: Interface gorda que hace de todo
// interface IRepository {
//   getAllMovies(), getUsers(), addMovie(), deleteUser() ...
// }
```

**Implementado en**:
- `data/repositories/MovieRepository.ts:6-11`
- `data/repositories/UserRepository.ts:5-9`

---

### **D - Dependency Inversion Principle** (Inversión de Dependencias)

Las clases dependen de **abstracciones (interfaces)**, no de implementaciones concretas:

```typescript
// ✅ BIEN: Depende de interfaces
export class NetflixService {
  constructor(
    private movieRepository: IMovieRepository,    // ← Interface
    private userRepository: IUserRepository       // ← Interface
  ) {}
}

// ❌ MAL: Depender de clases concretas
// constructor(
//   private movieRepository: MovieRepository,    // ← Clase concreta
// ) {}
```

**Implementado en**: `business/services/NetflixService.ts:22-25`

---

## 🎨 Patrones de Diseño

### 🔨 **Patrón Creacional: Factory Method**

**Ubicación**: `src/business/factories/MovieFactory.ts`

**¿Qué hace?**: Crea diferentes tipos de películas según el género, sin exponer la lógica de creación.

**Estructura**:
```typescript
// Interface base
export interface MovieFactory {
  createMovie(id, title, rating, ...): Movie;
}

// Factories concretas
export class DramaMovieFactory implements MovieFactory { /* ... */ }
export class ActionMovieFactory implements MovieFactory { /* ... */ }
export class HorrorMovieFactory implements MovieFactory { /* ... */ }
export class ComedyMovieFactory implements MovieFactory { /* ... */ }

// Manager que coordina
export class MovieFactoryManager {
  private factories = new Map<MovieGenre, MovieFactory>([
    [MovieGenre.DRAMA, new DramaMovieFactory()],
    [MovieGenre.ACTION, new ActionMovieFactory()],
    // ...
  ]);
}
```

**Uso**:
```typescript
const factoryManager = new MovieFactoryManager();
const movie = factoryManager.createMovie(
  MovieGenre.DRAMA,
  '1',
  'El Padrino',
  9.2,
  15000,
  1972,
  'Historia de la mafia'
);
```

**Beneficios**:
- ✅ Centraliza la creación de objetos
- ✅ Fácil agregar nuevos tipos (ej: `SciFiMovieFactory`)
- ✅ Cumple Open/Closed Principle

---

### ⚡ **Patrón de Comportamiento: Strategy**

**Ubicación**: `src/business/strategies/RecommendationStrategy.ts`

**¿Qué hace?**: Define una familia de algoritmos de recomendación intercambiables en tiempo de ejecución.

**Estructura**:
```typescript
// Interface base
export interface RecommendationStrategy {
  recommend(movies: Movie[], user: UserProfile, limit?: number): Movie[];
}

// Estrategias concretas
export class GenreRecommendationStrategy implements RecommendationStrategy {
  recommend(movies, user, limit) {
    // Recomienda según géneros favoritos del usuario
    return movies.filter(m => user.favoriteGenres.includes(m.genre))
                 .sort((a, b) => b.rating - a.rating)
                 .slice(0, limit);
  }
}

export class RatingRecommendationStrategy implements RecommendationStrategy {
  recommend(movies, user, limit) {
    // Recomienda las mejor valoradas
    return movies.sort((a, b) => b.rating - a.rating).slice(0, limit);
  }
}

export class PopularityRecommendationStrategy { /* más populares */ }
export class HybridRecommendationStrategy { /* combina factores */ }

// Context que usa la estrategia
export class RecommendationContext {
  constructor(private strategy: RecommendationStrategy) {}

  setStrategy(strategy: RecommendationStrategy): void {
    this.strategy = strategy; // ← Cambia en tiempo de ejecución
  }

  execute(movies, user, limit) {
    return this.strategy.recommend(movies, user, limit);
  }
}
```

**Uso**:
```typescript
// Crear contexto con estrategia inicial
const context = new RecommendationContext(new GenreBasedStrategy());

// Obtener recomendaciones
let recommendations = context.execute(movies, user, 5);

// Cambiar estrategia en tiempo de ejecución
context.setStrategy(new RatingRecommendationStrategy());
recommendations = context.execute(movies, user, 5);
```

**Beneficios**:
- ✅ Separa el algoritmo de quien lo usa (Open/Closed)
- ✅ Fácil agregar nuevas estrategias
- ✅ Algoritmos intercambiables dinámicamente

---

### 🔧 **Patrón Estructural: Facade**

**Ubicación**: `src/business/facades/NetflixFacade.ts`

**¿Qué hace?**: Proporciona una interfaz **simple** para un sistema **complejo** de 3 capas.

**Estructura**:
```typescript
export class NetflixFacade {
  private netflixService: NetflixService;

  constructor() {
    // Inyección de dependencias (oculta la complejidad)
    const movieRepo = new MovieRepository();
    const userRepo = new UserRepository();
    this.netflixService = new NetflixService(movieRepo, userRepo);
  }

  // Métodos simples que ocultan la complejidad
  getRecommendations(userId, type, limit) {
    return this.netflixService.getRecommendations(userId, type, limit);
  }

  searchMovies(query) {
    return this.netflixService.searchMovies(query);
  }

  getAllMovies() {
    return this.netflixService.getAllMovies();
  }
}
```

**Uso en la UI**:
```typescript
// La UI solo necesita esto:
const netflixFacade = new NetflixFacade();

// Simple y claro:
const recommendations = netflixFacade.getRecommendations('1', 'hybrid', 5);
const movies = netflixFacade.searchMovies('action');
```

**Beneficios**:
- ✅ Oculta la complejidad del sistema
- ✅ Interfaz simple para la UI
- ✅ Reduce acoplamiento entre capas
- ✅ La UI no necesita conocer Repositories, Services, Strategies

**Lo que oculta**:
- ❌ No necesitas saber que hay repositorios
- ❌ No necesitas saber sobre strategies
- ❌ No necesitas saber sobre factories
- ✅ Solo usas métodos simples del Facade

---

## 📁 Estructura de Archivos Detallada

### **CAPA 1: Data/Persistence**

#### `data/models/types.ts`
Define las interfaces del dominio:
```typescript
export enum MovieGenre {
  DRAMA = 'Drama',
  ACTION = 'Acción',
  HORROR = 'Terror',
  COMEDY = 'Comedia',
}

export interface Movie {
  id: string;
  title: string;
  genre: MovieGenre;
  rating: number;
  popularity: number;
  year: number;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  favoriteGenres: MovieGenre[];
  watchHistory: string[];
}
```

#### `data/repositories/MovieRepository.ts`
Maneja el acceso a datos de películas:
- `getAllMovies()`: Retorna todas las películas
- `searchMovies(query)`: Busca por título, género o descripción
- `getMoviesByGenre(genre)`: Filtra por género
- `addMovie(movie)`: Agrega nueva película

#### `data/repositories/UserRepository.ts`
Maneja el acceso a datos de usuarios:
- `getAllProfiles()`: Retorna todos los usuarios
- `getProfile(userId)`: Busca usuario por ID
- `addToWatchHistory(userId, movieId)`: Registra película vista

---

### **CAPA 2: Business Logic**

#### `business/services/NetflixService.ts`
Lógica de negocio principal:
- Coordina Repositories, Factories y Strategies
- Implementa Dependency Inversion (usa interfaces)
- Métodos: `getRecommendations()`, `searchMovies()`, `addMovie()`

#### `business/factories/MovieFactory.ts`
Patrón Factory Method para crear películas

#### `business/strategies/RecommendationStrategy.ts`
Patrón Strategy con 4 algoritmos de recomendación

#### `business/facades/NetflixFacade.ts`
Patrón Facade que simplifica el acceso

---

### **CAPA 3: Presentation**

#### `app/page.tsx`
Interfaz de usuario React:
- Usa solo NetflixFacade (no conoce las capas internas)
- Muestra recomendaciones
- Permite buscar películas
- Cambia estrategias dinámicamente

---

## 🔄 Flujo de Datos

### Flujo de una Recomendación

```
1. Usuario hace clic en "Recomendaciones por Género"
   │
   ├─→ app/page.tsx (CAPA 3: Presentation)
   │   │
   │   └─→ netflixFacade.getRecommendations('1', 'genre', 5)
   │
   ├─→ business/facades/NetflixFacade.ts (CAPA 2: Business)
   │   │
   │   └─→ netflixService.getRecommendations('1', 'genre', 5)
   │
   ├─→ business/services/NetflixService.ts (CAPA 2: Business)
   │   │
   │   ├─→ userRepository.getProfile('1') → Obtiene usuario
   │   │
   │   ├─→ movieRepository.getAllMovies() → Obtiene películas
   │   │
   │   └─→ recommendationContext.setStrategy(new GenreStrategy())
   │       └─→ recommendationContext.execute(movies, user, 5)
   │
   ├─→ business/strategies/GenreBasedStrategy.ts (CAPA 2: Business)
   │   │
   │   └─→ Filtra películas por géneros favoritos del usuario
   │
   └─→ Retorna array de películas recomendadas
       │
       └─→ Se muestra en la UI
```

---

## 🎯 Guía de Defensa

### Explicación de la Arquitectura (30 segundos)

> "Implementé un sistema de recomendación de películas con arquitectura de 3 capas. La capa de Data maneja el acceso a datos con repositorios, la capa de Business tiene toda la lógica con servicios, strategies y factories, y la capa de Presentation es solo la UI de React."

### Mostrar las Capas (1 minuto)

**Abrir en VSCode**:
1. `src/data/` → "Repositorios y modelos, solo datos"
2. `src/business/` → "Toda la lógica de negocio y patrones"
3. `src/app/page.tsx` → "Solo la interfaz, usa el Facade"

### Explicar SOLID (1 minuto)

**S**: "MovieRepository solo maneja datos de películas, nada más"

**O**: "Puedo agregar una nueva estrategia sin modificar NetflixService" → Mostrar `RecommendationStrategy.ts`

**D**: "NetflixService depende de IMovieRepository (interfaz), no de MovieRepository (clase)" → Mostrar constructor línea 22

### Explicar Patrones (1.5 minutos)

**Factory**: Abrir `business/factories/MovieFactory.ts`
> "Tengo 4 factories (Drama, Action, Horror, Comedy) que crean películas según el género"

**Strategy**: Abrir `business/strategies/RecommendationStrategy.ts`
> "Tengo 4 estrategias de recomendación que se pueden intercambiar dinámicamente. Esto es Open/Closed en acción."

**Facade**: Abrir `business/facades/NetflixFacade.ts`
> "El Facade simplifica todo. La UI solo llama `getRecommendations()` y no necesita saber de repositorios o strategies."

### Ejecutar (30 segundos)

```bash
npm run dev
```

Mostrar:
1. Cambiar estrategias en la UI
2. Buscar películas
3. Ver recomendaciones personalizadas

---

## 📊 Resumen Visual

| Aspecto | Implementación |
|---------|---------------|
| **Arquitectura** | 3 Capas: Data → Business → Presentation |
| **Principio S** | Cada clase una responsabilidad |
| **Principio O** | 4 estrategias extensibles |
| **Principio L** | Estrategias intercambiables |
| **Principio I** | Interfaces específicas |
| **Principio D** | Dependencias por interfaces |
| **Patrón Creacional** | Factory Method (4 factories) |
| **Patrón Comportamiento** | Strategy (4 estrategias) |
| **Patrón Estructural** | Facade (simplifica acceso) |
| **Archivos principales** | 9 archivos TypeScript |
| **Líneas de código** | ~500 líneas totales |

---

## 🏆 Ventajas de esta Arquitectura

✅ **Mantenible**: Cambios en una capa no afectan a las demás

✅ **Testeable**: Cada componente se puede probar aisladamente

✅ **Extensible**: Agregar funcionalidades sin modificar código existente

✅ **Escalable**: Fácil agregar más repositorios, servicios o strategies

✅ **Profesional**: Arquitectura real usada en producción

✅ **SOLID**: Todos los principios implementados correctamente

---

## 📚 Tecnologías

- **Next.js 16**: Framework React
- **TypeScript 5**: Tipado estático
- **React 19**: Biblioteca UI
- **Tailwind CSS 4**: Estilos

---

**Autor**: Desarrollo académico - Arquitectura de Software
**Fecha**: Noviembre 2025
