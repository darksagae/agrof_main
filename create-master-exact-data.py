#!/usr/bin/env python3
"""
Create master data file with ALL products from exact source data
This ensures every product has correct pricing and details
"""

import json

products = []

# Product 1: Sugar Baby
products.append({
    "id": 1,
    "name": "Sugar Baby",
    "folder": "Sugar Baby – Most Popular And Grown Watermelon Variety Due To Its Early Maturity",
    "altFolder": "Sugar Baby",
    "supplier": "Simlaw Seeds Company (U) Ltd",
    "category": "Watermelon",
    "productDetails": "Potential fruit weight: 5-8kgs, Yield potential: 48-50 tons per acre, Duration to maturity: 80 days, Spacing: 100x100cm, Seed rate: 500 grams per acre, Approximate seed count per gram: 20 seeds, Special attributes: Dark green, round watermelon, Very uniform growth, Very adoptable and grows on wide range of soils.",
    "packages": [
        { "size": "10g", "tiers": [{ "qty": 1, "price": 2100 }] },
        { "size": "20g", "tiers": [{ "qty": 1, "price": 3200 }] },
        { "size": "25g", "tiers": [{ "qty": 1, "price": 3800 }] },
        { "size": "50g", "tiers": [{ "qty": 1, "price": 8700 }] },
        { "size": "250g", "tiers": [{ "qty": 1, "price": 34900 }] },
        { "size": "500g", "tiers": [{ "qty": 1, "price": 67200 }] },
        { "size": "1kg", "tiers": [{ "qty": 1, "price": 128900 }] }
    ]
})

# Product 2: Pusa Sawani (not Dodo!) - this has the okra description
products.append({
    "id": 2,
    "name": "Pusa Sawani",
    "folder": "Pusa Sawani – Okra Variety With Wide Adaptability",
    "altFolder": "Pusa Sawani",
    "supplier": "Simlaw Seeds Company (U) Ltd",
    "category": "Okra",
    "productDetails": "Green slender and attractive pods with good storage ability, Good fruit setting, Maturity: Harvesting start 40-45 days from planting, Tolerant to Yellow Vein Mosaic Virus (YVMV)",
    "packages": [
        { "size": "10g", "tiers": [
            { "qty": 1, "price": 1400 },
            { "qty": 5, "price": 1322 },
            { "qty": 10, "price": 1308 },
            { "qty": 20, "price": 1303 }
        ]},
        { "size": "20g", "tiers": [
            { "qty": 1, "price": 2600 },
            { "qty": 5, "price": 2452 },
            { "qty": 10, "price": 2436 },
            { "qty": 20, "price": 2428 }
        ]},
        { "size": "50g", "tiers": [
            { "qty": 1, "price": 4300 },
            { "qty": 5, "price": 4154 },
            { "qty": 10, "price": 4137 },
            { "qty": 20, "price": 4124 }
        ]},
        { "size": "250g", "tiers": [
            { "qty": 1, "price": 16500 },
            { "qty": 5, "price": 16302 },
            { "qty": 10, "price": 16253 },
            { "qty": 20, "price": 16220 }
        ]},
        { "size": "500g", "tiers": [
            { "qty": 1, "price": 23300 },
            { "qty": 5, "price": 23230 },
            { "qty": 10, "price": 23160 },
            { "qty": 20, "price": 23067 }
        ]},
        { "size": "1kg", "tiers": [
            { "qty": 1, "price": 46300 },
            { "qty": 5, "price": 46207 },
            { "qty": 10, "price": 46022 },
            { "qty": 20, "price": 40142 }
        ]}
    ]
})

# Product 34: Dodo (Elma) - THIS is the amaranth with different pricing
products.append({
    "id": 34,
    "name": "Dodo (Elma)",
    "folder": "Dodo (Elma)",
    "supplier": "Simlaw Seeds Company (U) Ltd",
    "category": "Amaranth/Vegetables",
    "productDetails": "Dodo is a Highly nutritious vegetable, Easy to grow, Fast maturing, has very vigorous growth, Transports well, Quick to cook.",
    "packages": [
        { "size": "10g", "tiers": [
            { "qty": 1, "price": 1400 },
            { "qty": 5, "price": 1322 },
            { "qty": 10, "price": 1308 },
            { "qty": 20, "price": 1303 }
        ]},
        { "size": "20g", "tiers": [
            { "qty": 1, "price": 1500 },
            { "qty": 5, "price": 1422 },
            { "qty": 10, "price": 1409 },
            { "qty": 20, "price": 1404 }
        ]},
        { "size": "25g", "tiers": [
            { "qty": 1, "price": 1600 },
            { "qty": 5, "price": 1530 },
            { "qty": 10, "price": 1509 },
            { "qty": 20, "price": 1506 }
        ]},
        { "size": "50g", "tiers": [
            { "qty": 1, "price": 4500 },
            { "qty": 5, "price": 4320 },
            { "qty": 10, "price": 4302 },
            { "qty": 20, "price": 4289 }
        ]}
    ]
})

# Save to JSON
with open('/home/darksagae/Desktop/agrof-auto/all-69-products-master-data.json', 'w') as f:
    json.dump({"products": products}, f, indent=2)

print(f"✅ Created master data with {len(products)} products so far")
print("Next: Add remaining 68 products...")
