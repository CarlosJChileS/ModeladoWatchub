import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/ui/hero-section";
import { ContentRow } from "@/components/ui/content-row";
import { TopTenRow } from "@/components/ui/top-ten-row";
import { MovieDetailModal } from "@/components/ui/movie-detail-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Star, TrendingUp, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOMDbMovies } from "@/hooks/useOMDbMovies";

const Index = () => {
  const { user } = useAuth();
  const { movies: omdbMovies, loading, getPopularMovies } = useOMDbMovies();
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
    } else {
      // Load popular movies from OMDb
      getPopularMovies();
    }
  }, [user, navigate]); // Removed getPopularMovies from dependencies

  if (!user) {
    return null;
  }

  // Only show loading spinner if we're loading and don't have any movies yet
  if (loading && omdbMovies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Convert OMDb movies to the format expected by the components
  const popularMovies = omdbMovies.slice(0, 10).map(movie => ({
    id: movie.imdb_id,
    title: movie.title,
    image: movie.poster_url,
    genre: movie.genre?.join(', ') || 'N/A',
    description: movie.description,
    rating: movie.rating?.toString() || 'N/A',
    year: movie.release_year?.toString() || 'N/A',
    cast: movie.cast || [],
    director: movie.director || 'N/A'
  }));

  const topTenToday = popularMovies.slice(0, 10).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    image: movie.image,
    rank: index + 1,
    category: movie.genre
  }));

  // If no movies loaded yet and not loading, show a message
  if (!loading && omdbMovies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h2 className="text-2xl font-semibold mb-4">Cargando contenido...</h2>
          <p className="text-muted-foreground">
            Estamos preparando las mejores películas para ti.
          </p>
        </div>
      </div>
    );
  }

  const handleContentClick = (content: any) => {
    // Convert OMDb movie format to modal format if needed
    const modalContent = {
      id: content.imdb_id || content.id,
      title: content.title,
      image: content.poster_url || content.image,
      rating: content.rating?.toString(),
      duration: content.duration ? `${Math.floor(content.duration / 60)}h ${content.duration % 60}m` : content.duration,
      category: content.genre?.join(', ') || content.category,
      year: content.release_year?.toString() || content.year,
      description: content.description,
      cast: content.cast,
      director: content.director
    };
    
    setSelectedContent(modalContent);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection 
        movies={omdbMovies.slice(0, 5)} // Pass first 5 movies for rotation
        onMovieClick={handleContentClick}
      />

      {/* Content Sections */}
      <div className="space-y-8 pb-16">
        {/* Top 10 Today */}
        <TopTenRow 
          title="Top 10"
          items={topTenToday}
        />

        {/* Popular Movies from OMDb */}
        <ContentRow
          title="Películas Populares"
          subtitle="Las mejores películas según OMDb"
          items={popularMovies}
          onItemClick={handleContentClick}
        />

        {/* Call to Action Section */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 fill-current" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Descubre tu próxima película favorita
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 lg:mb-8">
                Explora nuestra colección de películas seleccionadas con datos reales de IMDb
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <button 
                  onClick={() => navigate("/categories")}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Buscar Películas
                </button>
                <button 
                  onClick={() => navigate("/subscriptions")}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/80 text-accent-foreground px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  Ver Planes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        content={selectedContent}
      />
    </div>
  );
};

export default Index;
