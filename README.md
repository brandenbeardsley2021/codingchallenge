# Braintree Hosted Fields Integration project

A project that implements Braintree API for:

1. Creating a client token
2. Creating a customer
3. Adding a payment method
4. Handling a transaction

## Installation

This project requires Node.js an Braintree API keys to run.

1. Create .env file in the root directory of project
2. Add API keys to following variables:

```env
# mandatory
BRAINTREE_MERCHANT_ID=
BRAINTREE_PUBLIC_KEY=
BRAINTREE_PRIVATE_KEY=

# optional
PORT=
```

3. Install the dependencies and run the project via following commands:

```bash
npm install
npm start
```

## Usage

Application contains 2 pages:

1. `index.html` - Checkout page
2. `transactions.html` - Transaction history page

To get to transactions, click on Transaction History link on checkout page
