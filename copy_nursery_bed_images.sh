#!/bin/bash

# Copy and rename nursery bed images from original folders to simplified folder
NURSERY_ORIGINAL="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/Nursery_bed"
NURSERY_SIMPLE="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/NURSERY_BED_SIMPLE"

echo "Starting nursery bed image copy and rename process..."

# Clear existing simplified images
echo "Clearing existing simplified images..."
rm -f "$NURSERY_SIMPLE"/*

# Use find to get all directories, then process each one
echo "Getting all nursery bed folders..."
counter=1

# Process each directory in the nursery bed folder
find "$NURSERY_ORIGINAL" -maxdepth 1 -type d ! -path "$NURSERY_ORIGINAL" | while read -r folder_path; do
    folder_name=$(basename "$folder_path")
    echo "Processing folder: $folder_name"
    
    # Find the first image file in the folder
    image_file=$(find "$folder_path" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | head -1)
    
    if [ -n "$image_file" ]; then
        # Create simplified name from folder name
        simplified_name=$(echo "$folder_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_\|_$//g')
        
        # Get file extension
        extension="${image_file##*.}"
        
        # Copy with new name
        new_name="${simplified_name}.${extension}"
        cp "$image_file" "$NURSERY_SIMPLE/$new_name"
        
        echo "Copied: $folder_name -> $new_name"
        ((counter++))
    else
        echo "No image found in folder: $folder_name"
    fi
done

echo "Nursery bed image copy and rename completed!"
echo "Images in simplified folder: $(ls "$NURSERY_SIMPLE" | wc -l)"
