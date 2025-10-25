const fetch = require('node-fetch');

async function testImageUrl() {
    // Get a product
    const response = await fetch('http://192.168.0.105:3001/api/products?limit=1');
    const products = await response.json();
    const product = products[0];
    
    console.log('Product:', product.name);
    console.log('Image URL from API:', product.image_url);
    
    if (product.image_url) {
        // Encode properly
        const pathParts = product.image_url.split('/').map(part => {
            if (part === '' || part === 'api' || part === 'images') {
                return part;
            }
            return encodeURIComponent(part);
        });
        const encodedPath = pathParts.join('/');
        const fullUrl = `http://192.168.0.105:3001${encodedPath}`;
        
        console.log('Encoded URL:', fullUrl);
        
        // Test if accessible
        try {
            const imgResponse = await fetch(fullUrl, { method: 'HEAD' });
            console.log('Image accessible:', imgResponse.ok, imgResponse.status);
        } catch (err) {
            console.log('Image NOT accessible:', err.message);
        }
    }
}

testImageUrl();
