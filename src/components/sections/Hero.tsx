
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Heart, Star } from "lucide-react";

export const Hero = () => {
  const handleShopNow = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
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
            <span>Premium Quality Plants & Crafts</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-6 leading-tight" data-testid="hero-title">
            Bring Nature
            <span className="text-green-400 block">Into Your Home</span>
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
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg" 
              onClick={handleShopNow}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold group shadow-lg"
              data-testid="shop-now-btn"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLearnMore}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-green-400 px-8 py-4 text-lg font-semibold shadow-lg"
              data-testid="learn-more-btn"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2" data-testid="stat-products">50+</div>
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
