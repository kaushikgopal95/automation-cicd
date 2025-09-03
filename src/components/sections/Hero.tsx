
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Star, Heart, ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/use-product-search";
import { useAuth } from "@/contexts/AuthContext";

interface HeroProps {
  onGetStarted?: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const { user, isLoading } = useAuth();
  
  // Fetch featured products count for dynamic stats
  const { data: featuredProducts = [] } = useFeaturedProducts(50);
  const featuredProductsCount = featuredProducts.length;

  const handleShopNow = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-green-400 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-green-300 rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-green-600/30">
            <Leaf className="h-4 w-4" />
            <span>Premium Quality Plants and Saplings</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-6 leading-tight" data-testid="hero-title">
            Bring Nature
            <span className="text-green-400 block">Into Your House</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
            Discover our curated collection of beautiful indoor plants and handcrafted decor. 
            Transform your space into a green sanctuary.
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 mb-10 text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-400" />
              <span className="text-sm">10k+ Happy Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-400" />
              <span className="text-sm">Eco-Friendly</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold group"
              onClick={isLoading ? undefined : (onGetStarted || handleShopNow)}
              data-testid="get-started-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : user ? 'Shop Now' : 'Get Started'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2" data-testid="stat-products">{featuredProductsCount}+</div>
              <div className="text-gray-400">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2" data-testid="stat-shipping">Free</div>
              <div className="text-gray-400">Shipping Over $50</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2" data-testid="stat-guarantee">30-Day</div>
              <div className="text-gray-400">Care Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
