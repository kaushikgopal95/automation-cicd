
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const Categories = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <section id="categories" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Plant Categories</h2>
            <p className="text-xl text-gray-300">Explore our diverse collection of plants</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-20 bg-gray-900" data-testid="categories-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-100 mb-4" data-testid="categories-title">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-400">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="categories-grid">
          {categories?.map((category) => (
            <Card 
              key={category.id} 
              className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 group cursor-pointer"
              data-testid={`category-card-${category.slug}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600/30 transition-colors">
                  <span className="text-2xl">
                    {category.slug === 'indoor-plants' && '🌱'}
                    {category.slug === 'handmade-crafts' && '🎨'}
                    {category.slug === 'plant-care' && '🌿'}
                    {category.slug === 'home-decor' && '🏠'}
                    {!['indoor-plants', 'handmade-crafts', 'plant-care', 'home-decor'].includes(category.slug) && '🌱'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-green-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-center text-green-400 group-hover:text-green-300 transition-colors">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
