# 🚀 **SUPABASE MIGRATION PLAN FOR AGROF**

## 📋 **MIGRATION OVERVIEW**

### **Current System:**
- **Database**: SQLite with 500+ agricultural products
- **Backend**: Node.js/Express API
- **Frontend**: React Native/Expo mobile app
- **Deployment**: Render platform

### **Target System with Supabase:**
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Built-in user management
- **Storage**: Product images in Supabase Storage
- **API**: Auto-generated REST/GraphQL APIs
- **Deployment**: Supabase hosting + Vercel/Netlify

## 🗄️ **DATABASE SCHEMA MIGRATION**

### **Current SQLite Tables:**
```sql
-- Categories table
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER,
  description TEXT,
  price TEXT,
  image_url TEXT,
  specifications TEXT,
  features TEXT,
  usage_instructions TEXT,
  application_method TEXT,
  benefits TEXT,
  storage_instructions TEXT,
  safety_info TEXT,
  availability TEXT DEFAULT 'In Stock',
  quantity_in_stock INTEGER DEFAULT 0,
  minimum_stock_level INTEGER DEFAULT 10,
  maximum_stock_level INTEGER DEFAULT 1000,
  unit_of_measure TEXT DEFAULT 'bags',
  barcode TEXT UNIQUE,
  supplier_name TEXT,
  supplier_contact TEXT,
  cost_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  last_restocked_date DATETIME,
  expiry_date DATETIME,
  batch_number TEXT,
  location TEXT DEFAULT 'Warehouse A',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);
```

### **Supabase PostgreSQL Schema:**
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  specifications JSONB,
  features TEXT[],
  usage_instructions TEXT,
  application_method TEXT,
  benefits TEXT,
  storage_instructions TEXT,
  safety_info TEXT,
  availability TEXT DEFAULT 'In Stock',
  quantity_in_stock INTEGER DEFAULT 0,
  minimum_stock_level INTEGER DEFAULT 10,
  maximum_stock_level INTEGER DEFAULT 1000,
  unit_of_measure TEXT DEFAULT 'bags',
  barcode TEXT UNIQUE,
  supplier_name TEXT,
  supplier_contact TEXT,
  cost_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  last_restocked_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  batch_number TEXT,
  location TEXT DEFAULT 'Warehouse A',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for authentication)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 **SUPABASE SETUP STEPS**

### **1. Create Supabase Project**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project
supabase init

# Start local development
supabase start
```

### **2. Environment Configuration**
```env
# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
```

### **3. Migration Scripts**
```javascript
// migrate-to-supabase.js
const { createClient } = require('@supabase/supabase-js');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateData() {
  // Connect to SQLite
  const db = new sqlite3.Database('./store.db');
  
  // Migrate categories
  const categories = await getCategories(db);
  await supabase.from('categories').insert(categories);
  
  // Migrate products
  const products = await getProducts(db);
  await supabase.from('products').insert(products);
  
  console.log('Migration completed successfully!');
}

migrateData();
```

## 📱 **REACT NATIVE INTEGRATION**

### **1. Install Supabase Client**
```bash
cd mobile/app
npm install @supabase/supabase-js
```

### **2. Supabase Configuration**
```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your-supabase-url';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### **3. Updated API Calls**
```javascript
// services/storeApi.js
import { supabase } from '../lib/supabase';

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        display_name
      )
    `);
  
  if (error) throw error;
  return data;
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const addToCart = async (userId, productId, quantity) => {
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: productId,
      quantity: quantity
    });
  
  if (error) throw error;
  return data;
};
```

## 🚀 **DEPLOYMENT CONFIGURATION**

### **1. Supabase Hosting**
- **Database**: Managed PostgreSQL
- **API**: Auto-generated REST/GraphQL
- **Storage**: File storage for images
- **Auth**: Built-in authentication
- **Real-time**: Live updates

### **2. Frontend Deployment**
- **Vercel**: For web version
- **Expo**: For mobile app
- **Environment Variables**: Secure configuration

### **3. Backend Simplification**
- Remove Node.js/Express backend
- Use Supabase client directly
- Implement serverless functions for complex logic

## 📊 **MIGRATION TIMELINE**

### **Phase 1: Setup (1-2 days)**
- [ ] Create Supabase project
- [ ] Set up database schema
- [ ] Configure environment variables

### **Phase 2: Data Migration (1 day)**
- [ ] Export SQLite data
- [ ] Import to Supabase
- [ ] Verify data integrity

### **Phase 3: Frontend Integration (2-3 days)**
- [ ] Install Supabase client
- [ ] Update API calls
- [ ] Test functionality

### **Phase 4: Deployment (1 day)**
- [ ] Configure hosting
- [ ] Set up CI/CD
- [ ] Go live

## 💰 **COST COMPARISON**

### **Current Setup:**
- **Render Backend**: $7-25/month
- **SQLite Database**: Free (but limited)
- **File Storage**: Basic

### **Supabase Setup:**
- **Database**: Free tier (500MB)
- **API**: Free tier (50,000 requests/month)
- **Storage**: Free tier (1GB)
- **Auth**: Free tier (50,000 MAU)
- **Total**: $0/month (free tier) or $25/month (pro)

## ✅ **BENEFITS OF MIGRATION**

1. **Real-time Updates**: Live inventory changes
2. **Authentication**: User accounts and sessions
3. **File Storage**: Product images in cloud
4. **Auto-scaling**: No server management
5. **Better Performance**: PostgreSQL vs SQLite
6. **Cost Effective**: Generous free tier
7. **Developer Experience**: Better tooling and debugging

## 🎯 **NEXT STEPS**

1. **Create Supabase Account**: Sign up at supabase.com
2. **Set up Project**: Create new project
3. **Configure Database**: Set up schema
4. **Migrate Data**: Transfer from SQLite
5. **Update Frontend**: Integrate Supabase client
6. **Deploy**: Go live with new system

This migration will modernize your AGROF platform with better performance, real-time capabilities, and easier maintenance!
