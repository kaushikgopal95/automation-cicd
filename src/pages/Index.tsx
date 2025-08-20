
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Categories } from "@/components/sections/Categories";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartSidebar } from "@/components/cart/CartSidebar";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      console.log('Searching for:', query);
      // Scroll to products section when searching
      const featuredSection = document.getElementById('featured-products');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
      // TODO: Implement actual search functionality
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header 
        onAuthClick={handleAuthClick}
        onCartClick={() => setShowCart(true)}
        onSearch={handleSearch}
      />
      
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Newsletter />
      </main>
      
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
      
      <CartSidebar 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </div>
  );
};

export default Index;
