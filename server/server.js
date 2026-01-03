require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/client', clientRoutes);

// Health Check
app.get('/', (req, res) => res.send('Designsyncs API Running'));

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/designsyncs')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
