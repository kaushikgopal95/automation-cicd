
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedProducts, searchProducts } from "@/data/products";
import { Input } from "@/components/ui/input";

const CARD_WIDTH = 320; // Approximate width of each product card including gap

export const FeaturedProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxVisibleCards, setMaxVisibleCards] = useState(4);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If input is cleared, reset the search immediately
    if (!value.trim()) {
      setSearchTerm("");
    }
  };

  // Handle search submission
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery);
      // Scroll to products section when searching
      const featuredSection = document.getElementById('featured-products');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Clear search if query is empty
      setSearchTerm("");
    }
  }, [searchQuery]);

  // Fetch products based on search term
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: async () => {
      if (searchTerm) {
        return searchProducts(searchTerm);
      }
      return getFeaturedProducts();
    },
    refetchOnWindowFocus: false,
  });

  // Handle window resize to update visible cards
  useEffect(() => {
    const updateMaxVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 640) return setMaxVisibleCards(1);
      if (width < 768) return setMaxVisibleCards(2);
      if (width < 1024) return setMaxVisibleCards(3);
      return setMaxVisibleCards(4);
    };

    updateMaxVisibleCards();
    window.addEventListener('resize', updateMaxVisibleCards);
    return () => window.removeEventListener('resize', updateMaxVisibleCards);
  }, []);

  // Handle navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= products.length - maxVisibleCards ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? Math.max(0, products.length - maxVisibleCards) : prevIndex - 1
    );
  };

  if (error) {
    console.error('Error in FeaturedProducts:', error);
    return (
      <section id="featured-products" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl text-red-500">Error loading products</h2>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products" className="py-12 bg-gray-950 relative" data-testid="featured-products">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6" data-testid="featured-title">
            {searchTerm ? 'Search Results' : 'Featured Plants'}
          </h2>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search plants..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  // Clear search immediately when pressing Escape
                  if (e.key === 'Escape' && searchQuery) {
                    setSearchQuery('');
                    setSearchTerm('');
                  }
                }}
                className="pl-10 pr-4 py-6 text-base bg-gray-800 border-gray-700 focus:border-green-500 focus:ring-green-500 text-gray-100 placeholder-gray-400"
              />
              <Button 
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 px-6 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </div>
          
          {searchTerm ? (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {products.length > 0 
                ? `Found ${products.length} ${products.length === 1 ? 'result' : 'results'} for "${searchTerm}"`
                : `No results found for "${searchTerm}"`
              }
            </p>
          ) : (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Handpicked favorites that bring life and beauty to your space
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-x-6 hover:scale-110"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-gray-800/80 hover:bg-gray-700/90 text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-6 hover:scale-110"
            aria-label="Next products"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Products Carousel */}
          <div 
            ref={containerRef}
            className="overflow-hidden relative"
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-6 py-4"
              style={{
                transform: `translateX(-${currentIndex * (CARD_WIDTH + 24)}px)`,
                width: `${products.length * (CARD_WIDTH + 24)}px`
              }}
            >
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[300px] space-y-4 animate-pulse">
                    <div className="aspect-square bg-gray-800 rounded-lg" />
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                  </div>
                ))
              ) : (
                // Actual products
                products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[300px]">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
