
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Categories } from "@/components/sections/Categories";
import { PlantCare } from "@/components/sections/PlantCare";
import { AboutUs } from "@/components/sections/AboutUs";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/layout/Footer";
import { AuthDrawer } from "@/components/auth/AuthDrawer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showCart, setShowCart] = useState(false);
  const { user } = useAuth();

  // Listen for custom cart events from other pages
  useEffect(() => {
    const handleCartEvent = (event: CustomEvent) => {
      if (event.detail?.action === 'open') {
        setShowCart(true);
      }
    };

    window.addEventListener('openCart', handleCartEvent as EventListener);
    
    return () => {
      window.removeEventListener('openCart', handleCartEvent as EventListener);
    };
  }, []);

  const handleAuthClick = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setShowAuthDrawer(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDrawer(false);
  };

  // Handle Get Started button click based on auth status
  const handleGetStarted = () => {
    if (user) {
      // User is logged in, scroll to featured products
      const featuredSection = document.getElementById('featured-products');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // User is not logged in, open signup drawer
      handleAuthClick('signup');
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      <Header 
        onAuthClick={() => handleAuthClick('signin')}
        onCartClick={() => setShowCart(true)}
      />
      
      <main>
        <section id="hero">
          <Hero onGetStarted={handleGetStarted} />
        </section>
        <section id="featured-products">
          <FeaturedProducts />
        </section>
        <section id="about" className="py-16 md:py-24 bg-gray-900">
          <AboutUs />
        </section>
        <section id="newsletter">
          <Newsletter />
        </section>
      </main>
      
      <Footer />
      
      <AuthDrawer 
        isOpen={showAuthDrawer}
        onClose={() => setShowAuthDrawer(false)}
        initialMode={authMode}
      />
      
      <CartSidebar 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </div>
  );
};

export default Index;
