const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class BarcodeScanner {
  constructor(db) {
    this.db = db;
  }

  // Generate barcode for a product
  generateBarcode(productId) {
    // Simple barcode generation - in production, use a proper barcode library
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `AGROF${productId.toString().padStart(4, '0')}${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  }

  // Assign barcode to product
  assignBarcode(productId, customBarcode = null) {
    return new Promise((resolve, reject) => {
      const barcode = customBarcode || this.generateBarcode(productId);
      
      this.db.run(
        'UPDATE products SET barcode = ? WHERE id = ?',
        [barcode, productId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(barcode);
          }
        }
      );
    });
  }

  // Scan barcode and get product info
  scanBarcode(barcode) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM products WHERE barcode = ?',
        [barcode],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (!row) {
            reject(new Error('Product not found'));
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  // Bulk assign barcodes to products without them
  bulkAssignBarcodes() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id FROM products WHERE barcode IS NULL',
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          let completed = 0;
          const total = rows.length;
          const results = [];

          if (total === 0) {
            resolve({ message: 'All products already have barcodes', count: 0 });
            return;
          }

          rows.forEach(row => {
            this.assignBarcode(row.id)
              .then(barcode => {
                results.push({ productId: row.id, barcode });
                completed++;
                
                if (completed === total) {
                  resolve({ 
                    message: `Generated ${total} barcodes`, 
                    count: total,
                    results 
                  });
                }
              })
              .catch(err => {
                reject(err);
              });
          });
        }
      );
    });
  }

  // Update stock via barcode scan
  updateStockByBarcode(barcode, quantity, transactionType, notes = '') {
    return new Promise((resolve, reject) => {
      this.scanBarcode(barcode)
        .then(product => {
          // This would integrate with the inventory update API
          resolve({
            productId: product.id,
            productName: product.name,
            currentStock: product.quantity_in_stock,
            barcode: barcode
          });
        })
        .catch(reject);
    });
  }
}

module.exports = BarcodeScanner;
