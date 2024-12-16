const { AuthorizationCode } = require('simple-oauth2');
require('dotenv').config(); // Load environment variables

// OAuth 2.0 configuration
const config = {
    client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET
    },
    auth: {
        tokenHost: 'https://services.leadconnectorhq.com',
        tokenPath: '/oauth/token'
    }
};

// Create OAuth2 client instance
const oauthClient = new AuthorizationCode(config);

module.exports = oauthClient;
