-- Agricultural News Table for AI Planner
CREATE TABLE IF NOT EXISTS agricultural_news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  source TEXT DEFAULT 'AGROF Admin',
  related_products TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  status TEXT DEFAULT 'active',
  views INTEGER DEFAULT 0,
  created_by TEXT DEFAULT 'admin'
);

CREATE INDEX IF NOT EXISTS idx_news_type_status ON agricultural_news(type, status);
CREATE INDEX IF NOT EXISTS idx_news_priority ON agricultural_news(priority, created_at);

INSERT INTO agricultural_news (type, priority, title, message, source, location) VALUES
('fraud', 'urgent', 'Fake DAP Fertilizer Alert', 
 'The Ministry of Agriculture warns farmers against counterfeit DAP fertilizer circulating in Kampala markets. Check for authentic YARA or Dangote seals. Buy only from registered dealers.',
 'Ministry of Agriculture Uganda', 'Central'),
('price', 'high', 'Urea Price Reduction',
 'Good news! Urea fertilizer price dropped from UGX 41,000 to UGX 35,000 per bag.',
 'AGROF Store', 'National');
