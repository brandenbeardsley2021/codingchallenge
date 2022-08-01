const { Router } = require('express');
const { httpGetTransactions } = require('./transactions.controller');

// Create checkout router
const transactionsRouter = Router();


// Define routes and connect controller functions
transactionsRouter.get('/', httpGetTransactions);

// Export checkout router
// export means make available to the rest of the project
module.exports = transactionsRouter;