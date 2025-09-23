const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'store-backend/store.db');
const db = new sqlite3.Database(dbPath);

console.log('Testing database connection...');

// Check categories
db.all('SELECT * FROM categories', (err, rows) => {
  if (err) {
    console.error('Error fetching categories:', err);
  } else {
    console.log('Categories:', rows.length);
    console.log(rows);
  }
});

// Check products
db.all('SELECT * FROM products', (err, rows) => {
  if (err) {
    console.error('Error fetching products:', err);
  } else {
    console.log('Products:', rows.length);
    if (rows.length > 0) {
      console.log('First few products:', rows.slice(0, 3));
    }
  }
  
  db.close();
});
