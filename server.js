require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const merchantId = process.env.BRAINTREE_MERCHANT_ID;
const publicKey = process.env.BRAINTREE_PUBLIC_KEY;
const privateKey = process.env.BRAINTREE_PRIVATE_KEY;

app.use(express.static('public'));

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId,
  publicKey,
  privateKey,
});

app.get("/client_token", (req, res) => {
  gateway.clientToken.generate({}).then(response => {
    res.send(response.clientToken);
  });
});

app.post("/checkout", async (req, res) => {
  const nonceFromTheClient = req.body.nonce;
  const email = req.body.email;

  // TODO:
  // 1. Create a customer with received email
  // 2. Add a payment method with nonce (verify)
  // 3. Proceed with transaction if steps above succeeded

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

  const verificationResult = await gateway.paymentMethod.create({
    customerId: customerCreationResult.customer.id,
    paymentMethodNonce: customerCreationResult.customer.paymentMethods[0].token,
    options: {
      verifyCard: true,
      verificationAmount: "2.00",
    }
  });

  console.log(verificationResult);

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
    if (transactionResult) {
      res.send(transactionResult);
      console.log(transactionResult);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
