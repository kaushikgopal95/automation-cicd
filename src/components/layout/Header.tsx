
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  onAuthClick: (mode: 'signin' | 'signup') => void;
  onCartClick: () => void;
  onSearch: (query: string) => void;
}

export const Header = ({ onAuthClick, onCartClick, onSearch }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('cart')
        .select('*, products(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleNavigation = (sectionId: string) => {
    // Handle special cases for navigation
    if (sectionId === 'about') {
      // For now, scroll to footer until we have a dedicated about page
      const element = document.getElementById('footer');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (sectionId === 'care') {
      // Scroll to newsletter section for plant care info
      const element = document.getElementById('newsletter');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-green-400 cursor-pointer" data-testid="logo" onClick={() => handleNavigation('hero')}>
              PlantCraft
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('featured-products')} 
              className="text-gray-300 hover:text-green-400 transition-colors" 
              data-testid="nav-plants"
            >
              Plants
            </button>
            <button 
              onClick={() => handleNavigation('categories')} 
              className="text-gray-300 hover:text-green-400 transition-colors" 
              data-testid="nav-crafts"
            >
              Crafts
            </button>
            <button 
              onClick={() => handleNavigation('care')} 
              className="text-gray-300 hover:text-green-400 transition-colors" 
              data-testid="nav-care"
            >
              Plant Care
            </button>
            <button 
              onClick={() => handleNavigation('about')} 
              className="text-gray-300 hover:text-green-400 transition-colors" 
              data-testid="nav-about"
            >
              About
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                data-testid="search-input"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  data-testid="sign-out-btn"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAuthClick('signin')}
                  className="text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  data-testid="sign-in-btn"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAuthClick('signup')}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                  data-testid="sign-up-btn"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="relative text-gray-300 hover:text-green-400 hover:bg-gray-800"
              data-testid="cart-btn"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-green-600 text-white min-w-[20px] h-5 flex items-center justify-center text-xs shadow-md"
                  data-testid="cart-badge"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:bg-gray-800"
              data-testid="mobile-menu-btn"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4 bg-gray-800/50" data-testid="mobile-menu">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation('featured-products')} 
                className="text-gray-300 hover:text-green-400 transition-colors px-4 py-2 hover:bg-gray-800 rounded text-left"
              >
                Plants
              </button>
              <button 
                onClick={() => handleNavigation('categories')} 
                className="text-gray-300 hover:text-green-400 transition-colors px-4 py-2 hover:bg-gray-800 rounded text-left"
              >
                Crafts
              </button>
              <button 
                onClick={() => handleNavigation('care')} 
                className="text-gray-300 hover:text-green-400 transition-colors px-4 py-2 hover:bg-gray-800 rounded text-left"
              >
                Plant Care
              </button>
              <button 
                onClick={() => handleNavigation('about')} 
                className="text-gray-300 hover:text-green-400 transition-colors px-4 py-2 hover:bg-gray-800 rounded text-left"
              >
                About
              </button>
              
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => onAuthClick('signin')}
                    className="justify-start text-gray-300 hover:text-green-400 hover:bg-gray-800"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => onAuthClick('signup')}
                    className="justify-start bg-green-600 hover:bg-green-700 text-white shadow-md"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
