# 🔥🟢 Firebase + Supabase Architecture for AGROF

## ✅ Database Schema Complete!

Your Supabase database is fully set up with:
- ✅ Users (base table)
- ✅ Buyers & Sellers (user types)
- ✅ Products & Categories
- ✅ Carts & Cart Items
- ✅ Orders & Order Items
- ✅ Reviews & Favorites

## 🔗 Firebase ↔ Supabase Correlation

### **How It Works:**

```
┌──────────────────────────────────────────────────────────┐
│                    USER SIGN UP FLOW                      │
├──────────────────────────────────────────────────────────┤
│ 1. User enters: email, password, name, phone             │
│                                                           │
│ 2. Firebase Authentication                               │
│    ├─ Creates user account                              │
│    ├─ Sends email verification                          │
│    └─ Returns: Firebase UID (unique identifier)         │
│                                                           │
│ 3. Supabase Database                                     │
│    ├─ Inserts into users table                          │
│    ├─ Uses Firebase UID as primary key (users.id)       │
│    └─ Stores: profile, phone, photo, etc.               │
│                                                           │
│ 4. AsyncStorage (Local Fallback)                         │
│    └─ Caches user data for offline access               │
└──────────────────────────────────────────────────────────┘
```

### **Key Correlation:**

| Firebase Auth | Supabase Database |
|--------------|-------------------|
| `auth.currentUser.uid` | `users.id` (PRIMARY KEY) |
| Handles authentication | Stores all user data |
| Email/password only | Profile, photos, cart, orders |

## 📊 Complete Database Schema

### **1. Users Table (Base)**
```sql
users (
  id UUID PRIMARY KEY,           -- ✅ Firebase UID
  email TEXT,                    -- From Firebase
  full_name TEXT,
  username TEXT,
  phone TEXT,
  profile_photo TEXT,            -- Supabase Storage URL
  user_type TEXT,                -- 'buyer', 'seller', 'both'
  agrof_balance DECIMAL,
  email_verified BOOLEAN,
  firebase_auth BOOLEAN,
  contact_info JSONB
)
```

### **2. Buyers Table**
```sql
buyers (
  id UUID PRIMARY KEY → users.id,
  shipping_address JSONB,
  billing_address JSONB,
  total_orders INTEGER,
  total_spent DECIMAL,
  loyalty_points INTEGER,
  preferences JSONB
)
```

### **3. Sellers Table**
```sql
sellers (
  id UUID PRIMARY KEY → users.id,
  business_name TEXT,
  business_license TEXT,
  tax_id TEXT,
  business_address JSONB,
  commission_rate DECIMAL,
  rating DECIMAL,
  total_sales INTEGER,
  total_revenue DECIMAL,
  verification_status TEXT,
  store_description TEXT,
  store_logo TEXT
)
```

### **4. Products Table**
```sql
products (
  id UUID PRIMARY KEY,
  seller_id UUID → sellers.id,
  category_id UUID → categories.id,
  name TEXT,
  description TEXT,
  price DECIMAL,
  images TEXT[],                 -- Array of image URLs
  specifications JSONB,
  quantity_in_stock INTEGER,
  rating DECIMAL,
  review_count INTEGER,
  is_active BOOLEAN,
  is_featured BOOLEAN
)
```

### **5. Carts Table**
```sql
carts (
  id UUID PRIMARY KEY,
  user_id UUID → users.id,       -- ✅ Firebase UID
  status TEXT,                    -- 'active', 'abandoned', 'converted'
  total_items INTEGER,
  subtotal DECIMAL,
  tax DECIMAL,
  shipping_cost DECIMAL,
  total DECIMAL
)
```

### **6. Cart Items Table**
```sql
cart_items (
  id UUID PRIMARY KEY,
  cart_id UUID → carts.id,
  product_id UUID → products.id,
  seller_id UUID → sellers.id,
  quantity INTEGER,
  unit_price DECIMAL,
  subtotal DECIMAL
)
```

### **7. Orders Table**
```sql
orders (
  id UUID PRIMARY KEY,
  order_number TEXT,              -- Auto-generated: ORD-2025-00001
  buyer_id UUID → buyers.id,
  user_id UUID → users.id,        -- ✅ Firebase UID
  status TEXT,                    -- Order status
  payment_status TEXT,
  payment_method TEXT,
  subtotal DECIMAL,
  total_amount DECIMAL,
  shipping_address JSONB,
  tracking_number TEXT
)
```

### **8. Order Items Table**
```sql
order_items (
  id UUID PRIMARY KEY,
  order_id UUID → orders.id,
  product_id UUID → products.id,
  seller_id UUID → sellers.id,
  product_name TEXT,              -- Snapshot
  quantity INTEGER,
  unit_price DECIMAL,
  subtotal DECIMAL,
  status TEXT
)
```

## 🔄 Data Flow Examples

### **Example 1: User Signs Up**
```javascript
// Step 1: Firebase creates auth user
const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);
// firebaseUser.uid = "abc123"

// Step 2: Supabase inserts user data
await supabase.from('users').insert({
  id: firebaseUser.uid,              // ← Firebase UID as primary key
  email: firebaseUser.email,
  full_name: "John Doe",
  phone: "+256700000000",
  user_type: "buyer"
});

// Step 3: Create buyer profile
await supabase.from('buyers').insert({
  id: firebaseUser.uid,              // ← Same Firebase UID
  shipping_address: {...},
  preferences: {...}
});
```

### **Example 2: User Adds to Cart**
```javascript
// User is logged in with Firebase UID
const userId = auth.currentUser.uid;  // "abc123"

// Get or create cart
let cart = await supabase
  .from('carts')
  .select('*')
  .eq('user_id', userId)             // ← Using Firebase UID
  .eq('status', 'active')
  .single();

// Add item to cart
await supabase.from('cart_items').insert({
  cart_id: cart.id,
  product_id: productId,
  quantity: 2,
  unit_price: 50000,
  subtotal: 100000
});

// Cart totals auto-update via trigger!
```

### **Example 3: User Places Order**
```javascript
// Convert cart to order
const order = await supabase.from('orders').insert({
  user_id: auth.currentUser.uid,     // ← Firebase UID
  buyer_id: auth.currentUser.uid,    // ← Same UID (if buyer)
  order_number: null,                 // Auto-generated: ORD-2025-00001
  status: 'pending',
  payment_status: 'pending',
  shipping_address: {...},
  total_amount: cart.total
}).select().single();

// Copy cart items to order items
const cartItems = await supabase
  .from('cart_items')
  .select('*, products(*)')
  .eq('cart_id', cart.id);

await supabase.from('order_items').insert(
  cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    seller_id: item.seller_id,
    product_name: item.products.name,    // Snapshot
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
    total: item.subtotal
  }))
);
```

### **Example 4: Get User's Complete Profile**
```javascript
// Get everything for logged-in user
const userId = auth.currentUser.uid;

// Get base user data with buyer info
const { data: user } = await supabase
  .from('users')
  .select(`
    *,
    buyers (*),
    sellers (*)
  `)
  .eq('id', userId)
  .single();

// User object now has:
// - user.email, user.full_name, user.phone, user.profile_photo
// - user.buyers (if they're a buyer)
// - user.sellers (if they're a seller)
```

## 🛡️ Security (Row Level Security)

All tables have RLS enabled:

```sql
-- Users can only see/edit their own data
CREATE POLICY "Users manage own data" ON users
  FOR ALL USING (id = auth.uid());

-- Users can only see/edit their own carts
CREATE POLICY "Users manage own carts" ON carts
  FOR ALL USING (user_id = auth.uid());

-- Users can only see/edit their own orders
CREATE POLICY "Users manage own orders" ON orders
  FOR ALL USING (user_id = auth.uid());

-- Anyone can view active products
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (is_active = true);
```

## 📸 Profile Photos Storage

Profile photos are stored in Supabase Storage:

```javascript
// Upload profile photo
const file = { uri: imageUri, type: 'image/jpeg', name: 'profile.jpg' };
const filePath = `profile-photos/${userId}/profile.jpg`;

const { data } = await supabase.storage
  .from('user-uploads')
  .upload(filePath, file, { upsert: true });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('user-uploads')
  .getPublicUrl(filePath);

// Update user profile
await supabase.from('users').update({
  profile_photo: publicUrl
}).eq('id', userId);
```

## 🔍 Querying Data Examples

### **Get User's Active Cart with Items**
```javascript
const { data: cart } = await supabase
  .from('carts')
  .select(`
    *,
    cart_items (
      *,
      products (
        *,
        sellers (business_name)
      )
    )
  `)
  .eq('user_id', userId)
  .eq('status', 'active')
  .single();
```

### **Get User's Order History**
```javascript
const { data: orders } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (
      *,
      products (name, images)
    )
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### **Get Seller's Products**
```javascript
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    categories (display_name),
    product_reviews (rating)
  `)
  .eq('seller_id', userId)
  .eq('is_active', true);
```

## 🚀 Benefits of This Architecture

1. ✅ **Single Source of Truth**: Firebase UID ties everything together
2. ✅ **Offline Support**: AsyncStorage fallback
3. ✅ **Real-time Updates**: Supabase subscriptions ready
4. ✅ **Secure**: RLS ensures data privacy
5. ✅ **Scalable**: PostgreSQL handles millions of records
6. ✅ **Profile Photos**: Supabase Storage with CDN
7. ✅ **E-commerce Ready**: Carts, orders, reviews all set up
8. ✅ **Multi-user Types**: Buyers and sellers supported

## 📱 Next Steps

1. Update React Native services to use new schema
2. Create UI components for cart/orders
3. Implement checkout flow
4. Add payment integration
5. Build seller dashboard

Your database is ready! 🎉

