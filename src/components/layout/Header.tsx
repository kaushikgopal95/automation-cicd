
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  LogOut,
  ChevronDown,
  Leaf
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthDrawer } from "@/components/auth/AuthDrawer";

interface HeaderProps {
  onAuthClick: (mode?: 'signin' | 'signup') => void;
  onCartClick: () => void;
}

const navigation = [
  { name: 'Shop', path: '#shop', scrollTo: 'featured-products' },
  { name: 'About Us', path: '#about', scrollTo: 'about' },
  { name: 'Contact', path: '/contact' },
];

export const Header = ({ onAuthClick, onCartClick }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  const cartItemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };



  const isActive = (path: string) => {
    if (path.startsWith('#')) {
      return location.hash === path;
    }
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const handleNavigation = (path: string, scrollTo?: string) => {
    if (path.startsWith('#')) {
      // For hash links, scroll to the section
      const element = document.getElementById(scrollTo || path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // For regular paths, navigate to the route
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
  <img 
    src="/logo.png" 
    alt="PlantBot Logo" 
    className="h-8 w-8 object-contain"
  />
  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent" data-testid="logo">
    PlantBot
  </h1>
</a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path, item.scrollTo)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.path) 
                    ? 'text-green-400 bg-gray-800' 
                    : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                } transition-colors`}
              >
                {item.name}
              </button>
            ))}
          </nav>



          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-green-400 hover:bg-gray-800 flex items-center gap-1"
                  >
                    <User className="h-4 w-4" />
                    Profile
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onAuthClick('signin')}
                  className="text-gray-300 hover:text-white px-4 h-9"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onAuthClick('signup')}
                  className="text-white border-green-600 bg-green-600/10 hover:bg-green-600/20 hover:border-green-500 px-4 h-9 transition-colors"
                >
                  Create Account
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
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path, item.scrollTo)}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    isActive(item.path) 
                      ? 'text-green-400 bg-gray-800' 
                      : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                  } transition-colors`}
                >
                  {item.name}
                </button>
              ))}
              
              {!user && (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700 px-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onAuthClick();
                      setIsMenuOpen(false);
                    }}
                    className="h-12 justify-start text-gray-300 hover:text-white hover:bg-gray-800 w-full text-base"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onAuthClick();
                      setIsMenuOpen(false);
                    }}
                    className="h-12 justify-center text-white bg-green-600 border-green-600 hover:bg-green-600/90 hover:border-green-500 w-full text-base font-medium"
                  >
                    Create Account
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
