const axios = require('axios');
const { URLSearchParams } = require('url');
const db = require('./db'); // Ensure your SQLite instance is imported
require('dotenv').config();

/**
 * Exchange the installation ID for an access token and store the tokens in SQLite.
 */
async function exchangeInstallIdForToken(req, res) {
    try {
        const installId = process.env.INSTALL_ID;

        if (!installId) {
            console.error('[ERROR] Installation ID is missing.');
            return res.status(400).json({ error: 'Installation ID is required.' });
        }

        console.log(`[INFO] Using Installation ID: ${installId}`);

        // Prepare URL-encoded parameters
        const encodedParams = new URLSearchParams();
        encodedParams.set('client_id', process.env.CLIENT_ID);
        encodedParams.set('client_secret', process.env.CLIENT_SECRET);
        encodedParams.set('grant_type', 'authorization_code');
        encodedParams.set('code', installId);
        encodedParams.set('redirect_uri', process.env.REDIRECT_URI);

        console.log('[INFO] Sending request to token endpoint...');
        console.log('[DETAIL] Request Parameters:', encodedParams.toString());

        // Make the POST request
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

        console.log('[SUCCESS] Access Token Response:', data);

        // Log the token details for debugging
        console.log('[DETAIL] Access Token:', data.access_token);
        console.log('[DETAIL] Refresh Token:', data.refresh_token);
        console.log('[DETAIL] Token Expiration (seconds):', data.expires_in);

        // Store the tokens in SQLite
        console.log('[INFO] Storing tokens in SQLite database...');
        db.run(
            `INSERT INTO tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?)`,
            [
                data.access_token,
                data.refresh_token,
                Date.now() + data.expires_in * 1000, // Calculate expires_at
            ],
            (err) => {
                if (err) {
                    console.error('[ERROR] Failed to store token in SQLite:', err.message);
                    return res.status(500).json({ error: 'Failed to store token in SQLite.' });
                }

                console.log('[SUCCESS] Token successfully stored in SQLite.');
                res.json({
                    message: 'Token successfully exchanged and stored.',
                    token: data,
                }); // Respond with the token details
            }
        );
    } catch (error) {
        console.error(
            '[ERROR] Failed to exchange installation ID for token:',
            error.response?.data || error.message
        );
        console.log('[DETAIL] Full Error Object:', error);
        res.status(500).json({ error: 'Failed to exchange installation ID for token.' });
    }
}

module.exports = { exchangeInstallIdForToken };
