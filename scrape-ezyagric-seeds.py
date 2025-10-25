#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import time

# Function to scrape seeds from ezyagric
def scrape_seeds_page(page_num):
    url = f"https://ezyagric.com/catalog?category=Seeds&page={page_num}&q="
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        print(f"📥 Fetching page {page_num}...")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all product cards
        products = []
        product_cards = soup.find_all('div', class_='product-item') or soup.find_all('div', class_='product-card')
        
        if not product_cards:
            # Try alternative selectors
            product_cards = soup.find_all('article', class_='product') or soup.find_all('div', {'data-product-id': True})
        
        print(f"Found {len(product_cards)} product cards")
        
        for card in product_cards:
            try:
                # Extract product name
                name_elem = card.find('h3') or card.find('h4') or card.find('a', class_='product-title')
                name = name_elem.get_text(strip=True) if name_elem else None
                
                # Extract price
                price_elem = card.find('span', class_='price') or card.find('div', class_='price') or card.find(text=lambda t: 'UGX' in str(t))
                price = price_elem.get_text(strip=True) if price_elem else None
                
                # Extract description
                desc_elem = card.find('p', class_='description') or card.find('div', class_='description')
                description = desc_elem.get_text(strip=True) if desc_elem else None
                
                # Extract image
                img_elem = card.find('img')
                image_url = img_elem['src'] if img_elem and 'src' in img_elem.attrs else None
                
                # Extract link
                link_elem = card.find('a')
                product_url = link_elem['href'] if link_elem and 'href' in link_elem.attrs else None
                
                if name:
                    product = {
                        'name': name,
                        'price': price,
                        'description': description,
                        'image_url': image_url,
                        'product_url': product_url
                    }
                    products.append(product)
                    print(f"  ✅ {name} - {price}")
            
            except Exception as e:
                print(f"  ❌ Error parsing product: {e}")
                continue
        
        return products
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching page {page_num}: {e}")
        return []

# Main execution
if __name__ == "__main__":
    print("🌾 Scraping EzyAgric Seeds...")
    print("=" * 60)
    
    all_seeds = []
    
    # Scrape multiple pages (adjust range as needed)
    for page in range(1, 30):  # Pages 1-29
        seeds = scrape_seeds_page(page)
        if seeds:
            all_seeds.extend(seeds)
            time.sleep(2)  # Be polite to the server
        else:
            print(f"No products found on page {page}, stopping...")
            break
    
    print("\n" + "=" * 60)
    print(f"📊 Total seeds scraped: {len(all_seeds)}")
    
    # Save to JSON
    output_file = '/home/darksagae/Desktop/agrof-auto/ezyagric_seeds_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_seeds, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Data saved to: {output_file}")
    
    # Print summary
    print("\n📋 Sample products:")
    for seed in all_seeds[:10]:
        print(f"  • {seed['name']} - {seed['price']}")





