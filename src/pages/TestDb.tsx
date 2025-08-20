import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function TestDb() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        
        // Test products query
        console.log('Fetching products...');
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .limit(5);
        
        if (productsError) throw productsError;
        console.log('Products:', productsData);
        setProducts(productsData || []);
        
        // Test categories query
        console.log('Fetching categories...');
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .limit(5);
        
        if (categoriesError) throw categoriesError;
        console.log('Categories:', categoriesData);
        setCategories(categoriesData || []);
        
      } catch (err) {
        console.error('Error testing database connection:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Database Connection</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      {error ? (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <div className="bg-green-900/50 border border-green-500 text-green-200 p-4 rounded-lg">
              Successfully connected to Supabase!
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Products (first 5)</h2>
            <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
              {products.length > 0 ? (
                <pre className="whitespace-pre-wrap">{JSON.stringify(products, null, 2)}</pre>
              ) : (
                <p className="text-gray-400">No products found</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Categories (first 5)</h2>
            <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
              {categories.length > 0 ? (
                <pre className="whitespace-pre-wrap">{JSON.stringify(categories, null, 2)}</pre>
              ) : (
                <p className="text-gray-400">No categories found</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Console Output</h2>
        <p className="text-gray-400 text-sm mb-2">Check your browser's developer console for detailed logs.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
