#!/bin/bash

# Copy and rename herbicide images from original folders to simplified folder
HERBICIDE_ORIGINAL="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/HERBICIDE"
HERBICIDE_SIMPLE="/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/HERBICIDES_SIMPLE"

echo "Starting herbicide image copy and rename process..."

# Clear existing simplified images
echo "Clearing existing simplified images..."
rm -f "$HERBICIDE_SIMPLE"/*

# Get all original folders
folders=($(ls "$HERBICIDE_ORIGINAL"))

echo "Found ${#folders[@]} herbicide folders"

# Copy and rename each image
counter=1
for folder in "${folders[@]}"; do
    echo "Processing folder: $folder"
    
    # Find the first image file in the folder
    image_file=$(find "$HERBICIDE_ORIGINAL/$folder" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | head -1)
    
    if [ -n "$image_file" ]; then
        # Create simplified name from folder name
        simplified_name=$(echo "$folder" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_\|_$//g')
        
        # Get file extension
        extension="${image_file##*.}"
        
        # Copy with new name
        new_name="${simplified_name}.${extension}"
        cp "$image_file" "$HERBICIDE_SIMPLE/$new_name"
        
        echo "Copied: $folder -> $new_name"
        ((counter++))
    else
        echo "No image found in folder: $folder"
    fi
done

echo "Herbicide image copy and rename completed!"
echo "Total images copied: $((counter-1))"
