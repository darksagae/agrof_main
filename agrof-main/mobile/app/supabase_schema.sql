-- Supabase Crop Database Schema
-- Create table for all 19 crops with complete Uganda agricultural data

CREATE TABLE IF NOT EXISTS crops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  growth_duration TEXT,
  planting_season TEXT,
  harvest_season TEXT,
  spacing TEXT,
  seed_rate TEXT,
  fertilizer_requirement TEXT,
  water_requirement TEXT,
  soil_type TEXT,
  market_price_min INTEGER,
  market_price_max INTEGER,
  roi_percentage_min INTEGER,
  roi_percentage_max INTEGER,
  regional_suitability TEXT,
  pest_control TEXT,
  disease_control TEXT,
  labor_requirement TEXT,
  equipment_requirement TEXT,
  export_potential TEXT,
  storage_requirement TEXT,
  processing_requirement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crops_category ON crops(category);
CREATE INDEX IF NOT EXISTS idx_crops_name ON crops(name);

-- Enable Row Level Security (RLS)
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to crops" ON crops
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage crops" ON crops
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert all 19 crops with complete data
INSERT INTO crops (
  id, name, category, image, description, growth_duration, planting_season, 
  harvest_season, spacing, seed_rate, fertilizer_requirement, water_requirement,
  soil_type, market_price_min, market_price_max, roi_percentage_min, roi_percentage_max,
  regional_suitability, pest_control, disease_control, labor_requirement,
  equipment_requirement, export_potential, storage_requirement, processing_requirement
) VALUES 
(
  'maize', 'Maize', 'cereals', 'maize.png', 
  'Staple cereal crop widely grown in Uganda',
  '90-120 days', 'March-April, September-October', 'July-August, December-January',
  '75cm x 25cm', '25-30 kg per acre', 'NPK 17:17:17', '500-600mm per season',
  'Well-drained loamy soil', 800, 1200, 200, 550,
  'Northern, Eastern, Central', 'Stem borers, Armyworms', 'Maize streak virus, Leaf blight',
  'Medium', 'Plow, Planter, Harvester', 'High', 'Dry storage, 12-14% moisture', 'Milling, Drying'
),
(
  'tomatoes', 'Tomatoes', 'vegetables', 'tomatoes.png',
  'High-value vegetable crop with excellent market demand',
  '90-120 days', 'Year-round', 'Continuous',
  '60cm x 45cm', '100-150g per acre', 'NPK 20:10:10', '600-800mm per season',
  'Well-drained sandy loam', 2500, 4500, 1340, 3488,
  'Central, Eastern, Western', 'Aphids, Whiteflies, Thrips', 'Blight, Bacterial wilt',
  'High', 'Drip irrigation, Stakes', 'Very High', 'Cool storage, 10-12°C', 'Sorting, Packaging'
),
(
  'beans', 'Beans', 'legumes', 'beans.png',
  'Protein-rich legume crop essential for nutrition',
  '60-90 days', 'March-April, September-October', 'June-July, December-January',
  '50cm x 10cm', '40-50 kg per acre', 'NPK 10:20:20', '400-500mm per season',
  'Well-drained clay loam', 1800, 2800, 150, 400,
  'All regions', 'Bean fly, Aphids', 'Anthracnose, Rust',
  'Medium', 'Planter, Harvester', 'High', 'Dry storage, 12-14% moisture', 'Sorting, Cleaning'
),
(
  'coffee', 'Coffee', 'cash_crops', 'coffee.png',
  'Premium cash crop with high export value',
  '3-4 years to first harvest', 'March-May', 'October-February',
  '3m x 3m', '200-300 seedlings per acre', 'NPK 15:15:15', '1000-1500mm per year',
  'Volcanic, Well-drained', 3500, 5500, 200, 400,
  'Eastern, Western, Central', 'Coffee berry borer, Antestia', 'Coffee wilt, Leaf rust',
  'High', 'Pruning tools, Pulping machine', 'Very High', 'Dry storage, 12% moisture', 'Pulping, Drying, Milling'
),
(
  'banana', 'Banana', 'fruits', 'banana.png',
  'Staple fruit crop with high nutritional value',
  '12-15 months', 'Year-round', 'Year-round',
  '3m x 3m', '400-500 suckers per acre', 'NPK 20:10:10', '800-1200mm per year',
  'Well-drained clay loam', 800, 1500, 100, 200,
  'Central, Eastern, Western', 'Banana weevil, Nematodes', 'Panama disease, Sigatoka',
  'Medium', 'Machete, Pruning tools', 'High', 'Cool storage, 13-15°C', 'Sorting, Packaging'
),
(
  'onions', 'Onions', 'vegetables', 'onions.png',
  'Essential vegetable crop with strong market demand',
  '90-120 days', 'March-April, September-October', 'July-August, December-January',
  '30cm x 10cm', '2-3 kg per acre', 'NPK 20:10:10', '500-600mm per season',
  'Well-drained sandy loam', 2000, 3500, 300, 600,
  'Central, Eastern, Northern', 'Thrips, Onion fly', 'Downy mildew, Purple blotch',
  'Medium', 'Planter, Harvester', 'High', 'Cool, dry storage', 'Sorting, Drying'
),
(
  'groundnuts', 'Groundnuts', 'oil_crops', 'groundnuts.png',
  'Oil-rich crop with high nutritional value',
  '90-120 days', 'March-April, September-October', 'July-August, December-January',
  '60cm x 15cm', '80-100 kg per acre', 'NPK 10:20:20', '400-500mm per season',
  'Well-drained sandy loam', 2200, 3200, 250, 500,
  'Northern, Eastern, Central', 'Aphids, Thrips', 'Leaf spot, Rust',
  'Medium', 'Planter, Digger', 'High', 'Dry storage, 8-10% moisture', 'Shelling, Sorting'
),
(
  'rice', 'Rice', 'cereals', 'rice.png',
  'Staple cereal crop with high water requirement',
  '120-150 days', 'March-April, September-October', 'August-September, February-March',
  '25cm x 15cm', '30-40 kg per acre', 'NPK 15:15:15', '1000-1500mm per season',
  'Clay loam, Paddy soil', 1500, 2200, 200, 400,
  'Eastern, Northern, Central', 'Stem borers, Rice bugs', 'Blast, Bacterial blight',
  'High', 'Transplanter, Harvester', 'Medium', 'Dry storage, 14% moisture', 'Milling, Polishing'
),
(
  'cotton', 'Cotton', 'fiber_crops', 'cotton.png',
  'Fiber crop with industrial applications',
  '150-180 days', 'April-May', 'October-December',
  '90cm x 30cm', '8-10 kg per acre', 'NPK 20:10:10', '600-800mm per season',
  'Well-drained clay loam', 1800, 2500, 150, 300,
  'Northern, Eastern', 'Bollworms, Aphids', 'Bacterial blight, Wilt',
  'High', 'Planter, Picker', 'High', 'Dry storage', 'Ginning, Cleaning'
),
(
  'sugarcane', 'Sugarcane', 'industrial_crops', 'sugarcane.png',
  'Industrial crop for sugar production',
  '12-18 months', 'March-May, September-November', 'Year-round',
  '90cm x 15cm', '2000-2500 cuttings per acre', 'NPK 25:10:10', '1200-1800mm per year',
  'Well-drained clay loam', 1200, 1800, 300, 600,
  'Central, Eastern, Western', 'Stem borers, Termites', 'Smut, Ratoon stunting',
  'High', 'Planter, Harvester', 'High', 'Cool storage', 'Crushing, Refining'
),
(
  'pineapple', 'Pineapple', 'fruits', 'pineapple.png',
  'Tropical fruit with high export potential',
  '18-24 months', 'Year-round', 'Year-round',
  '90cm x 60cm', '2000-2500 suckers per acre', 'NPK 15:15:15', '800-1200mm per year',
  'Well-drained sandy loam', 1500, 2500, 400, 800,
  'Central, Eastern, Western', 'Mealybugs, Scale insects', 'Heart rot, Root rot',
  'Medium', 'Planting tools, Harvesting knife', 'Very High', 'Cool storage, 8-10°C', 'Sorting, Packaging'
),
(
  'mangoes', 'Mangoes', 'fruits', 'mangoes.png',
  'Tropical fruit with excellent market demand',
  '3-5 years to first harvest', 'March-May', 'November-March',
  '10m x 10m', '40-50 seedlings per acre', 'NPK 15:15:15', '800-1200mm per year',
  'Well-drained loamy soil', 1200, 2000, 200, 400,
  'Central, Eastern, Western', 'Fruit flies, Scale insects', 'Anthracnose, Powdery mildew',
  'Medium', 'Pruning tools, Harvesting poles', 'Very High', 'Cool storage, 12-15°C', 'Sorting, Packaging'
),
(
  'avocados', 'Avocados', 'fruits', 'avocados.png',
  'High-value fruit with growing export market',
  '3-4 years to first harvest', 'March-May', 'June-September',
  '8m x 8m', '60-80 seedlings per acre', 'NPK 15:15:15', '1000-1500mm per year',
  'Well-drained loamy soil', 2500, 4000, 300, 600,
  'Central, Eastern, Western', 'Fruit flies, Scale insects', 'Root rot, Anthracnose',
  'Medium', 'Pruning tools, Harvesting poles', 'Very High', 'Cool storage, 5-7°C', 'Sorting, Packaging'
),
(
  'carrots', 'Carrots', 'vegetables', 'carrot.png',
  'Root vegetable with high nutritional value',
  '90-120 days', 'Year-round', 'Year-round',
  '30cm x 5cm', '2-3 kg per acre', 'NPK 15:15:15', '500-600mm per season',
  'Well-drained sandy loam', 1800, 2800, 200, 400,
  'Central, Eastern, Northern', 'Carrot fly, Aphids', 'Leaf blight, Root rot',
  'Medium', 'Planter, Harvester', 'Medium', 'Cool storage, 0-2°C', 'Washing, Sorting'
),
(
  'spinach', 'Spinach', 'vegetables', 'spinach.png',
  'Leafy green vegetable with high nutritional value',
  '30-45 days', 'Year-round', 'Year-round',
  '30cm x 10cm', '1-2 kg per acre', 'NPK 20:10:10', '400-500mm per season',
  'Well-drained loamy soil', 1500, 2500, 150, 300,
  'All regions', 'Aphids, Leaf miners', 'Downy mildew, Leaf spot',
  'Medium', 'Planter, Harvesting tools', 'Medium', 'Cool storage, 0-2°C', 'Washing, Packaging'
),
(
  'millet', 'Millet', 'cereals', 'millet.png',
  'Drought-resistant cereal crop',
  '90-120 days', 'March-April, September-October', 'July-August, December-January',
  '60cm x 10cm', '15-20 kg per acre', 'NPK 10:20:20', '300-400mm per season',
  'Well-drained sandy loam', 1200, 1800, 100, 250,
  'Northern, Eastern', 'Stem borers, Birds', 'Downy mildew, Smut',
  'Medium', 'Planter, Harvester', 'Low', 'Dry storage, 12-14% moisture', 'Threshing, Cleaning'
),
(
  'soybeans', 'Soybeans', 'legumes', 'soyabeans.png',
  'Protein-rich legume with industrial uses',
  '90-120 days', 'March-April, September-October', 'July-August, December-January',
  '60cm x 10cm', '40-50 kg per acre', 'NPK 10:20:20', '500-600mm per season',
  'Well-drained clay loam', 2000, 3000, 200, 400,
  'Central, Eastern, Northern', 'Aphids, Bean fly', 'Rust, Bacterial blight',
  'Medium', 'Planter, Harvester', 'High', 'Dry storage, 12-14% moisture', 'Cleaning, Sorting'
),
(
  'cabbage', 'Cabbage', 'vegetables', 'cabbage.png',
  'Leafy vegetable with high market demand',
  '90-120 days', 'Year-round', 'Year-round',
  '60cm x 45cm', '100-150g per acre', 'NPK 20:10:10', '500-600mm per season',
  'Well-drained loamy soil', 1500, 2500, 400, 800,
  'Central, Eastern, Western', 'Diamondback moth, Cabbage aphids', 'Black rot, Club root',
  'Medium', 'Planter, Harvesting knife', 'Medium', 'Cool storage, 0-2°C', 'Washing, Packaging'
),
(
  'oranges', 'Oranges', 'fruits', 'orangoes.png',
  'Citrus fruit with high vitamin C content',
  '3-4 years to first harvest', 'March-May', 'June-September',
  '6m x 6m', '100-120 seedlings per acre', 'NPK 15:15:15', '800-1200mm per year',
  'Well-drained loamy soil', 1800, 2800, 200, 400,
  'Central, Eastern, Western', 'Fruit flies, Scale insects', 'Citrus canker, Greening',
  'Medium', 'Pruning tools, Harvesting poles', 'High', 'Cool storage, 3-5°C', 'Sorting, Packaging'
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_crops_updated_at 
    BEFORE UPDATE ON crops 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();













