import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import plantRoutes from './routes/plants.js';
import authRoutes from './routes/auth.js';
import reminderRoutes from './routes/reminders.js';
import uploadRoutes from './routes/upload.js';
import { startScheduler } from './services/schedulerService.js';
// ❌ Removed: import { loadModel } from './services/predictionService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Connect to DB and start scheduler only
connectDB();
startScheduler();

// ❌ Removed: loadModel(); // not needed — AI handled by FastAPI now

// ✅ Middlewares
// ✅ Correct CORS configuration to allow DELETE
app.use(cors({
  origin: 'http://localhost:5173', // Matches your frontend origin in screenshot
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicitly allows DELETE
  allowedHeaders: ['Content-Type', 'x-auth-token'], // Allows your auth header
  credentials: true
}));

app.use(express.json());
app.use(express.json());

// ✅ Routes
app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/upload', uploadRoutes);

// ✅ Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('API Running Successfully!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
