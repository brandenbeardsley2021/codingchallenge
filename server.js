// Get all the environment variables from .env file
require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 3000;

// Listen for requests
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

// Good courses to expand knowledge on web development:
// Fireship.io
// ZeroToMastery ZTM