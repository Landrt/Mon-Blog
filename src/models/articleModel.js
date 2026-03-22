const db = require('../config/database');

const ArticleModel = {
  create: (articleData, callback) => {
    const { title, content, author, category, tags } = articleData;
    const query = `INSERT INTO articles (title, content, author, category, tags) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [title, content, author, category, tags], function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, ...articleData });
    });
  },

  findAll: (filters, callback) => {
    let query = `SELECT * FROM articles`;
    const params = [];
    const conditions = [];

    if (filters.category) {
      conditions.push(`category = ?`);
      params.push(filters.category);
    }
    if (filters.author) {
      conditions.push(`author = ?`);
      params.push(filters.author);
    }
    if (filters.date) {
      // Very basic date filtering by matching the beginning of the datetime string
      conditions.push(`date LIKE ?`);
      params.push(`${filters.date}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY date DESC`;

    db.all(query, params, (err, rows) => {
      callback(err, rows);
    });
  },

  findById: (id, callback) => {
    const query = `SELECT * FROM articles WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      callback(err, row);
    });
  },

  update: (id, articleData, callback) => {
    const { title, content, author, category, tags } = articleData;
    const query = `UPDATE articles SET title = ?, content = ?, author = ?, category = ?, tags = ? WHERE id = ?`;
    db.run(query, [title, content, author, category, tags, id], function (err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  },

  delete: (id, callback) => {
    const query = `DELETE FROM articles WHERE id = ?`;
    db.run(query, [id], function (err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  },

  search: (searchQuery, callback) => {
    const query = `SELECT * FROM articles WHERE title LIKE ? OR content LIKE ? ORDER BY date DESC`;
    const param = `%${searchQuery}%`;
    db.all(query, [param, param], (err, rows) => {
      callback(err, rows);
    });
  }
};

module.exports = ArticleModel;
