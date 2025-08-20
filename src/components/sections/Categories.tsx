
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const Categories = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      console.log('Fetched categories:', data);
      return data || [];
    },
  });

  if (error) {
    console.error('Error in Categories:', error);
    return (
      <section id="categories" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl text-red-500">Error loading categories</h2>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="categories" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-800 rounded-lg animate-pulse"></div>
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
