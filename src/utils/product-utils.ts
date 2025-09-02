/**
 * Shared utility functions for product-related operations
 */

/**
 * Get product image based on product name
 * Maps plant names to their corresponding local images
 */
export const getProductImage = (productName: string, fallbackImageUrl?: string, hasImageError = false) => {
  const name = productName.toLowerCase().trim();
  
  // Map of plant names to their corresponding local images
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
  
  // Fallback to the product's image_url if available and no error
  if (fallbackImageUrl && !hasImageError) {
    return fallbackImageUrl;
  }
  
  // Final fallback to default plant image
  return '/default-plant.png';
};
