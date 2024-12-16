const express = require('express');
const cron = require('node-cron');
const { exchangeInstallIdForToken } = require('./lib/exchange');
const { refreshAccessToken } = require('./lib/refresh');

const app = express();

// Routes
app.get('/token', async (req, res) => {
    console.log('[INFO] /token endpoint hit. Attempting to exchange installation ID for token...');
    await exchangeInstallIdForToken(req, res);
    console.log('[INFO] Finished processing /token request.');
});

app.get('/refresh', async (req, res) => {
    console.log('[INFO] /refresh endpoint hit. Attempting to manually refresh the token...');
    await refreshAccessToken(req, res);
    console.log('[INFO] Finished processing /refresh request.');
});

// Schedule token refresh every minute
cron.schedule('* * * * *', async () => {
    console.log('[CRON] Running token refresh...');
    try {
        await refreshAccessToken();
        console.log('[CRON] Token refresh completed successfully.');
    } catch (error) {
        console.error('[CRON ERROR] Failed to refresh token:', error.message);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('[INFO] App Listening on port 3000!');
    console.log('[INFO] Endpoints available:');
    console.log('  [GET] /token   - Exchange installation ID for token.');
    console.log('  [GET] /refresh - Manually refresh the access token.');
    console.log('[INFO] Cron job is set to refresh token every minute.');
});

