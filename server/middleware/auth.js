const pool = require('../config/db');

// Middleware to protect organizer routes
function requireAuth(req, res, next) {
    if (req.cookies.session !== "loggedIn") {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
}

async function withDatabaseClient(req, res, next) {
    try {
        const client = await pool.connect();
        req.dbClient = client;
        
        // Set role based on authentication
        const isOrganizer = req.cookies.session === 'loggedIn';
        const role = isOrganizer ? 'organizer' : 'public';
        await client.query(`SET app.user_role = '${role}'`);
        
        // Release client when response finishes
        res.on('finish', () => {
            client.release();
        });
        
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}

// Middleware to validate public access tokens
async function validateAccessToken(req, res, next) {
    try {
        const { token } = req.params;
        
        const result = await req.dbClient.query(
            'SELECT id FROM events WHERE access_token = $1 AND status = $2',
            [token, 'active']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        req.eventId = result.rows[0].id;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { 
    withDatabaseClient,
    requireAuth, 
    validateAccessToken 
};








