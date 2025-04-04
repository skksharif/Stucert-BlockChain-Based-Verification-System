const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Serve assets folder statically
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/verifiers', require('./routes/verifierRoutes'));
app.use('/api/institutes', require('./routes/instituteRoutes'));

app.get('/', (req, res) => {
  res.send('Certificate Backend is running');
});

const PORT = process.env.PORT || 5700;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});