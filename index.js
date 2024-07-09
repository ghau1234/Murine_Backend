require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const settingsRoutes = require('./routes/settings');

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());




// Define CORS options
const corsOptions = {
    origin: 'https://murine.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Use routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

//admin
app.use('/admin/settings', settingsRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//checking 
app.get('/', (req, res) => {
    res.send('Hello, Murine!'); 
});