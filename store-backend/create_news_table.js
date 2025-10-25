const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/app/store.db');

console.log('📰 Creating agricultural_news table...\n');

db.serialize(() => {
  db.run(`
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
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating table:', err);
    } else {
      console.log('✅ Table created successfully');
    }
  });

  db.run(`CREATE INDEX IF NOT EXISTS idx_news_type_status ON agricultural_news(type, status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_news_priority ON agricultural_news(priority, created_at)`);

  // Insert sample news
  const sampleNews = [
    ['fraud', 'urgent', 'Fake DAP Fertilizer Alert', 
     'Ministry warns against counterfeit DAP in Kampala. Check seals. Buy from registered dealers only.',
     'Ministry of Agriculture Uganda', 'Central'],
    ['price', 'high', 'Urea Price Reduced',
     'Urea fertilizer now UGX 35,000 (was 41,000). Limited stock!',
     'AGROF Store', 'National'],
    ['disease', 'urgent', 'Fall Armyworm Alert - Maize',
     'Fall armyworm detected in Eastern Uganda. Spray Lambda-cyhalothrin or Dimethoate immediately.',
     'Ministry of Agriculture', 'Eastern'],
    ['weather', 'high', 'Good Planting Window',
     'Consistent rainfall expected. Ideal for maize, beans, tomatoes. Prepare your land!',
     'UNMA', 'National'],
    ['research', 'medium', 'New Tomato Variety',
     'NARO releases Maxim F2 - 30% higher yield, better disease resistance.',
     'NARO Uganda', 'National']
  ];

  sampleNews.forEach(news => {
    db.run(
      `INSERT INTO agricultural_news (type, priority, title, message, source, location) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      news,
      (err) => {
        if (err && !err.message.includes('UNIQUE')) {
          console.error('Error inserting news:', err);
        }
      }
    );
  });

  db.get('SELECT COUNT(*) as count FROM agricultural_news', (err, row) => {
    if (!err) {
      console.log(`\n📊 Total news articles: ${row.count}`);
    }
    db.close();
  });
});
