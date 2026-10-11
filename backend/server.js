const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const opportunityRoutes = require('./routes/opportunities');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// serving frontend files from the frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// api routes
app.use('/api/opportunities', opportunityRoutes);

// root route - serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// starting server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api/opportunities`);
});
