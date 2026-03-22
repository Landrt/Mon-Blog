const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Serve static frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Load dummy file just to make swaggerJsdoc parse comments
// We can include the swagger comments directly in routes or in a specific file.
// We put them in src/swagger/swaggerDef.js
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'A simple Express Blog API supporting CRUD operations and Search.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/swagger/swaggerDef.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/articles', articleRoutes);

// General route
app.get('/', (req, res) => {
  res.send('Blog API is running. Go to /api-docs for Swagger documentation.');
});

// Handle unknown endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;
