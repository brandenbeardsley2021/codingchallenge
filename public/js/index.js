// Grab DOM elements necessary for checkout form logic
let form = document.querySelector('#payment-form');
let submit = document.querySelector('#payment-button');

// Make a GET request to receive the token
function getToken() {
    return fetch('http://localhost:3000/checkout');
}

function displayError(message) {
    setLoading(false);
    $('#checkout-message').html(`<span class="w3-text-red">${message}</span>`);
}

function displaySuccess() {
    setLoading(false);
    $('#checkout-message').html('<span class="w3-text-green">Success</span>');
}

function setLoading(state) {
    if (state) {
        submit.setAttribute('disabled', true);
        $('#loading-state').html('<span class="w3-text-grey">Loading...</span>');
    } else {
        submit.removeAttribute('disabled');
        $('#loading-state').html('');
    }
}

// With token received, initialize braintree hosted fields
// and handle POST checkout request
getToken()
    .then((res) => {
        // read the stream and interpret it as text
        return res.text()
    })
    .then((token) => {
        braintree.client.create({
            authorization: token
        }, function(clientErr, clientInstance) {
            if (clientErr) {
                console.error(clientErr);
                displayError('An unexpected error occurred. For more details, see console');
                return;
            }

            let options = {
                client: clientInstance,
                styles: {},
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

            braintree.hostedFields.create(options, function(hostedFieldsErr, hostedFieldsInstance) {
                if (hostedFieldsErr) {
                    console.error(hostedFieldsErr);
                    displayError('An unexpected error occurred. For more details, see console');
                    return;
                }

                // Initially, the submit button is disabled
                // Once hosted fields are initialized, enable the button
                submit.removeAttribute('disabled');

                // Handle form submission
                form.addEventListener('submit', function(event) {
                    event.preventDefault();
                    setLoading(true);

                    // Get the email field value
                    let email = document.getElementById('email').value;

                    // Tokenize form data and prepare for sending
                    hostedFieldsInstance.tokenize(async function(tokenizeErr, payload) {
                        if (tokenizeErr) {
                            console.error(tokenizeErr);
                            displayError('An unexpected error occurred. For more details, see console');
                            return;
                        }

                        // Make a POST Request with payment nonce and customer email
                        fetch("http://localhost:3000/checkout", {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                nonce: payload.nonce,
                                email
                            })
                        }).then((res) => {
                            hostedFieldsInstance.teardown();

                            if (res.status === 200) {
                                displaySuccess();
                            } else {
                                displayError('An unexpected error occurred. For more details, see console');
                            }
                        }).catch((err) => {
                            hostedFieldsInstance.teardown();

                            console.err(err);
                            displayError('An unexpected error occurred. For more details, see console');
                        });
                    });
                });
            });
        });
    })
    .catch((err) => {
        console.error(err);
        displayError('An unexpected error occurred. For more details, see console');
    });