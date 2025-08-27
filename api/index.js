const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const app = express();
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json());

// ✅ CORS config
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://gameson.vercel.app',
        'https://gameson-git-main-shlok2345788.vercel.app',
        'https://gameson-shlok2345788.vercel.app',
        'https://gameon-website.vercel.app',
        'https://game-frotend-phi.vercel.app'
      ]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// (👉 Keep all your product/order/email routes here – copy-paste from server.js)

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GameOn Backend is running!' });
});

// ❌ DO NOT use app.listen()
// module.exports = app so Vercel can use it
module.exports = app;
