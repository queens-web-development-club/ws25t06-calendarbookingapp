const express = require('express');
//const cors = require('cors');

const app = express();
const PORT = 3000;

const pool = require('./db');

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});