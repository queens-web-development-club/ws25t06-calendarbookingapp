// Configuration file for environment variables and defaults
require('dotenv').config();

const config = {
    // Server configuration
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database configuration
    database: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'calendar_booking',
        password: process.env.DB_PASSWORD || 'your_password_here',
        port: process.env.DB_PORT || 5432
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'calendar-booking-app',
        audience: 'calendar-booking-users'
    },
    
    // Master credentials configuration
    masterCredentials: {
        username: process.env.MASTER_USERNAME || 'admin',
        passwordHash: process.env.MASTER_PASSWORD_HASH || '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O' // "admin123"
    },
    
    // Security configuration
    security: {
        bcryptRounds: 12,
        maxLoginAttempts: 5,
        loginBlockDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
        rateLimitWindow: 15 * 60 * 1000, // 15 minutes
        rateLimitMax: 100
    },
    
    // CORS configuration
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
    },
    
    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false'
    }
};

// Validation function to check required environment variables
const validateConfig = () => {
    const required = ['JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.warn('⚠️  Warning: Missing environment variables:', missing.join(', '));
        console.warn('   Using default values. In production, set these environment variables.');
    }
    
    // Check if using default JWT secret
    if (!process.env.JWT_SECRET) {
        console.warn('⚠️  Warning: Using default JWT secret. Set JWT_SECRET environment variable in production.');
    }
    
    // Check if using default master credentials
    if (!process.env.MASTER_PASSWORD_HASH) {
        console.warn('⚠️  Warning: Using default master password hash. Set MASTER_PASSWORD_HASH environment variable in production.');
        console.warn('   Default credentials are admin/admin123 - CHANGE THIS IMMEDIATELY!');
    }
};

// Run validation
validateConfig();

module.exports = config;
