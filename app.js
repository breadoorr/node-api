const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/profileRoutes');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

db();

app.use('/user', authRoutes);
app.use('/profile', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
