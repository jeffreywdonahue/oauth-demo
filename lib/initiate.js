// Import the configuration file containing client and API details
const config = require('../config');
const axios = require('axios'); // Import axios for making HTTP requests
const FormData = require('form-data');

/**
 * Function to initiate the OAuth authentication process.
 * This function constructs an authorization URL and redirects the user to it.
 *
 * @param {Object} req - The incoming HTTP request object.
 * @param {Object} res - The outgoing HTTP response object.
 */
async function initiateAuth(req, res) {
    try {
        // Define the options required for OAuth authentication
        const authOptions = {
            requestType: "code", // Specifies the type of response expected from the OAuth server
            redirectUri: "http://localhost:3000/oauth/callback", // URI to redirect the user after authentication
            clientId: config.clientId, // Client ID from the configuration file
            scopes: [ // Scopes determine the permissions requested from the user
                "calendars.readonly",
                "campaigns.readonly",
                "contacts.readonly"
            ]
        };

        // Construct the authorization URL by appending required query parameters
        const authorizationUrl = `${config.baseUrl}/oauth/chooselocation` +
            `?response_type=${authOptions.requestType}` +
            `&redirect_uri=${encodeURIComponent(authOptions.redirectUri)}` +
            `&client_id=${authOptions.clientId}` +
            `&scope=${authOptions.scopes.join(' ')}`;

        // Redirect the user to the constructed URL to begin the authentication process
        return res.redirect(authorizationUrl);
    } catch (error) {
        // Log the error details to the console for debugging
        console.error("Error occurred during OAuth initiation:", error);
        // Respond with a 500 status code and an error message
        return res.status(500).send("An error occurred while initiating authentication.");
    }
}

// Export the functions for use in other parts of the application
module.exports = { initiateAuth };
