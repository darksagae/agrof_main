# User Registration Fix - AGROF Mobile App

## Problem Description

Users were experiencing "user not found" errors and foreign key constraint violations when trying to register as buyers or sellers in the account tab. The specific errors were:

1. **Foreign Key Constraint Error:**
```
ERROR ❌ Error creating buyer profile: {"code": "23503", "details": "Key (id)=(pyESzROI7FSN5ihvpYUZPBQVl8I3) is not present in table \"users\".", "hint": null, "message": "insert or update on table \"buyers\" violates foreign key constraint \"buyers_id_fkey\""}
```

2. **Duplicate Email Error:**
```
ERROR ❌ Error creating user: {"code": "23505", "details": "Key (email)=(mulajjelatif@gmail.com) already exists.", "hint": null, "message": "duplicate key value violates unique constraint \"users_email_key\""}
```

3. **UID Mismatch Error:**
```
WARN ⚠️ Supabase load failed: Cannot coerce the result to a single JSON object
ERROR ⚠️ Supabase save failed: duplicate key value violates unique constraint "users_email_key"
```

## Root Cause Analysis

1. **Foreign Key Constraints**: Both `buyers` and `sellers` tables have foreign key constraints that reference `users.id`
2. **User Registration Flow Issue**: 
   - Users register through Firebase Auth
   - User data is saved to Supabase `users` table
   - **BUT** users are immediately signed out after registration (for email verification)
   - When users try to register as buyers/sellers, they're logged in but their Supabase record might not exist
3. **Timing Issue**: The user exists in Firebase but not in Supabase when trying to create buyer/seller profiles
4. **Email Conflict Issue**: Users might re-register with the same email but different Firebase UID, causing duplicate email constraint violations
5. **UID Mismatch Issue**: User exists in Supabase with different UID than Firebase, causing data synchronization issues

## Solution Implemented

### 1. Added User Existence Check

Before creating buyer or seller profiles, the system now:
- Checks if the user exists in the Supabase `users` table by UID
- If not found by UID, checks if email exists with different UID
- If email exists with different UID, uses the existing user record
- If no user exists at all, creates a new user record
- Then proceeds with buyer/seller profile creation using the correct user ID

### 2. Created Utility Function

Added `ensureUserExists()` function in `supabaseService.js`:
```javascript
async ensureUserExists(user) {
  // Check if user exists by UID
  // If not, check for email conflict
  // Handle email conflicts by using existing user ID
  // Create new user only if no conflicts exist
  // Return success status with correct user ID
}
```

### 3. Email Conflict Resolution

The system now handles email conflicts gracefully:
- Detects when email exists with different UID
- Uses the existing user's ID for profile creation
- Prevents duplicate email constraint violations
- Maintains data consistency across Firebase and Supabase

### 4. UID Mismatch Resolution

For users with UID mismatches (Firebase UID differs from Supabase UID):
- Identifies existing user records with different UID
- Migrates all dependent records (buyers, sellers, role_requests) to correct UID
- Updates user record to use Firebase UID
- Preserves all user data and relationships

### 5. Updated Registration Screens

**BuyerRequestScreen.js**:
- Added user existence check before creating buyer profile
- Uses the new utility function for clean code

**SellerRequestScreen.js**:
- Added user existence check before submitting seller request
- Uses the new utility function for clean code

## Files Modified

1. `/agrof-main/mobile/app/screens/BuyerRequestScreen.js`
   - Added user existence check
   - Imported supabaseService utility

2. `/agrof-main/mobile/app/screens/SellerRequestScreen.js`
   - Added user existence check
   - Imported supabaseService utility

3. `/agrof-main/mobile/app/services/supabaseService.js`
   - Added `ensureUserExists()` utility function
   - Handles user creation with proper data mapping

## Testing

Created and ran comprehensive tests that verified:
- ✅ User creation works
- ✅ Foreign key constraints satisfied
- ✅ Buyer profile creation works
- ✅ No more "user not found" errors
- ✅ Email conflict detection works
- ✅ Existing user ID is used correctly
- ✅ No more duplicate key errors
- ✅ UID mismatch resolution works
- ✅ Dependent records migration successful
- ✅ Data integrity maintained

## Benefits

1. **Eliminates "User Not Found" Errors**: Users can now register as buyers/sellers without errors
2. **Eliminates Duplicate Email Errors**: System handles email conflicts gracefully
3. **Eliminates UID Mismatch Errors**: System resolves UID conflicts automatically
4. **Maintains Data Integrity**: Foreign key constraints are properly satisfied
5. **Seamless User Experience**: No more confusing error messages
6. **Robust Error Handling**: System gracefully handles missing user records, email conflicts, and UID mismatches
7. **Code Reusability**: Utility function can be used in other parts of the app
8. **Data Consistency**: Maintains consistency between Firebase and Supabase user records
9. **Data Migration**: Safely migrates dependent records when resolving UID conflicts

## How It Works Now

1. User logs in with Firebase Auth
2. User navigates to Account tab
3. User clicks "Register as Buyer" or "Register as Seller"
4. System checks if user exists in Supabase by UID
5. If not found by UID, checks for email conflicts
6. If email exists with different UID, uses existing user record
7. If no user exists, creates new user record
8. Proceeds with buyer/seller profile creation using correct user ID
9. Success! No more foreign key constraint or duplicate email errors

## Technical Details

- **Foreign Key Constraints**: `buyers.id` → `users.id` and `sellers.id` → `users.id`
- **Error Code 23503**: Foreign key constraint violation
- **Error Code 23505**: Duplicate key value violation (email constraint)
- **PGRST116**: Supabase "not found" error code
- **User Data Mapping**: Firebase user data properly mapped to Supabase schema
- **Email Conflict Resolution**: Uses existing user ID when email exists with different UID
- **UID Mismatch Handling**: Gracefully handles cases where Firebase UID differs from Supabase user ID

This fix ensures a smooth user registration experience while maintaining database integrity, foreign key relationships, and handling email conflicts gracefully.
