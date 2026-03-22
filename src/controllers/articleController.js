const ArticleModel = require('../models/articleModel');

const ArticleController = {
  createArticle: (req, res) => {
    ArticleModel.create(req.body, (err, article) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.status(201).json({ message: 'Article created successfully', article });
    });
  },

  getAllArticles: (req, res) => {
    const filters = {
      category: req.query.category || null,
      author: req.query.author || null,
      date: req.query.date || null
    };

    ArticleModel.findAll(filters, (err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.status(200).json(articles);
    });
  },

  getArticleById: (req, res) => {
    ArticleModel.findById(req.params.id, (err, article) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      res.status(200).json(article);
    });
  },

  updateArticle: (req, res) => {
    const id = req.params.id;
    // Verify if article exists first
    ArticleModel.findById(id, (err, article) => {
      if (err) {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!article) {
         return res.status(404).json({ message: 'Article not found' });
      }
      
      ArticleModel.update(id, req.body, (updateErr, result) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Article updated successfully' });
      });
    });
  },

  deleteArticle: (req, res) => {
    const id = req.params.id;
    ArticleModel.findById(id, (err, article) => {
      if (err) {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!article) {
         return res.status(404).json({ message: 'Article not found' });
      }
      
      ArticleModel.delete(id, (deleteErr, result) => {
        if (deleteErr) {
          console.error(deleteErr);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Article deleted successfully' });
      });
    });
  },

  searchArticles: (req, res) => {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    ArticleModel.search(query, (err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      res.status(200).json(articles);
    });
  }
};

module.exports = ArticleController;
