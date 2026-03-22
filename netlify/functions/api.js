const serverless = require('serverless-http');
const app = require('../../src/app');

// Wrap the Express app for AWS Lambda (used by Netlify Functions)
module.exports.handler = serverless(app, {
  basePath: '/.netlify/functions/api'
});
