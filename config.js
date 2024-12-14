require('dotenv').config();

const config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    baseUrl: process.env.BASE_URL,
    redirectUri: process.env.REDIRECT_URI
};

module.exports = config;
