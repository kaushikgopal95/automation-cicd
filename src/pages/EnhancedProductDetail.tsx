import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, ChevronRight, ChevronLeft, Check, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  is_primary?: boolean;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const EnhancedProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          product_images(id, url, alt, is_primary)
        `)
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('category_id', product.category_id)
        .neq('id', productId)
        .limit(4);
      
      if (error) throw error;
      return data;
    },
    enabled: !!product?.category_id,
  });

  // Mock reviews (in a real app, this would come from your API)
  const reviews: Review[] = [
    {
      id: '1',
      user_name: 'Alex Johnson',
      rating: 5,
      comment: 'This plant is absolutely beautiful and arrived in perfect condition. It has grown so much since I got it!',
      created_at: '2023-05-15T10:30:00Z'
    },
    {
      id: '2',
      user_name: 'Sam Wilson',
      rating: 4,
      comment: 'Great plant, but the leaves were a bit damaged during shipping. Customer service was helpful though!',
      created_at: '2023-06-22T14:45:00Z'
    }
  ];

  const handleAddToCart = async () => {
    if (!product) return;
    
    const { data: { user } } = await supabase.auth.getUser();
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
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,product_id',
          returning: 'minimal'
        });

      if (error) throw error;

      toast({
        title: 'Added to cart',
        description: `${quantity} × ${product.name} has been added to your cart`,
      });

      // Invalidate cart query to refresh the cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleWishlistToggle = async () => {
    // In a real app, this would add/remove from wishlist in your database
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: isWishlisted 
        ? `${product?.name} has been removed from your wishlist`
        : `${product?.name} has been added to your wishlist`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} on PlantPals`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied to clipboard',
      });
    }
  };

  const productImages = product?.product_images?.length 
    ? product.product_images 
    : product?.image_url 
      ? [{ id: '1', url: product.image_url, alt: product.name, is_primary: true }]
      : [];

  const primaryImage = productImages.find(img => img.is_primary) || productImages[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-24 bg-gray-800 rounded-md"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-800 rounded-lg"></div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 w-20 bg-gray-800 rounded-md"></div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="h-6 w-32 bg-gray-800 rounded mb-2"></div>
                  <div className="h-10 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-800 rounded w-1/4"></div>
                </div>
                
                <div className="h-6 w-24 bg-gray-800 rounded"></div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-800 rounded w-4/6"></div>
                </div>
                
                <div className="h-12 bg-gray-800 rounded-md w-full max-w-xs"></div>
                
                <div className="flex gap-4 pt-4">
                  <div className="h-12 w-12 bg-gray-800 rounded-md"></div>
                  <div className="h-12 flex-1 bg-gray-800 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
        <div className="container mx-auto text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🌿</div>
            <h1 className="text-3xl font-bold mb-4">Plant Not Found</h1>
            <p className="text-gray-400 mb-8">We couldn't find the plant you're looking for. It may have been moved or is no longer available.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700"
              >
                Back to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/shop')}
                className="border-gray-700 hover:bg-gray-800"
              >
                Browse All Plants
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Button>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden">
                {productImages.length > 0 ? (
                  <img 
                    src={productImages[currentImageIndex]?.url || primaryImage?.url} 
                    alt={productImages[currentImageIndex]?.alt || primaryImage?.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                    <Leaf className="h-16 w-16" />
                  </div>
                )}
                
                {/* Image Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => (prev - 1 + productImages.length) % productImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setCurrentImageIndex(prev => (prev + 1) % productImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Sale/New Badge */}
                {product.tags?.includes('new') && (
                  <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">
                    New Arrival
                  </Badge>
                )}
                {product.tags?.includes('sale') && (
                  <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">
                    On Sale
                  </Badge>
                )}
              </div>
              
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        currentImageIndex === index ? 'border-green-500' : 'border-transparent'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img 
                        src={img.url} 
                        alt={img.alt || `${product.name} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              {/* Category and Actions */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                    <span>{product.categories?.name || 'House Plant'}</span>
                    <span>•</span>
                    <span className="text-green-400">In Stock</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {product.name}
                  </h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full text-gray-400"
                    onClick={handleShare}
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-5 w-5 ${star <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {product.rating?.toFixed(1)} ({product.review_count || 0} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-400">
                  ${product.price?.toFixed(2)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Short Description */}
              <p className="text-gray-300 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
              
              {/* Plant Care Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
                  <div className="p-2 bg-green-900/30 rounded-full">
                    <Droplets className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Water</p>
                    <p className="text-sm font-medium">{product.water_needs || 'Moderate'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
                  <div className="p-2 bg-yellow-900/30 rounded-full">
                    <Sun className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Light</p>
                    <p className="text-sm font-medium">{product.light_requirements || 'Bright, indirect'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
                  <div className="p-2 bg-blue-900/30 rounded-full">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Care Level</p>
                    <p className="text-sm font-medium">{product.difficulty_level || 'Easy'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg">
                  <div className="p-2 bg-purple-900/30 rounded-full">
                    <Shield className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Pet Friendly</p>
                    <p className="text-sm font-medium">
                      {product.pet_friendly ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="h-12 w-12 text-xl text-gray-300 hover:bg-gray-800"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="h-12 w-12 text-xl text-gray-300 hover:bg-gray-800"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </Button>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-base font-medium"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
                
                {product.stock_quantity && product.stock_quantity < 5 && (
                  <p className="mt-2 text-sm text-yellow-400">
                    Only {product.stock_quantity} left in stock!
                  </p>
                )}
              </div>
              
              {/* Delivery Info */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-400">Arrives in 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md bg-gray-900">
                <TabsTrigger 
                  value="description" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  onClick={() => setActiveTab('details')}
                >
                  Details & Care
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold mb-4">About the {product.name}</h3>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      {product.description || 'No detailed description available.'}
                    </p>
                    <p>
                      This beautiful plant will add a touch of nature to any space. Perfect for both home and office environments.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Air purifying properties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Low maintenance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Pet-friendly (non-toxic)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Plant Care</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-200">Light Requirements</h4>
                        <p className="text-gray-400">{product.light_requirements || 'Bright, indirect light'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">Watering</h4>
                        <p className="text-gray-400">
                          {product.water_needs || 'Water when the top 1-2 inches of soil are dry. Avoid overwatering.'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">Humidity</h4>
                        <p className="text-gray-400">
                          {product.humidity || 'Prefers moderate to high humidity (40-60%).'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">Temperature</h4>
                        <p className="text-gray-400">
                          {product.temperature || 'Ideal between 65-80°F (18-27°C). Avoid drafts and sudden temperature changes.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                    <div className="space-y-4">
                      <div>
                            <h4 className="font-medium text-gray-200">Scientific Name</h4>
                            <p className="text-gray-400">
                              {product.scientific_name || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-200">Plant Family</h4>
                            <p className="text-gray-400">
                              {product.family || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-200">Native Area</h4>
                            <p className="text-gray-400">
                              {product.native_area || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-200">Toxicity</h4>
                            <p className="text-gray-400">
                              {product.pet_friendly === false ? 'Toxic to pets' : 'Non-toxic to pets and humans'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-200">Mature Size</h4>
                            <p className="text-gray-400">
                              {product.mature_size || 'Varies by species and care'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-5xl font-bold">
                            {product.rating?.toFixed(1) || '5.0'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-5 w-5 ${
                                    star <= Math.round(product.rating || 5) 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-700'
                                  }`} 
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-400">
                              Based on {product.review_count || reviews.length} reviews
                            </p>
                          </div>
                        </div>
                        
                        <Button className="bg-gray-800 hover:bg-gray-700 text-gray-200">
                          Write a Review
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{review.user_name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-4 w-4 ${
                                        star <= review.rating 
                                          ? 'text-yellow-400 fill-yellow-400' 
                                          : 'text-gray-700'
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="text-gray-300 mt-2">{review.comment}</p>
                          </div>
                        ))}
                        
                        {reviews.length === 0 && (
                          <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">No reviews yet. Be the first to review this product!</p>
                            <Button className="bg-green-600 hover:bg-green-700">
                              Write a Review
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Related Products */}
                {relatedProducts.length > 0 && (
                  <div className="mt-20">
                    <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {relatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EnhancedProductDetail;
