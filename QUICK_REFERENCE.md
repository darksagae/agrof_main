# 📋 AGROF - Quick Reference Card

## 🔑 The Key Concept

**Firebase UID = Supabase Primary Key**

```
Firebase: auth.currentUser.uid → "abc123"
Supabase: users.id → "abc123"
          carts.user_id → "abc123"
          orders.user_id → "abc123"
```

## 🗄️ Database Tables

| Table | Key | Purpose |
|-------|-----|---------|
| `users` | `id` (Firebase UID) | Base user data |
| `buyers` | `id` → `users.id` | Buyer profiles |
| `sellers` | `id` → `users.id` | Seller profiles |
| `products` | `id` | Agricultural products |
| `carts` | `user_id` → `users.id` | Shopping carts |
| `cart_items` | `cart_id` → `carts.id` | Cart contents |
| `orders` | `user_id` → `users.id` | Customer orders |
| `order_items` | `order_id` → `orders.id` | Order contents |

## 🔧 Services Usage

### **Auth Service**
```javascript
import authService from './services/authService';

// Login
const { user } = await authService.signInWithEmail(email, password);

// Get current user
const { user } = await authService.getCurrentUser();

// Update profile
await authService.updateUserData(userId, { full_name: 'New Name' });

// Upload photo
const { url } = await authService.uploadProfilePhoto(userId, imageUri);
```

### **Cart Service**
```javascript
import cartService from './services/cartService';

// Get cart
const { cart } = await cartService.getOrCreateCart();

// Add to cart
await cartService.addToCart(productId, quantity);

// Update quantity
await cartService.updateCartItemQuantity(itemId, newQty);

// Remove item
await cartService.removeFromCart(itemId);

// Clear cart
await cartService.clearCart();
```

### **Order Service**
```javascript
import orderService from './services/orderService';

// Create order
const { order } = await orderService.createOrder(shippingAddress, paymentMethod);

// Get orders
const { orders } = await orderService.getOrders();

// Get specific order
const { order } = await orderService.getOrder(orderId);

// Cancel order
await orderService.cancelOrder(orderId, reason);
```

## 📊 Common Queries

### Get Products
```javascript
const { data: products } = await supabase
  .from('products')
  .select('*, categories(display_name), sellers(business_name)')
  .eq('is_active', true);
```

### Get User's Cart
```javascript
const { data: cart } = await supabase
  .from('carts')
  .select('*, cart_items(*, products(*))')
  .eq('user_id', userId)
  .eq('status', 'active')
  .single();
```

### Get User's Orders
```javascript
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*, products(name, images))')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

## 🔐 User Types

```javascript
// Set user as buyer
await supabase.from('users').update({ user_type: 'buyer' }).eq('id', userId);
await supabase.from('buyers').insert({ id: userId });

// Set user as seller
await supabase.from('users').update({ user_type: 'seller' }).eq('id', userId);
await supabase.from('sellers').insert({ id: userId, business_name: 'My Store' });

// Both buyer and seller
await supabase.from('users').update({ user_type: 'both' }).eq('id', userId);
```

## 📸 Profile Photos

```javascript
// Upload
const filePath = `profile-photos/${userId}/profile.jpg`;
const { data } = await supabase.storage
  .from('user-uploads')
  .upload(filePath, file, { upsert: true });

// Get URL
const { data: { publicUrl } } = supabase.storage
  .from('user-uploads')
  .getPublicUrl(filePath);

// Save to profile
await supabase.from('users').update({ profile_photo: publicUrl }).eq('id', userId);
```

## 🛒 Cart Flow

```
1. User logs in → Firebase UID
2. Get/create cart → SELECT * FROM carts WHERE user_id = UID
3. Add item → INSERT INTO cart_items
4. Totals auto-calculate (triggers)
5. Checkout → CREATE order from cart
6. Mark cart as 'converted'
```

## 📦 Order Flow

```
1. User in CartScreen with items
2. Navigate to CheckoutScreen
3. Enter shipping address
4. Call orderService.createOrder()
5. Creates order + order_items
6. Clears cart (status = 'converted')
7. Navigate to OrderConfirmation
```

## 🔍 Check Data

Visit Supabase Dashboard:
https://supabase.com/dashboard/project/xtklayjpdpfykjbttaac

- **Table Editor** → View data
- **SQL Editor** → Run queries
- **Storage** → View uploaded files
- **Logs** → Debug issues

## 🐛 Troubleshooting

### Can't see data?
```javascript
// Check user ID
console.log('User ID:', auth.currentUser?.uid);

// Check RLS policies
// Users can only see their own data
```

### Cart not updating?
```javascript
// Cart totals auto-update via triggers
// Just reload: await cartService.getOrCreateCart()
```

### Profile photo not showing?
```javascript
// Check storage bucket exists
// Check photo URL is saved in users.profile_photo
const { data } = await supabase.from('users').select('profile_photo').eq('id', userId).single();
console.log('Photo URL:', data.profile_photo);
```

## 📱 App Structure

```
config/
├── firebaseConfig.js    ← Firebase auth
└── supabaseConfig.js    ← Supabase database (configured ✅)

services/
├── authService.js       ← Auth + user data
├── supabaseService.js   ← User operations
├── cartService.js       ← Cart management
└── orderService.js      ← Order management

screens/
├── LoginScreen.js
├── CartScreen.js        ← Use cartService
├── CheckoutScreen.js    ← Use orderService
└── OrderHistoryScreen.js ← Use orderService
```

## ⚡ Quick Start

```bash
cd /home/darksagae/Desktop/agrof-up/agrof-main/mobile/app
npm start
```

## 📚 Full Documentation

- `FINAL_SETUP_COMPLETE.md` - Complete summary
- `FIREBASE_SUPABASE_ARCHITECTURE.md` - Detailed architecture
- `COMPLETE_INTEGRATION_GUIDE.md` - Usage examples

## 🎯 Key Point

**Everything is connected through Firebase UID!**

```
Firebase Authentication (UID)
        ↓
    users.id
        ↓
   ├─ buyers.id
   ├─ sellers.id
   ├─ carts.user_id
   └─ orders.user_id
```

No data loss - all profile photos and user data preserved in Supabase! 🎉

