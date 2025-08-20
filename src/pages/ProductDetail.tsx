import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { mockProducts } from "@/data/products";

// Get product image based on product name
const getProductImage = (productName: string) => {
  const name = productName.toLowerCase().trim();
  
  // Map of plant names to their corresponding local images - must match ProductCard.tsx
  const plantImages = {
    // Monstera variations
    'monstera': '/monstera.png',
    'monstera deliciosa': '/monstera.png',
    
    // Rubber plant variations
    'rubber': '/rubber.png',
    'rubber plant': '/rubber.png',
    'ficus elastica': '/rubber.png',
    
    // Other plants
    'snake': '/snake.png',
    'snake plant': '/snake.png',
    'fiddle': '/fiddle.png',
    'fiddle leaf': '/fiddle.png',
    'fiddle leaf fig': '/fiddle.png',
    'pothos': '/golden.png',
    'golden pothos': '/golden.png',
    'zz': '/zz.png',
    'zz plant': '/zz.png',
    'zamioculcas': '/zz.png'
  };

  // First, try exact match
  if (plantImages[name]) {
    return plantImages[name];
  }
  
  // Then try partial matches
  for (const [key, value] of Object.entries(plantImages)) {
    if (name.includes(key)) {
      return value;
    }
  }
  
  // Fallback to default plant image
  return '/default-plant.png';
};

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
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('No product ID provided');
      
      // First try to get from mock data if using mock data
      if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        // Try to find by ID first
        let mockProduct = mockProducts.find(p => p.id === productId);
        
        // If not found by ID and productId is a number, try by array index
        if (!mockProduct && !isNaN(Number(productId))) {
          const index = Number(productId) - 1;
          if (index >= 0 && index < mockProducts.length) {
            mockProduct = mockProducts[index];
          }
        }
        
        if (mockProduct) {
          // Ensure we have at least one image
          if (!mockProduct.images || mockProduct.images.length === 0) {
            mockProduct.images = [
              `https://source.unsplash.com/random/800x800/?plant-${mockProduct.id}`,
              `https://source.unsplash.com/random/800x800/?${mockProduct.name.split(' ').join('-')}`,
              `https://source.unsplash.com/random/800x800/?${mockProduct.id}`
            ];
          }
          return mockProduct;
        }
      }
      
      // If not found in mock data or in production, try Supabase
      try {
        const { data, error: queryError } = await supabase
          .from('products')
          .select(`
            *,
            categories(*)
          `)
          .eq('id', productId)
          .single();
        
        if (queryError) throw queryError;
        if (!data) throw new Error('Product not found');
        
        // Ensure we have at least one image
        if (!data.images || data.images.length === 0) {
          data.images = [
            data.image_url || `https://source.unsplash.com/random/800x800/?plant-${data.id}`,
            `https://source.unsplash.com/random/800x800/?${data.name.split(' ').join('-')}`,
            `https://source.unsplash.com/random/800x800/?${data.id}`
          ];
        }
        
        return data;
      } catch (err) {
        console.error('Error fetching product:', err);
        throw new Error(`Failed to load product: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    },
    enabled: !!productId,
    retry: 1,
  });

  // Update product image when product data changes
  useEffect(() => {
    if (product) {
      // Always try to get image based on product name first
      if (product.name) {
        setProductImage(getProductImage(product.name));
      }
      // Fallback to the product's image_url if name-based lookup fails
      else if (product.image_url) {
        setProductImage(product.image_url);
      }
      // Final fallback to a placeholder
      else {
        setProductImage('https://placehold.co/800x800/1a1a1a/4d7c0f?text=Plant+Image&font=montserrat');
      }
    }
  }, [product]);

  const handleAddToCart = async () => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', { productId, quantity });
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
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="container mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <ProductImage 
              src={productImage} 
              alt={product.name} 
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.categories?.name && (
                  <span className="text-sm text-gray-400">
                    {product.categories.name}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < (product.rating || 0) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  ({product.review_count || 0} reviews)
                </span>
              </div>
            </div>
            
            <p className="text-2xl font-bold text-green-400">
              ${product.price?.toFixed(2)}
            </p>
            
            <p className="text-gray-300">
              {product.description || 'No description available.'}
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-gray-700 rounded-md">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              
              <Button 
                size="lg" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
            
            <div className="pt-6 border-t border-gray-800">
              <h3 className="font-semibold mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p>{product.categories?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Availability</p>
                  <p className="text-green-400">In Stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
