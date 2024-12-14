const express = require('express');

const { initiateAuth } = require('./lib/initiate'); // Import both functions
const { exchangeAuthCodeForToken } = require('./lib/exchange'); // Import both functions
const { refreshToken } = require('./lib/refresh'); // Adjust as per your module
const { handleCallback } = require('./lib/callback'); // Adjust as per your module

const app = express();

// Middleware for error handling
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Routes with error handling
app.get('/initiate', asyncHandler(initiateAuth)); // Use initiateAuth for initiating OAuth flow
app.get('/exchange', asyncHandler(exchangeAuthCodeForToken)); // Use exchangeAuthCodeForToken for token exchange
app.get('/refresh', asyncHandler(refreshToken)); // Use refreshToken for refreshing tokens
app.get('/oauth/callback', asyncHandler(handleCallback)); // Use handleCallback for OAuth callback

// Start the server
app.listen(3000, () => {
    console.log("App Listening on 3000 !");
});
