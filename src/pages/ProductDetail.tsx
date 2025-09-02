import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Star, LogOut, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useProductById } from "@/hooks/use-product-search";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { getProductImage } from "@/utils/product-utils";

// Simple Image Component
const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  
  // Process the image source when it changes
  useEffect(() => {
    if (!src) {
      setImgSrc('/default-plant.png');
      return;
    }
    
    // If it's a local path, ensure it starts with a slash
    if (!src.startsWith('http') && !src.startsWith('blob:')) {
      setImgSrc(src.startsWith('/') ? src : `/${src}`);
    } else {
      setImgSrc(src);
    }
  }, [src]);

  return (
    <div className="aspect-square overflow-hidden rounded-lg bg-gray-900 relative">
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            // Fallback to default plant image if the specified image fails to load
            setImgSrc('/default-plant.png');
            setIsLoading(false);
          }}
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}
    </div>
  );
};

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [productImage, setProductImage] = useState<string>('');
  const [showCart, setShowCart] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useProductById(productId);

  // Update product image when product data changes
  useEffect(() => {
    if (product) {
      // Use the product's image_url if available, otherwise fallback to name-based mapping
      if (product.image_url) {
        setProductImage(product.image_url);
      } else if (product.name) {
        setProductImage(getProductImage(product.name));
      } else {
        setProductImage('/placeholder.svg');
      }
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity,
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) throw error;

      toast({
        title: 'Added to cart',
        description: `${quantity} × ${product.name} has been added to your cart`,
      });

      // Invalidate cart query to refresh the cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCartClick = () => {
    // Open cart sidebar locally on this page
    setShowCart(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-800 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                <div className="h-6 bg-gray-800 rounded w-1/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                <div className="h-24 bg-gray-800 rounded"></div>
                <div className="h-12 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Product detail error:', error);
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error loading product</h1>
          <p className="text-gray-400 mb-6">
            {error.message.includes('not found') 
              ? 'The requested product could not be found.' 
              : 'There was an error loading the product details.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="border-gray-700 hover:bg-gray-800"
            >
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleCartClick}
                className="flex items-center gap-2 hover:bg-gray-800"
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
              </Button>
              
              {user && (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 hover:bg-gray-800 text-red-400 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image - Reduced Size */}
          <div className="lg:col-span-1">
            <div className="max-w-sm mx-auto">
              <ProductImage 
                src={productImage} 
                alt={product.name}
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-100 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-400">(0 reviews)</span>
              </div>
              <div className="text-3xl font-bold text-green-400">${product.price}</div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Quantity:</label>
              <div className="flex items-center border border-gray-600 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-800"
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-800"
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold px-8"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            
            {/* Dynamic Stock Status */}
            <div className="text-sm text-gray-400">
              {product.stock_quantity > 0 ? (
                <span className="text-green-400">
                  In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="text-red-400">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">How do I care for this plant?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                This plant thrives in bright, indirect light and requires moderate watering. Allow the soil to dry slightly between waterings and avoid overwatering.
              </p>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">What's the delivery time?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We offer free shipping on orders over $50. Standard delivery takes 3-5 business days, while express shipping is available for next-day delivery.
              </p>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">Is this plant pet-friendly?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Most of our plants are pet-friendly, but we recommend keeping them out of reach of curious pets. Check individual product descriptions for specific details.
              </p>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">What's your return policy?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We offer a 30-day care guarantee. If your plant doesn't thrive within 30 days, we'll replace it or provide a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </div>
  );
};

export default ProductDetail;
