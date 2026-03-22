const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articleController');
const { validateArticle } = require('../middlewares/validator');

/**
 * Endpoint for search needs to be defined BEFORE /:id
 * otherwise 'search' is captured as the ID parameter
 */
router.get('/search', ArticleController.searchArticles);

router.post('/', validateArticle, ArticleController.createArticle);
router.get('/', ArticleController.getAllArticles);
router.get('/:id', ArticleController.getArticleById);
router.put('/:id', validateArticle, ArticleController.updateArticle);
router.delete('/:id', ArticleController.deleteArticle);

module.exports = router;
