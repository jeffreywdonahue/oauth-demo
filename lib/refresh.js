const axios = require('axios');
const { URLSearchParams } = require('url');
const { getStoredRefreshToken, updateToken } = require('./db'); // Import functions from db.js
require('dotenv').config();

/**
 * Refresh the access token using the stored refresh token.
 */
async function refreshAccessToken() {
    try {
        // Retrieve the stored refresh token from the database
        const refreshToken = await getStoredRefreshToken();

        if (!refreshToken) {
            console.error('[ERROR] No refresh token found.');
            return;
        }

        console.log('[INFO] Using refresh token:', refreshToken);

        // Prepare the payload for the refresh token request
        const encodedParams = new URLSearchParams();
        encodedParams.set('client_id', process.env.CLIENT_ID);
        encodedParams.set('client_secret', process.env.CLIENT_SECRET);
        encodedParams.set('grant_type', 'refresh_token');
        encodedParams.set('refresh_token', refreshToken);

        console.log('[INFO] Sending refresh token request...');

        // Make the request to refresh the token
        const { data } = await axios.post(
            'https://services.leadconnectorhq.com/oauth/token',
            encodedParams.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
            }
        );

        console.log('[SUCCESS] Refreshed Token Response:', data);

        // Update the token in the database
        await updateToken(data.access_token, data.refresh_token, Date.now() + data.expires_in * 1000);

        console.log('[SUCCESS] Token successfully updated in SQLite.');
    } catch (error) {
        console.error('[ERROR] Failed to refresh token:', error.response?.data || error.message);
    }
}

module.exports = { refreshAccessToken };
