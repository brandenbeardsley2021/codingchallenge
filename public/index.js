let form = document.querySelector('#payment-form');
let submit = document.querySelector('#payment-button');
let token;

async function initialize() {
    token = await fetch('http://localhost:3000/client_token');
}

braintree.client.create({
    authorization: token
}, function (clientErr, clientInstance) {
    if (clientErr) {
        console.error(clientErr);
        return;
    }

    let options = {
        client: clientInstance,
        styles: {
            // 'input': {
            //     'font-size': '14px'
            // },
            'input.is-invalid': {
                'color': 'red'
            },
            'input.is-valid': {
                'color': 'green'
            }
        },
        fields: {
            cardholderName: {
                selector: '#card-name',
                placeholder: 'Name as it appears on your card'
            },
            number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
            },
            cvv: {
                selector: '#card-cvv',
                placeholder: '123'
            },
            expirationDate: {
                selector: '#card-expiration',
                placeholder: 'MM / YY'
            }
        }
    };

    braintree.hostedFields.create(options, function (hostedFieldsErr, hostedFieldsInstance) {
        if (hostedFieldsErr) {
            console.error(hostedFieldsErr);
            return;
        }

        submit.removeAttribute('disabled');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            let email = document.getElementById('email').value;

            hostedFieldsInstance.tokenize(async function (tokenizeErr, payload) {
                if (tokenizeErr) {
                    console.error(tokenizeErr);
                    return;
                } console.log(payload);

                // TODO: POST Request with payment nonce

                const result = await fetch("http://localhost:3000/checkout", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nonce: payload.nonce,
                        email
                    })
                });

                hostedFieldsInstance.teardown(function (teardownErr) {
                    console.error(teardownErr);
                });

                if (result.status === 200) {
                    $("#checkout-message").html("<span>Success!!</span>");
                } else {
                    $("#checkout-message").html("<span>Error</span>");
                }
            });
        });
    });
});
