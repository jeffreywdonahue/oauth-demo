const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tokens.db');

// Ensure the tokens table exists
db.serialize(() => {
    console.log('[INFO] Ensuring the tokens table exists...');
    db.run(`
        CREATE TABLE IF NOT EXISTS tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            access_token TEXT NOT NULL,
            refresh_token TEXT NOT NULL,
            expires_at INTEGER NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('[ERROR] Failed to create or verify tokens table:', err.message);
        } else {
            console.log('[SUCCESS] Tokens table is ready.');
        }
    });
});

// Function to retrieve the most recent refresh token
const getStoredRefreshToken = () => {
    console.log('[INFO] Attempting to retrieve the most recent refresh token from the database...');
    return new Promise((resolve, reject) => {
        db.get('SELECT refresh_token FROM tokens ORDER BY id DESC LIMIT 1', (err, row) => {
            if (err) {
                console.error('[ERROR] Failed to retrieve refresh token:', err.message);
                return reject(err);
            }
            if (row) {
                console.log('[SUCCESS] Retrieved refresh token from the database:', row.refresh_token);
                resolve(row.refresh_token);
            } else {
                console.log('[INFO] No refresh token found in the database.');
                resolve(null);
            }
        });
    });
};

// Function to update the token in the database
const updateToken = (accessToken, refreshToken, expiresAt) => {
    console.log('[INFO] Preparing to update tokens in the database...');
    console.log('[DETAIL] New access token:', accessToken);
    console.log('[DETAIL] New refresh token:', refreshToken);
    console.log('[DETAIL] Token expiration (timestamp):', expiresAt);

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?)`,
            [accessToken, refreshToken, expiresAt],
            (err) => {
                if (err) {
                    console.error('[ERROR] Failed to update token in SQLite:', err.message);
                    return reject(err);
                }
                console.log('[SUCCESS] Tokens successfully updated in the database.');
                resolve();
            }
        );
    });
};

// Optional: Log database file information
console.log('[INFO] Connected to SQLite database: tokens.db');

module.exports = { db, getStoredRefreshToken, updateToken };
