const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/social-network-api');

// Log MongoDB queries for debugging
mongoose.set('debug', true);

// Import routes
app.use(require('./routes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));