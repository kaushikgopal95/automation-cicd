
import { useState } from "react";
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

const Index = () => {
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showCart, setShowCart] = useState(false);
  const handleAuthClick = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setShowAuthDrawer(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthDrawer(false);
  };



  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden">
      <Header 
        onAuthClick={() => handleAuthClick('signin')}
        onCartClick={() => setShowCart(true)}
      />
      
      <main>
        <section id="hero">
          <Hero onGetStarted={() => handleAuthClick('signup')} />
        </section>
        <section id="featured-products">
          <FeaturedProducts />
        </section>
        {/* Commented out as per request
        <section id="categories">
          <Categories />
        </section>
        <section id="plant-care">
          <PlantCare />
        </section>
        <section id="about">
          <AboutUs />
        </section>
        */}
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
