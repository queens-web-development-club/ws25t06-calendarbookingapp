# Calendar Booking Server - Authentication System

A secure Express.js server with a master username/password authentication system for the calendar booking application.

## Features

- 🔐 **Master Username/Password Authentication**: Single admin account with secure password hashing
- 🛡️ **Security Features**: 
  - JWT tokens with configurable expiration
  - Rate limiting to prevent brute force attacks
  - Input validation and sanitization
  - CORS protection
  - Helmet.js security headers
  - Token revocation on logout
- 🗄️ **Database Integration**: PostgreSQL with minimal auth tables
- 🔄 **Token Management**: Secure token storage and revocation

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

Run the authentication tables SQL script:

```bash
psql -d your_database_name -f sql/auth_tables.sql
```

### 3. Environment Variables (Optional)

Create a `.env` file in the server directory:

```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=calendar_booking
DB_PASSWORD=your_password_here
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Master Credentials (generate hash with: node -e "console.log(require('bcryptjs').hashSync('your_password', 12))")
MASTER_USERNAME=admin
MASTER_PASSWORD_HASH=$2a$12$your_hashed_password_here

# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
Login with master username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "isAdmin": true
  },
  "expiresIn": "24h"
}
```

#### POST `/api/auth/logout`
Logout and revoke the current token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET `/api/auth/verify`
Verify if a token is valid.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "username": "admin",
    "isAdmin": true
  }
}
```

#### POST `/api/auth/change-password`
Change the master password (requires current password).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "newSecurePassword123"
}
```

### Health Check Endpoints

#### GET `/health`
Server health check.

#### GET `/health/db`
Database health check.

## Security Features

### Rate Limiting
- **Login attempts**: 5 attempts per 15 minutes per IP
- **General endpoints**: 100 requests per 15 minutes per IP

### Password Security
- Bcrypt hashing with 12 rounds
- Minimum 8 character requirement for new passwords
- Secure password comparison

### Token Security
- JWT tokens with 24-hour expiration
- Token revocation on logout
- IP tracking in tokens
- Secure token verification

### Input Validation
- Username and password validation
- Input sanitization and escaping
- SQL injection prevention

## Database Schema

### Authentication Tables

#### `revoked_tokens`
Stores revoked JWT tokens for logout functionality.

## Default Credentials

**⚠️ IMPORTANT: Change these immediately in production!**

- **Username**: `admin`
- **Password**: `admin123`

## Security Recommendations

1. **Change Default Credentials**: Update the master username and password immediately
2. **Environment Variables**: Set all environment variables in production
3. **JWT Secret**: Use a strong, unique JWT secret
4. **Database Security**: Use strong database passwords and restrict access
5. **HTTPS**: Use HTTPS in production
6. **Regular Updates**: Keep dependencies updated

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": [] // Optional validation details
}
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Running in Production

```bash
npm start
```

### Testing the API

You can test the endpoints using curl or any API client:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Use the returned token for authenticated requests
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Check your database credentials and ensure PostgreSQL is running
2. **CORS Errors**: Verify the `CLIENT_URL` environment variable matches your frontend URL
3. **Token Expired**: Tokens expire after 24 hours, re-login to get a new token
4. **Rate Limited**: Wait 15 minutes if you've exceeded rate limits

### Logs

Check the console output for detailed logs including:
- Authentication attempts
- Database connection status
- Rate limiting events
- Security warnings
