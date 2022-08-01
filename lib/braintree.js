const braintree = require("braintree");

const merchantId = process.env.BRAINTREE_MERCHANT_ID;
const publicKey = process.env.BRAINTREE_PUBLIC_KEY;
const privateKey = process.env.BRAINTREE_PRIVATE_KEY;

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId,
    publicKey,
    privateKey,
});

module.exports = gateway;