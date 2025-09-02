import { ProductCard } from "@/components/products/ProductCard";
import { useNavigate } from "react-router-dom";
import { useProductSearch } from "@/hooks/use-product-search";

export const ProductList = () => {
  const navigate = useNavigate();

  const { data: products, isLoading } = useProductSearch("", 50); // Get all products

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        
        {products?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
