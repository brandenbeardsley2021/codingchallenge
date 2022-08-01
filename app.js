// Libraries
const express = require('express');
const morgan = require('morgan');

// Routers
const checkoutRouter = require('./routes/checkout/checkout.router');
const transactionsRouter = require('./routes/transactions/transactions.router');

// Creating express app
const app = express();

// Applying middleware
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('combined'));

// Handling routes
app.use('/checkout', checkoutRouter);
app.use('/transactions', transactionsRouter);

module.exports = app;