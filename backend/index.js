import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { signup, login } from './controllers/analyticsController.js'; // ✅ ADD THIS
import adminRoutes from './routes/adminRoutes.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
// ✅ AUTH ROUTES
app.post('/api/analytics/signup', signup);
app.post('/api/analytics/login', login);

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Mongo connection error:', err));
