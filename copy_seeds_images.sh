#!/bin/bash

# Copy and rename seeds images from original folders to simplified folder
SEEDS_ORIGINAL="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/SEEDS"
SEEDS_SIMPLE="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/SEEDS_SIMPLE"

echo "Starting seeds image copy and rename process..."

# Clear existing simplified images
echo "Clearing existing simplified images..."
rm -f "$SEEDS_SIMPLE"/*

# Use find to get all directories, then process each one
echo "Getting all seeds folders..."
counter=1

# Process each directory in the seeds folder
find "$SEEDS_ORIGINAL" -maxdepth 1 -type d ! -path "$SEEDS_ORIGINAL" | while read -r folder_path; do
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
        cp "$image_file" "$SEEDS_SIMPLE/$new_name"
        
        echo "Copied: $folder_name -> $new_name"
        ((counter++))
    else
        echo "No image found in folder: $folder_name"
    fi
done

echo "Seeds image copy and rename completed!"
echo "Images in simplified folder: $(ls "$SEEDS_SIMPLE" | wc -l)"
