
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, ChevronRight, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getProductImage } from "@/utils/product-utils";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
  sku: string;
  rating?: number;
  reviews?: number;
  category?: string;
  difficulty_level?: string;
  light_requirements?: string;
  water_needs?: string;
  humidity?: string;
  pet_friendly?: boolean;
  tags?: string[];
  details?: {
    height: string;
    width: string;
    origin: string;
    scientific_name: string;
    benefits: string[];
  };
  images?: string[];
  categories?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });

      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-600 text-white';
      case 'intermediate': return 'bg-yellow-600 text-white';
      case 'advanced': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card 
      className="group overflow-hidden bg-gray-900 border border-gray-800 hover:border-green-500/50 transition-all duration-300 h-full flex flex-col hover:shadow-lg hover:shadow-green-500/10"
    >
      <div className="relative aspect-square overflow-hidden">
        <div 
          className="w-full h-full cursor-pointer"
          onClick={handleViewDetails}
        >
          <img
            src={getProductImage(product.name)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>
        
        <div className="absolute top-2 left-2 flex flex-col space-y-2">
          <Badge className={`${getDifficultyColor(product.difficulty_level)}`}>
            {product.difficulty_level || 'Easy'}
          </Badge>
          {product.stock_quantity === 0 && (
            <Badge className="bg-red-600 text-white" data-testid="out-of-stock-badge">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-green-400 transition-colors" data-testid="product-name">
              {product.name}
            </h3>
            {product.categories && (
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-600 mt-1">
                {product.categories.name}
              </Badge>
            )}
          </div>
          {product.rating !== undefined && (
            <div className="flex items-center bg-gray-800/80 rounded-full px-2 py-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-xs font-medium text-gray-200">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {product.difficulty_level && (
          <div className="mt-2">
            <Badge className={`text-xs ${getDifficultyColor(product.difficulty_level)}`} data-testid="difficulty-badge">
              {product.difficulty_level} Care Level
            </Badge>
          </div>
        )}

        <p className="text-gray-400 text-sm mb-4 line-clamp-2" data-testid="product-description">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
          ))}
          <span className="text-gray-400 text-sm ml-2">(4.8)</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-400" data-testid="product-price">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500">SKU: {product.sku}</span>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isLoading || product.stock_quantity === 0}
            className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors"
            data-testid="add-to-cart-btn"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
