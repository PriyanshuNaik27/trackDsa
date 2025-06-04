const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file
const connectDB = require('./src/config/db');
const heatmapRoutes = require('./src/routes/heatmap');

const authRoutes = require('./src/routes/auth.routes');
const questionRoutes = require('./src/routes/question.routes');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://track-dsa.vercel.app', 'http://localhost:5173'], // Allow both your deployed frontend and local frontend
  methods: 'GET,POST,PUT,DELETE',           // Allowed methods
  allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
};

app.use(cors(corsOptions));

// Ensure MONGO_URI is available
if (!process.env.MONGO_URI) {
  console.error('Mongo URI is not defined in .env file');
  process.exit(1);  // Exit if MONGO_URI is missing
}


// Connect to DB
connectDB();

// Middleware

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

app.use('/api/heatmap', heatmapRoutes);


app.get('/', (req, res) => {
  res.send('Track DSA Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
