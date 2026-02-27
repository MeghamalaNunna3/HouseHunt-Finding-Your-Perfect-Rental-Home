import express from 'express';
import mongoose, { get } from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import listingRoutes from './routes/listing.route.js';
import dotenv from 'dotenv';
dotenv.config();

// console.log('MONGO_URL:', process.env.MONGO_URL);  // Add this line

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });



const app = express();
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists.`;
    statusCode = 409;
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    
  });
});
