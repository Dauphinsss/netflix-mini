# Netflix Mini - Sistema de Recomendación de Películas

Un sistema de recomendación de películas que implementa tres patrones de diseño principales: **Factory Method**, **Strategy** y **Facade**.

## Patrones de Diseño Implementados

### 1. Factory Method (Patrón Creacional)

**Ubicación**: `src/patterns/factory/MovieFactory.ts`

Crea diferentes tipos de películas (Drama, Acción, Terror, Comedia) utilizando factories especializadas. Cada factory se encarga de crear películas con características específicas según su género.

**Clases principales**:
- `MovieFactory` (interfaz)
- `DramaMovieFactory`
- `ActionMovieFactory`
- `HorrorMovieFactory`
- `ComedyMovieFactory`
- `MovieFactoryManager` (gestiona todas las factories)

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
  'La historia de una familia mafiosa'
);
```

### 2. Strategy (Patrón de Comportamiento)

**Ubicación**: `src/patterns/strategy/RecommendationStrategy.ts`

Define una familia de algoritmos de recomendación intercambiables que pueden ser seleccionados en tiempo de ejecución.

**Estrategias disponibles**:
- `GenreRecommendationStrategy`: Recomienda basándose en los géneros favoritos del usuario
- `RatingRecommendationStrategy`: Recomienda las películas mejor calificadas
- `PopularityRecommendationStrategy`: Recomienda las películas más populares
- `HybridRecommendationStrategy`: Combina múltiples factores (género, rating, popularidad, año)

**Uso**:
```typescript
const context = new RecommendationContext(new GenreRecommendationStrategy());
const recommendations = context.executeStrategy(movies, user, 5);

// Cambiar estrategia en tiempo de ejecución
context.setStrategy(new RatingRecommendationStrategy());
const newRecommendations = context.executeStrategy(movies, user, 5);
```

### 3. Facade (Patrón Estructural)

**Ubicación**: `src/patterns/facade/NetflixFacade.ts`

Proporciona una interfaz simplificada para interactuar con el sistema complejo de Netflix, ocultando la complejidad de las factories, estrategias y servicios.

**Métodos principales**:
- `searchMovies(query)`: Busca películas por título, género o descripción
- `getRecommendations(userId, type, limit)`: Obtiene recomendaciones para un usuario
- `getMoviesByGenre(genre)`: Filtra películas por género
- `getAllMovies()`: Obtiene el catálogo completo
- `getUserProfiles()`: Obtiene todos los perfiles de usuario
- `watchMovie(userId, movieId)`: Registra que un usuario vio una película
- `addMovie(...)`: Agrega una nueva película al catálogo

**Uso**:
```typescript
const netflix = new NetflixFacade();

// Búsqueda simple
const results = netflix.searchMovies('action');

// Recomendaciones con estrategia híbrida
const recommendations = netflix.getRecommendations('1', 'hybrid', 5);

// Obtener perfiles
const profiles = netflix.getUserProfiles();
```

## Estructura del Proyecto

```
src/
├── types/
│   └── movie.ts                 # Interfaces y tipos (Movie, UserProfile, MovieGenre)
├── patterns/
│   ├── factory/
│   │   └── MovieFactory.ts      # Implementación del patrón Factory Method
│   ├── strategy/
│   │   └── RecommendationStrategy.ts  # Implementación del patrón Strategy
│   └── facade/
│       └── NetflixFacade.ts     # Implementación del patrón Facade
├── services/
│   └── UserProfileService.ts    # Servicio de gestión de perfiles
└── app/
    └── page.tsx                 # Componente UI principal
```

## Características

- **Perfiles de usuario**: 4 perfiles predefinidos con diferentes preferencias
- **Catálogo de películas**: 12 películas de diferentes géneros
- **Búsqueda en tiempo real**: Busca por título, género o descripción
- **4 estrategias de recomendación**: Híbrida, por género, por rating y por popularidad
- **Interfaz responsive**: Diseño adaptable con Tailwind CSS
- **UI estilo Netflix**: Colores oscuros y diseño moderno

## Ejecutar el proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tecnologías

- **Next.js 16**: Framework de React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **React 19**: Biblioteca de UI

## Ventajas de los Patrones Implementados

### Factory Method
- Desacopla la creación de objetos de su uso
- Facilita agregar nuevos tipos de películas sin modificar código existente
- Centraliza la lógica de creación

### Strategy
- Permite cambiar algoritmos en tiempo de ejecución
- Facilita agregar nuevas estrategias sin modificar las existentes
- Mejora la mantenibilidad y testing

### Facade
- Simplifica la interfaz del sistema
- Reduce el acoplamiento entre cliente y subsistemas
- Facilita el uso del sistema completo con una API simple
