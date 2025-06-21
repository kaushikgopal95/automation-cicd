
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  difficulty_level?: string;
  stock_quantity: number;
  sku: string;
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user || null;
    },
  });

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

      // Refresh cart data
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
      case 'beginner': return 'bg-green-600';
      case 'intermediate': return 'bg-yellow-600';
      case 'advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 group overflow-hidden" data-testid={`product-card-${product.sku}`}>
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid="product-image"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            data-testid="quick-view-btn"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            data-testid="wishlist-btn"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Badge */}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <Badge className="absolute top-2 right-2 bg-yellow-600 text-white" data-testid="low-stock-badge">
            Low Stock
          </Badge>
        )}
        
        {product.stock_quantity === 0 && (
          <Badge className="absolute top-2 right-2 bg-red-600 text-white" data-testid="out-of-stock-badge">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-green-400 transition-colors" data-testid="product-name">
              {product.name}
            </h3>
            {product.categories && (
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-700 mt-1">
                {product.categories.name}
              </Badge>
            )}
          </div>
          {product.difficulty_level && (
            <Badge className={`text-xs text-white ${getDifficultyColor(product.difficulty_level)}`} data-testid="difficulty-badge">
              {product.difficulty_level}
            </Badge>
          )}
        </div>

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

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-400" data-testid="product-price">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500">SKU: {product.sku}</span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock_quantity === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
            data-testid="add-to-cart-btn"
          >
            {isLoading ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
