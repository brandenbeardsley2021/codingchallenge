// import statements
const { Router } = require('express');
const { httpHandleCheckout, httpCreateToken } = require('./checkout.controller');

// Create checkout router
const checkoutRouter = Router();


// Define routes and connect controller functions
checkoutRouter.post('/', httpHandleCheckout);
checkoutRouter.get('/', httpCreateToken);

// Export checkout router
// export means make available to the rest of the project
module.exports = checkoutRouter;