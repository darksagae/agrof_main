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

async function downloadIsagalaImage() {
  try {
    console.log('🔍 Searching for Isagala Mark image in Supabase storage...\n');

    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }

    console.log(`📦 Found ${buckets.length} storage buckets:`);
    buckets.forEach(bucket => console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`));
    console.log('');

    // Search in each bucket for isagala-related images
    let foundImages = [];

    for (const bucket of buckets) {
      console.log(`🔎 Searching in bucket: ${bucket.name}...`);
      
      const { data: files, error: filesError } = await supabase.storage
        .from(bucket.name)
        .list('', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (filesError) {
        console.log(`   ⚠️  Could not access bucket ${bucket.name}: ${filesError.message}`);
        continue;
      }

      // Search for isagala-related files (case-insensitive)
      const isagalaFiles = files.filter(file => 
        file.name.toLowerCase().includes('isagala') ||
        file.name.toLowerCase().includes('mark')
      );

      if (isagalaFiles.length > 0) {
        console.log(`   ✅ Found ${isagalaFiles.length} matching file(s):`);
        isagalaFiles.forEach(file => {
          foundImages.push({ bucket: bucket.name, file: file });
          console.log(`      - ${file.name} (${(file.metadata?.size / 1024).toFixed(2)} KB)`);
        });
      }
    }

    if (foundImages.length === 0) {
      console.log('\n❌ No images found matching "isagala" or "mark"');
      console.log('\n💡 Let me list all images in storage buckets...\n');
      
      // List all images in each bucket
      for (const bucket of buckets) {
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (!filesError && files.length > 0) {
          console.log(`\n📁 ${bucket.name}:`);
          files.slice(0, 20).forEach(file => {
            console.log(`   - ${file.name}`);
          });
          if (files.length > 20) {
            console.log(`   ... and ${files.length - 20} more files`);
          }
        }
      }
      return;
    }

    // Download the images
    console.log(`\n📥 Downloading ${foundImages.length} image(s)...\n`);
    
    const downloadDir = path.join(__dirname, 'downloaded-images');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    for (const { bucket, file } of foundImages) {
      const { data, error } = await supabase.storage
        .from(bucket.name)
        .download(file.name);

      if (error) {
        console.log(`   ❌ Error downloading ${file.name}: ${error.message}`);
        continue;
      }

      // Save the file
      const fileName = path.join(downloadDir, `${bucket.name}_${file.name}`);
      const buffer = Buffer.from(await data.arrayBuffer());
      fs.writeFileSync(fileName, buffer);
      
      console.log(`   ✅ Downloaded: ${fileName}`);
      
      // Also try to get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket.name)
        .getPublicUrl(file.name);
      
      if (urlData?.publicUrl) {
        console.log(`   🔗 Public URL: ${urlData.publicUrl}`);
      }
    }

    console.log(`\n🎉 Successfully downloaded ${foundImages.length} image(s) to: ${downloadDir}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error(error);
  }
}

// Run the script
console.log('🚀 Starting Isagala Mark Image Downloader...\n');
downloadIsagalaImage().then(() => {
  console.log('\n✨ Done!');
}).catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});


