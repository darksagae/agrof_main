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
    console.log('🔍 Comprehensive Supabase Search...\n');

    // Step 1: Check storage buckets and list files
    console.log('📦 Step 1: Checking Storage Buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log(`   ⚠️  Error: ${bucketsError.message}`);
    } else if (buckets.length === 0) {
      console.log('   ℹ️  No storage buckets found');
      console.log('   💡 You may need to create storage buckets in Supabase dashboard first');
    } else {
      console.log(`   ✅ Found ${buckets.length} bucket(s):`);
      for (const bucket of buckets) {
        console.log(`\n   📁 Bucket: ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        
        // List files in each bucket
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 100 });

        if (!filesError && files && files.length > 0) {
          console.log(`      Files (${files.length}):`);
          files.slice(0, 20).forEach(file => {
            if (file.name.toLowerCase().includes('saga') || 
                file.name.toLowerCase().includes('isagala')) {
              console.log(`      🎯 ${file.name} ⭐`);
            } else {
              console.log(`      - ${file.name}`);
            }
          });
          if (files.length > 20) console.log(`      ... and ${files.length - 20} more`);
        }
      }
    }

    // Step 2: Try to query products table with different search terms
    console.log('\n📋 Step 2: Searching Products Table...');
    const searchTerms = ['saga', 'isagala', 'mark'];
    
    for (const term of searchTerms) {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${term}%`)
        .limit(20);

      if (!productsError && products && products.length > 0) {
        console.log(`\n   ✅ Found ${products.length} product(s) with "${term}":`);
        products.forEach(product => {
          console.log(`\n      📦 ${product.name || 'Unnamed'}`);
          console.log(`         ID: ${product.id}`);
          if (product.image_url || product.imageUrl || product.image) {
            const imageUrl = product.image_url || product.imageUrl || product.image;
            console.log(`         Image: ${imageUrl}`);
          }
          if (product.category_id) console.log(`         Category: ${product.category_id}`);
        });
      }
    }

    // Step 3: List all products (first 50) to see what's there
    console.log('\n📊 Step 3: Listing Sample Products...');
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('id, name, image_url')
      .limit(50);

    if (!allError && allProducts && allProducts.length > 0) {
      console.log(`   ✅ Found ${allProducts.length} products in database:`);
      allProducts.forEach((p, i) => {
        if (i < 10) { // Show first 10
          console.log(`      ${i+1}. ${p.name || 'Unnamed'} ${p.image_url ? '🖼️' : ''}`);
        }
      });
      if (allProducts.length > 10) {
        console.log(`      ... and ${allProducts.length - 10} more products`);
      }
    } else if (allError) {
      console.log(`   ℹ️  Products table not accessible: ${allError.message}`);
    }

    // Step 4: Check categories
    console.log('\n📑 Step 4: Checking Categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(20);

    if (!catError && categories && categories.length > 0) {
      console.log(`   ✅ Found ${categories.length} categories:`);
      categories.forEach(cat => {
        console.log(`      - ${cat.name || cat.title || cat.id}`);
      });
    }

    // Step 5: Try herbicides table specifically
    console.log('\n🌿 Step 5: Checking Herbicides Category...');
    const { data: herbicides, error: herbError } = await supabase
      .from('products')
      .select('id, name, image_url')
      .eq('category_id', 4) // Herbicides category
      .ilike('name', '%saga%')
      .limit(20);

    if (!herbError && herbicides && herbicides.length > 0) {
      console.log(`   ✅ Found ${herbicides.length} herbicide(s) with "saga":`);
      herbicides.forEach(h => {
        console.log(`      🎯 ${h.name}`);
        if (h.image_url) console.log(`         Image: ${h.image_url}`);
      });
    }

    console.log('\n✨ Search Complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error(error);
  }
}

// Run the script
console.log('🚀 Starting Comprehensive Supabase Search...\n');
searchSupabase().then(() => {
  console.log('\n🏁 Done!');
}).catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});


