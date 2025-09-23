# AGROF E-Commerce Store Setup Instructions

This guide will help you set up and run the complete AGROF e-commerce store integration with your existing Expo React Native application.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Git

## Project Structure

```
agrof1/
├── agrof-main/
│   └── mobile/
│       └── app/                 # Existing Expo React Native app
│           ├── assets/
│           │   └── store/       # Product images and data
│           ├── screens/         # Store screens
│           ├── services/        # API services
│           ├── contexts/        # Cart context
│           └── package.json
└── store-backend/               # New backend server
    ├── server.js
    ├── package.json
    └── README.md
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd /home/darksagae/Desktop/saga/agrof1/store-backend
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

The backend server will start on `http://localhost:3001` and automatically:
- Scan the store directory for products
- Parse markdown files for product information
- Populate the SQLite database
- Serve product images and API endpoints

### 4. Verify Backend is Running

Visit `http://localhost:3001/api/health` in your browser. You should see:
```json
{
  "status": "OK",
  "message": "AGROF Store Backend is running"
}
```

## Frontend Setup

### 1. Navigate to Mobile App Directory

```bash
cd /home/darksagae/Desktop/saga/agrof1/agrof-main/mobile/app
```

### 2. Install New Dependencies

```bash
npm install @react-native-async-storage/async-storage
```

### 3. Start the Expo Development Server

```bash
# Start Expo development server
npm start

# Or start for specific platform
npm run android
npm run ios
npm run web
```

## Configuration

### Backend Configuration

The backend automatically scans the store directory at:
`../agrof-main/mobile/app/assets/store`

If you need to change this path, modify the `storePath` variable in `store-backend/server.js`:

```javascript
const storePath = path.join(__dirname, '../agrof-main/mobile/app/assets/store');
```

### Frontend Configuration

The frontend API service is configured to connect to `http://localhost:3001` by default. If your backend runs on a different port or host, update the `API_BASE_URL` in `services/storeApi.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url:port/api';
```

## Features

### Backend Features
- **Automatic Product Discovery**: Scans store directory and parses markdown files
- **RESTful API**: Complete CRUD operations for products, categories, and cart
- **Image Serving**: Serves product images from the store directory
- **Search Functionality**: Full-text search across products
- **Session-based Cart**: Manages shopping cart per user session
- **SQLite Database**: Lightweight database for data persistence

### Frontend Features
- **Enhanced Store Screen**: Modern UI with search, featured products, and categories
- **Product Detail Screen**: Comprehensive product information with add to cart
- **Shopping Cart**: Full cart management with quantity updates and checkout
- **Search Functionality**: Real-time product search
- **Offline Support**: Caches data for offline access
- **Backend Integration**: Seamless API integration with fallback support

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:categoryId/products` - Get products by category

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `GET /api/search?q=query` - Search products

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart/:sessionId` - Get cart items
- `PUT /api/cart/:sessionId/item/:itemId` - Update cart item
- `DELETE /api/cart/:sessionId/item/:itemId` - Remove cart item
- `DELETE /api/cart/:sessionId` - Clear cart

### Images
- `GET /api/images/*` - Serve product images

## Usage

### 1. Access the Store

In your Expo app, navigate to the "Store" tab to access the e-commerce features.

### 2. Browse Products

- View featured products on the home screen
- Browse categories (Fertilizers, Fungicides, Herbicides, etc.)
- Use the search bar to find specific products

### 3. Product Details

- Tap on any product to view detailed information
- See product images, descriptions, specifications, and pricing
- Add products to your cart

### 4. Shopping Cart

- View your cart by tapping the cart icon
- Update quantities or remove items
- Proceed to checkout (simulated payment)

### 5. Search

- Use the search bar to find products by name or category
- View search results with product images and details

## Troubleshooting

### Backend Issues

1. **Port Already in Use**
   ```bash
   # Kill process using port 3001
   lsof -ti:3001 | xargs kill -9
   ```

2. **Database Issues**
   ```bash
   # Delete database file to reset
   rm store-backend/store.db
   # Restart server to recreate database
   ```

3. **Store Directory Not Found**
   - Ensure the store directory path is correct in `server.js`
   - Check that the store folder exists with product data

### Frontend Issues

1. **API Connection Failed**
   - Verify backend is running on `http://localhost:3001`
   - Check network connectivity
   - App will work in offline mode with cached data

2. **Images Not Loading**
   - Ensure backend is running and serving images
   - Check image URLs in the API responses
   - Fallback images will be used if backend images fail

3. **Cart Not Persisting**
   - Cart data is stored in AsyncStorage
   - Clear app data if cart becomes corrupted

## Development

### Adding New Products

1. Add product images to the appropriate category folder in `assets/store/`
2. Create or update markdown files with product information
3. Restart the backend server to scan for new products

### Customizing the UI

- Modify styles in the respective screen files
- Update colors and themes in the StyleSheet objects
- Add new features by extending the existing components

### Extending the API

- Add new endpoints in `store-backend/server.js`
- Update the frontend API service in `services/storeApi.js`
- Add corresponding UI components as needed

## Production Deployment

### Backend Deployment

1. Set up a production server (VPS, cloud instance, etc.)
2. Install Node.js and dependencies
3. Set environment variables for production
4. Use a process manager like PM2
5. Set up reverse proxy with Nginx
6. Configure SSL certificates

### Frontend Deployment

1. Build the Expo app for production
2. Deploy to app stores (iOS App Store, Google Play Store)
3. Or deploy as a web app using Expo's web build

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all dependencies are installed correctly
3. Ensure both backend and frontend are running
4. Check the API endpoints are accessible

## License

This e-commerce integration is part of the AGROF project and follows the same licensing terms.


