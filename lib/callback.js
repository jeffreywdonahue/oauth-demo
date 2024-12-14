const axios = require('axios');
const qs = require('qs');
const appConfig = require('../config.json');

/**
 * Handles the OAuth callback and exchanges the authorization code for an access token.
 *
 * @param {Object} req - The incoming HTTP request object.
 * @param {Object} res - The outgoing HTTP response object.
 */
async function callback(req, res) {
    try {
        // Validate that the authorization code is present
        const authCode = req.query.code;
        if (!authCode) {
            console.error("Authorization code is missing from the callback request.");
            return res.status(400).json({ error: "Authorization code is required." });
        }

        // Prepare the request data for token exchange
        const data = qs.stringify({
            'client_id': appConfig.clientId,
            'client_secret': appConfig.clientSecret,
            'grant_type': 'authorization_code',
            'code': authCode,
            'user_type': 'Location',
            'redirect_uri': 'http://localhost:3000/oauth/callback'
        });

        // Configure the POST request options
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://services.leadconnectorhq.com/oauth/token',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        // Make the token exchange request
        const response = await axios.request(config);
        console.log("Access token response:", response.data);

        // Respond with the token data
        return res.json({ data: response.data });
    } catch (error) {
        // Log the error for debugging
        console.error("Error during token exchange:", error.message);
        return res.status(500).json({ error: "Failed to exchange authorization code for token." });
    }
}

module.exports = callback;
