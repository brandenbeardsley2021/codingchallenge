const gateway = require("../../lib/braintree");

function httpGetTransactions(req, res) {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 3);

    let transactions = [];

    const stream = gateway.transaction.search((search) => {
        search.createdAt().between(from, to)
    });

    stream.on('data', (transaction) => {
        transactions.push(transaction);
    });

    stream.on('error', (err) => {
        console.error(err);
    });

    stream.on('end', () => {
        return res.json(transactions);
    });
}

module.exports = {
    httpGetTransactions
};