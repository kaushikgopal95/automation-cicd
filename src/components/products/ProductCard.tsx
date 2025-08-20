
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [imageError, setImageError] = useState(false);
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

  const getProductImage = () => {
    // If there's an image URL and no error, use it
    if (product.image_url && !imageError) {
      return product.image_url;
    }

    // Fallback to category-specific images
    const plantImages = {
      monstera: 'https://images.unsplash.com/photo-1509315073520-7fadf8b73739?w=800&h=600&fit=crop&crop=center',
      snake: 'https://images.unsplash.com/photo-1595239244574-806db09dcd26?w=800&h=600&fit=crop&crop=center',
      fiddle: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?w=800&h=600&fit=crop&crop=center',
      pothos: 'https://images.unsplash.com/photo-1600411832666-9c9a0acb50cc?w=800&h=600&fit=crop&crop=center',
      succulent: 'https://images.unsplash.com/photo-1518977676601-b53fccabaac7?w=800&h=600&fit=crop&crop=center',
      default: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&crop=center'
    };

    const craftImages = {
      macrame: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&h=600&fit=crop&crop=center',
      ceramic: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
      planter: 'https://images.unsplash.com/photo-1515150144906-dae0426e5c9e?w=800&h=600&fit=crop&crop=center',
      default: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&h=600&fit=crop&crop=center'
    };

    const plantCareImages = {
      fertilizer: 'https://images.unsplash.com/photo-1597846255279-4b7a6d7c2c8c?w=800&h=600&fit=crop&crop=center',
      tools: 'https://images.unsplash.com/photo-1584308666744-5d72bbefd1f5?w=800&h=600&fit=crop&crop=center',
      default: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&h=600&fit=crop&crop=center'
    };

    // Check for specific product names in the product name
    const productName = product.name.toLowerCase();
    
    if (product.categories?.slug === 'indoor-plants') {
      if (productName.includes('monstera')) return plantImages.monstera;
      if (productName.includes('snake')) return plantImages.snake;
      if (productName.includes('fiddle')) return plantImages.fiddle;
      if (productName.includes('pothos')) return plantImages.pothos;
      if (productName.includes('succulent')) return plantImages.succulent;
      return plantImages.default;
    }
    
    if (product.categories?.slug === 'handmade-crafts') {
      if (productName.includes('macrame')) return craftImages.macrame;
      if (productName.includes('ceramic')) return craftImages.ceramic;
      if (productName.includes('planter')) return craftImages.planter;
      return craftImages.default;
    }
    
    if (product.categories?.slug === 'plant-care') {
      if (productName.includes('fertilizer')) return plantCareImages.fertilizer;
      if (productName.includes('tool') || productName.includes('set')) return plantCareImages.tools;
      return plantCareImages.default;
    }

    // Default fallback
    return 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=600&fit=crop&crop=center';
  };

  return (
    <Card className="bg-gray-900 border-gray-700 hover:border-green-500 transition-all duration-300 group overflow-hidden" data-testid={`product-card-${product.sku}`}>
      <div className="relative overflow-hidden">
        <img
          src={getProductImage()}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid="product-image"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <Button
            size="sm"
            variant="secondary"
            className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white border-gray-600"
            data-testid="quick-view-btn"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white border-gray-600"
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
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-600 mt-1">
                {product.categories.name}
              </Badge>
            )}
          </div>
          {product.difficulty_level && (
            <Badge className={`text-xs ${getDifficultyColor(product.difficulty_level)}`} data-testid="difficulty-badge">
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
            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
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
