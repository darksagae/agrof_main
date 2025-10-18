// Test the featured products loading logic
const currentLanguage = 'en';

// Simulate the API calls
const testCategoryLoading = async () => {
  const categoryNames = ['fertilizers', 'fungicides', 'herbicides', 'nursery_bed', 'organic_chemicals', 'seeds'];
  
  console.log('Testing category product loading...\n');
  
  for (const cat of categoryNames) {
    try {
      const response = await fetch(`http://192.168.1.15:3001/api/products?category=${cat}&limit=7&language=${currentLanguage}`);
      const products = await response.json();
      console.log(`✓ ${cat}: ${products.length} products`);
    } catch (error) {
      console.log(`✗ ${cat}: ${error.message}`);
    }
  }
};

testCategoryLoading();
