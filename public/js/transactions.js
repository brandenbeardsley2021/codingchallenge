function getTransactions() {
    return fetch('http://localhost:3000/transactions');
}

getTransactions().then((res) => {
    return res.json();
}).then((res) => {
    const table = $("#transactions").DataTable({
        data: res,
        columns: [
            { title: 'Transaction ID', data: 'id' },
            { title: 'Amount', data: 'amount' },
            { title: 'Status', data: 'status' },
            { title: 'Date', data: 'createdAt' }
        ],
        paging: false
    });
});