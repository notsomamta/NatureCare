// backend/routes/upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

// 🗂 Set up Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// 🌿 POST route to handle file upload + AI prediction
router.post('/', upload.single('plantImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const imagePath = req.file.path;

    // Prepare form-data for FastAPI
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    // FastAPI endpoint
    const FASTAPI_URL = 'http://127.0.0.1:8000/predict';

    // Send image to FastAPI
    const response = await axios.post(FASTAPI_URL, form, {
      headers: form.getHeaders(),
      timeout: 10000, // optional: 10 sec timeout
    });

    // Send response back to frontend or Postman
    res.json({
      success: true,
      message: 'Prediction successful!',
      imagePath: `/${imagePath}`,
      prediction: response.data,
    });

  } catch (error) {
    console.error('❌ Error during upload or prediction:', error.message);

    if (error.response) {
      console.error('FastAPI error response:', error.response.data);
      return res.status(error.response.status).json({
        error: 'FastAPI responded with an error',
        details: error.response.data,
      });
    }

    res.status(500).json({ error: 'Server error while processing image.' });
  }
});

export default router;
