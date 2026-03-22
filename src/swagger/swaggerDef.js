/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the article
 *         title:
 *           type: string
 *           description: The title of the article
 *         content:
 *           type: string
 *           description: The content of the article
 *         author:
 *           type: string
 *           description: The author of the article
 *         category:
 *           type: string
 *           description: The category of the article
 *         tags:
 *           type: string
 *           description: Comma-separated tags
 *         date:
 *           type: string
 *           format: date-time
 *           description: The creation date
 *       example:
 *         id: 1
 *         title: Introduction to Node.js
 *         content: This is a beginner guide...
 *         author: John Doe
 *         category: Tech
 *         tags: nodejs, backend
 *         date: 2026-03-22T10:00:00Z
 * 
 *     ArticleInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: string
 *       example:
 *         title: Introduction to Node.js
 *         content: This is a beginner guide...
 *         author: John Doe
 *         category: Tech
 *         tags: nodejs, backend
 *
 * tags:
 *   name: Articles
 *   description: The blog articles managing API
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Returns the list of all the articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category to filter by
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author to filter by
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Start of date to filter by (e.g. 2026-03-18)
 *     responses:
 *       200:
 *         description: The list of the articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal Error
 *
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: The article was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Validation Error (Missing required fields)
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Search articles by title or content
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Text to search for in title or content
 *     responses:
 *       200:
 *         description: Matching articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       400:
 *         description: Search query is required
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get the article by id
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The article id
 *     responses:
 *       200:
 *         description: The article description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: The article was not found
 *       500:
 *         description: Server Error
 *
 *   put:
 *     summary: Update the article by the id
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The article id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: The article was updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: The article was not found
 *       500:
 *         description: Server Error
 *
 *   delete:
 *     summary: Remove the article by id
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The article id
 *     responses:
 *       200:
 *         description: The article was deleted
 *       404:
 *         description: The article was not found
 *       500:
 *         description: Server Error
 */
