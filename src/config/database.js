const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbPath = process.env.NODE_ENV === 'production'
  ? '/tmp/database.sqlite'
  : path.resolve(__dirname, '../../', process.env.DB_FILE || 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database: ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create articles table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      category TEXT,
      tags TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (createErr) => {
      if (createErr) {
        console.error('Error creating articles table: ' + createErr.message);
      } else {
        console.log('Articles table ready.');
      }
    });
  }
});

module.exports = db;
