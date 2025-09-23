# AGROF Store Backend

Backend server for the AGROF e-commerce store, providing API endpoints for product data, categories, and cart management.

## Features

- **Product Management**: Automatically scans and indexes products from the store directory
- **Category Management**: Organizes products into categories (Fertilizers, Fungicides, etc.)
- **Search Functionality**: Full-text search across product names, descriptions, and specifications
- **Cart Management**: Session-based shopping cart functionality
- **Image Serving**: Serves product images from the store directory
- **Markdown Parsing**: Extracts product information from markdown files
- **SQLite Database**: Lightweight database for storing product and cart data

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:categoryId/products` - Get products by category

### Products
- `GET /api/products` - Get all products (with optional search, category, limit, offset)
- `GET /api/products/:id` - Get single product by ID
- `GET /api/search?q=query` - Search products

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart/:sessionId` - Get cart items
- `PUT /api/cart/:sessionId/item/:itemId` - Update cart item quantity
- `DELETE /api/cart/:sessionId/item/:itemId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear entire cart

### Images
- `GET /api/images/*` - Serve product images

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Configuration

The server automatically scans the store directory at `../agrof-main/mobile/app/assets/store` and populates the database with:

- Product information from markdown files
- Product images from product directories
- Category organization

## Database Schema

### Categories Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT UNIQUE)
- `display_name` (TEXT)
- `description` (TEXT)
- `image_url` (TEXT)
- `created_at` (DATETIME)

### Products Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `category_id` (INTEGER FOREIGN KEY)
- `description` (TEXT)
- `price` (TEXT)
- `image_url` (TEXT)
- `specifications` (TEXT)
- `availability` (TEXT)
- `created_at` (DATETIME)

### Cart Items Table
- `id` (INTEGER PRIMARY KEY)
- `session_id` (TEXT)
- `product_id` (INTEGER FOREIGN KEY)
- `quantity` (INTEGER)
- `created_at` (DATETIME)

## Development

The server uses:
- **Express.js** for the web framework
- **SQLite3** for the database
- **Marked** for markdown parsing
- **Multer** for file handling
- **CORS** for cross-origin requests
- **Helmet** for security headers

## Production Deployment

For production deployment:

1. Set environment variables
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Configure SSL certificates
5. Set up database backups

## License

MIT License


