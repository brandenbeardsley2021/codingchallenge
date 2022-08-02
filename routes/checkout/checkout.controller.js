// Importing braintree gateway instance
const gateway = require('../../lib/braintree');

// Handles checkout by
// (1) creating customer
// (2) adding and verifying payment method
// (3) creating a transaction
async function httpHandleCheckout(req, res) {
    // Get payment nonce and customer email from request
    const nonceFromTheClient = req.body.nonce;
    const email = req.body.email;

    // validating request

    if (!nonceFromTheClient || !email) {
        return res.status(400).send({
            err: 'Did not receive nonce or email'
        });
    }

    // Create a customer with received email

    const customerCreationResult = await gateway.customer.create({
        email,
        paymentMethodNonce: nonceFromTheClient
    }).catch((err) => {
        return res.status(500).send(err);
    });

    if (!customerCreationResult.success) {
        return res.status(500).send({
            err: 'Customer creation failed.'
        });
    }

    // Adding and verifying payment method

    const verificationResult = await gateway.paymentMethod.create({
        customerId: customerCreationResult.customer.id,
        paymentMethodNonce: customerCreationResult.customer.paymentMethods[0].token,
        options: {
            verifyCard: true,
            verificationAmount: "2.00",
        }
    });

    // Proceed with transaction if steps above succeeded

    // try {
    //     Code here might fail
    // } catch(err) {
    //     If it does
    //     Handle an err that is stored in `err` variable
    // }

    try {
        const transactionResult = await gateway.transaction.sale({
            amount: '10.00',
            customerId: customerCreationResult.customer.id,
            options: {
                // This option requests the funds from the transaction
                // once it has been authorized successfully
                submitForSettlement: true,
                storeInVaultOnSuccess: true
            }
        });
        if (transactionResult.success) {
            return res.send(transactionResult);
            // console.log(transactionResult);
        } else {
            return res.status(500).send({
                err: "Transaction Failed",
                transactionResult
            });
        }

    } catch (error) {
        return res.status(500).send(error);
    }
};

// Creates a client token
function httpCreateToken(req, res) {
    gateway.clientToken.generate({}).then(response => {
        return res.send(response.clientToken);
    });
}

module.exports = {
    httpHandleCheckout,
    httpCreateToken
};