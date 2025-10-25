#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Supabase Configuration
const SUPABASE_URL = 'https://xtklayjpdpfykjbttaac.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0a2xheWpwZHBmeWtqYnR0YWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTI2NTcsImV4cCI6MjA3NTY2ODY1N30.GXPo5n_MlOWqIe5lEKcgVJD_A3wyx2IPNyH9DmgXtWM';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function searchSupabase() {
  try {
    console.log('🔍 Searching Supabase for "Isagala Mark"...\n');

    // Step 1: Check storage buckets
    console.log('📦 Step 1: Checking Storage Buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log(`   ⚠️  Error: ${bucketsError.message}`);
    } else {
      console.log(`   Found ${buckets.length} bucket(s):`);
      buckets.forEach(bucket => console.log(`   - ${bucket.name}`));
    }

    // Step 2: Try to query products table
    console.log('\n📋 Step 2: Searching Products Table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .or('name.ilike.%isagala%,name.ilike.%mark%')
      .limit(50);

    if (productsError) {
      console.log(`   ℹ️  Table not found or no access: ${productsError.message}`);
    } else if (products && products.length > 0) {
      console.log(`   ✅ Found ${products.length} product(s):`);
      products.forEach(product => {
        console.log(`\n   📦 ${product.name || product.title || 'Unnamed product'}`);
        console.log(`      ID: ${product.id}`);
        if (product.image_url || product.imageUrl || product.image) {
          const imageUrl = product.image_url || product.imageUrl || product.image;
          console.log(`      Image: ${imageUrl}`);
        }
      });
    } else {
      console.log('   No products found with "isagala" or "mark"');
    }

    // Step 3: Try different table names
    console.log('\n📊 Step 3: Checking Alternative Tables...');
    const tablesToCheck = ['items', 'herbicides', 'store_products', 'inventory'];
    
    for (const tableName of tablesToCheck) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .or('name.ilike.%isagala%,name.ilike.%mark%')
        .limit(10);

      if (!error && data && data.length > 0) {
        console.log(`\n   ✅ Found in "${tableName}" table (${data.length} result(s)):`);
        data.forEach(item => {
          console.log(`      - ${item.name || item.title || JSON.stringify(item).substring(0, 100)}`);
        });
      }
    }

    // Step 4: List all tables
    console.log('\n📑 Step 4: Listing All Available Tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tablesError && tables) {
      console.log(`   Available tables: ${tables.map(t => t.table_name).join(', ')}`);
    }

    // Step 5: Try RPC call to search all text columns
    console.log('\n🔎 Step 5: Performing Full-Text Search...');
    try {
      // Try a raw query if possible
      const { data: searchResults, error: searchError } = await supabase
        .rpc('search_all_text', { search_term: 'isagala' })
        .limit(20);

      if (!searchError && searchResults) {
        console.log(`   ✅ Found ${searchResults.length} result(s) in full-text search`);
      }
    } catch (e) {
      console.log('   ℹ️  Full-text search not available');
    }

    // Step 6: Download found images
    const downloadDir = path.join(__dirname, 'downloaded-images');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    if (products && products.length > 0) {
      console.log('\n📥 Step 6: Downloading Images...');
      for (const product of products) {
        const imageUrl = product.image_url || product.imageUrl || product.image;
        if (imageUrl) {
          try {
            const fileName = path.join(downloadDir, `${product.id}_${path.basename(imageUrl)}`);
            
            // If it's a Supabase storage URL
            if (imageUrl.includes('supabase.co')) {
              await downloadImage(imageUrl, fileName);
              console.log(`   ✅ Downloaded: ${fileName}`);
            } else {
              console.log(`   ℹ️  Image URL: ${imageUrl}`);
            }
          } catch (err) {
            console.log(`   ⚠️  Failed to download: ${err.message}`);
          }
        }
      }
    }

    console.log('\n✨ Search Complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
console.log('🚀 Starting Supabase Search for Isagala Mark...\n');
searchSupabase().then(() => {
  console.log('\n🏁 Done!');
}).catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});


