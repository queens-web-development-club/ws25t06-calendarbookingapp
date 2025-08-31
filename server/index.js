const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
const interviewsRoutes = require('./routes/interviews');
const responsesRoutes = require('./routes/responses');

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
    allowedHeaders: ['Content-Type', 'X-CSRF-TOKEN']
  }));
app.use(express.json());

const pool = require('./db');

// Routes

app.use('/interviews', interviewsRoutes);
app.use('/responses', responsesRoutes);


app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({
            status: 'success',
            message: 'Database connected!',
            currentTime: result.rows[0].current_time
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
            stack: error.stack
        });
    }
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});