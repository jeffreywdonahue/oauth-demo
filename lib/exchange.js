const axios = require('axios');
const FormData = require('form-data');
const config = require('../config');

/**
 * Exchanges the authorization code for an access token.
 */
async function exchangeAuthCodeForToken(req, res) {
    try {
        const code = req.query.code;

        if (!code) {
            console.error('Authorization code not found.');
            return res.status(400).json({ error: 'Authorization code is required.' });
        }

        console.log('Authorization code received:', code);

        // Prepare the form data
        const formData = new FormData();
        formData.append('client_id', config.clientId);
        formData.append('client_secret', config.clientSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code);
        formData.append('redirect_uri', config.redirectUri);

        // Define the request options
        const options = {
            method: 'POST',
            url: `${config.baseUrl}/oauth/token`,
            headers: formData.getHeaders(),
            data: formData
        };

        // Make the POST request
        const { data } = await axios.request(options);
        console.log('Access token response:', data);
        res.json(data);
    } catch (error) {
        console.error('Error while exchanging authorization code for token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to exchange authorization code for token.' });
    }
}

module.exports = { exchangeAuthCodeForToken };
