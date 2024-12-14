const axios = require('axios');
const qs = require('qs');
const appConfig = require('../config.json');

/**
 * Handles refreshing the access token using a refresh token.
 *
 * @param {Object} req - The incoming HTTP request object.
 * @param {Object} res - The outgoing HTTP response object.
 */
async function refreshToken(req, res) {
    try {
        // Validate the presence of a refresh token in the request
        const refreshToken = req.query.token;
        if (!refreshToken) {
            console.error("Refresh token is missing from the request.");
            return res.status(400).json({ error: "Refresh token is required." });
        }

        // Prepare the request data for refreshing the token
        const data = qs.stringify({
            'client_id': appConfig.clientId,
            'client_secret': appConfig.clientSecret,
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
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

        // Make the token refresh request
        const response = await axios.request(config);
        console.log("Refreshed token response:", response.data);

        // Respond with the refreshed token data
        return res.json({ data: response.data });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error occurred while refreshing the token:", error.message);

        // Send an error response with appropriate status code
        return res.status(500).json({ error: "Failed to refresh token." });
    }
}

module.exports = refreshToken;
